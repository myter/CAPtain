Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
const Eventual_1 = require("./Eventual");
const Consistent_1 = require("./Consistent");
let EV = Eventual_1.Eventual;
let CO = Consistent_1.Consistent;
class CAPMirror extends spiders_js_1.SpiderActorMirror {
    constructor() {
        super();
        this.EV = EV;
        this.CO = CO;
    }
    simpleBind(fun, ctx) {
        var newFun = function () {
            return fun.apply(ctx, arguments);
        };
        newFun.toString = function () {
            return fun.toString();
        };
        newFun.unBind = function () {
            return fun;
        };
        return newFun;
    }
    freezeCheck(value) {
        if (value.isEventual != true) {
            throw new Error("Cannot freeze non-eventual value");
        }
        else {
            return this.freeze(value);
        }
    }
    thawCheck(value) {
        let check = value.isConsistent;
        if (check instanceof Promise) {
            return check.then((ok) => {
                if (ok) {
                    return this.thaw(value);
                }
                else {
                    throw new Error("Cannot thaw non-consistent value");
                }
            });
        }
        else {
            throw new Error("Cannot thaw non-consistent value");
        }
    }
    constructMethod(functionSource) {
        if (functionSource.startsWith("function")) {
            return eval("(" + functionSource + ")");
        }
        else {
            return eval("(function " + functionSource + ")");
        }
    }
    freeze(value) {
        let con = new this.CO();
        let [fields, methods] = value["_GET_FREEZE_DATA_"];
        fields.forEach(([fieldName, fieldvalue]) => {
            con[fieldName] = fieldvalue;
        });
        methods.forEach(([methodName, methodString]) => {
            con[methodName] = this.simpleBind(this.constructMethod(methodString), con);
        });
        return con;
    }
    thaw(value) {
        let ev = new this.EV();
        if (ev.committedVals.size == 0) {
            //This is the first invocation on this eventual, populate its committed map
            ev.populateCommitted();
        }
        let behaviour = this.base.behaviourObject;
        let gsp = behaviour.gsp;
        gsp.registerMasterEventual(ev);
        ev.setHost(gsp, this.base.thisRef.ownerId, true);
        return value["_GET_THAW_DATA_"].then(([fields, methods]) => {
            fields.forEach(([fieldName, fieldvalue]) => {
                ev[fieldName] = fieldvalue;
            });
            methods.forEach(([methodName, methodString]) => {
                ev[methodName] = this.simpleBind(this.constructMethod(methodString), ev);
            });
            return ev;
        });
    }
    initialise(stdLib, appActor, parentRef) {
        stdLib.freeze = this.freezeCheck.bind(this);
        stdLib.thaw = this.thawCheck.bind(this);
        super.initialise(stdLib, appActor, parentRef);
        let behaviour = this.base.behaviourObject;
        let gsp = behaviour.gsp;
        Reflect.ownKeys(behaviour).forEach((key) => {
            let val = behaviour[key];
            if (val) {
                if (val.isEventual == true) {
                    if (!gsp.knownEventual(val.id)) {
                        if (val.committedVals.size == 0) {
                            //This is the first invocation on this eventual, populate its committed map
                            val.populateCommitted();
                        }
                        gsp.registerMasterEventual(val);
                        val.setHost(gsp, this.base.thisRef.ownerId, true);
                    }
                }
            }
        });
    }
}
exports.CAPMirror = CAPMirror;
//# sourceMappingURL=CAPMirror.js.map