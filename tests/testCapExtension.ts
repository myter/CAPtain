import {CAPActor} from "../src/CAPActor";
import {Available} from "../src/Available";
import {Eventual} from "../src/Eventual";
import {Consistent} from "../src/Consistent";
import { Actor, FarRef} from "spiders.js"
import {CAPplication} from "../src/CAPplication";

var scheduled           = []
function log(testName,result,expected){
    var ul = document.getElementById("resultList");
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(testName + ". Expected: " + expected + " . Result : " + result));
    li.setAttribute("id", "element4"); // added line
    if(result == expected){
        li.style.color = "Green";

    }
    else{
        li.style.color = "Red";
    }
    ul.appendChild(li);
}
var app                 = new CAPplication()
class TestAvailable extends Available{
    value
    constructor(){
        super()
        this.value = 5
    }

    incWithPrim(num){
        this.value += num
    }

    incWithCon(con){
        this.value += con.value
    }
}
class TestEventual extends Eventual{
    v1

    constructor(){
        super()
        this.v1 = 5
    }

    inc(){
        this.v1++
    }

    incWithPrim(v){
        this.v1 += v
    }

    incWithCon(c){
        this.v1 += c.v1
    }
}
class TestConsistent extends Consistent{
    value
    constructor(){
        super()
        this.value = 5
    }

    incWithPrim(num){
        this.value += num
    }

    incWithCon(con){
        con.value.then((v)=>{
            this.value += v
        })
    }
}


class AvailableContentSerActor extends CAPActor{
    c
    constructor(){
        super()
        this.c = new TestAvailable()
    }

    test(){
        return this.c.value
    }
}
let AvailableContentSer = ()=> {
    return (app.spawnActor(AvailableContentSerActor) as FarRef<any>).test().then((v)=>{
        log("Available Content Serialisation",v,5)
    })
}
scheduled.push(AvailableContentSer)

class AvailableClassSerActor extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }
    test(){
        let c = new this.TestConsistent()
        return c.value
    }
}
let AvailableClassSer = () => {
    return (app.spawnActor(AvailableClassSerActor) as FarRef<any>).test().then((v)=>{
        log("Available Class Serialisation",v,5)
    })
}
scheduled.push(AvailableClassSer)

class AvailableNOKAssignmentAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c   = new this.TestConsistent()
        c.value = {x:5}
        return c.value
    }
}
let AvailableNOKAssignment = () => {
    return (app.spawnActor(AvailableNOKAssignmentAct) as any).test().catch(()=>{
        log("Available NOK Assignment","N.A.","N.A.")
    })
}
scheduled.push(AvailableNOKAssignment)

class AvailableNOKConstraintAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c   = new this.TestConsistent()
        c.incWithCon({value:5})
    }
}
let AvailableNOKConstraint = () => {
    return (app.spawnActor(AvailableNOKConstraintAct) as any).test().catch(()=>{
        log("Available NOK Constraint","N.A.","N.A.")
    })
}
scheduled.push(AvailableNOKConstraint)

class TestEventualAvailableAssignment extends Eventual{
    value
    constructor(){
        super()
        this.value  = 5
    }
}
class AvailableAssignmentEventualAct extends CAPActor{
    TestConsistent
    TestEventual
    constructor(){
        super()
        this.TestConsistent = TestAvailable
        this.TestEventual   = TestEventualAvailableAssignment
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestEventual()
        c.value = cc
        return c.value
    }
}
let AvailableAssignmentEventual = ()=>{
    return (app.spawnActor(AvailableAssignmentEventualAct) as any).test().then((v)=>{
        log("Available Assignment (Eventual)",v.value,5)
    })
}
scheduled.push(AvailableAssignmentEventual)

class AvailableAssignmentAvailableAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        c.value = cc
        return c.value
    }
}
let AvailableAssignmentAvailable = () => {
    return (app.spawnActor(AvailableAssignmentAvailableAct) as any).test().then((v)=>{
        log("Available Assignment (Available)",v.value,5)
    })
}
scheduled.push(AvailableAssignmentAvailable)

class AvailableAssignmentPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c = new this.TestConsistent()
        c.value = 6
        return c.value
    }
}
let AvailableAssignmentPrimitive = () => {
    return (app.spawnActor(AvailableAssignmentPrimitiveAct) as any).test().then((v)=>{
        log("Available Assignment (Primitive)",v,6)
    })
}
scheduled.push(AvailableAssignmentPrimitive)

class TestEventualAvailableConstraint extends Eventual{
    value
    constructor(){
        super()
        this.value  = 5
    }
}
class AvailableConstraintEventualAct extends CAPActor{
    TestConsistent
    TestEventual
    constructor(){
        super()
        this.TestConsistent = TestAvailable
        this.TestEventual   = TestEventualAvailableConstraint
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestEventual()
        c.incWithCon(cc)
        return c.value
    }
}
let AvailableConstraintEventual = ()=>{
    return (app.spawnActor(AvailableConstraintEventualAct) as any).test().then((v)=>{
        log("Available Constraint (Eventual)",v,10)
    })
}
scheduled.push(AvailableConstraintEventual)

class AvailableConstraintAvailableAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        c.incWithCon(cc)
        return c.value
    }
}
let AvailableConstraintAvailable = ()=>{
    return (app.spawnActor(AvailableConstraintAvailableAct) as any).test().then((v)=>{
        log("Available Constraint (Available)",v,10)
    })
}
scheduled.push(AvailableConstraintAvailable)

class AvailableConstraintPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestAvailable
    }

    test(){
        let c = new this.TestConsistent()
        c.incWithPrim(5)
        return c.value
    }
}
let AvailableConstraintPrimitive = ()=>{
    return (app.spawnActor(AvailableConstraintPrimitiveAct) as any).test().then((v)=>{
        log("Available Constraint (Primitive)",v,10)
    })
}
scheduled.push(AvailableConstraintPrimitive)

class MasterSlaveChangeAct extends CAPActor{
    ev
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    send(toRef){
        toRef.getEv(this.ev)
    }

    test(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(this.ev.v1)
            },2000)
        })
    }
}
class SlaveSlaveChangeAct extends CAPActor{
    getEv(anEv){
        anEv.inc()

    }
}
let EventualReplicationSlaveChange = ()=>{
    let slave : FarRef<SlaveSlaveChangeAct> = app.spawnActor(SlaveSlaveChangeAct)
    let master : FarRef<MasterSlaveChangeAct> = app.spawnActor(MasterSlaveChangeAct)
    master.send(slave)
    return master.test().then((v)=>{
        log("Eventual Simple Replication, Slave Change",v,6)
    })
}
scheduled.push(EventualReplicationSlaveChange)

class MasterMasterChange extends CAPActor{
    ev
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    sendAndInc(toRef){
        toRef.getEv(this.ev)
        this.ev.inc()
    }
}
class SlaveMasterChange extends CAPActor{
    ev
    getEv(anEv){
        this.ev = anEv
    }
    test(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(this.ev.v1)
            },2000)
        })
    }
}
let EventualReplicationMasterchange = () =>{
    let slave : FarRef<SlaveMasterChange> = app.spawnActor(SlaveMasterChange)
    let master : FarRef<MasterMasterChange> = app.spawnActor(MasterMasterChange)
    master.sendAndInc(slave)
    return slave.test().then((v)=>{
        log("Eventual Simple Replication, Master Change",v,6)
    })
}
scheduled.push(EventualReplicationMasterchange)

class EventualContentSerialisationAct extends Actor{
    ev
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    test(){
        return this.ev.v1
    }
}
let EventualContentSerialisation = ()=>{
    return (app.spawnActor(EventualContentSerialisationAct) as any).test().then((v)=>{
        log("Eventual Content Serialisation",v,5)
    })
}
scheduled.push(EventualContentSerialisation)

