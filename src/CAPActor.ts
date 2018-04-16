import {GSP} from "./GSP";
import {Actor} from "spiders.js";
import {CAPMirror} from "./CAPMirror";
import {CAPLib} from "./CAPLib";


export class CAPActor extends Actor{
    gsp : GSP
    GSP
    Round
    libs : CAPLib

    constructor(){
        super(new CAPMirror())
        this.GSP    = require("./GSP").GSP
        this.Round  = require("./Round").Round
    }

    init(){
        this.gsp = new this.GSP(this.libs.reflectOnActor().base.thisRef.ownerId,this.Round)
    }
}

