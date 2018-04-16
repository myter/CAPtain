import {CAPActor} from "./CAPActor";
import {bundleScope, FarRef, LexScope, SpiderActorMirror, SpiderIsolateMirror} from "spiders.js";
import {Eventual, EventualMirror} from "./Eventual";
import {Consistent} from "./Consistent";
let EV = Eventual
let CO = Consistent
export class CAPMirror extends SpiderActorMirror{
    EV
    CO

    constructor(){
        super()
        this.EV = EV
        this.CO = CO
    }

    simpleBind(fun, ctx){
        var newFun = function(){
            return fun.apply(ctx, arguments);
        }
        newFun.toString = function(){
            return fun.toString();
        };
        (newFun as any).unBind = function(){
            return fun
        }
        return newFun;
    }

    freezeCheck(value : Eventual){
        if(value.isEventual != true){
            throw new Error("Cannot freeze non-eventual value")
        }
        else{
            return this.freeze(value)
        }
    }

    thawCheck(value : Consistent){
        let check = value.isConsistent
        if(check instanceof Promise){
            return check.then((ok)=>{
                if(ok){
                    return this.thaw(value)
                }
                else{
                    throw new Error("Cannot thaw non-consistent value")
                }
            })
        }
        else{
            throw new Error("Cannot thaw non-consistent value")
        }
    }

    freeze(value : Eventual){
        let con                 = new this.CO()
        let [fields,methods]    = value["_GET_FREEZE_DATA_"]
        fields.forEach(([fieldName,fieldvalue])=>{
            con[fieldName] = fieldvalue
        })
        methods.forEach(([methodName,methodString])=>{
            con[methodName] = this.simpleBind(eval("(function " +methodString + ")"),con)
        })
        return con
    }

    thaw(value : Consistent){
        let ev                  = new this.EV()
        if(ev.committedVals.size == 0){
            //This is the first invocation on this eventual, populate its committed map
            ev.populateCommitted()
        }
        let behaviour = this.base.behaviourObject
        let gsp       = (behaviour as CAPActor).gsp
        gsp.registerMasterEventual(ev)
        ev.setHost(gsp,this.base.thisRef.ownerId,true)
        return (value["_GET_THAW_DATA_"] as any).then(([fields,methods])=>{
            fields.forEach(([fieldName,fieldvalue])=>{
                ev[fieldName] = fieldvalue
            })
            methods.forEach(([methodName,methodString])=>{
                ev[methodName] = this.simpleBind(eval("(function " +methodString + ")"),ev)
            })
            return ev
        })
    }

    initialise(stdLib,appActor,parentRef){
        stdLib.freeze = this.freezeCheck.bind(this)
        stdLib.thaw   = this.thawCheck.bind(this)
        super.initialise(stdLib,appActor,parentRef)
        let behaviour = this.base.behaviourObject
        let gsp       = (behaviour as CAPActor).gsp
        Reflect.ownKeys(behaviour).forEach((key)=>{
            let val = behaviour[key]
            if(val){
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
            }
        })
    }
}