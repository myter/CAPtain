Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const Consistent_1 = require("../src/Consistent");
class TestEV extends Eventual_1.Eventual {
    constructor() {
        super();
        this.value = 5;
    }
    incMUT() {
        this.value += 1;
    }
}
class TestCon extends Consistent_1.Consistent {
    constructor() {
        super();
        this.value = 5;
    }
    incMUT() {
        this.value += 1;
    }
}
let ev = new TestEV();
let app = new CAPplication_1.CAPplication();
let con = app.libs.freeze(ev);
con.incMUT();
app.libs.thaw(con).then((ev2) => {
    ev2.incMUT();
});
/*let con = new TestCon()
let app = new CAPplication()
app.libs.thaw(con).then((ev)=>{
    ev.incMUT()
    let con2 = app.libs.freeze(ev)
    con2.incMUT()
})*/
//# sourceMappingURL=temp.js.map