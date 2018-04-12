import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {GroceryItem, GroceryList, UserLists} from "./Defs";
import {FarRef, PSClient} from "spiders.js";
class App extends CAPplication{
    constructor(){
        super()
        this.libs.setupPSServer()
    }
}
let app = new App()
class Server extends CAPActor{
    lists : Map<string,UserLists>
    tempList : UserLists
    psClient : PSClient
    UserLists
    dir

    constructor(){
        super()
        this.dir = __dirname
    }

    init(){
        this.psClient = this.libs.setupPSClient()
        this.lists = new Map()
        this.UserLists = require(this.dir+"/Defs").UserLists
        console.log("Server id: " + this.gsp.thisActorId)
        this.psClient.subscribe(new this.libs.PubSubTag("GetListReq")).each((userName)=>{
            console.log("Client " + userName + " logged in to server")
            if(this.lists.has(userName)){
                this.psClient.publish(this.lists.get(userName),new this.libs.PubSubTag("GetListResp"))
            }
            else{
                let newList = new this.UserLists(userName)
                this.tempList = newList
                this.lists.set(userName,newList)
                this.psClient.publish(newList,new this.libs.PubSubTag("GetListResp"))
            }
        })
    }

    /*getLists(userName){
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
    }*/

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
    psClient : PSClient
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
        this.psClient   = this.libs.setupPSClient()
        console.log(this.name +" id :" + this.gsp.thisActorId)
    }

    login(){
        this.psClient.subscribe(new this.libs.PubSubTag("GetListResp")).each((myLists)=>{
            this.myLists = myLists
        })
        this.psClient.publish("client",new this.libs.PubSubTag("GetListReq"))
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
cli.login();
cli2.login();
var stdin = process.openStdin();

function printAll(){
    (ser.print() as any).then(()=>{
        (cli.print() as any).then(()=>{
            cli2.print()
        })
    })
}
stdin.addListener("data", function(d) {
    eval(d.toString().trim())
});