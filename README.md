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
import {Available, CAPActor, CAPplication} from "spiders.captain"
class AVCounter extends Available{
    value = 0
    
    inc(){
        return ++this.value
    }
}
let counter = new AVCounter()
counter.value //Returns 0
counter.inc() //Returns 1
```

`Availables` adhere to pass-by-copy semantics. In other words, whenever an `Available` is sent between two actors the receiving actor receives
a deep copy of the original object (if this doesn't make sense to you, see the [Spiders.js](https://github.com/myter/Spiders.js) tutorial):
```TypeScript
class TestActor extends CAPActor {
    rcvCounter(counter){
        counter.inc() //Returns 1
    }
}

let counter = new AVCounter()
let app = new CAPplication()
let act = app.spawnActor(TestActor)
act.rcvCounter(counter)
counter.inc() //Returns 1
```

---
`Eventuals` extend the behaviour of `Availables` by keeping all copies of a particular `Eventual` instance eventually consistent (i.e. not strongly eventually consistent).
In a nutshell if two actors have a copy of the same `Eventual` object, CAPtain.js ensures that the state of these objects is synchronised.
In other words, both actors can concurrently modify the state of their copy of the object (even while being disconnected from each other) without worrying about 
synchronising these modifications.

The `@mutating` annotation allows you to signal the CAPtain.js runtime that a particular method mutates an `Eventual's` state.
You can install `onTentative` and `onCommit` listeners which are respectively triggered whenever the state of an `Eventual` is changed locally or globally.
```TypeScript
import {CAPActor, CAPplication, Eventual, mutating} from "spiders.captain";

class EVCounter extends Eventual{
    value = 0

    @mutating
    inc(){
        return ++this.value
    }
}

let ev = new EVCounter()
ev.onTentative(()=>{
    ev.value //Triggered first, returns 1
})

ev.onCommit(()=>{
    ev.value //Triggered second, returns 1
})
ev.inc()
```

`Eventuals` are passed between actors using pass-by-replication semantics.
In a nutshell, this entails that the passed object is deeply copied and that the copies are kept eventually consistent behind the scenes.
The counter example bellow illustrated the workings of `Eventuals` across actors.
The example can trivially be ported to work across machines given Spiders.js' inherent distribution mechanisms.
```TypeScript
class TestActor extends CAPActor{
    rcvCounter(counter){
        counter.onTentative(()=>{
            //Triggered when "this" actor invokes "inc"
        })
        counter.onCommit(()=>{
            //Triggered whenever a new global value for counter is confirmed
            //This can either be the result of "this" actor invoking inc or the "other" actor invoking inc 
        })
        counter.inc()
    }
}

let app  = new CAPplication()
let counter   = new EVCounter()
let act1 =  app.spawnActor(TestActor)
let act2 = app.spawnActor(TestActor)
act1.rcvCounter(counter)
act2.rcvCounter(counter)
```
The example spawn two actors which both get a copy of a `Counter` `Eventual`.
Subsequently, both actors install `onTentative` and `onCommit` listeners and concurrently increment the counter's value.
Depending on the interleaving of messages the state change listeners might be triggered in different orders. 
However, the `onCommit` listeners will eventually trigger a final time for both actors.
At that point in time CAPtain.js guarantees that the value of both counter copies is 2.

---

In the example above it can happen that both actors read different values for the counter (i.e. if this read happens in between synchronisation rounds).
If you desire stronger consistency guarantees CAPtain.js offers `Consistents` which guarantee sequential consistency.
In contrast to `Availables` and `Eventuals`, `Consistents` offer an asynchronous API.
Accessing a `Consistent's` field or invoking one of its methods returns a promise which only resolves when the consistency of the result can be guaranteed by CAPtain.js:
```TypeScript
import {Consistent} from "spiders.captain";

class CCounter extends Consistent{
    value = 0

    inc(){
        return ++this.value
    }
}

let counter = new CCounter()
counter.value.then((v)=>{
    //v will be bound to 0 when promise resolves
})
counter.inc().then((v)=>{
    //v will be bound to 1 when promise resolves
})
```

`Consistents` are passed between actors using pass-by-reference semantics.
Conceptually, this entails that actors only ever have a "far reference" or proxy to a consistent:
```TypeScript
class TestActor extends CAPActor{
    rcvCounter(counter){
        counter.value.then((v)=>{
            //Returns the same v for both actors unless someone invokes inc on the counter in between reads
        })
    }
}

let app  = new CAPplication()
let counter   = new CCounter()
let act1 =  app.spawnActor(TestActor)
let act2 = app.spawnActor(TestActor)
act1.rcvCounter(counter)
act2.rcvCounter(counter)
```
This difference between this example and the example using the `Eventual` counter above lies in the consistency guarantees the counter provides.
In the previous example it could be that both actors read different values for the counter's value (e.g. due to one of the actors being disconnected from the network).
In this example both actors will always read the same value for the counter, provided that no inc operation interleaves both reads.
## From Eventual to Consistent and Back Again
## Restrictions
## Custom Consistency Requirements
TODO
# Reading
In case you are interested in this work beyond this tutorial you are more than welcome to read our papers about [CAPtain](TODO) or [Spiders.js](TODO).
