import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {GroceryList, UserLists} from "./Defs";
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

    print(){
        console.log("State on server")
        this.tempList.lists.forEach((list : GroceryList)=>{
            console.log(" - List : " + list.listName)
            list.items.forEach((itemName,itemQuant)=>{
                console.log("     - " + itemQuant + " : " + itemName)
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
        return new Promise((resolve)=>{
            this.psClient.subscribe(new this.libs.PubSubTag("GetListResp")).each((myLists)=>{
                this.myLists = myLists
                myLists.onCommit(this.print.bind(this))
                myLists.onTentative(this.print.bind(this))
                resolve()
            })
            this.psClient.publish("client",new this.libs.PubSubTag("GetListReq"))
        })
    }

    print(){
        console.log("State on client: " + this.name)
        this.myLists.lists.forEach((list : GroceryList)=>{
            console.log(" - List : " + list.listName)
            list.items.forEach((itemName,itemQuant)=>{
                console.log("     - " + itemQuant + " : " + itemName)
            })
        })
    }


    newList(listName){
        let newList = new this.GroceryList(listName)
        this.myLists.newListMUT(newList)
    }

    add(listName,itemName){
        this.myLists.lists.get(listName).addGroceryItemMUT(itemName)
    }

    inc(listName,itemName){
        this.myLists.lists.get(listName).incQuantityMUT(itemName)
    }

}
let ser : FarRef<Server> = app.spawnActor(Server)
let cli : FarRef<Client> = app.spawnActor(Client,["client1"]);
let cli2 : FarRef<Client> = app.spawnActor(Client,["client2"]);
let cli3 : FarRef<Client> = app.spawnActor(Client,["client3"]);
let cli4 : FarRef<Client> = app.spawnActor(Client,["client4"])
cli.login()
cli2.login()
cli3.login()
cli4.login()
setTimeout(()=>{
    cli.newList("test")
    cli.add("test","banana")
    cli.add("test","banana")
    cli.add("test","pear")
    cli.add("test","waffle")
},2000)
var stdin = process.openStdin();

let increments = new Map()

function loop(){
    for(var i = 0;i < 10;i++){
        cli.inc("test","waffle")
    }
    for(var i = 0;i < 10;i++){
        cli4.inc("test","pear")
    }
    for(var i = 0;i < 10;i++){
        cli3.inc("test","banana")
    }
}

function printAll(){
    (ser.print() as any).then(()=>{
        (cli.print() as any).then(()=>{
            (cli2.print() as any).then(()=>{
                (cli3.print() as any).then(()=>{
                    cli4.print()
                })
            })
        })
    })
}
let newA : FarRef<Client>
function logNew(){
    newA  = app.spawnActor(Client,["runtime"])
    newA.login().then(()=>{
        newA.add("test","beer")
        for(var i = 0;i< 10;i++){
            newA.inc("test","waffle")
        }
    })
}

stdin.addListener("data", function(d) {
    eval(d.toString().trim())
});