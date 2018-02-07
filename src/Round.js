Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
class Round extends spiders_js_1.SpiderIsolate {
    constructor(objectId, masterOwnerId, roundNumber, methodName, args) {
        super();
        this.objectId = objectId;
        this.masterOwnerId = masterOwnerId;
        this.roundNumber = roundNumber;
        this.methodName = methodName;
        this.args = args;
    }
}
exports.Round = Round;
//# sourceMappingURL=Round.js.map