class EventualClassSerialisationAct extends Actor{
    TestEventual
    constructor(){
        super()
        this.TestEventual = TestEventual
    }
    test(){
        let ev = new this.TestEventual()
        return ev.v1
    }
}
let EventualClassSerialisation = ()=>{
    return (app.spawnActor(EventualClassSerialisationAct) as any).test().then((v)=>{
        log("Eventual Class Serialisation",v,5)
    })
}
scheduled.push(EventualClassSerialisation)

class EventualNOKAssignmentAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c   = new this.TestConsistent()
        c.v1 = {x:5}
        return c.value
    }
}
let EventualNOKAssignment = () =>{
    return (app.spawnActor(EventualNOKAssignmentAct) as any).test().catch(()=>{
        log("Eventual NOK Assignment","N.A.","N.A.")
    })
}
scheduled.push(EventualNOKAssignment)

class EventualNOKConstraintAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c   = new this.TestConsistent()
        c.incWithCon({value:5})
        return c.value
    }
}
let EventualNOKConstraint = ()=>{
    return (app.spawnActor(EventualNOKConstraintAct) as any).test().catch(()=>{
        log("Eventual NOK Constraint","N.A.","N.A.")
    })

}
scheduled.push(EventualNOKConstraint)

class EventualAssignmentEventualAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        c.v1 = cc
        return c.v1
    }
}
let EventualAssignmentEventual = ()=>{
    return (app.spawnActor(EventualAssignmentEventualAct) as any).test().then((v)=>{
        log("Eventual Assignment (Eventual)",v.v1,5)
    })
}
scheduled.push(EventualAssignmentEventual)

class EventualAssignmentPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c = new this.TestConsistent()
        c.v1 = 6
        return c.v1
    }
}
let EventualAssignmentPrimitive = ()=>{
    return (app.spawnActor(EventualAssignmentPrimitiveAct) as any).test().then((v)=>{
        log("Eventual Assignment (Primitive)",v,6)
    })
}
scheduled.push(EventualAssignmentPrimitive)

class EventualConstraintEventualAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        c.incWithCon(cc)
        return c.v1
    }
}
let EventualConstraintEventual = ()=>{
    return (app.spawnActor(EventualConstraintEventualAct) as any).test().then((v)=>{
        log("Eventual Constraint (Eventual)",v,10)
    })
}
scheduled.push(EventualConstraintEventual)

class EventualConstraintPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestEventual
    }

    test(){
        let c = new this.TestConsistent()
        c.incWithPrim(5)
        return c.v1
    }
}
let EventualConstraintPrimitive = ()=>{
    return (app.spawnActor(EventualConstraintPrimitiveAct) as any).test().then((v)=>{
        log("Eventual Constraint (Primitive)",v,10)
    })
}
scheduled.push(EventualConstraintPrimitive)

class EventualTentativeMaster extends CAPActor{
    ev
    constructor(){
        super()
        this.ev = new TestEventual()
    }

    send(toRef){
        toRef.getEv(this.ev)
    }

}
class EventualTentativeSlave extends CAPActor{
    val

    getEv(anEv){
        anEv.onTentative((ev)=>{
            this.val = ev.v1
        })
        anEv.inc()
    }

    test(){
        return new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(this.val)
            },2000)
        })
    }
}
let EventualTentative = ()=>{
    let slave : FarRef<EventualTentativeSlave> = app.spawnActor(EventualTentativeSlave)
    let master : FarRef<EventualTentativeMaster> = app.spawnActor(EventualTentativeMaster)
    master.send(slave)
    return slave.test().then((v)=>{
        log("Eventual Tentative Listener",v,6)
    })
}
scheduled.push(EventualTentative)

class EventualCommitMaster extends CAPActor{
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
class EventualCommitSlave extends CAPActor{
    val

