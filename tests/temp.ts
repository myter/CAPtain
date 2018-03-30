import {Eventual} from "../src/Eventual";
import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";

class Test extends Eventual{
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
    sendTo(ref){
        let t = new Test()
        t.onCommit((ev : Test)=>{
            console.log("New commit val in app: " + ev.value)
        })
        t.onTentative((ev : Test)=>{
            console.log("New tent val in app: " + ev.value)
        })
        ref.get(t)
        setTimeout(()=>{
            console.log("Incrementing in app")
            t.incM()
        },5000)
    }
}

class TAC extends CAPActor{
    get(rep){
        rep.onCommit((ev : Test)=>{
            console.log("New commit val in act: " + ev.value)
        })
        rep.onTentative((ev : Test)=>{
            console.log("New tent val in act: " + ev.value)
        })
        setTimeout(()=>{
            console.log("Incrementing in act")
            rep.incM()
        },2000)
    }
}

let app = new TA()
let act = app.spawnActor(TAC)
app.sendTo(act)

