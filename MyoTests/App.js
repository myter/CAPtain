Object.defineProperty(exports, "__esModule", { value: true });
const CAPplication_1 = require("../src/CAPplication");
const CAPActor_1 = require("../src/CAPActor");
let app = new CAPplication_1.CAPplication();
class Server extends CAPActor_1.CAPActor {
    constructor() {
        super();
        this.dir = __dirname;
    }
    init() {
        this.lists = new Map();
        this.UserLists = require(this.dir + "/Defs").UserLists;
        console.log("Server id: " + this.gsp.thisActorId);
    }
    getLists(userName) {
        console.log("Client " + userName + " logged in to server");
        if (this.lists.has(userName)) {
            return this.lists.get(userName);
        }
        else {
            let newList = new this.UserLists(userName);
            this.tempList = newList;
            this.lists.set(userName, newList);
            return newList;
        }
    }
    print() {
        console.log("State on server");
        this.tempList.lists.forEach((list) => {
            console.log(" - List : " + list.listName);
            list.items.forEach((item) => {
                console.log("     - " + item.groceryName + " : " + item.quantity);
            });
        });
    }
}
class Client extends CAPActor_1.CAPActor {
    constructor(userName) {
        super();
        this.name = userName;
        this.dir = __dirname;
    }
    init() {
        this.GroceryList = require(this.dir + "/Defs").GroceryList;
        this.GroceryItem = require(this.dir + "/Defs").GroceryItem;
        console.log(this.name + " id :" + this.gsp.thisActorId);
    }
    login(serverRef) {
        this.server = serverRef;
        return this.server.getLists("client").then((myLists) => {
            this.myLists = myLists;
        });
    }
    print() {
        console.log("State on client: " + this.name);
        this.myLists.lists.forEach((list) => {
            console.log(" - List : " + list.listName);
            list.items.forEach((item) => {
                console.log("     - " + item.groceryName + " : " + item.quantity);
            });
        });
    }
    newList(listName) {
        let newList = new this.GroceryList(listName);
        this.myLists.newListMUT(newList);
    }
    add(listName, itemName) {
        let item = new this.GroceryItem(itemName, 1);
        this.myLists.lists.get(listName).addGroceryItemMUT(item);
    }
    inc(listName, itemName) {
        this.myLists.lists.get(listName).items.forEach((item) => {
            if (item.groceryName == itemName) {
                item.incQuantityMUT();
            }
        });
    }
}
let ser = app.spawnActor(Server);
let cli = app.spawnActor(Client, ["client1"]);
let cli2 = app.spawnActor(Client, ["client2"]);
cli.login(ser).then(() => {
    //cli.inc("test","banana")
    /*cli2.login(ser).then(()=>{
        cli.newList("test")
        cli.add("test","banana")
        cli.inc("test","banana")
    })*/
});
/*setTimeout(()=>{
    cli2.login(ser)
},2000)*/
var stdin = process.openStdin();
function printAll() {
    ser.print().then(() => {
        cli.print().then(() => {
            cli2.print();
        });
    });
}
function log2() {
    cli2.login(ser);
}
stdin.addListener("data", function (d) {
    eval(d.toString().trim());
});
//# sourceMappingURL=App.js.map