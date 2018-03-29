// Type definitions for spiders.captain
// Definitions by: Florian Myter
import {ActorSTDLib, FarRef} from "spiders.js";

export * from "spiders.js"
export class CAPActor{
    parent  : FarRef
    libs    : ActorSTDLib
}

export class CAPplication{
    libs    : ActorSTDLib
    constructor(address? : string,port? : number)
    spawnActor(actorClass : Function,constructionArgs? : Array<any>,port? : number)
    spawnActorFromFile(path : string,className : string,constructorArgs? : Array<any>,port? : number)
    kill()
}

export type native = string | boolean | number

export class Eventual{}

export class Available{}

export class Consistent{}