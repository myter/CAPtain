Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
const CAPMirror_1 = require("./CAPMirror");
class CAPActor extends spiders_js_1.Actor {
    constructor() {
        super(new CAPMirror_1.CAPMirror());
        this.GSP = require("./GSP").GSP;
        this.Round = require("./Round").Round;
    }
    init() {
        this.gsp = new this.GSP(this.libs.reflectOnActor().base.thisRef.ownerId, this.Round);
    }
}
exports.CAPActor = CAPActor;
//# sourceMappingURL=CAPActor.js.map