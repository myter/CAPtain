Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
/*class Test extends Eventual{
    value
    constructor(){
        super()
        this.value = 0
    }

    incM(){
        this.value++
    }
}


class TA extends CAPplication{
    getFrom(ref){
        ref.giveMe().then((rep)=>{
            console.log("got rep")
            rep.incM()
        })
    }
}

class TAC extends CAPActor{
    Test
    constructor(){
        super()
        this.Test = Test
    }
    
    giveMe(){
        let t = new this.Test()
        t.onCommit(()=>{
            console.log("Changed commit val in actor")
        })
        return t
    }
}

let app = new TA()
let act = app.spawnActor(TAC)
app.getFrom(act)*/
class TestEventual extends Eventual_1.Eventual {
    constructor() {
        super();
        this.v1 = 5;
    }
    inc() {
        this.v1++;
        return 5;
    }
    incWithPrim(v) {
        this.v1 += v;
    }
    incWithCon(c) {
        this.v1 += c.v1;
    }
}
class Act2 extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.ev = new TestEventual();
    }
    init() {
        console.log("init ok");
    }
    test() {
        console.log("Test invoked");
        return this.ev.v1;
    }
}
let app = new CAPplication_1.CAPplication();
app.spawnActor(Act2).test().then((v) => {
    console.log(v);
});
//# sourceMappingURL=temp.js.map