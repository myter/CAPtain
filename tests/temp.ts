import {Eventual} from "../src/Eventual";
import {CAPActor} from "../src/CAPActor";
import {CAPplication} from "../src/CAPplication";
import {FarRef} from "spiders.js";

class TestEv extends Eventual{
    value

    constructor(){
        super()
        this.value = 5
    }

    incMUT(){
        this.value += 1
    }
}


class Act extends CAPActor{
    TestEv
    ev
    c

    constructor(){
        super()
        this.TestEv = TestEv
    }

    getCon(){
        this.ev = new this.TestEv()
        this.c = this.libs.freeze(this.ev)
        return this.c
    }

    test(){
        console.log("EV value: " + this.ev.value)
        this.c.value.then((v)=>{
            console.log("Consistent value: " + v)
        })
    }
}

let app = new CAPplication()
let act : FarRef<Act> = app.spawnActor(Act)
act.getCon().then((c)=>{
    c.incMUT().then(()=>{
        act.test()
    })
})




