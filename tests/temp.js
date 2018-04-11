Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
class Test extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 0;
    }
    incMUT() {
        this.value++;
    }
}
class App extends CAPplication_1.CAPplication {
    constructor() {
        super();
        this.ev = new Test();
    }
    sendTo(ref) {
        ref.getEV(this.ev);
    }
    mutate() {
        this.ev.incMUT();
    }
    print() {
        console.log("In app: " + this.ev.value);
    }
}
class Act extends CAPActor_1.CAPActor {
    getEV(ev) {
        this.ev = ev;
    }
    print() {
        console.log("In act: " + this.ev.value);
    }
}
let app = new App();
let a1 = app.spawnActor(Act);
app.mutate();
app.mutate();
app.sendTo(a1);
setTimeout(() => {
    app.print();
    a1.print();
    let a2 = app.spawnActor(Act);
    app.sendTo(a2);
    setTimeout(() => {
        a2.print();
    }, 1000);
}, 1000);
//# sourceMappingURL=temp.js.map