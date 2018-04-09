import {Eventual} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {FarRef, SpiderObject, SpiderObjectMirror} from "spiders.js";
import set = Reflect.set;

class Contained extends Eventual{
    innerVal

    constructor(){
        super()
        this.innerVal = 5
    }

    incMUT(){
        this.innerVal++
    }
}

class Container extends Eventual{
    inners

    constructor(){
        super()
        this.inners = []
    }

    addInnersMUT(inner){
        this.inners.push(inner)
    }
}

class App extends CAPplication{

    cont

    sendEV(toRef : FarRef<Act>){
        this.cont = new Container()
        toRef.getContainer(this.cont)
    }

    print(){
        console.log("Printing state")
        this.cont.inners.forEach((inner : Contained)=>{
            console.log(inner.innerVal)
        })
    }
}

class Act extends CAPActor{
    Contained

    constructor(){
        super()
        this.Contained = Contained
    }


    getContainer(container : Container){
        let inner = new this.Contained()
        container.addInnersMUT(inner)
        inner.incMUT()
        let inner2 = new this.Contained()
        container.addInnersMUT(inner2)
        inner2.incMUT()
    }
}

let app = new App()
let act : FarRef<Act> = app.spawnActor(Act)
app.sendEV(act)
setTimeout(()=>{
    app.print()
},5000)




