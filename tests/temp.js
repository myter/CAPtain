Object.defineProperty(exports, "__esModule", { value: true });
const CAPplication_1 = require("../src/CAPplication");
const Consistent_1 = require("../src/Consistent");
class TestC extends Consistent_1.Consistent {
    constructor() {
        super();
        this.someArr = [1, 2, 3, 4];
    }
    topMethod() {
        console.log("TOP");
        console.log(this.someArr);
        this.bottomMethod();
        /*this.someArr.forEach((el)=>{
            console.log(el)
        })*/
    }
    bottomMethod() {
        console.log("BOTTOM");
        console.log(this.someArr);
        this.reallyBottomMethod();
    }
    reallyBottomMethod() {
        console.log("REAL BOTTOM");
        console.log(this.someArr);
        this.someArr.forEach((el) => {
            console.log(el);
        });
    }
    test() {
        this.someFunc();
    }
}
let app = new CAPplication_1.CAPplication();
let t = new TestC();
//t.topMethod()
t.someFunc = () => { console.log("OK WORKED"); };
t.test();
//# sourceMappingURL=temp.js.map