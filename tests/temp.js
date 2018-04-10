Object.defineProperty(exports, "__esModule", { value: true });
const Consistent_1 = require("../src/Consistent");
class Test extends Consistent_1.Consistent {
    constructor() {
        super();
        this.value = 5;
    }
    inc() {
        return this.value.then((v) => {
            console.log("Value read = " + v);
            return this.value = v + 5;
        });
    }
}
let t = new Test();
t.inc().then(() => {
    t.value.then((v) => {
        console.log("Updated: " + v);
    });
});
//# sourceMappingURL=temp.js.map