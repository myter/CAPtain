import {CAPActor} from "../src/CAPActor";
import {Actor, Application, SpiderIsolate} from "spiders.js";
import {Eventual} from "../src/Eventual";
class TestEventual extends Eventual{
    v1

    constructor(){
        super()
        this.v1 = 5
    }

    inc(){
        this.v1++
        return 5
    }

    incWithPrim(v){
        this.v1 += v
    }

    incWithCon(c){
        this.v1 += c.v1
    }
}

let app = new Application()

class Master extends CAPActor{
    ev
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    sendAndInc(toRef){
        console.log("SENDING")
        toRef.getEv(this.ev)
        this.ev.inc()
    }
}
class Slave extends CAPActor{
    ev
    getEv(anEv){
        console.log("Got EV")
        this.ev = anEv
    }
    test(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(this.ev.v1)
            },2000)
        })
    }
}

let slave = app.spawnActor(Slave)
let master = app.spawnActor(Master)
master.sendAndInc(slave)
