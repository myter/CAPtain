Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
var _IS_CONSISTENT_KEY_ = "_IS_CONSISTENT_";
class Consistent extends spiders_js_1.SpiderObject {
    constructor() {
        super(new ConsistentMirror());
        this[_IS_CONSISTENT_KEY_] = true;
    }
}
exports.Consistent = Consistent;
class AsyncObjectMirror extends spiders_js_1.SpiderObjectMirror {
    invoke(methodName, args) {
        return new Promise((resolve) => {
            resolve(super.invoke(methodName, args));
        });
    }
    access(fieldName) {
        return new Promise((resolve) => {
            resolve(super.access(fieldName));
        });
    }
}
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
                resolve(super.invoke(methodName, args));
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
    access(fieldName) {
        return new Promise((resolve) => {
            resolve(super.access(fieldName));
        });
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