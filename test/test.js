const assert = require('chai').assert;

const { LazyGraph, EagerGraph } = require('../src/graph');

const { stats, withMissingNode, withCircularDependencies } = require('./test-objs');

describe('LazyGraph', function() {

    describe('receive(graph)', function() {
        it('should load the graph', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            assert.deepEqual(stats, lazyGraph.graph);
        });
    });

    describe('solve(\'m2\')', function() {

        it('should compute m2', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            assert.notEqual(lazyGraph.solve('m2'), undefined);
        });

        it('should compute nodes required by m2', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            lazyGraph.solve('m2');
            assert.notEqual(lazyGraph.obj.n, undefined);
            assert.notEqual(lazyGraph.obj.xs, undefined);
        });

        it('should not compute nodes not required by m2', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            lazyGraph.solve('m2');
            assert.equal(lazyGraph.obj.m, undefined);
            assert.equal(lazyGraph.obj.v, undefined);
        });

        it('should compute m2 correctly', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            assert.equal(lazyGraph.solve('m2'), 12.5);
        });

        it('should compute nodes required by m2 correctly', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(stats);
            lazyGraph.solve('m2');
            assert.equal(lazyGraph.obj.n, 4);
            assert.deepEqual(lazyGraph.obj.xs, [1, 2, 3, 6]);
        });
    });

    describe('solve(\'v\') when node m is missing', function() {

        it('should throw an error', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(withMissingNode);
            assert.throws(() => lazyGraph.solve('v'), Error, "m is undefined");
        });
    });

    describe('solve(\'m2\') when node m is missing', function() {

        it('should not throw an error', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(withMissingNode);
            assert.doesNotThrow(() => lazyGraph.solve('m2'), Error);
        });
    });

    describe('solve(\'m2\') when m and m2 are dependent on each other', function() {

        it('should throw an error', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(withCircularDependencies);
            assert.throws(() => lazyGraph.solve('v'), Error, 'Dependency loop between m and m2');
        });
    });

    describe('solve(\'n\') when m and m2 are dependent on each other', function() {

        it('should not throw an error', function() {
            const lazyGraph = new LazyGraph();
            lazyGraph.receive(withCircularDependencies);
            assert.doesNotThrow(() => lazyGraph.solve('n'), Error);
        });
    });
});

describe('EagerGraph', function() {

    before(function() {
        var eagerGraph;
    });

    beforeEach(function() {
        eagerGraph = new EagerGraph();
    });

    describe('receive(graph)', function() {
        it('should load the graph', function() {
            const eagerGraph = new EagerGraph();
            eagerGraph.receive(stats);
            assert.deepEqual(stats, eagerGraph.lazy.graph);
        });
    });

    describe('solve()', function() {

        it('should compute all the nodes of the graph', function() {
            const eagerGraph = new EagerGraph();
            eagerGraph.receive(stats);
            solved = eagerGraph.solve();
            assert.notEqual(solved.xs, undefined);
            assert.notEqual(solved.n, undefined);
            assert.notEqual(solved.m, undefined);
            assert.notEqual(solved.m2, undefined);
            assert.notEqual(solved.v, undefined);
        });

        it('should compute all the nodes of the graph correctly', function() {
            const eagerGraph = new EagerGraph();
            eagerGraph.receive(stats);
            solved = eagerGraph.solve();
            assert.deepEqual(solved.xs, [1, 2, 3, 6]);
            assert.equal(solved.n, 4);
            assert.equal(solved.m, 3);
            assert.equal(solved.m2, 12.5);
            assert.equal(solved.v, 3.5);
        });

    });

    describe('solve() when node m is missing', function() {

        it('should throw an error', function() {
            const eagerGraph = new EagerGraph();
            eagerGraph.receive(withMissingNode);
            assert.throws(() => eagerGraph.solve(), Error, "m is undefined");
        });
    });

    describe('solve() when m and m2 are dependent on each other', function() {

        it('should throw an error', function() {
            const eagerGraph = new EagerGraph();
            eagerGraph.receive(withCircularDependencies);
            assert.throws(() => eagerGraph.solve(), Error, 'Dependency loop between m2 and m');
        });
    });
});
