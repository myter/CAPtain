import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {GroceryItem, GroceryList, UserLists} from "./Defs";
import {FarRef} from "spiders.js";
import set = Reflect.set;

let app = new CAPplication()
class Server extends CAPActor{
    lists : Map<string,UserLists>
    tempList : UserLists
    UserLists
    dir

    constructor(){
        super()
        this.dir = __dirname
    }

    init(){
        this.lists = new Map()
        this.UserLists = require(this.dir+"/Defs").UserLists
        console.log("Server id: " + this.gsp.thisActorId)
    }

    getLists(userName){
        console.log("Client " + userName + " logged in to server")
        if(this.lists.has(userName)){
            return this.lists.get(userName)
        }
        else{
            let newList = new this.UserLists(userName)
            this.tempList = newList
            this.lists.set(userName,newList)
            return newList
        }
    }

    print(){
        console.log("State on server")
        this.tempList.lists.forEach((list : GroceryList)=>{
            console.log(" - List : " + list.listName)
            list.items.forEach((item : GroceryItem)=>{
                console.log("     - " + item.groceryName + " : " + item.quantity)
            })
        })
    }
}

class Client extends CAPActor{
    name
    server : FarRef<Server>
    myLists : UserLists
    dir
    GroceryList
    GroceryItem

    constructor(userName){
        super()
        this.name = userName
        this.dir  = __dirname
    }

    init(){
        this.GroceryList = require(this.dir+"/Defs").GroceryList
        this.GroceryItem = require(this.dir+"/Defs").GroceryItem
        console.log(this.name +" id :" + this.gsp.thisActorId)
    }

    login(serverRef){
        this.server = serverRef
        return this.server.getLists("client").then((myLists)=>{
            this.myLists = myLists
        })
    }

    print(){
        console.log("State on client: " + this.name)
        this.myLists.lists.forEach((list : GroceryList)=>{
            console.log(" - List : " + list.listName)
            list.items.forEach((item : GroceryItem)=>{
                console.log("     - " + item.groceryName + " : " + item.quantity)
            })
        })
    }


    newList(listName){
        let newList = new this.GroceryList(listName)
        this.myLists.newListMUT(newList)
    }

    add(listName,itemName){
        let item = new this.GroceryItem(itemName,1)
        this.myLists.lists.get(listName).addGroceryItemMUT(item)
    }

    inc(listName,itemName){
        this.myLists.lists.get(listName).items.forEach((item)=>{
            if(item.groceryName == itemName){
                item.incQuantityMUT()
            }
        })
    }

}
let ser : FarRef<Server> = app.spawnActor(Server)
let cli : FarRef<Client> = app.spawnActor(Client,["client1"]);
let cli2 : FarRef<Client> = app.spawnActor(Client,["client2"]);

(cli.login(ser) as any).then(()=>{
    cli.newList("test")
    cli.add("test","banana")
    //cli.inc("test","banana")
    /*cli2.login(ser).then(()=>{
        cli.newList("test")
        cli.add("test","banana")
        cli.inc("test","banana")
    })*/

})
/*setTimeout(()=>{
    cli2.login(ser)
},2000)*/
var stdin = process.openStdin();

function printAll(){
    ser.print().then(()=>{
        cli.print().then(()=>{
            //cli2.print()
        })
    })
}
stdin.addListener("data", function(d) {
    eval(d.toString().trim())
});