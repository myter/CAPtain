import {Eventual, mutating} from "../src/Eventual";
import {CAPActor} from "../src/CAPActor";
import {CAPplication} from "../src/CAPplication";
import {FarRef} from "spiders.js";
import {Consistent} from "../src/Consistent";

class TestEv extends Consistent{
    value
    constructor(){
        super()
        this.value = 5
    }

    @mutating
    inc(){
        this.value +=1
    }
}

class TestActor extends CAPActor{
    getEV(e){
        e.onCommit(()=>{
            console.log("New value in actor: " + e.value)
        })
        e.inc()
    }
}

class App extends CAPplication{
    constructor(){
        super()
        let con = new TestEv()
        let ev = this.libs.thaw(con)
    }
}
new App()


/*let con = new TestCon()
let app = new CAPplication()
app.libs.thaw(con).then((ev)=>{
    ev.incMUT()
    let con2 = app.libs.freeze(ev)
    con2.incMUT()
})*/





