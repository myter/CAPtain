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
        return new Promise((resolve)=>{
            resolve(t)
        })
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
let app = new CAPplication_1.CAPplication();
class Master extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.ev = new TestEventual();
    }
    send(toRef) {
        this.ev.onCommit((ev) => {
            this.val = ev.v1;
        });
        toRef.getEv(this.ev);
    }
    test() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.val);
            }, 2000);
        });
    }
}
class Slave extends CAPActor_1.CAPActor {
    getEv(anEv) {
        anEv.onTentative((ev) => {
            this.val = ev.v1;
        });
        anEv.inc();
    }
}
let slave = app.spawnActor(Slave);
let master = app.spawnActor(Master);
master.send(slave);
master.test().then((v) => {
    console.log("Got back : " + v);
});
//# sourceMappingURL=temp.js.map