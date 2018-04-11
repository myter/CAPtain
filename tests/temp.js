var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
class TestEV extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 5;
    }
    inc() {
        console.log("Incrementing");
        this.value++;
    }
}
__decorate([
    Eventual_1.mutating
], TestEV.prototype, "inc", null);
exports.TestEV = TestEV;
class MutAct extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.AnnotEV = TestEV;
    }
    test() {
        let ev = new this.AnnotEV();
        console.log(ev.value);
        return new Promise((resolve) => {
            ev.onTentative(() => (resolve(ev.value)));
            ev.inc();
            console.log(ev.value);
        });
    }
}
let app = new CAPplication_1.CAPplication();
let act = app.spawnActor(MutAct);
act.test().then((v) => {
    console.log("Got back: " + v);
});
//# sourceMappingURL=temp.js.map