    getEv(anEv){
        anEv.onTentative((ev)=>{
            this.val = ev.v1
        })
        anEv.inc()
    }


}
let EventualCommit = () =>{
    let slave : FarRef<EventualCommitSlave> = app.spawnActor(EventualCommitSlave)
    let master : FarRef<EventualCommitMaster> = app.spawnActor(EventualCommitMaster)
    master.send(slave)
    return master.test().then((v)=>{
        log("Eventual Commit Listener",v,6)
    })
}
scheduled.push(EventualCommit)

class ConsistentContentSerialisationAct extends CAPActor{
    c
    constructor(){
        super()
        this.c = new TestConsistent()
    }

    test(){
        return this.c.value
    }
}
let ConsistentContentSerialisation = ()=>{
    return (app.spawnActor(ConsistentContentSerialisationAct) as any).test().then((v)=>{
        log("Consistent Content Serialisation",v,5)
    })
}
scheduled.push(ConsistentContentSerialisation)

class ConsistentClassSerialisationAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }
    test(){
        let c = new this.TestConsistent()
        return c.value
    }
}
let ConsistentClassSerialisation = ()=>{
    return (app.spawnActor(ConsistentClassSerialisationAct) as any).test().then((v)=>{
        log("Consistent Class Serialisation",v,5)
    })
}
scheduled.push(ConsistentClassSerialisation)

class ConsistentNOKAssignmentAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c   = new this.TestConsistent()
        c.value = {x:5}
        return c.value
    }
}
let ConsistentNOKAssignment = ()=>{
    return (app.spawnActor(ConsistentNOKAssignmentAct) as any).test().catch(()=>{
        log("Consistent NOK Assignment","N.A.","N.A.")
    })
}
scheduled.push(ConsistentNOKAssignment)

class ConsistentNOKConstraintAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c   = new this.TestConsistent()
        c.incWithCon({value:5})
        return c.value
    }
}
let ConsistentNOKConstraint = ()=>{
    return (app.spawnActor(ConsistentNOKConstraintAct) as any).test().catch(()=>{
        log("Consistent NOK Constraint","N.A.","N.A.")
    })
}
scheduled.push(ConsistentNOKConstraint)

class ConsistentAssignmentConsistentAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        c.value = cc
        return c.value
    }
}
let ConsistentAssignmentConsistent = ()=>{
    return (app.spawnActor(ConsistentAssignmentConsistentAct) as any).test().then((v)=>{
        return v.value.then((vv)=>{
            log("Consistent Assignment (Consistent)",vv,5)
        })
    })
}
scheduled.push(ConsistentAssignmentConsistent)

class ConsistentAssignmentPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c = new this.TestConsistent()
        c.value = 6
        return c.value
    }
}
let ConsistentAssignmentPrimitive = ()=>{
    return (app.spawnActor(ConsistentAssignmentPrimitiveAct) as any).test().then((v)=>{
        log("Consistent Assignment (Primitive)",v,6)
    })
}
scheduled.push(ConsistentAssignmentPrimitive)

class ConsistentConstraintConsistentAct extends CAPActor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c   = new this.TestConsistent()
        let cc  = new this.TestConsistent()
        return c.incWithCon(cc).then(()=>{
            return c.value
        })
    }
}
let ConsistentConstraintConsistent = ()=>{
    return (app.spawnActor(ConsistentConstraintConsistentAct) as any).test().then((v)=>{
        log("Consistent Constraint (Consistent)",v,10)
    })
}
scheduled.push(ConsistentConstraintConsistent)

class ConsistentConstraintPrimitiveAct extends Actor{
    TestConsistent
    constructor(){
        super()
        this.TestConsistent = TestConsistent
    }

    test(){
        let c = new this.TestConsistent()
        c.incWithPrim(5)
        return c.value
    }
}
let ConsistentConstraintPrimitive = ()=>{
    return (app.spawnActor(ConsistentConstraintPrimitiveAct) as any).test().then((v)=>{
        log("Consistent Constraint (Primitive)",v,10)
    })
}
scheduled.push(ConsistentConstraintPrimitive)


function performAll(nextTest){
    nextTest().then(() => {
        if(scheduled.length > 0) {
            performAll(scheduled.pop())
        }
    })
}
performAll(scheduled.pop())