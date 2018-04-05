import {CAPActor} from "./CAPActor";
import {FarRef, SpiderActorMirror} from "spiders.js";
import {Eventual} from "./Eventual";

export class CAPMirror extends SpiderActorMirror{
    initialise(stdLib,appActor,parentRef){
        super.initialise(stdLib,appActor,parentRef)
        let behaviour = this.base.behaviourObject
        let gsp       = (behaviour as CAPActor).gsp
        Reflect.ownKeys(behaviour).forEach((key)=>{
            let val = behaviour[key]
            if(val.isEventual == true){
                if(!gsp.knownEventual(val.id)){
                    if(val.committedVals.size == 0){
                        //This is the first invocation on this eventual, populate its committed map
                        val.populateCommitted()
                    }
                    gsp.registerMasterEventual(val)
                    val.setHost(gsp,this.base.thisRef.ownerId,true)
                }
            }
        })
    }
}