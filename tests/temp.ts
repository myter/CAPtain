import {Eventual} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef} from "spiders.js";

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
let app = new CAPplication()
class Master extends CAPActor{
    ev
    val
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    send(toRef){
        this.ev.onCommit((ev)=>{
            this.val = ev.v1
        })
        toRef.getEv(this.ev)
    }

    test(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(this.val)
            },2000)
        })
    }

}
class Slave extends CAPActor{
    val

    getEv(anEv){
        anEv.onTentative((ev)=>{
            this.val = ev.v1
        })
        anEv.inc()
    }


}
let slave : FarRef<Slave> = app.spawnActor(Slave)
let master : FarRef<Master> = app.spawnActor(Master)
master.send(slave)
master.test().then((v)=>{
    console.log("Got back : " + v)
})

