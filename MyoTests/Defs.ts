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
}

export class GroceryList extends Eventual{
    listName    : string
    items       : Map<string,number>

    constructor(name : string){
        super()
        this.listName   = name
        this.items      = new Map()
    }

    addGroceryItemMUT(itemName : string){
        this.items.set(itemName,0)
    }

    remGroceryItemMut(itemName : string){
        this.items.delete(itemName)
    }

    incQuantityMUT(itemName : string){
        this.items.set(itemName,this.items.get(itemName)+1)
    }

    decQuantityMUT(itemName : string){
        this.items.set(itemName,this.items.get(itemName)-1)
    }

}