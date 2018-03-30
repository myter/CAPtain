Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
class Test extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 0;
    }
    incM() {
        this.value++;
    }
}
class TA extends CAPplication_1.CAPplication {
    sendTo(ref) {
        let t = new Test();
        t.onCommit((ev) => {
            console.log("New commit val in app: " + ev.value);
        });
        t.onTentative((ev) => {
            console.log("New tent val in app: " + ev.value);
        });
        ref.get(t);
        setTimeout(() => {
            console.log("Incrementing in app");
            t.incM();
        }, 5000);
    }
}
class TAC extends CAPActor_1.CAPActor {
    get(rep) {
        rep.onCommit((ev) => {
            console.log("New commit val in act: " + ev.value);
        });
        rep.onTentative((ev) => {
            console.log("New tent val in act: " + ev.value);
        });
        setTimeout(() => {
            console.log("Incrementing in act");
            rep.incM();
        }, 2000);
    }
}
let app = new TA();
let act = app.spawnActor(TAC);
app.sendTo(act);
//# sourceMappingURL=temp.js.map