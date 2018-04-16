Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPActor_1 = require("../src/CAPActor");
const CAPplication_1 = require("../src/CAPplication");
class TestEv extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 5;
    }
    incMUT() {
        this.value += 1;
    }
}
class Act extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.TestEv = TestEv;
    }
    getCon() {
        this.ev = new this.TestEv();
        this.c = this.libs.freeze(this.ev);
        return this.c;
    }
    test() {
        console.log("EV value: " + this.ev.value);
        this.c.value.then((v) => {
            console.log("Consistent value: " + v);
        });
    }
}
let app = new CAPplication_1.CAPplication();
let act = app.spawnActor(Act);
act.getCon().then((c) => {
    c.incMUT().then(() => {
        act.test();
    });
});
//# sourceMappingURL=temp.js.map