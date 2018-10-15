import {CAPplication} from "../src/CAPplication";
import {Consistent} from "../src/Consistent";

class TestC extends Consistent{
    someArr
    someFunc

    constructor(){
        super()
        this.someArr = [1,2,3,4]
    }

    topMethod(){
        console.log("TOP")
        console.log(this.someArr)
        this.bottomMethod()
        /*this.someArr.forEach((el)=>{
            console.log(el)
        })*/
    }

    bottomMethod(){
        console.log("BOTTOM")
        console.log(this.someArr)
        this.reallyBottomMethod()
    }

    reallyBottomMethod(){
        console.log("REAL BOTTOM")
        console.log(this.someArr)
        this.someArr.forEach((el)=>{
            console.log(el)
        })
    }

    test(){
        this.someFunc()
    }
}

let app = new CAPplication()
let t = new TestC()
//t.topMethod()
t.someFunc = ()=>{console.log("OK WORKED")}
t.test()





