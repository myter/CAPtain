import {GSP} from "./GSP";
import {bundleScope, LexScope, SpiderActorMirror, SpiderIsolate, SpiderIsolateMirror} from "spiders.js";
import {native} from "../index";
import {CAPMirror} from "./CAPMirror";
import {CAPActor} from "./CAPActor";

export var _IS_EVENTUAL_KEY_ = "_IS_EVENTUAL_"

export function mutating(target : any,propertyKey : string,descriptor : PropertyDescriptor){
    let originalMethod = descriptor.value
    originalMethod["_IS_MUTATING_"] = true
    return {
        value : originalMethod
    }
}
export class Eventual extends SpiderIsolate{
    hostGsp             : GSP
    hostId              : string
    ownerId             : string
    id                  : string
    committedVals       : Map<string,any>
    tentativeVals       : Map<string,any>
    tentListeners       : Array<(ev : Eventual)=>any>
    commListeners       : Array<(ev : Eventual)=>any>
    populated           : boolean = false
    lastCommit          : number
    isEventual

    clone(value){
        if(typeof value != 'object'){
            return value
        }
        else if(value instanceof Array){
            let res = []
            value.forEach((val)=>{
                res.push(this.clone(val))
            })
            return res
        }
        else if(value instanceof Map){
            let res = new Map()
            value.forEach((val,key)=>{
                res.set(key,this.clone(val))
            })
            return res
        }
        else if(value.isEventual){
            /*console.log("Cloning inner eventual")
            let c = new (this.constructor as any)()
            Reflect.ownKeys(value).forEach((key)=>{
                //console.log("Deep cloning: " + key.toString())
                //console.log("Is eventual? " + value[key].isEventual)
                c[key] = this.clone(value[key])
            })
            return c*/
            /*Reflect.ownKeys(value).forEach((key)=>{
                value[key] = this.clone(value[key])
            })*/
            return value
        }
        else{
            return value
        }
    }


    //////////////////////////////////////
    // GSP methods                      //
    //////////////////////////////////////

    populateCommitted(){
        /*Reflect.ownKeys(this).forEach((key)=>{
            if(typeof this[key] != 'function' && key != "hostGsp" && key != "hostId" && key != "ownerId" && key != "id" && key != "committedVals" && key != "tentativeVals" && key != "tentListeners" && key != "commListeners" && key != "populated" && key != "isEventual" && key != "_INSTANCEOF_ISOLATE_" && key != '_SPIDER_OBJECT_MIRROR_' && key != '_IS_EVENTUAL_'){
                this.committedVals.set(key.toString(),this.clone(this[key]))
                this.tentativeVals.set(key.toString(),this.clone(this[key]))
            }
        })*/
        this.populated = true
    }

    //Called by host actor when this eventual is first passed to other actor
    setHost(hostGsp : GSP,hostId : string = undefined,isOwner : boolean){
        this.hostGsp    = hostGsp
        this.hostId     = hostId
        if(isOwner){
            this.ownerId = hostId
        }
        if(!this.hostGsp.tentativeListeners.has(this.id)){
            this.hostGsp.tentativeListeners.set(this.id,[])
        }
        if(!this.hostGsp.commitListeners.has(this.id)){
            this.hostGsp.commitListeners.set(this.id,[])
        }
        this.tentListeners.forEach((callback)=>{
            this.hostGsp.tentativeListeners.get(this.id).push(callback)
        })
        this.commListeners.forEach((callback)=>{
            this.hostGsp.commitListeners.get(this.id).push(callback)
        })
        this.tentListeners = []
        this.commListeners = []
    }

    resetToCommit(){
        this.committedVals.forEach((committedVal,key)=>{
            this.tentativeVals.set(key,committedVal)
        })
    }

    commit(roundNumber){
        this.tentativeVals.forEach((tentativeVal,key)=>{
            this.committedVals.set(key,this.clone(tentativeVal))
        })
        this.lastCommit = roundNumber
        this.triggerCommit()
    }

