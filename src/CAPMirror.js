Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
class CAPMirror extends spiders_js_1.SpiderActorMirror {
    getEventualArgs(args) {
        return args.filter((arg, index) => {
            if (arg) {
                //No this isn't some dumb mistake, must ensure that it is true and not a true-like value!
                return arg.isEventual == true;
            }
            else {
                return false;
            }
        });
    }
    receiveInvocation(sender, targetObject, methodName, args, performInvocation = () => { return undefined; }, sendReturn = () => { return undefined; }) {
        let eventualArgs = this.getEventualArgs(args);
        let gsp = this.base.behaviourObject.gsp;
        let cont = () => {
            let retVal = performInvocation();
            if (retVal) {
                if (retVal.isEventual) {
                    if (!gsp.knownEventual(retVal.id)) {
                        if (retVal.committedVals.size == 0) {
                            //This is the first invocation on this eventual, populate its committed map
                            retVal.populateCommitted();
                        }
                        gsp.registerMasterEventual(retVal);
                        retVal.setHost(gsp, this.base.thisRef.ownerId, true);
                    }
                    sendReturn(retVal);
                }
                else {
                    sendReturn(retVal);
                }
            }
            else {
                sendReturn(retVal);
            }
        };
        /*if(eventualArgs.length > 0){
            sender.gsp.then((senderGSPRef)=>{
                eventualArgs.forEach((eventual : Eventual)=>{
                    eventual.setHost(gsp,this.base.thisRef.ownerId,false)
                    gsp.registerHolderEventual(eventual,senderGSPRef)
                })
                cont()
            })
        }
        else{
            cont()
        }*/
        cont();
    }
    sendInvocation(target, methodName, args, contactId = this.base.thisRef.ownerId, contactAddress = null, contactPort = null, mainId = null) {
        let eventualArgs = this.getEventualArgs(args);
        let gsp = this.base.behaviourObject.gsp;
        eventualArgs.forEach((eventual) => {
            //An eventual is being sent to another actor, without that eventual being already registered
            //In other words, this eventual must have been created newly by the sending actor
            if (!gsp.knownEventual(eventual.id)) {
                if (eventual.committedVals.size == 0) {
                    //This is the first invocation on this eventual, populate its committed map
                    eventual.populateCommitted();
                }
                gsp.registerMasterEventual(eventual);
                eventual.setHost(gsp, this.base.thisRef.ownerId, true);
            }
        });
        return super.sendInvocation(target, methodName, args, contactId, contactAddress, contactPort, mainId);
    }
}
exports.CAPMirror = CAPMirror;
//# sourceMappingURL=CAPMirror.js.map