import {SpiderIsolate} from "spiders.js";


export class Round extends SpiderIsolate{
    objectId        : string
    masterOwnerId   : string
    roundNumber     : number
    methodName      : string
    args            : Array<any>

    constructor(objectId : string,masterOwnerId : string,roundNumber : number,methodName : string,args : Array<any>){
        super()
        this.objectId       = objectId
        this.masterOwnerId  = masterOwnerId
        this.roundNumber    = roundNumber
        this.methodName     = methodName
        this.args           = args
    }
}