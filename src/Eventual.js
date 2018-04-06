Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
exports._IS_EVENTUAL_KEY_ = "_IS_EVENTUAL_";
class Eventual extends spiders_js_1.SpiderIsolate {
    //////////////////////////////////////
    // GSP methods                      //
    //////////////////////////////////////
    //Calling this at construction time is dangerous but ok for now. A problem could arise if an eventual is created and serialised at actor construction-time (some elements in the map might be serialised as far references)
    populateCommitted() {
        Reflect.ownKeys(this).forEach((key) => {
            if (key != "hostGSP" && key != "hostId" && key != "ownerId" && key != "id" && key != "committedVals" && key != "tentListeners" && key != "commListeners" && key != "isEventual" && key != "_INSTANCEOF_ISOLATE_" && key != '_SPIDER_OBJECT_MIRROR_' && key != '_IS_EVENTUAL_') {
                this.committedVals.set(key.toString(), this[key]);
            }
        });
    }
    //Called by host actor when this eventual is first passed to other actor
    setHost(hostGsp, hostId = undefined, isOwner) {
        this.hostGsp = hostGsp;
        this.hostId = hostId;
        if (isOwner) {
            this.ownerId = hostId;
        }
        this.tentListeners.forEach((callback) => {
            this.hostGsp.tentativeListeners.push(callback);
        });
        this.commListeners.forEach((callback) => {
            this.hostGsp.commitListeners.push(callback);
        });
        this.tentListeners = [];
        this.commListeners = [];
    }
    resetToCommit() {
        this.committedVals.forEach((committedVal, key) => {
            this[key] = committedVal;
        });
    }
    commit() {
        this.committedVals.forEach((_, key) => {
            this.committedVals.set(key, this[key]);
        });
        this.triggerCommit();
    }
    constructor() {
        super(new EventualMirror());
        this["_IS_EVENTUAL_"] = true;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        this.isEventual = true;
        this.committedVals = new Map();
        this.tentListeners = [];
        this.commListeners = [];
    }
    //////////////////////////////////////
    // API                              //
    //////////////////////////////////////
    triggerTentative() {
        if (this.hostGsp) {
            this.hostGsp.tentativeListeners.forEach((callback) => {
                callback(this);
            });
        }
        else {
            this.tentListeners.forEach((callback) => {
                callback(this);
            });
        }
    }
    onTentative(callback) {
        if (this.hostGsp) {
            this.hostGsp.tentativeListeners.push(callback);
        }
        else {
            this.tentListeners.push(callback);
        }
    }
    onCommit(callback) {
        if (this.hostGsp) {
            this.hostGsp.commitListeners.push(callback);
        }
        else {
            this.commListeners.push(callback);
        }
    }
    triggerCommit() {
        if (this.hostGsp) {
            this.hostGsp.commitListeners.forEach((callback) => {
                callback(this);
            });
        }
        else {
            this.commListeners.forEach((callback) => {
                callback(this);
            });
        }
    }
}
exports.Eventual = Eventual;
class EventualMirror extends spiders_js_1.SpiderIsolateMirror {
    ignoreInvoc(methodName) {
        return methodName == "setHost" || methodName == "resetToCommit" || methodName == "commit" || methodName == "populateCommitted" || methodName == "onCommit" || methodName == "onTentative" || methodName == "triggerCommit" || methodName == "triggerTentative";
    }
    checkArg(arg) {
        if (arg instanceof Array) {
            let wrongArgs = arg.filter(this.checkArg);
            return wrongArgs.length > 0;
        }
        else if (typeof arg == 'object') {
            //Does this look like I'm stupid ? Yes ! However undefined is not seen as a falsy value for filter while it is in the condition of an if ... go figure
            if (!arg["_IS_EVENTUAL_"]) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }
    canInvoke(methodName, args) {
        let wrongArgs = args.filter((arg) => {
            return this.checkArg(arg);
        });
        if (wrongArgs.length > 0) {
            let message = "Cannot pas non-eventual arguments to eventual method call: " + methodName;
            throw new Error(message);
        }
        else {
            return true;
        }
    }
    invoke(methodName, args) {
        let baseEV = this.base;
        if (!baseEV.hostGsp) {
            if (this.ignoreInvoc(methodName)) {
                return super.invoke(methodName, args);
            }
            else {
                if (this.canInvoke(methodName, args)) {
                    return super.invoke(methodName, args);
                }
            }
        }
        else if (!this.ignoreInvoc(methodName)) {
            if (baseEV.hostGsp.replay.includes(baseEV.id)) {
                if (this.canInvoke(methodName, args)) {
                    return super.invoke(methodName, args);
                }
            }
            else {
                if (this.canInvoke(methodName, args)) {
                    baseEV.hostGsp.createRound(baseEV.id, baseEV.ownerId, methodName, args);
                    let ret = super.invoke(methodName, args);
                    baseEV.hostGsp.yield(baseEV.id, baseEV.ownerId);
                    baseEV.triggerTentative();
                    return ret;
                }
            }
        }
        else {
            //No need to check method call constraints, it's a system call
            return super.invoke(methodName, args);
        }
    }
    write(fieldName, value) {
        if (this.checkArg(value) && fieldName != "hostGsp" && fieldName != "committedVals") {
            throw new Error("Cannot assign non-eventual argument to eventual field: " + fieldName);
        }
        else {
            return super.write(fieldName, value);
        }
    }
    resolve(hostActorMirror) {
        //Dirty trick, but it could be that this eventual is resolved to an actor which hasn't been initialised (i.e. as part of a scope serialisation)
        if (hostActorMirror.base.behaviourObject) {
            let newGsp = hostActorMirror.base.behaviourObject.gsp;
            let oldGSP = this.base.hostGsp;
            this.base.setHost(newGsp, hostActorMirror.base.thisRef.ownerId, false);
            newGsp.registerHolderEventual(this.base, oldGSP);
        }
    }
    pass(hostActorMirror) {
        //Same "hack" as for resolve
        if (hostActorMirror.base.behaviourObject) {
            let gsp = hostActorMirror.base.behaviourObject.gsp;
            let eventual = this.base;
            if (!gsp.knownEventual(eventual.id)) {
                if (eventual.committedVals.size == 0) {
                    //This is the first invocation on this eventual, populate its committed map
                    eventual.populateCommitted();
                }
                gsp.registerMasterEventual(eventual);
                eventual.setHost(gsp, hostActorMirror.base.thisRef.ownerId, true);
            }
            return super.pass(hostActorMirror);
        }
    }
}
exports.EventualMirror = EventualMirror;
let evScope = new spiders_js_1.LexScope();
evScope.addElement("EventualMirror", EventualMirror);
spiders_js_1.bundleScope(Eventual, evScope);
//# sourceMappingURL=Eventual.js.map