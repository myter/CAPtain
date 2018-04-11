import {Eventual, mutating} from "../src/Eventual";

export class TestEV extends Eventual{
    value

    constructor(){
        super()
        this.value = 5
    }

    @mutating
    inc(){
        console.log("Incrementing")
        this.value++
    }
}