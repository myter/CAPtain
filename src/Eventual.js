Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
exports._IS_EVENTUAL_KEY_ = "_IS_EVENTUAL_";
class Eventual extends spiders_js_1.SpiderIsolate {
    constructor() {
        super(new EventualMirror());
        this.populated = false;
        this["_IS_EVENTUAL_"] = true;
        this.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
        this.isEventual = true;
        this.committedVals = new Map();
        this.tentativeVals = new Map();
        this.tentListeners = [];
        this.commListeners = [];
    }
    clone(value) {
        if (typeof value != 'object') {
            return value;
        }
        else if (value instanceof Array) {
            let res = [];
            value.forEach((val) => {
                res.push(this.clone(val));
            });
            return res;
        }
        else if (value instanceof Map) {
            let res = new Map();
            value.forEach((val, key) => {
                res.set(key, this.clone(val));
            });
            return res;
        }
        else if (value.isEventual) {
            /*console.log("Cloning inner eventual")
            let c = new (this.constructor as any)()
            Reflect.ownKeys(value).forEach((key)=>{
                //console.log("Deep cloning: " + key.toString())
                //console.log("Is eventual? " + value[key].isEventual)
                c[key] = this.clone(value[key])
            })
            return c*/
            /*Reflect.ownKeys(value).forEach((key)=>{
                value[key] = this.clone(value[key])
            })*/
            return value;
        }
        else {
            return value;
        }
    }
    //////////////////////////////////////
    // GSP methods                      //
    //////////////////////////////////////
    populateCommitted() {
        /*Reflect.ownKeys(this).forEach((key)=>{
            if(typeof this[key] != 'function' && key != "hostGsp" && key != "hostId" && key != "ownerId" && key != "id" && key != "committedVals" && key != "tentativeVals" && key != "tentListeners" && key != "commListeners" && key != "populated" && key != "isEventual" && key != "_INSTANCEOF_ISOLATE_" && key != '_SPIDER_OBJECT_MIRROR_' && key != '_IS_EVENTUAL_'){
                this.committedVals.set(key.toString(),this.clone(this[key]))
                this.tentativeVals.set(key.toString(),this.clone(this[key]))
            }
        })*/
        this.populated = true;
    }
    //Called by host actor when this eventual is first passed to other actor
    setHost(hostGsp, hostId = undefined, isOwner) {
        this.hostGsp = hostGsp;
        this.hostId = hostId;
        if (isOwner) {
            this.ownerId = hostId;
        }
        if (!this.hostGsp.tentativeListeners.has(this.id)) {
            this.hostGsp.tentativeListeners.set(this.id, []);
        }
        if (!this.hostGsp.commitListeners.has(this.id)) {
            this.hostGsp.commitListeners.set(this.id, []);
        }
        this.tentListeners.forEach((callback) => {
            this.hostGsp.tentativeListeners.get(this.id).push(callback);
        });
        this.commListeners.forEach((callback) => {
            this.hostGsp.commitListeners.get(this.id).push(callback);
        });
        this.tentListeners = [];
        this.commListeners = [];
    }
    resetToCommit() {
        this.committedVals.forEach((committedVal, key) => {
            /*console.log("Inside: " + this.hostGsp.thisActorId)
            console.log(key)
            console.log("Resetting to commit from: " + committedVal + " to " + this.tentativeVals.get(key))*/
            this.tentativeVals.set(key, committedVal);
        });
    }
    commit() {
        this.tentativeVals.forEach((tentativeVal, key) => {
            this.committedVals.set(key, tentativeVal);
        });
        /*console.log("Inside: " + this.hostGsp.thisActorId)
        console.log("After commit for: " + this.id)
        console.log(this.tentativeVals.get("innerVal"))*/
        this.triggerCommit();
    }
    //////////////////////////////////////
    // API                              //
    //////////////////////////////////////
    triggerTentative() {
        if (this.hostGsp) {
            this.hostGsp.tentativeListeners.get(this.id).forEach((callback) => {
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
            if (!this.hostGsp.tentativeListeners.has(this.id)) {
                this.hostGsp.tentativeListeners.set(this.id, []);
            }
            this.hostGsp.tentativeListeners.get(this.id).push(callback);
        }
        else {
            this.tentListeners.push(callback);
        }
    }
    onCommit(callback) {
        if (this.hostGsp) {
            if (!this.hostGsp.commitListeners.has(this.id)) {
                this.hostGsp.commitListeners.set(this.id, []);
            }
            this.hostGsp.commitListeners.get(this.id).push(callback);
        }
        else {
            this.commListeners.push(callback);
        }
    }
    triggerCommit() {
        if (this.hostGsp) {
            this.hostGsp.commitListeners.get(this.id).forEach((callback) => {
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
        return methodName == "setHost" || methodName == "resetToCommit" || methodName == "commit" || methodName == "populateCommitted" || methodName == "onCommit" || methodName == "onTentative" || methodName == "triggerCommit" || methodName == "triggerTentative" || methodName == "clone";
    }
    checkArg(arg) {
        if (arg instanceof Array) {
            let wrongArgs = arg.filter(this.checkArg);
            return wrongArgs.length > 0;
        }
        if (arg instanceof Map) {
            let foundWrongArg = false;
            arg.forEach((val) => {
                if (this.checkArg(val)) {
                    foundWrongArg = true;
                }
            });
            return foundWrongArg;
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
                    //No host GSP yet for this eventual, which means that it hasn't been serialised yet but created by hosting actor
                    //Safe to trigger both tentative and commit handlers
                    baseEV.triggerTentative();
                    baseEV.triggerCommit();
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
                if (this.canInvoke(methodName, args) && methodName.includes("MUT")) {
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
        if (this.checkArg(value) && fieldName != "hostGsp" && fieldName != "committedVals" && fieldName != "tentativeVals" && fieldName != "_SPIDER_OBJECT_MIRROR_") {
            throw new Error("Cannot assign non-eventual argument to eventual field: " + fieldName);
        }
        else if (fieldName == "hostGsp" || fieldName == "hostId" || fieldName == "ownerId" || fieldName == "id" || fieldName == "committedVals" || fieldName == "tentativeVals" || fieldName == "tentListeners" || fieldName == "commListeners" || fieldName == "populated" || fieldName == "isEventual" || fieldName == "_INSTANCEOF_ISOLATE_" || fieldName == '_SPIDER_OBJECT_MIRROR_' || fieldName == '_IS_EVENTUAL_') {
            return super.write(fieldName, value);
        }
        else {
            let base = this.base;
            if (base.tentativeVals) {
                if (base.tentativeVals.has(fieldName)) {
                    base.tentativeVals.set(fieldName, value);
                }
                else {
                    base.tentativeVals.set(fieldName, base.clone(value));
                    base.committedVals.set(fieldName, base.clone(value));
                }
            }
            return super.write(fieldName, value);
        }
    }
    access(fieldName) {
        let base = this.base;
        if (base.tentativeVals.has(fieldName)) {
            return base.tentativeVals.get(fieldName);
        }
        else {
            return super.access(fieldName);
        }
    }
    resolve(hostActorMirror) {
        //Dirty trick, but it could be that this eventual is resolved to an actor which hasn't been initialised (i.e. as part of a scope serialisation)
        if (hostActorMirror.base.behaviourObject) {
            let newGsp = hostActorMirror.base.behaviourObject.gsp;
            let oldGSP = this.base.hostGsp;
            this.base.setHost(newGsp, hostActorMirror.base.thisRef.ownerId, false);
            if (!newGsp.knownEventual(this.base.id)) {
                newGsp.registerHolderEventual(this.base, oldGSP);
            }
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