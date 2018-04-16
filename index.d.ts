// Type definitions for spiders.captain
// Definitions by: Florian Myter
import {ActorSTDLib, FarRef, PSClient, PSServer, PubSubTag} from "spiders.js";
import {CAPLib} from "./src/CAPLib";

export * from "spiders.js"
export type FarRef<T> = T
export type  PSServer = PSServer
export type  PSClient = PSClient
export type PubSubTag = PubSubTag
export class CAPActor{
    parent  : FarRef<any>
    libs    : CAPLib
}

export class CAPplication{
    libs    : CAPLib
    constructor(address? : string,port? : number)
    spawnActor(actorClass : Function,constructionArgs? : Array<any>,port? : number)
    spawnActorFromFile(path : string,className : string,constructorArgs? : Array<any>,port? : number)
    kill()
}

export type native = string | boolean | number
type callback = (ev : Eventual) => any
export class Eventual{
    onCommit(callback : callback)
    onTentative(callback : callback)
}

export class Available{}

export class Consistent{}

export function mutating(target : any,propertyKey : string,descriptor : PropertyDescriptor)