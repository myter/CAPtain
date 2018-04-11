function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
const CAPActor_1 = require("./src/CAPActor");
exports.CAPActor = CAPActor_1.CAPActor;
const Eventual_1 = require("./src/Eventual");
exports.Eventual = Eventual_1.Eventual;
const Consistent_1 = require("./src/Consistent");
exports.Consistent = Consistent_1.Consistent;
const Available_1 = require("./src/Available");
exports.Available = Available_1.Available;
const CAPplication_1 = require("./src/CAPplication");
exports.CAPplication = CAPplication_1.CAPplication;
const Eventual_2 = require("./src/Eventual");
exports.mutating = Eventual_2.mutating;
__export(require("spiders.js"));
//# sourceMappingURL=captain.js.map