    constructor(){
        super(new EventualMirror())
        this["_IS_EVENTUAL_"]       = true
        this.id                 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        })
        this.isEventual         = true
        this.committedVals      = new Map()
        this.tentativeVals      = new Map()
        this.tentListeners      = []
        this.commListeners      = []
        this.lastCommit         = 0
    }

    //////////////////////////////////////
    // API                              //
    //////////////////////////////////////

    triggerTentative(){
        if(this.hostGsp){
            this.hostGsp.tentativeListeners.get(this.id).forEach((callback)=>{
                callback(this)
            })
        }
        else{
            this.tentListeners.forEach((callback)=>{
                callback(this)
            })
        }
    }

    onTentative(callback : (ev : Eventual)=>any){
        if(this.hostGsp){
            if(!this.hostGsp.tentativeListeners.has(this.id)){
                this.hostGsp.tentativeListeners.set(this.id,[])
            }
            this.hostGsp.tentativeListeners.get(this.id).push(callback)
        }
        else{
            this.tentListeners.push(callback)
        }
    }

    onCommit(callback : (ev : Eventual)=>any){
        if(this.hostGsp){
            if(!this.hostGsp.commitListeners.has(this.id)){
                this.hostGsp.commitListeners.set(this.id,[])
            }
            this.hostGsp.commitListeners.get(this.id).push(callback)
        }
        else{
            this.commListeners.push(callback)
        }
    }

    triggerCommit(){
        if(this.hostGsp){
            this.hostGsp.commitListeners.get(this.id).forEach((callback)=>{
                callback(this)
            })
        }
        else{
            this.commListeners.forEach((callback)=>{
                callback(this)
            })
        }
    }
}
export class EventualMirror extends SpiderIsolateMirror{
    private ignoreInvoc(methodName){
        return methodName == "setHost" || methodName == "resetToCommit" || methodName == "commit" || methodName == "populateCommitted" || methodName == "onCommit" || methodName == "onTentative" || methodName == "triggerCommit" || methodName == "triggerTentative" || methodName == "clone"
    }

    private checkArg(arg){
        if(arg instanceof Array){
            let wrongArgs = arg.filter(this.checkArg)
            return wrongArgs.length > 0
        }
        if(arg instanceof  Map){
            let foundWrongArg = false
            arg.forEach((val)=>{
                if(this.checkArg(val)){
                    foundWrongArg = true
                }
            })
            return foundWrongArg
        }
        else if(typeof arg == 'object'){
            //Does this look like I'm stupid ? Yes ! However undefined is not seen as a falsy value for filter while it is in the condition of an if ... go figure
            if(!arg["_IS_EVENTUAL_"]){
                return true
            }
            else{
                return false
            }
        }
        else{
            return false
        }
    }

    private canInvoke(methodName,args){
        let wrongArgs = args.filter((arg)=>{
            return this.checkArg(arg)
        })
        if(wrongArgs.length > 0){
            let message = "Cannot pas non-eventual arguments to eventual method call: " + methodName
            throw new Error(message)
        }
        else{
            return true
        }
    }

