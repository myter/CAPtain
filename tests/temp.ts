import {Eventual} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef, SpiderObject, SpiderObjectMirror} from "spiders.js";
import set = Reflect.set;
import {Consistent} from "../src/Consistent";

class Test extends Consistent{
    value

    constructor(){
        super()
        this.value = 5
    }

    inc(){
        return this.value.then((v)=>{
            console.log("Value read = " + v)
            return this.value = v + 5
        })
    }
}

let t = new Test()
t.inc().then(()=>{
    t.value.then((v)=>{
        console.log("Updated: " + v)
    })
})




