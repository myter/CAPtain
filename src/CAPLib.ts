import {ActorSTDLib} from "spiders.js";
import {Consistent} from "./Consistent";
import {Eventual} from "./Eventual";

export interface CAPLib extends ActorSTDLib{
    freeze(value : Eventual)
    thaw(value : Consistent)
}