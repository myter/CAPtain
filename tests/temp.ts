import {Eventual, mutating} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef, SpiderObject, SpiderObjectMirror} from "spiders.js";
import set = Reflect.set;
import {Consistent} from "../src/Consistent";

class Container extends Eventual{
    inners

    constructor(){
        super()
        this.inners = []
    }

    addInnerMUT(newInner  : Contained){
        this.inners.push(newInner)
    }
}

class Contained extends Eventual{
    someVal

    constructor(){
        super()
        this.someVal = 5
    }

    incMUT(){
        this.someVal++
    }
}


class App extends CAPplication{
    ev : Container

    constructor(){
        super()
        this.ev = new Container()
        this.ev.onCommit(()=>{
            console.log("New commit in app")
            this.print()
        })
    }

    sendTo(ref){
        ref.getEV(this.ev)
    }

    print(){
        console.log("In app: ")
        this.ev.inners.forEach((inner : Contained)=>{
            console.log(inner.someVal)
        })
    }

}

class Act extends CAPActor{
    ev : Container
    Contained

    constructor(){
        super()
        this.Contained = Contained
    }

    getEV(ev){
        this.ev = ev
        let c : Contained = new this.Contained()
        this.ev.addInnerMUT(c)
        c.incMUT()
    }

    print(){
        console.log("In act: ")
    }
}
let app = new App()
let a1 : FarRef<Act> = app.spawnActor(Act)
app.sendTo(a1)
setTimeout(()=>{
    console.log("Forcing")
    app.print()
},1500)




