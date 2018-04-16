import {bundleScope, LexScope, SpiderObject, SpiderObjectMirror} from "spiders.js";

var _IS_CONSISTENT_KEY_ = "_IS_CONSISTENT_"

export class Consistent extends SpiderObject{
    isConsistent
    constructor(){
        super(new ConsistentMirror())
        this[_IS_CONSISTENT_KEY_]   = true
        this.isConsistent           = true
    }
}

export class ConsistentMirror extends SpiderObjectMirror{
    private checkArg(arg){
        if(arg instanceof Array){
            let wrongArgs = arg.filter((a)=>{
                return this.checkArg(a)
            })
            return wrongArgs.length > 0
        }
        else if(arg instanceof  Map){
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
            if(!arg[_IS_CONSISTENT_KEY_]){
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

    invoke(methodName : string,args : Array<any>){
            let wrongArgs = args.filter(this.checkArg)
            if(wrongArgs.length > 0){
                let message = "Cannot pas non-consistent arguments to consistent method call: " + methodName
                throw new Error(message)
            }
            else{
                return new Promise((resolve)=>{
                    //Pretty ugly, but all methods in mirror object are bound to the mirror
                    //In this case we don't want this.x to return a promise if it's "internal"
                    //Need to get the regular function back and bind it to the unproxied object
                    let f = this.base[methodName].unBind().bind(this.base)
                    resolve(f(...args))
                })
            }
    }

    write(fieldName,value){
        if(this.checkArg(value)){
            throw new Error("Cannot assign non-consistent argument to consistent field")
        }
        else{
            return new Promise((resolve)=>{
                resolve(super.write(fieldName,value))
            })
        }
    }

    access(fieldName : string){
        if(fieldName == "_GET_THAW_DATA_"){
            return new Promise((resolve)=>{
                let fields  = []
                let methods = []
                Reflect.ownKeys(this.base).filter((key)=>{
                    return key != "_IS_CONSISTENT_" && key != "isConsistent" && key != "constructor"
                }).forEach((key)=>{
                    if(typeof this.base[key] == 'function'){
                        let meth = this.base[key].toString()
                        methods.push([key,meth])
                    }
                    else{
                        fields.push([key,this.base[key]])
                    }
                })
                let res = [fields,methods]
                resolve(res)
            })
        }
        else{
            return new Promise((resolve)=>{
                resolve(super.access(fieldName))
            })
        }
    }
}
let consScope       = new LexScope()
consScope.addElement("ConsistentMirror",ConsistentMirror)
consScope.addElement("_IS_CONSISTENT_KEY_",_IS_CONSISTENT_KEY_)
bundleScope(Consistent,consScope)
let conMirrorScope  = new LexScope()
conMirrorScope.addElement("_IS_CONSISTENT_KEY_",_IS_CONSISTENT_KEY_)
bundleScope(ConsistentMirror,conMirrorScope)