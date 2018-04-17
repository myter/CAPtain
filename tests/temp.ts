import {Eventual} from "../src/Eventual";
import {CAPActor} from "../src/CAPActor";
import {CAPplication} from "../src/CAPplication";
import {FarRef} from "spiders.js";
import {Consistent} from "../src/Consistent";

class TestEV extends Eventual{
    value

    constructor(){
        super()
        this.value = 5
    }

    incMUT(){
        this.value += 1
    }
}

class TestCon extends Consistent{
    value

    constructor(){
        super()
        this.value = 5
    }

    incMUT(){
        this.value += 1
    }
}


let ev = new TestEV()
let app = new CAPplication()
let con = app.libs.freeze(ev)
con.incMUT()
app.libs.thaw(con).then((ev2)=>{
    ev2.incMUT()
})



/*let con = new TestCon()
let app = new CAPplication()
app.libs.thaw(con).then((ev)=>{
    ev.incMUT()
    let con2 = app.libs.freeze(ev)
    con2.incMUT()
})*/





