Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
class Container extends Eventual_1.Eventual {
    constructor() {
        super();
        this.inners = [];
    }
    addInnerMUT(newInner) {
        this.inners.push(newInner);
    }
}
class Contained extends Eventual_1.Eventual {
    constructor() {
        super();
        this.someVal = 5;
    }
    incMUT() {
        this.someVal++;
    }
}
class App extends CAPplication_1.CAPplication {
    constructor() {
        super();
        this.ev = new Container();
        this.ev.onCommit(() => {
            console.log("New commit in app");
            this.print();
        });
    }
    sendTo(ref) {
        ref.getEV(this.ev);
    }
    print() {
        console.log("In app: ");
        this.ev.inners.forEach((inner) => {
            console.log(inner.someVal);
        });
    }
}
class Act extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.Contained = Contained;
    }
    getEV(ev) {
        this.ev = ev;
        let c = new this.Contained();
        this.ev.addInnerMUT(c);
        c.incMUT();
    }
    print() {
        console.log("In act: ");
    }
}
let app = new App();
let a1 = app.spawnActor(Act);
app.sendTo(a1);
setTimeout(() => {
    console.log("Forcing");
    app.print();
}, 1500);
//# sourceMappingURL=temp.js.map