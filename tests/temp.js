var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPActor_1 = require("../src/CAPActor");
const CAPplication_1 = require("../src/CAPplication");
const Consistent_1 = require("../src/Consistent");
class TestEv extends Consistent_1.Consistent {
    constructor() {
        super();
        this.value = 5;
    }
    inc() {
        this.value += 1;
    }
}
__decorate([
    Eventual_1.mutating
], TestEv.prototype, "inc", null);
class TestActor extends CAPActor_1.CAPActor {
    getEV(e) {
        e.onCommit(() => {
            console.log("New value in actor: " + e.value);
        });
        e.inc();
    }
}
class App extends CAPplication_1.CAPplication {
    constructor() {
        super();
        let con = new TestEv();
        let ev = this.libs.thaw(con);
    }
}
new App();
/*let con = new TestCon()
let app = new CAPplication()
app.libs.thaw(con).then((ev)=>{
    ev.incMUT()
    let con2 = app.libs.freeze(ev)
    con2.incMUT()
})*/
//# sourceMappingURL=temp.js.map