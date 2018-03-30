import {CAPActor} from "./CAPActor";
import {FarRef, SpiderActorMirror} from "spiders.js";
import {Eventual} from "./Eventual";

export class CAPMirror extends SpiderActorMirror{

    private getEventualArgs(args : Array<any>){
        return args.filter((arg,index)=>{
            if(arg){
                //No this isn't some dumb mistake, must ensure that it is true and not a true-like value!
                return arg.isEventual == true
            }
            else{
                return false
            }
        })
    }

    receiveInvocation(sender : FarRef,targetObject : Object,methodName : string,args : Array<any>,performInvocation : () => undefined = () => undefined){
        let eventualArgs = this.getEventualArgs(args)
        let gsp = (this.base.behaviourObject as CAPActor).gsp
        if(eventualArgs.length > 0){
            sender.gsp.then((senderGSPRef)=>{
                eventualArgs.forEach((eventual : Eventual)=>{
                    eventual.setHost(gsp,this.base.thisRef.ownerId,false)
                    gsp.registerHolderEventual(eventual,senderGSPRef)
                })
                super.receiveInvocation(sender,targetObject,methodName,args,performInvocation)
            })
        }
        else{
            super.receiveInvocation(sender,targetObject,methodName,args,performInvocation)
        }
    }

    sendInvocation(target : FarRef,methodName : string,args : Array<any>,contactId = this.base.thisRef.ownerId,contactAddress = null,contactPort = null,mainId = null){
        let eventualArgs    = this.getEventualArgs(args)
        let gsp             = (this.base.behaviourObject as CAPActor).gsp
        eventualArgs.forEach((eventual : Eventual)=>{
            //An eventual is being sent to another actor, without that eventual being already registered
            //In other words, this eventual must have been created newly by the sending actor
            if(!gsp.knownEventual(eventual.id)){
                if(eventual.committedVals.size == 0){
                    //This is the first invocation on this eventual, populate its committed map
                    eventual.populateCommitted()
                }
                gsp.registerMasterEventual(eventual)
                eventual.setHost(gsp,this.base.thisRef.ownerId,true)
            }
        })
        return super.sendInvocation(target,methodName,args,contactId,contactAddress,contactPort,mainId)
    }
}