# CAPtain.js
Integrating the CAP theorem into distributed language design

# Usage
Install with npm:
```
npm install spiders.captain
```
CAPtain.js is a first prototype of what I think the next generation of distributed programming languages should look like.
The main idea behind CAPtain.js is to make the trade-off between availability and consistency (think [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem)) explicit from a programming perspective.
Concretely, as a distributed programmer you explicitly state which pieces of your system's state should be available (and eventually consistent) or (strongly) consistent (but not always available).

If you are interested in how all of this works in practice please consider going through [Spiders.js' tutorial](https://github.com/myter/Spiders.js) first.
CAPtain.js builds forth on Spiders.js and therefore heavily relies on its abstractions and concepts.
# Tutorial
This tutorail aims to provide a brief introduction to CAPtain.js' basic abstractions.
[This](https://github.com/myter/Myosotis) collaborative grocery list application provides a complete and running example.
## Building Blocks: Availables,Eventuals and Consistents
CAPtain.js extends Spiders.js with three new classes: availables, eventuals and consistents.
Each class represents a possible availability/consistency trade-off.


---
Objects of type `Available` ensure that field accesses and method calls always return a value (regardless of the caller's connectivity).
The API offered by `Availables` is basically that of regular TypeScript/JavaScript objects:
```TypeScript
import {Available} from "spiders.captain"
class MyAvailable extends Available{
    x = 5
    
    doubleX(){
        return this.x * 2
    }
}
let ma = new MyAvailable()
ma.x //Returns 5
ma.doubleX() //Returns 10
```

`Availables` adhere to pass-by-copy semantics. In other words, whenever an `Available` is sent between two actors the receiving actor receives
a deep copy of the original object (if this doesn't make sense to you, see the [Spiders.js](https://github.com/myter/Spiders.js) tutorial):
```TypeScript
import {Available, CAPActor, CAPplication} from "spiders.captain"
class MyAvailable extends Available{
    x = 5

    doubleX(){
        return this.x * 2
    }
}

class TestActor extends CAPActor {
    receiveAvailable(av){
        av.x = 10
        av.doubleX() //Returns 20
    }
}

let ma  = new MyAvailable()
let app = new CAPplication()
let act = app.spawnActor(TestActor)
act.receiveAvailable(ma)
ma.doubleX() //Returns 10
```

---
`Eventuals` extend the behaviour of `Availables` by keeping all copies of a particular `Eventual` instance eventually consistent (i.e. not strongly eventually consistent).
The `@mutating` annotation allows you to signal the CAPtain.js runtime that a particular method changes an `Eventual's` state.
Using the 

A simple counter example is given bellow.
TODO
```TypeScript
TODO
```
## From Eventual to Consistent and Back Again
## Restrictions
## Custom Consistency Requirements
TODO
# Reading
In case you are interested in this work beyond this tutorial you are more than welcome to read our papers about [CAPtain](TODO) or [Spiders.js](TODO).
