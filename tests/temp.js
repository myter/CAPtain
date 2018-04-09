Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
class Contained extends Eventual_1.Eventual {
    constructor() {
        super();
        this.innerVal = 5;
    }
    incMUT() {
        this.innerVal++;
    }
}
class Container extends Eventual_1.Eventual {
    constructor() {
        super();
        this.inners = [];
    }
    addInnersMUT(inner) {
        this.inners.push(inner);
    }
}
class App extends CAPplication_1.CAPplication {
    sendEV(toRef) {
        this.cont = new Container();
        toRef.getContainer(this.cont);
    }
    print() {
        console.log("Printing state");
        this.cont.inners.forEach((inner) => {
            console.log(inner.innerVal);
        });
    }
}
class Act extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.Contained = Contained;
    }
    getContainer(container) {
        let inner = new this.Contained();
        container.addInnersMUT(inner);
        inner.incMUT();
        let inner2 = new this.Contained();
        container.addInnersMUT(inner2);
        inner2.incMUT();
    }
}
let app = new App();
let act = app.spawnActor(Act);
app.sendEV(act);
setTimeout(() => {
    app.print();
}, 5000);
//# sourceMappingURL=temp.js.map