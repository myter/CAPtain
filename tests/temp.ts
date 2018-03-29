import {CAPActor} from "../src/CAPActor";
import {Actor, Application, SpiderIsolate} from "spiders.js";
import {Eventual} from "../src/Eventual";
import {Available} from "../src/Available";
import set = Reflect.set;
import {CAPplication} from "../src/CAPplication";
class Counter extends Eventual {
    value

    constructor(){
        super()
        this.value = 0
    }

    incrementM(){
        this.value++
    }
}

class TestApp extends CAPplication{
    sendTo(ref){
        let c = new Counter()
        ref.getRep(c)
        c.incrementM()
        setTimeout(()=>{
            console.log("Value in application: " + c.value)
        },2000)
    }
}

class TestAct extends CAPActor{

    getRep(rep){
        setTimeout(()=>{
            console.log("Value in actor: " + rep.value)
        },2000)
    }
}

let app = new TestApp()
let act = app.spawnActor(TestAct)
app.sendTo(act)