    invoke(methodName,args){
        let baseEV = this.base as Eventual
        if(!baseEV.hostGsp){
            if(this.ignoreInvoc(methodName)){
                return super.invoke(methodName,args)
            }
            else{
                if(this.canInvoke(methodName,args) && (methodName.includes("MUT") || baseEV[methodName]["_IS_MUTATING_"])){
                    //No host GSP yet for this eventual, which means that it hasn't been serialised yet but created by hosting actor
                    //Safe to trigger both tentative and commit handlers
                    let ret = super.invoke(methodName,args)
                    baseEV.triggerTentative()
                    baseEV.triggerCommit()
                    return ret
                }
                else{
                    return super.invoke(methodName,args)
                }
            }
        }
        else if(!this.ignoreInvoc(methodName)){
            if((baseEV.hostGsp.replay as any).includes(baseEV.id)){
                if(this.canInvoke(methodName,args)){
                    return super.invoke(methodName,args)
                }
            }
            else{
                if(this.canInvoke(methodName,args) && (methodName.includes("MUT") || baseEV[methodName]["_IS_MUTATING_"])){
                    baseEV.hostGsp.createRound(baseEV.id,baseEV.ownerId,methodName,args)
                    let ret = super.invoke(methodName,args)
                    baseEV.hostGsp.yield(baseEV.id,baseEV.ownerId)
                    baseEV.triggerTentative()
                    return ret
                }
                else{
                    return super.invoke(methodName,args)
                }
            }
        }
        else{
            //No need to check method call constraints, it's a system call
            return super.invoke(methodName,args)
        }
    }

    write(fieldName,value){
        if(this.checkArg(value) && fieldName != "hostGsp" && fieldName != "committedVals" && fieldName != "tentativeVals" && fieldName != "_SPIDER_OBJECT_MIRROR_"){
            throw new Error("Cannot assign non-eventual argument to eventual field: " + fieldName)
        }
        else if(fieldName == "hostGsp" || fieldName == "hostId" || fieldName == "ownerId" || fieldName == "id" || fieldName == "committedVals" || fieldName == "tentativeVals" || fieldName == "tentListeners" || fieldName == "commListeners" || fieldName == "populated" || fieldName == "isEventual" || fieldName == "_INSTANCEOF_ISOLATE_" || fieldName == '_SPIDER_OBJECT_MIRROR_' || fieldName == '_IS_EVENTUAL_'){
            return super.write(fieldName,value)
        }
        else{
            let base : Eventual = this.base as Eventual
            if(base.tentativeVals){
                if(base.tentativeVals.has(fieldName)){
                    base.tentativeVals.set(fieldName,value)
                }
                else{
                    base.tentativeVals.set(fieldName,base.clone(value))
                    base.committedVals.set(fieldName,base.clone(value))
                }
            }
            return super.write(fieldName,value)
        }
    }

    access(fieldName){
        let base : Eventual = this.base as Eventual
        if(base.tentativeVals.has(fieldName)){
            return base.tentativeVals.get(fieldName)
        }
        else{
            return super.access(fieldName)
        }
    }

    resolve(hostActorMirror : CAPMirror){
        //Dirty trick, but it could be that this eventual is resolved to an actor which hasn't been initialised (i.e. as part of a scope serialisation)
        if(hostActorMirror.base.behaviourObject){
            let newGsp : GSP = (hostActorMirror.base.behaviourObject as CAPActor).gsp
            let oldGSP = (this.base as Eventual).hostGsp;
            (this.base as Eventual).setHost(newGsp,hostActorMirror.base.thisRef.ownerId,false)
            if(!newGsp.knownEventual((this.base as Eventual).id)){
                newGsp.registerHolderEventual(this.proxyBase as Eventual,oldGSP)
            }
        }
    }

    pass(hostActorMirror : CAPMirror){
        //Same "hack" as for resolve
        if(hostActorMirror.base.behaviourObject){
            let gsp         = (hostActorMirror.base.behaviourObject as CAPActor).gsp
            let eventual    = this.base as Eventual;
            if(!gsp.knownEventual(eventual.id)){
                if(eventual.committedVals.size == 0){
                    //This is the first invocation on this eventual, populate its committed map
                    eventual.populateCommitted()
                }
                gsp.registerMasterEventual(this.proxyBase as Eventual)
                eventual.setHost(gsp,hostActorMirror.base.thisRef.ownerId,true)
            }
            return super.pass(hostActorMirror)
        }
    }
}

let evScope         = new LexScope()
evScope.addElement("EventualMirror",EventualMirror)
bundleScope(Eventual,evScope)