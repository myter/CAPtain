import {CAPplication} from "../src/CAPplication";
import {CAPActor} from "../src/CAPActor";
import {GroceryItem, GroceryList, UserLists} from "./Defs";
import {FarRef} from "spiders.js";

let app = new CAPplication()
class Server extends CAPActor{
    lists : Map<string,UserLists>
    tempList
    UserLists
    dir

    constructor(){
        super()
        this.dir = __dirname
    }

    init(){
        this.lists = new Map()
        this.UserLists = require(this.dir+"/Defs").UserLists
    }

    getLists(userName){
        console.log("Client " + userName + " logged in to server")
        if(this.lists.has(userName)){
            return this.lists.get(userName)
        }
        else{
            let newList = new this.UserLists(userName)
            newList.onCommit((lists : UserLists)=>{
                console.log("Lists on server: ")
                lists.lists.forEach((lst : GroceryList)=>{
                    console.log(lst.listName)
                })
                /*this.printLists(lists)
                lists.lists.forEach((lst)=>{
                    console.log(lst.items.length)
                })
                lists.lists.forEach((lst : GroceryList)=>{
                    lst.onCommit((l : GroceryList)=>{
                        this.printList(l)
                        l.items.forEach((item : GroceryItem)=>{
                            this.printItem(item)
                        })
                    })
                })*/

            })
            this.tempList = newList
            return newList
        }
    }

    prefix = "[SERVER] "

    printLists(lists : UserLists){
        console.log(this.prefix + "State of all lists")
        lists.lists.forEach((list : GroceryList)=>{
            this.printList(list)
        })
        console.log(this.prefix + "[END]")
    }

    printList(list : GroceryList){
        console.log(this.prefix + "State of : " + list.listName)
        list.items.forEach((item : GroceryItem)=>{
            this.printItem(item)
        })
        console.log(this.prefix + "[END]")
    }

    printItem(item : GroceryItem){
        console.log(this.prefix + "State of : " + item.groceryName)
        console.log("       -" + item.groceryName + " : " + item.quantity)
        console.log(this.prefix + "[END]")
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
    }

    login(serverRef){
        this.server = serverRef
        return this.server.getLists(this.name).then((myLists)=>{
            this.myLists = myLists
            this.myLists.onCommit((lists : UserLists)=>{
                this.printLists(lists)
            })
        })
    }

    prefix = "[CLIENT] "

    printLists(lists : UserLists){
        console.log(this.prefix + "State of all lists")
        lists.lists.forEach((list : GroceryList)=>{
            this.printList(list)
        })
        console.log(this.prefix + "[END]")
    }

    printList(list : GroceryList){
        console.log(this.prefix + "State of : " + list.listName)
        list.items.forEach((item : GroceryItem)=>{
            this.printItem(item)
        })
        console.log(this.prefix + "[END]")
    }

    printItem(item : GroceryItem){
        console.log(this.prefix + "State of : " + item.groceryName)
        console.log("       -" + item.groceryName + " : " + item.quantity)
        console.log(this.prefix + "[END]")
    }

    newList(listName){
        let newList = new this.GroceryList(listName)
        newList.onCommit((lst : GroceryList)=>{
            this.printList(lst)
        })
        this.myLists.newListMUT(newList)
    }

    addItemToList(listName,itemName){
        let item = new this.GroceryItem(itemName,1)
        this.myLists.lists.get(listName).addGroceryItemMUT(item)
    }

}
let ser : FarRef<Server> = app.spawnActor(Server)
let cli : FarRef<Client> = app.spawnActor(Client,["client1"]);

(cli.login(ser) as any).then(()=>{
    cli.newList("test")
    setTimeout(()=>{
        cli.addItemToList("test","banana")
        setTimeout(()=>{
            //ser.printAll()
        },1000)
    },1000)
    /*cli.newList("test2")
    cli.newList("test3")
    cli.newList("test4")*/
    /*setTimeout(()=>{
        cli.addItemToList("test","banana")
    },0)*/
})
var stdin = process.openStdin();
stdin.addListener("data", function(d) {
    eval(d.toString().trim())
});