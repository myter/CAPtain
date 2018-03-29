Object.defineProperty(exports, "__esModule", { value: true });
const CAPActor_1 = require("../src/CAPActor");
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
class Counter extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 0;
    }
    incrementM() {
        this.value++;
    }
}
class TestApp extends CAPplication_1.CAPplication {
    sendTo(ref) {
        let c = new Counter();
        ref.getRep(c);
        c.incrementM();
        setTimeout(() => {
            console.log("Value in application: " + c.value);
        }, 2000);
    }
}
class TestAct extends CAPActor_1.CAPActor {
    getRep(rep) {
        setTimeout(() => {
            console.log("Value in actor: " + rep.value);
        }, 2000);
    }
}
let app = new TestApp();
let act = app.spawnActor(TestAct);
app.sendTo(act);
//# sourceMappingURL=temp.js.map