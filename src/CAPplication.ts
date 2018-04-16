import {Application} from "spiders.js";
import {GSP} from "./GSP";
import {Round} from "./Round";
import {CAPMirror} from "./CAPMirror";
import {CAPLib} from "./CAPLib";

export class CAPplication extends Application{
    gsp : GSP
    libs : CAPLib

    constructor(ip : string = "127.0.0.1",port : number = 8000){
        super(new CAPMirror(),ip,port)
        this.gsp = new GSP(this.libs.reflectOnActor().base.thisRef.ownerId,Round)
    }
}