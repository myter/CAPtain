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
        console.log("Client id: " + this.gsp.thisActorId);
    }
    login(serverRef) {
        this.server = serverRef;
        return this.server.getLists(this.name).then((myLists) => {
            this.myLists = myLists;
        });
    }
    print() {
        console.log("State on client");
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
    addItemToList(listName, itemName) {
        let item = new this.GroceryItem(itemName, 1);
        this.myLists.lists.get(listName).addGroceryItemMUT(item);
    }
}
let ser = app.spawnActor(Server);
let cli = app.spawnActor(Client, ["client1"]);
cli.login(ser).then(() => {
    cli.newList("test");
    cli.addItemToList("test", "banana");
    cli.addItemToList("test", "pear");
});
var stdin = process.openStdin();
stdin.addListener("data", function (d) {
    eval(d.toString().trim());
});
//# sourceMappingURL=App.js.map