// Type definitions for spiders.captain
// Definitions by: Florian Myter
import {ActorSTDLib, FarRef} from "spiders.js";

export * from "spiders.js"
export class CAPActor{
    parent  : FarRef
    libs    : ActorSTDLib
}

export class Eventual{}

export class Available{}

export class Consistent{}