Object.defineProperty(exports, "__esModule", { value: true });
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
let app = new CAPplication_1.CAPplication();
class Server extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.prefix = "[SERVER] ";
        this.dir = __dirname;
    }
    init() {
        this.lists = new Map();
        this.UserLists = require(this.dir + "/Defs").UserLists;
    }
    getLists(userName) {
        console.log("Client " + userName + " logged in to server");
        if (this.lists.has(userName)) {
            return this.lists.get(userName);
        }
        else {
            let newList = new this.UserLists(userName);
            newList.onCommit((lists) => {
                console.log("Lists on server: ");
                lists.lists.forEach((lst) => {
                    console.log(lst.listName);
                });
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
            });
            this.tempList = newList;
            return newList;
        }
    }
    printLists(lists) {
        console.log(this.prefix + "State of all lists");
        lists.lists.forEach((list) => {
            this.printList(list);
        });
        console.log(this.prefix + "[END]");
    }
    printList(list) {
        console.log(this.prefix + "State of : " + list.listName);
        list.items.forEach((item) => {
            this.printItem(item);
        });
        console.log(this.prefix + "[END]");
    }
    printItem(item) {
        console.log(this.prefix + "State of : " + item.groceryName);
        console.log("       -" + item.groceryName + " : " + item.quantity);
        console.log(this.prefix + "[END]");
    }
}
class Client extends CAPActor_1.CAPActor {
    constructor(userName) {
        super();
        this.prefix = "[CLIENT] ";
        this.name = userName;
        this.dir = __dirname;
    }
    init() {
        this.GroceryList = require(this.dir + "/Defs").GroceryList;
        this.GroceryItem = require(this.dir + "/Defs").GroceryItem;
    }
    login(serverRef) {
        this.server = serverRef;
        return this.server.getLists(this.name).then((myLists) => {
            this.myLists = myLists;
            this.myLists.onCommit((lists) => {
                this.printLists(lists);
            });
        });
    }
    printLists(lists) {
        console.log(this.prefix + "State of all lists");
        lists.lists.forEach((list) => {
            this.printList(list);
        });
        console.log(this.prefix + "[END]");
    }
    printList(list) {
        console.log(this.prefix + "State of : " + list.listName);
        list.items.forEach((item) => {
            this.printItem(item);
        });
        console.log(this.prefix + "[END]");
    }
    printItem(item) {
        console.log(this.prefix + "State of : " + item.groceryName);
        console.log("       -" + item.groceryName + " : " + item.quantity);
        console.log(this.prefix + "[END]");
    }
    newList(listName) {
        let newList = new this.GroceryList(listName);
        newList.onCommit((lst) => {
            this.printList(lst);
        });
        this.myLists.newListMUT(newList);
    }
    addItemToList(listName, itemName) {
        let item = new this.GroceryItem(itemName, 1);
        this.myLists.lists.get(listName).addGroceryItemMUT(item);
    }
}
let ser = app.spawnActor(Server);
let cli = app.spawnActor(Client, ["client1"]);
cli.login(ser).then(() => {
    cli.newList("test");
    setTimeout(() => {
        cli.addItemToList("test", "banana");
        setTimeout(() => {
            //ser.printAll()
        }, 1000);
    }, 1000);
    /*cli.newList("test2")
    cli.newList("test3")
    cli.newList("test4")*/
    /*setTimeout(()=>{
        cli.addItemToList("test","banana")
    },0)*/
});
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    eval(d.toString().trim());
});
//# sourceMappingURL=App.js.map