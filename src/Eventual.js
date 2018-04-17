Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
exports._IS_EVENTUAL_KEY_ = "_IS_EVENTUAL_";
function mutating(target, propertyKey, descriptor) {
    let originalMethod = descriptor.value;
    originalMethod["_IS_MUTATING_"] = true;
    return {
        value: originalMethod
    };
}
exports.mutating = mutating;
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
        this.dependencies = new Map();
        this.lastCommit = 0;
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
        /*let layDependencies = (committed)=>{
            if(committed instanceof Array){
                (committed as Array<any>).forEach((v)=>{
                    layDependencies(v)
                })
            }
            else if(committed instanceof Map){

            }
            else if(committed.isEventual){
                console.log("Adding dependency")
                this.addDependency(committed)
            }
        }
        this.committedVals.forEach((committed)=>{
            console.log("checking")
            layDependencies(committed)
        })*/
        this.populated = true;
    }
    //Called by host actor when this eventual is first passed to other actor
    setHost(hostGsp, hostId = undefined, isOwner) {
        if (this.hostGsp == undefined) {
            this.masterGsp = hostGsp;
        }
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
        let reset = (val, key) => {
            if (val instanceof Array || val instanceof Map) {
                val.forEach((v) => {
                    if (v.isEventual) {
                        v.resetToCommit();
                    }
                });
            }
            else if (val.isEventual) {
                val.resetToCommit();
            }
            this.tentativeVals.set(key, val);
        };
        this.committedVals.forEach((committedVal, key) => {
            //reset(committedVal,key)
            this.tentativeVals.set(key, committedVal);
        });
    }
    commit(roundNumber) {
        let comm = (val, key) => {
            if (val instanceof Array || val instanceof Map) {
                val.forEach((v) => {
                    if (v.isEventual) {
                        v.commit(roundNumber);
                    }
                });
            }
            else if (val.isEventual) {
                val.commit(roundNumber);
            }
            this.committedVals.set(key, this.clone(val));
        };
        this.tentativeVals.forEach((tentativeVal, key) => {
            this.committedVals.set(key, this.clone(tentativeVal));
            //comm(tentativeVal,key)
        });
        this.lastCommit = roundNumber;
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
    addDependency(ev) {
        if (!this.dependencies.has(ev.id)) {
            this.dependencies.set(ev.id, ev);
            ev.onCommit(() => {
                this.triggerCommit();
            });
            ev.onTentative(() => {
                this.triggerTentative();
            });
        }
    }
    relayDependencies() {
        this.dependencies.forEach((ev, evId) => {
            ev.onCommit(() => {
                this.triggerCommit();
            });
            ev.onTentative(() => {
                this.triggerTentative();
            });
        });
    }
}
exports.Eventual = Eventual;
class EventualMirror extends spiders_js_1.SpiderIsolateMirror {
    ignoreInvoc(methodName) {
        return methodName == "relayDependencies" || methodName == "setHost" || methodName == "addDependency" || methodName == "resetToCommit" || methodName == "commit" || methodName == "populateCommitted" || methodName == "onCommit" || methodName == "onTentative" || methodName == "triggerCommit" || methodName == "triggerTentative" || methodName == "clone";
    }
    checkArg(arg) {
        if (arg instanceof Array) {
            let wrongArgs = arg.filter(this.checkArg);
            return wrongArgs.length > 0;
        }
        else if (arg instanceof Map) {
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
                args.forEach((arg) => {
                    if (arg.isEventual) {
                        baseEV.addDependency(arg);
                    }
                });
                if (this.canInvoke(methodName, args) && (methodName.includes("MUT") || baseEV[methodName]["_IS_MUTATING_"])) {
                    //No host GSP yet for this eventual, which means that it hasn't been serialised yet but created by hosting actor
                    //Safe to trigger both tentative and commit handlers
                    let ret = super.invoke(methodName, args);
                    baseEV.triggerTentative();
                    baseEV.triggerCommit();
                    return ret;
                }
                else {
                    return super.invoke(methodName, args);
                }
            }
        }
        else if (!this.ignoreInvoc(methodName)) {
            args.forEach((arg) => {
                if (arg.isEventual) {
                    baseEV.addDependency(arg);
                }
            });
            if (baseEV.hostGsp.replay.includes(baseEV.id)) {
                if (this.canInvoke(methodName, args)) {
                    return super.invoke(methodName, args);
                }
            }
            else {
                if (this.canInvoke(methodName, args) && (methodName.includes("MUT") || baseEV[methodName]["_IS_MUTATING_"])) {
                    baseEV.hostGsp.createRound(baseEV.id, baseEV.ownerId, methodName, args);
                    let ret = super.invoke(methodName, args);
                    baseEV.hostGsp.yield(baseEV.id, baseEV.ownerId);
                    baseEV.triggerTentative();
                    return ret;
                }
                else {
                    return super.invoke(methodName, args);
                }
            }
        }
        else {
            //No need to check method call constraints, it's a system call
            return super.invoke(methodName, args);
        }
    }
    write(fieldName, value) {
        if (this.checkArg(value) && fieldName != "hostGsp" && fieldName != "dependencies" && fieldName != "masterGsp" && fieldName != "committedVals" && fieldName != "tentativeVals" && fieldName != "_SPIDER_OBJECT_MIRROR_") {
            throw new Error("Cannot assign non-eventual argument to eventual field: " + fieldName);
        }
        else if (fieldName == "hostGsp" || fieldName == "masterGsp" || fieldName == "dependencies" || fieldName == "hostId" || fieldName == "ownerId" || fieldName == "id" || fieldName == "committedVals" || fieldName == "tentativeVals" || fieldName == "tentListeners" || fieldName == "commListeners" || fieldName == "populated" || fieldName == "isEventual" || fieldName == "_INSTANCEOF_ISOLATE_" || fieldName == '_SPIDER_OBJECT_MIRROR_' || fieldName == '_IS_EVENTUAL_') {
            return super.write(fieldName, value);
        }
        else if (typeof value == 'function') {
            return super.write(fieldName, value);
        }
        else {
            let base = this.base;
            if (value.isEventual) {
                base.addDependency(value);
            }
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
        if (fieldName == "_GET_FREEZE_DATA_") {
            let fields = [];
            let methods = [];
            let baseKeys = Reflect.ownKeys(this.base).filter((key) => {
                return key != "constructor" && key != "relayDependencies" && key != "instantiate" && key != "setHost" && key != "addDependency" && key != "resetToCommit" && key != "commit" && key != "populateCommitted" && key != "onCommit" && key != "onTentative" && key != "triggerCommit" && key != "triggerTentative" && key != "clone" && key != "hostGsp" && key != "masterGsp" && key != "dependencies" && key != "hostId" && key != "ownerId" && key != "id" && key != "committedVals" && key != "tentativeVals" && key != "tentListeners" && key != "commListeners" && key != "populated" && key != "isEventual" && key != "_INSTANCEOF_ISOLATE_" && key != '_SPIDER_OBJECT_MIRROR_' && key != '_IS_EVENTUAL_';
            });
            let protoKeys = Reflect.ownKeys(Reflect.getPrototypeOf(this.base)).filter((key) => {
                return key != "constructor";
            });
            baseKeys.concat(protoKeys).forEach((key) => {
                if (typeof this.base[key] == 'function') {
                    let meth = this.base[key].toString();
                    methods.push([key, meth]);
                }
                else {
                    let base = this.base;
                    if (base.tentativeVals.has(key.toString())) {
                        fields.push([key, base.tentativeVals.get(key.toString())]);
                    }
                    else {
                        fields.push([key, this.base[key]]);
                    }
                }
            });
            return [fields, methods];
        }
        else {
            let base = this.base;
            if (base.tentativeVals.has(fieldName)) {
                return base.tentativeVals.get(fieldName);
            }
            else {
                return super.access(fieldName);
            }
        }
    }
    resolve(hostActorMirror) {
        //Dirty trick, but it could be that this eventual is resolved to an actor which hasn't been initialised (i.e. as part of a scope serialisation)
        if (hostActorMirror.base.behaviourObject) {
            let baseEV = this.base;
            let newGsp = hostActorMirror.base.behaviourObject.gsp;
            baseEV.setHost(newGsp, hostActorMirror.base.thisRef.ownerId, false);
            if (!newGsp.knownEventual(baseEV.id)) {
                baseEV.relayDependencies();
                newGsp.registerHolderEventual(this.proxyBase, baseEV.masterGsp);
            }
            return newGsp.eventuals.get(baseEV.id);
        }
        else {
            return super.resolve(hostActorMirror);
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
                gsp.registerMasterEventual(this.proxyBase);
                eventual.setHost(gsp, hostActorMirror.base.thisRef.ownerId, true);
            }
            return super.pass(hostActorMirror);
        }
        else {
            return super.pass(hostActorMirror);
        }
    }
}
exports.EventualMirror = EventualMirror;
let evScope = new spiders_js_1.LexScope();
evScope.addElement("EventualMirror", EventualMirror);
spiders_js_1.bundleScope(Eventual, evScope);
//# sourceMappingURL=Eventual.js.map