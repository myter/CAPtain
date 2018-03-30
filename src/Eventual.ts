import {GSP} from "./GSP";
import {bundleScope,LexScope,SpiderIsolate,SpiderIsolateMirror} from "spiders.js";
import {native} from "../index";

export var _IS_EVENTUAL_KEY_ = "_IS_EVENTUAL_"
var _LOCAL_KEY_ = "_IS_EVENTUAL_"
export class Eventual extends SpiderIsolate{
    hostGsp             : GSP
    hostId              : string
    ownerId             : string
    id                  : string
    committedVals       : Map<string,any>
    tentListeners       : Array<(ev : Eventual)=>any>
    commListeners       : Array<(ev : Eventual)=>any>
    isEventual


    //////////////////////////////////////
    // GSP methods                      //
    //////////////////////////////////////

    //Calling this at construction time is dangerous but ok for now. A problem could arise if an eventual is created and serialised at actor construction-time (some elements in the map might be serialised as far references)
    populateCommitted(){
        Reflect.ownKeys(this).forEach((key)=>{
            if(key != "hostGSP" && key != "hostId" && key != "ownerId" && key != "id" && key != "committedVals" && key != "tentListeners" && key != "commListeners" && key != "isEventual" && key != "_INSTANCEOF_ISOLATE_" && key != '_SPIDER_OBJECT_MIRROR_' && key != '_IS_EVENTUAL_'){
                this.committedVals.set(key.toString(),this[key])
            }
        })
    }

    //Called by host actor when this eventual is first passed to other actor
    setHost(hostGsp : GSP,hostId : string = undefined,isOwner : boolean){
        this.hostGsp    = hostGsp
        this.hostId     = hostId
        if(isOwner){
            this.ownerId = hostId
        }
        this.tentListeners.forEach((callback)=>{
            this.hostGsp.tentativeListeners.push(callback)
        })
        this.commListeners.forEach((callback)=>{
            this.hostGsp.commitListeners.push(callback)
        })
        this.tentListeners = []
        this.commListeners = []
    }

    resetToCommit(){
        this.committedVals.forEach((committedVal,key)=>{
            this[key] = committedVal
        })
    }

    commit(){
        this.committedVals.forEach((_,key)=>{
            this.committedVals.set(key,this[key])
        })
        this.triggerCommit()
    }

    constructor(){
        super(new EventualMirror())
        this[_LOCAL_KEY_] = true
        this.id                 = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        })
        this.isEventual         = true
        this.committedVals      = new Map()
        this.tentListeners      = []
        this.commListeners      = []
    }

    //////////////////////////////////////
    // API                              //
    //////////////////////////////////////

    triggerTentative(){
        if(this.hostGsp){
            this.hostGsp.tentativeListeners.forEach((callback)=>{
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
            this.hostGsp.tentativeListeners.push(callback)
        }
        else{
            this.tentListeners.push(callback)
        }
    }

    onCommit(callback : (ev : Eventual)=>any){
        if(this.hostGsp){
            this.hostGsp.commitListeners.push(callback)
        }
        else{
            this.commListeners.push(callback)
        }
    }

    triggerCommit(){
        if(this.hostGsp){
            this.hostGsp.commitListeners.forEach((callback)=>{
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
        return methodName == "setHost" || methodName == "resetToCommit" || methodName == "commit" || methodName == "populateCommitted" || methodName == "onCommit" || methodName == "onTentative" || methodName == "triggerCommit" || methodName == "triggerTentative"
    }

    private checkArg(arg){
        if(arg instanceof Array){
            let wrongArgs = arg.filter(this.checkArg)
            return wrongArgs.length > 0
        }
        else if(typeof arg == 'object'){
            //Does this look like I'm stupid ? Yes ! However undefined is not seen as a falsy value for filter while it is in the condition of an if ... go figure
            if(!arg[_LOCAL_KEY_]){
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
                if(this.canInvoke(methodName,args)){
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
                if(this.canInvoke(methodName,args)){
                    baseEV.hostGsp.createRound(baseEV.id,baseEV.ownerId,methodName,args)
                    let ret = super.invoke(methodName,args)
                    baseEV.hostGsp.yield(baseEV.id,baseEV.ownerId)
                    baseEV.triggerTentative()
                    return ret
                }
            }
        }
        else{
            //No need to check method call constraints, it's a system call
            return super.invoke(methodName,args)
        }
    }

    write(fieldName,value){
        if(this.checkArg(value) && fieldName != "hostGsp" && fieldName != "committedVals"){
            throw new Error("Cannot assign non-eventual argument to eventual field: " + fieldName)
        }
        else{
            return super.write(fieldName,value)
        }
    }
}

let evScope         = new LexScope()
evScope.addElement("_LOCAL_KEY_",_LOCAL_KEY_)
evScope.addElement("EventualMirror",EventualMirror)
bundleScope(Eventual,evScope)
let evMirrorScope   = new LexScope()
evMirrorScope.addElement("_LOCAL_KEY_",_LOCAL_KEY_)
bundleScope(EventualMirror,evMirrorScope)