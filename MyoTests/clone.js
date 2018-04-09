//Clone function comes from stack overflow thread:
//http://stackoverflow.com/questions/728360/how-do-i-correctly-clone-a-javascript-object
function cloneDR(o) {
    const gdcc = "__getDeepCircularCopy__";
    if (o !== Object(o)) {
        return o; // primitive value
    }
    var set = gdcc in o, cache = o[gdcc], result;
    if (set && typeof cache == "function") {
        return cache();
    }
    // else
    o[gdcc] = function () { return result; }; // overwrite
    /*console.log("Checking for ")
    console.log(o)
    console.log(o instanceof Map)*/
    if (o instanceof Array) {
        result = [];
        for (var i = 0; i < o.length; i++) {
            result[i] = cloneDR(o[i]);
        }
    }
    else if (o instanceof Map) {
        result = new Map();
        o.forEach((val, key) => {
            if (!key == gdcc) {
                result.set(key, cloneDR(val));
            }
        });
    }
    else if (o instanceof Function) {
        result = o;
    }
    else {
        result = {};
        Reflect.ownKeys(o).forEach((k) => {
            if (k != gdcc) {
                result[k] = cloneDR(o[k]);
            }
            else if (set) {
                result[k] = cloneDR(cache);
            }
        });
    }
    for (var prop in o)
        if (prop != gdcc)
            result[prop] = cloneDR(o[prop]);
        else if (set)
            result[prop] = cloneDR(cache);
    if (set) {
        o[gdcc] = cache; // reset
    }
    else {
        delete o[gdcc]; // unset again
    }
    return result;
}
//REALLY ugly way of checking whether we have reached the end of the prototype chain while cloning
function isLastPrototype(object) {
    return object == null;
}
function clone(object) {
    let base = cloneDR(object);
    function walkProto(proto, last) {
        if (!(isLastPrototype(proto))) {
            let protoClone = cloneDR(proto);
            Reflect.setPrototypeOf(last, protoClone);
            walkProto(Reflect.getPrototypeOf(proto), protoClone);
        }
    }
    walkProto(Reflect.getPrototypeOf(object), base);
    return base;
}
let testArr = [1, 2];
let testMap = new Map();
testMap.set("foo", "bar");
console.log(cloneDR(testMap));
//# sourceMappingURL=clone.js.map