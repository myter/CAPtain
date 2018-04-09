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
        this.items = [];
    }
    addGroceryItemMUT(item) {
        this.items.push(item);
    }
}
exports.GroceryList = GroceryList;
class GroceryItem extends Eventual_1.Eventual {
    constructor(groceryName, quantity) {
        super();
        this.groceryName = groceryName;
        this.quantity = quantity;
    }
    changeNameMUT(newName) {
        this.groceryName = newName;
    }
    incQuantityMUT() {
        this.quantity++;
    }
    decQuantityMUT() {
        this.quantity--;
    }
}
exports.GroceryItem = GroceryItem;
//# sourceMappingURL=Defs.js.map