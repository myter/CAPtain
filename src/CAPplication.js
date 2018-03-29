Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
const GSP_1 = require("./GSP");
const Round_1 = require("./Round");
const CAPMirror_1 = require("./CAPMirror");
class CAPplication extends spiders_js_1.Application {
    constructor(ip = "127.0.0.1", port = 8000) {
        super(new CAPMirror_1.CAPMirror(), ip, port);
        this.gsp = new GSP_1.GSP(this.libs.reflectOnActor().base.thisRef.ownerId, Round_1.Round);
    }
}
exports.CAPplication = CAPplication;
//# sourceMappingURL=CAPplication.js.map