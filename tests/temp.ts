import {Eventual, mutating} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef, SpiderObject, SpiderObjectMirror} from "spiders.js";
import set = Reflect.set;
import {Consistent} from "../src/Consistent";
class Test extends Eventual{
    value

    constructor(){
        super()
        this.value = 0
    }

    incMUT(){
        this.value++
    }
}


class App extends CAPplication{
    ev

    constructor(){
        super()
        this.ev = new Test()
    }

    sendTo(ref){
        ref.getEV(this.ev)
    }

    mutate(){
        this.ev.incMUT()
    }

    print(){
        console.log("In app: " + this.ev.value)
    }

}

class Act extends CAPActor{
    ev

    getEV(ev){
        this.ev = ev
    }

    print(){
        console.log("In act: " + this.ev.value)
    }
}
let app = new App()
let a1 : FarRef<Act> = app.spawnActor(Act)
app.mutate()
app.mutate()
app.sendTo(a1)
setTimeout(()=>{
    app.print()
    a1.print()
    let a2 : FarRef<Act> = app.spawnActor(Act)
    app.sendTo(a2)
    setTimeout(()=>{
        a2.print()
    },1000)
},1000)




