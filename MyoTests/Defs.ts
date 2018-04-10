import {Eventual} from "../src/Eventual";

export class UserLists extends Eventual{
    owner : string
    lists : Map<string,GroceryList>

    constructor(ownerName : string){
        super()
        this.owner = ownerName
        this.lists = new Map()
    }

    newListMUT(list : GroceryList){
        this.lists.set(list.listName,list)
    }

    asString(){
        return "<USER-LISTS> : " + this.owner
    }
}

export class GroceryList extends Eventual{
    listName    : string
    items       : Array<GroceryItem>

    constructor(name : string){
        super()
        this.listName   = name
        this.items      = []
    }

    addGroceryItemMUT(item : GroceryItem){
        this.items.push(item)
    }

    asString(){
        return "<LIST> : "+ this.listName
    }
}

export class GroceryItem extends Eventual{
    groceryName : string
    quantity    : number

    constructor(groceryName : string,quantity : number){
        super()
        this.groceryName    = groceryName
        this.quantity       = quantity
    }

    changeNameMUT(newName : string){
        this.groceryName = newName
    }

    incQuantityMUT(){
        this.quantity++
    }

    decQuantityMUT(){
        this.quantity--
    }

    asString(){
        return "<ITEM> : " + this.groceryName
    }
}