Object.defineProperty(exports, "__esModule", { value: true });
const CAPActor_1 = require("../src/CAPActor");
const spiders_js_1 = require("spiders.js");
const Eventual_1 = require("../src/Eventual");
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
let app = new spiders_js_1.Application();
class Master extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.ev = new TestEventual();
    }
    sendAndInc(toRef) {
        console.log("SENDING");
        toRef.getEv(this.ev);
        this.ev.inc();
    }
}
class Slave extends CAPActor_1.CAPActor {
    getEv(anEv) {
        console.log("Got EV");
        this.ev = anEv;
    }
    test() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.ev.v1);
            }, 2000);
        });
    }
}
let slave = app.spawnActor(Slave);
let master = app.spawnActor(Master);
master.sendAndInc(slave);
//# sourceMappingURL=temp.js.map