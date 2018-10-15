Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
var _IS_CONSISTENT_KEY_ = "_IS_CONSISTENT_";
class Consistent extends spiders_js_1.SpiderObject {
    constructor() {
        super(new ConsistentMirror());
        this[_IS_CONSISTENT_KEY_] = true;
        this.isConsistent = true;
    }
}
exports.Consistent = Consistent;
class ConsistentMirror extends spiders_js_1.SpiderObjectMirror {
    checkArg(arg) {
        if (arg instanceof Array) {
            let wrongArgs = arg.filter((a) => {
                return this.checkArg(a);
            });
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
            if (!arg[_IS_CONSISTENT_KEY_]) {
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
    invoke(methodName, args) {
        let wrongArgs = args.filter(this.checkArg);
        if (wrongArgs.length > 0) {
            let message = "Cannot pas non-consistent arguments to consistent method call: " + methodName;
            throw new Error(message);
        }
        else {
            return new Promise((resolve) => {
                //Pretty ugly, but all methods in mirror object are bound to the mirror
                //In this case we don't want this.x to return a promise if it's "internal"
                //Moreover, this must be the case for nested function calls as well
                let rebind = (func) => {
                    return func.unBind().bind(new Proxy(base, {
                        get(target, key, receiver) {
                            if (typeof target[key] == 'function') {
                                return rebind(target[key]);
                            }
                            else {
                                return target[key];
                            }
                        }
                    }));
                };
                //Need to get the regular function back and bind it to the unproxied object
                //let f = this.base[methodName].unBind().bind(this.base)
                let base = this.base;
                /*let f = this.base[methodName].unBind().bind(new Proxy(base,{
                    get(target,key,receiver){
                        if(typeof target[key] == 'function'){
                            return target[key].unBind().bind(base)
                        }
                        else{
                            return target[key]
                        }
                    }
                }))*/
                let f = rebind(this.base[methodName]);
                resolve(f(...args));
            });
        }
    }
    write(fieldName, value) {
        if (this.checkArg(value)) {
            throw new Error("Cannot assign non-consistent argument to consistent field");
        }
        else {
            return new Promise((resolve) => {
                resolve(super.write(fieldName, value));
            });
        }
    }
    isMutatingMethod(methodName) {
        if (this.isAnnotated(methodName)) {
            return this.getAnnotationTag(methodName) == "mutating";
        }
        else {
            return false;
        }
    }
    access(fieldName) {
        if (fieldName == "_GET_THAW_DATA_") {
            return new Promise((resolve) => {
                let fields = [];
                let methods = [];
                let baseKeys = Reflect.ownKeys(this.base).filter((key) => {
                    return key != "_IS_CONSISTENT_" && key != "isConsistent" && key != "constructor";
                });
                let protoKeys = Reflect.ownKeys(Reflect.getPrototypeOf(this.base)).filter((key) => {
                    return key != "constructor";
                });
                baseKeys.concat(protoKeys).forEach((key) => {
                    if (typeof this.base[key] == 'function') {
                        let meth = this.base[key].toString();
                        methods.push([key, meth, this.isMutatingMethod(key)]);
                    }
                    else {
                        fields.push([key, this.base[key]]);
                    }
                });
                let res = [fields, methods];
                resolve(res);
            });
        }
        else {
            return new Promise((resolve) => {
                resolve(super.access(fieldName));
            });
        }
    }
}
exports.ConsistentMirror = ConsistentMirror;
let consScope = new spiders_js_1.LexScope();
consScope.addElement("ConsistentMirror", ConsistentMirror);
consScope.addElement("_IS_CONSISTENT_KEY_", _IS_CONSISTENT_KEY_);
spiders_js_1.bundleScope(Consistent, consScope);
let conMirrorScope = new spiders_js_1.LexScope();
conMirrorScope.addElement("_IS_CONSISTENT_KEY_", _IS_CONSISTENT_KEY_);
spiders_js_1.bundleScope(ConsistentMirror, conMirrorScope);
//# sourceMappingURL=Consistent.js.map