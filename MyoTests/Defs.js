Object.defineProperty(exports, "__esModule", { value: true });
const Eventual_1 = require("../src/Eventual");
class UserLists extends Eventual_1.Eventual {
    constructor(ownerName) {
        super();
        this.owner = ownerName;
        this.lists = new Map();
    }
    newListMUT(list) {
        this.lists.set(list.listName, list);
    }
}
exports.UserLists = UserLists;
class GroceryList extends Eventual_1.Eventual {
    constructor(name) {
        super();
        this.listName = name;
        this.items = new Map();
    }
    addGroceryItemMUT(itemName) {
        this.items.set(itemName, 0);
    }
    remGroceryItemMut(itemName) {
        this.items.delete(itemName);
    }
    incQuantityMUT(itemName) {
        this.items.set(itemName, this.items.get(itemName) + 1);
    }
    decQuantityMUT(itemName) {
        this.items.set(itemName, this.items.get(itemName) - 1);
    }
}
exports.GroceryList = GroceryList;
//# sourceMappingURL=Defs.js.map