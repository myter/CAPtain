var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const spiders_js_1 = require("spiders.js");
const Available_1 = require("../src/Available");
const Eventual_1 = require("../src/Eventual");
const Consistent_1 = require("../src/Consistent");
const CAPActor_1 = require("../src/CAPActor");
const CAPplication_1 = require("../src/CAPplication");
var assert = require('assert');
var chai = require('chai');
var expect = chai.expect;
describe("Availables", () => {
    class TestAvailable extends Available_1.Available {
        constructor() {
            super();
            this.value = 5;
        }
        incWithPrim(num) {
            this.value += num;
        }
        incWithCon(con) {
            this.value += con.value;
        }
    }
    it("Check OK Constraint (primitive)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithPrim(5);
                return c.value;
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
    it("Check OK Constraint (Available)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                c.incWithCon(cc);
                return c.value;
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
        class TestEventual extends Eventual_1.Eventual {
            constructor() {
                super();
                this.value = 5;
            }
        }
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
                this.TestEventual = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestEventual();
                c.incWithCon(cc);
                return c.value;
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
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                c.value = 6;
                return c.value;
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
    it("Check OK Assignment (Available)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                c.value = cc;
                return c.value;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v.value).to.equal(5);
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
        class TestEventual extends Eventual_1.Eventual {
            constructor() {
                super();
                this.value = 5;
            }
        }
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
                this.TestEventual = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestEventual();
                c.value = cc;
                return c.value;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            try {
                expect(v.value).to.equal(5);
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
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithCon({ value: 5 });
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
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                c.value = { x: 5 };
                return c.value;
            }
        }
        app.spawnActor(Act).test().catch(() => {
            app.kill();
            done();
        });
    });
    it("Class serialisation", (done) => {
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestAvailable;
            }
            test() {
                let c = new this.TestConsistent();
                return c.value;
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
    it("Consistent Serialisation", (done) => {
        class Act2 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.c = new TestAvailable();
            }
            test() {
                return this.c.value;
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
});
describe("Eventuals", () => {
    class TestEventual extends Eventual_1.Eventual {
        constructor() {
            super();
            this.v1 = 5;
            this.sensitive = [5];
        }
        inc() {
            this.v1++;
            return 5;
        }
        add(val) {
            this.sensitive.push(val);
        }
        incWithPrim(v) {
            this.v1 += v;
        }
        incWithCon(c) {
            this.v1 += c.v1;
        }
    }
    __decorate([
        Eventual_1.mutating
    ], TestEventual.prototype, "inc", null);
    __decorate([
        Eventual_1.mutating
    ], TestEventual.prototype, "add", null);
    __decorate([
        Eventual_1.mutating
    ], TestEventual.prototype, "incWithPrim", null);
    __decorate([
        Eventual_1.mutating
    ], TestEventual.prototype, "incWithCon", null);
    class Contained extends Eventual_1.Eventual {
        constructor() {
            super();
            this.innerVal = 5;
        }
        inc() {
            this.innerVal++;
        }
    }
    __decorate([
        Eventual_1.mutating
    ], Contained.prototype, "inc", null);
    class Container extends Eventual_1.Eventual {
        constructor() {
            super();
        }
        addInners(inner) {
            this.inner = inner;
        }
    }
    __decorate([
        Eventual_1.mutating
    ], Container.prototype, "addInners", null);
    it("Check OK Constraint (primitive)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestEventual;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithPrim(5);
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
                c.incWithCon(cc);
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
                c.incWithCon({ value: 5 });
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
                ev.inc();
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
                anEv.inc();
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
                anEv.add(6);
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
                cont.addInners(contained);
                contained.inc();
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
                anEv.inc();
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
                anEv.inc();
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
                cont.addInners(contained);
                contained.inc();
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
describe("Consistents", () => {
    class TestConsistent extends Consistent_1.Consistent {
        constructor() {
            super();
            this.value = 5;
        }
        incWithPrim(num) {
            this.value += num;
        }
        incWithCon(con) {
            return con.value.then((v) => {
                this.value += v;
            });
        }
    }
    it("Check OK Constraint (primitive)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                return c.incWithPrim(5).then(() => {
                    return c.value;
                });
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
    it("Check OK Constraint (Consistent)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                return c.incWithCon(cc).then(() => {
                    return c.value;
                });
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
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                c.value = 6;
                return c.value;
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
    it("Check OK Assignment (Consistent)", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                let cc = new this.TestConsistent();
                c.value = cc;
                return c.value;
            }
        }
        app.spawnActor(Act).test().then((v) => {
            v.value.then((vv) => {
                try {
                    expect(vv).to.equal(5);
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
    it("Check NOK Constraint", (done) => {
        let app = new spiders_js_1.Application();
        class Act extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                c.incWithCon({ value: 5 });
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
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                c.value = { x: 5 };
                return c.value;
            }
        }
        app.spawnActor(Act).test().catch(() => {
            app.kill();
            done();
        });
    });
    it("Class serialisation", (done) => {
        class Act extends spiders_js_1.Actor {
            constructor() {
                super();
                this.TestConsistent = TestConsistent;
            }
            test() {
                let c = new this.TestConsistent();
                return c.value;
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
    it("Consistent Serialisation", (done) => {
        class Act2 extends CAPActor_1.CAPActor {
            constructor() {
                super();
                this.c = new TestConsistent();
            }
            test() {
                return this.c.value;
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
});
describe("Libs extension", () => {
    class TestConsistent extends Consistent_1.Consistent {
        constructor() {
            super();
            this.value = 5;
        }
        inc() {
            this.value += 1;
        }
    }
    __decorate([
        Eventual_1.mutating
    ], TestConsistent.prototype, "inc", null);
    class TestEventual extends Eventual_1.Eventual {
        constructor() {
            super();
            this.value = 5;
        }
        inc() {
            this.value += 1;
        }
    }
    __decorate([
        Eventual_1.mutating
    ], TestEventual.prototype, "inc", null);
    it("thaw", function (done) {
        this.timeout(4000);
        class Act extends CAPActor_1.CAPActor {
            getEv(ev) {
                ev.inc();
            }
        }
        let app = new CAPplication_1.CAPplication();
        let con = new TestConsistent();
        let ev = app.libs.thaw(con).then((ev) => {
            ev.onCommit(() => {
                try {
                    expect(ev.value).to.equal(6);
                    app.kill();
                    done();
                }
                catch (e) {
                    app.kill();
                    done(e);
                }
            });
            let act = app.spawnActor(Act);
            act.getEv(ev);
        });
    });
    it("thaw remote", function (done) {
        this.timeout(4000);
        class Act extends CAPActor_1.CAPActor {
            getCon(con) {
                return this.libs.thaw(con).then((ev) => {
                    setTimeout(() => {
                        ev.inc();
                    }, 2000);
                    return ev;
                });
            }
        }
        let app = new CAPplication_1.CAPplication();
        let act = app.spawnActor(Act);
        let con = new TestConsistent();
        act.getCon(con).then((ev) => {
            ev.onCommit(() => {
                try {
                    expect(ev.value).to.equal(6);
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
    it("freeze", function (done) {
        this.timeout(4000);
        class Act extends CAPActor_1.CAPActor {
            getCon(con) {
                con.inc();
            }
        }
        let app = new CAPplication_1.CAPplication();
        let ev = new TestEventual();
        let con = app.libs.freeze(ev);
        let act = app.spawnActor(Act);
        act.getCon(con);
        setTimeout(() => {
            con.value.then((v) => {
                try {
                    expect(v).to.equal(6);
                    expect(ev.value).to.equal(5);
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
});
//# sourceMappingURL=cap.Test.js.map