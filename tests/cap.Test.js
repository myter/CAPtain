Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
const Eventual_1 = require("../src/Eventual");
const CAPActor_1 = require("../src/CAPActor");
const CAPplication_1 = require("../src/CAPplication");
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
/*describe("Availables",()=>{
    class TestAvailable extends Available{
        value
        constructor(){
            super()
            this.value = 5
        }

        incWithPrim(num){
            this.value += num
        }

        incWithCon(con){
            this.value += con.value
        }
    }

    it("Check OK Constraint (primitive)",(done)=>{
        let app = new Application()
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c = new this.TestConsistent()
                c.incWithPrim(5)
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(10)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Constraint (Available)",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestConsistent()
                c.incWithCon(cc)
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(10)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Constraint (Eventual)",(done)=>{
        let app = new Application()
        class TestEventual extends Eventual{
            value
            constructor(){
                super()
                this.value  = 5
            }
        }
        class Act extends CAPActor{
            TestConsistent
            TestEventual
            constructor(){
                super()
                this.TestConsistent = TestAvailable
                this.TestEventual   = TestEventual
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestEventual()
                c.incWithCon(cc)
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(10)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Assignment (primitive)",(done)=>{
        let app = new Application()
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c = new this.TestConsistent()
                c.value = 6
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(6)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Assignment (Available)",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestConsistent()
                c.value = cc
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v.value).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Assignment (Eventual)",(done)=>{
        let app = new CAPplication()
        class TestEventual extends Eventual{
            value
            constructor(){
                super()
                this.value  = 5
            }
        }
        class Act extends CAPActor{
            TestConsistent
            TestEventual
            constructor(){
                super()
                this.TestConsistent = TestAvailable
                this.TestEventual   = TestEventual
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestEventual()
                c.value = cc
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v.value).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check NOK Constraint",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c   = new this.TestConsistent()
                c.incWithCon({value:5})
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().catch(()=>{
            app.kill()
            done()
        })
    })

    it("Check NOK Assignment",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }

            test(){
                let c   = new this.TestConsistent()
                c.value = {x:5}
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().catch(()=>{
            app.kill()
            done()
        })
    })

    it("Class serialisation",(done)=>{
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestAvailable
            }
            test(){
                let c = new this.TestConsistent()
                return c.value
            }
        }
        let app = new CAPplication();
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Consistent Serialisation",(done)=>{
        class Act2 extends CAPActor{
            c
            constructor(){
                super()
                this.c = new TestAvailable()
            }

            test(){
                return this.c.value
            }
        }
        let app = new CAPplication();
        (app.spawnActor(Act2) as FarRef<Act2>).test().then((v)=>{
            try{
                expect(v).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })
})*/
describe("Eventuals", () => {
    class TestEventual extends Eventual_1.Eventual {
        constructor() {
            super();
            this.v1 = 5;
            this.sensitive = [5];
        }
        incMUT() {
            this.v1++;
            return 5;
        }
        addMUT(val) {
            this.sensitive.push(val);
        }
        incWithPrimMUT(v) {
            this.v1 += v;
        }
        incWithConMUT(c) {
            this.v1 += c.v1;
        }
    }
    class Contained extends Eventual_1.Eventual {
        constructor() {
            super();
            this.innerVal = 5;
        }
        incMUT() {
            this.innerVal++;
        }
    }
    class Container extends Eventual_1.Eventual {
        constructor() {
            super();
        }
        addInnersMUT(inner) {
            this.inner = inner;
        }
    }
    it("Check OK Constraint (primitive)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithPrimMUT(5);
                return c.v1;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v).to.equal(10);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Check OK Constraint (Eventual)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                c.incWithConMUT(cc);
                return c.v1;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v).to.equal(10);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Check OK Assignment (primitive)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                c.v1 = 6;
                return c.v1;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Check OK Assignment (Eventual)", (done) => {
        let app = new CAPplication_1.CAPplication();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                c.v1 = cc;
                return c.v1;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v.v1).to.equal(5);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Check NOK Constraint", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithConMUT({ value: 5 });
                return c.value;
            }
        }
        app.spawnActor(Act).test().catch(() => {
            app.kill();
            done();
        });
    });
    it("Check NOK Assignment", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                c.v1 = { x: 5 };
                return c.value;
            }
        }
        app.spawnActor(Act).test().catch(() => {
            app.kill();
            done();
        });
    });
    it("Class Serialisation", (done) => {
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            test() {
                let ev = new this.TestEventual();
                return ev.v1;
            }
        }
        let app = new CAPplication_1.CAPplication();
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v).to.equal(5);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Eventual Serialisation", function (done) {
        class Act2 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.ev = new TestEventual();
            }
            test() {
                return this.ev.v1;
            }
        }
        let app = new CAPplication_1.CAPplication();
        app.spawnActor(Act2).test().then((v) => {
            try {
                expect(v).to.equal(5);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Simple Replication, master change", function (done) {
        this.timeout(4000);
        let app = new CAPplication_1.CAPplication();
        class Master extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            sendAndInc(toRef) {
                let ev = new this.TestEventual();
                toRef.getEv(ev);
                ev.incMUT();
            }
        }
        class Slave extends CAPActor_1.CAPActor {
            getEv(anEv) {
                this.ev = anEv;
            }
            test() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.ev.v1);
                    }, 1000);
                });
            }
        }
        let slave = app.spawnActor(Slave);
        let master = app.spawnActor(Master);
        master.sendAndInc(slave);
        slave.test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Simple Replication, slave change", function (done) {
        this.timeout(4000);
        let app = new CAPplication_1.CAPplication();
        class Master extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            send(toRef) {
                this.ev = new this.TestEventual();
                toRef.getEv(this.ev);
            }
            test() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.ev.v1);
                    }, 2000);
                });
            }
        }
        class Slave extends CAPActor_1.CAPActor {
            getEv(anEv) {
                anEv.incMUT();
            }
        }
        let slave = app.spawnActor(Slave);
        let master = app.spawnActor(Master);
        master.send(slave);
        master.test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Clone sensitive replication", function (done) {
        this.timeout(4000);
        let app = new CAPplication_1.CAPplication();
        class Master extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            send(toRef) {
                this.ev = new this.TestEventual();
                toRef.getEv(this.ev);
            }
            test() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.ev.sensitive);
                    }, 2000);
                });
            }
        }
        class Slave extends CAPActor_1.CAPActor {
            getEv(anEv) {
                anEv.addMUT(6);
            }
        }
        let slave = app.spawnActor(Slave);
        let master = app.spawnActor(Master);
        master.send(slave);
        master.test().then((v) => {
            try {
                expect(v[0]).to.equal(5);
                expect(v[1]).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Nested replication", function (done) {
        this.timeout(5000);
        class Act1 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.Container = Container;
            }
            sendTo(ref) {
                this.cont = new this.Container();
                ref.getContainer(this.cont);
            }
            test() {
                return this.cont.inner.innerVal;
            }
        }
        class Act2 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.Contained = Contained;
            }
            getContainer(cont) {
                let contained = new this.Contained();
                cont.addInnersMUT(contained);
                contained.incMUT();
            }
        }
        let app = new CAPplication_1.CAPplication();
        let act1 = app.spawnActor(Act1);
        let act2 = app.spawnActor(Act2);
        act1.sendTo(act2);
        setTimeout(() => {
            act1.test().then((v) => {
                try {
                    expect(v).to.equal(6);
                    app.kill();
                    done();
                }
                catch (e) {
                    app.kill();
                    done(e);
                }
            });
        }, 2000);
    });
    it("tentative listener", function (done) {
        this.timeout(4000);
        let app = new CAPplication_1.CAPplication();
        class Master extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            send(toRef) {
                this.ev = new this.TestEventual();
                toRef.getEv(this.ev);
            }
        }
        class Slave extends CAPActor_1.CAPActor {
            getEv(anEv) {
                anEv.onTentative((ev) => {
                    this.val = ev.v1;
                });
                anEv.incMUT();
            }
            test() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.val);
                    }, 2000);
                });
            }
        }
        let slave = app.spawnActor(Slave);
        let master = app.spawnActor(Master);
        master.send(slave);
        slave.test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("commit listener", function (done) {
        this.timeout(4000);
        let app = new CAPplication_1.CAPplication();
        class Master extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestEventual = TestEventual;
            }
            send(toRef) {
                this.ev = new this.TestEventual();
                this.ev.onCommit((ev) => {
                    this.val = ev.v1;
                });
                toRef.getEv(this.ev);
            }
            test() {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        resolve(this.val);
                    }, 2000);
                });
            }
        }
        class Slave extends CAPActor_1.CAPActor {
            getEv(anEv) {
                anEv.onTentative((ev) => {
                    this.val = ev.v1;
                });
                anEv.incMUT();
            }
        }
        let slave = app.spawnActor(Slave);
        let master = app.spawnActor(Master);
        master.send(slave);
        master.test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
    it("Deep commit listener", function (done) {
        this.timeout(5000);
        class Act1 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.Container = Container;
                this.val = 5;
            }
            sendTo(ref) {
                this.cont = new this.Container();
                this.cont.onCommit(() => {
                    this.val++;
                });
                ref.getContainer(this.cont);
            }
            test() {
                return this.val;
            }
        }
        class Act2 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.Contained = Contained;
            }
            getContainer(cont) {
                let contained = new this.Contained();
                cont.addInnersMUT(contained);
                contained.incMUT();
            }
        }
        let app = new CAPplication_1.CAPplication();
        let act1 = app.spawnActor(Act1);
        let act2 = app.spawnActor(Act2);
        act1.sendTo(act2);
        setTimeout(() => {
            act1.test().then((v) => {
                try {
                    expect(v).to.equal(7);
                    app.kill();
                    done();
                }
                catch (e) {
                    app.kill();
                    done(e);
                }
            });
        }, 2000);
    });
    it("Mutating Annotation", function (done) {
        class MutAct extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.thisDir = __dirname;
            }
            test() {
                let AnnotEV = require(this.thisDir + "/EVDefinition").TestEV;
                let ev = new AnnotEV();
                return new Promise((resolve) => {
                    ev.onTentative(() => (resolve(ev.value)));
                    ev.inc();
                });
            }
        }
        let app = new CAPplication_1.CAPplication();
        let act = app.spawnActor(MutAct);
        act.test().then((v) => {
            try {
                expect(v).to.equal(6);
                app.kill();
                done();
            }
            catch (e) {
                app.kill();
                done(e);
            }
        });
    });
});
/*describe("Consistents",()=>{
    class TestConsistent extends Consistent{
        value
        constructor(){
            super()
            this.value = 5
        }

        incWithPrim(num){
            return this.value.then((v)=>{
                return this.value = v + num
            })
        }

        incWithCon(con){
            return con.value.then((v)=>{
                return this.value.then((vv)=>{
                    this.value = v + vv
                })
            })
        }
    }

    it("Check OK Constraint (primitive)",(done)=>{
        let app = new Application()
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c = new this.TestConsistent()
                return c.incWithPrim(5).then(()=>{
                    return c.value
                })
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(10)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Constraint (Consistent)",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestConsistent()
                return c.incWithCon(cc).then(()=>{
                    return c.value
                })
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(10)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Assignment (primitive)",(done)=>{
        let app = new Application()
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c = new this.TestConsistent()
                c.value = 6
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(6)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Check OK Assignment (Consistent)",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c   = new this.TestConsistent()
                let cc  = new this.TestConsistent()
                c.value = cc
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            v.value.then((vv)=>{
                try{
                    expect(vv).to.equal(5)
                    app.kill()
                    done()
                }
                catch(e){
                    app.kill()
                    done(e)
                }
            })
        })
    })

    it("Check NOK Constraint",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c   = new this.TestConsistent()
                c.incWithCon({value:5})
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().catch(()=>{
            app.kill()
            done()
        })
    })

    it("Check NOK Assignment",(done)=>{
        let app = new Application()
        class Act extends CAPActor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }

            test(){
                let c   = new this.TestConsistent()
                c.value = {x:5}
                return c.value
            }
        }
        (app.spawnActor(Act) as FarRef<Act>).test().catch(()=>{
            app.kill()
            done()
        })
    })

    it("Class serialisation",(done)=>{
        class Act extends Actor{
            TestConsistent
            constructor(){
                super()
                this.TestConsistent = TestConsistent
            }
            test(){
                let c = new this.TestConsistent()
                return c.value
            }
        }
        let app = new CAPplication();
        (app.spawnActor(Act) as FarRef<Act>).test().then((v)=>{
            try{
                expect(v).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })

    it("Consistent Serialisation",(done)=>{
        class Act2 extends CAPActor{
            c
            constructor(){
                super()
                this.c = new TestConsistent()
            }

            test(){
                return this.c.value
            }
        }
        let app = new CAPplication();
        (app.spawnActor(Act2) as FarRef<Act2>).test().then((v)=>{
            try{
                expect(v).to.equal(5)
                app.kill()
                done()
            }
            catch(e){
                app.kill()
                done(e)
            }
        })
    })
})*/
//# sourceMappingURL=cap.Test.js.map