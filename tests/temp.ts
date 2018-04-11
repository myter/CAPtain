import {Eventual, mutating} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef, SpiderObject, SpiderObjectMirror} from "spiders.js";
import set = Reflect.set;
import {Consistent} from "../src/Consistent";

export class TestEV extends Eventual{
    value

    constructor(){
        super()
        this.value = 5
    }

    @mutating
    inc(){
        console.log("Incrementing")
        this.value++
    }
}

class MutAct extends CAPActor{
    AnnotEV
    thisDir
    constructor(){
        super()
        this.AnnotEV = TestEV
    }

    test(){
        let ev = new this.AnnotEV()
        console.log(ev.value)
        return new Promise((resolve)=>{
            ev.onTentative(()=>(
                resolve(ev.value)
            ))
            ev.inc()
            console.log(ev.value)
        })
    }
}
let app = new CAPplication()
let act : FarRef<MutAct> = app.spawnActor(MutAct)
act.test().then((v)=>{
    console.log("Got back: " + v)
})




