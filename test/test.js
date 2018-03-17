const assert = require('chai').assert;

const { LazyGraph, EagerGraph } = require('../src/graph');

const { stats, withMissingNode, withCircularDependencies } = require('./test-objs');

describe('LazyGraph', function() {

    before(function() {
        var lazyGraph;
    });

    beforeEach(function() {
        lazyGraph = new LazyGraph();
    });

    describe('receive(graph)', function() {
        it('should load the graph', function() {
            lazyGraph.receive(stats);
            assert.deepEqual(stats, lazyGraph.graph);
        });
    });

    describe('solve(vertex)', function() {

        before(function() {
            var m2;
        });

        beforeEach(function() {
            lazyGraph.receive(stats);
            m2 = lazyGraph.solve('m2');
        });

        it('should compute the queried node', function() {
            assert.notEqual(m2, undefined);
        });

        it('should compute required nodes', function() {
            assert.notEqual(lazyGraph.obj.n, undefined);
            assert.notEqual(lazyGraph.obj.xs, undefined);
        });

        it('should not compute unneeded nodes', function() {
            assert.equal(lazyGraph.obj.m, undefined);
            assert.equal(lazyGraph.obj.v, undefined);
        });

        it('should compute the queried node correctly', function() {
            assert.equal(lazyGraph.obj.m2, 12.5);
        });

        it('should compute required nodes correctly', function() {
            assert.equal(lazyGraph.obj.n, 4);
        });
    });

    describe('solve(vertex) when graph has a missing node', function() {

        beforeEach(function() {
            lazyGraph.receive(withMissingNode);
        });

        it('should throw an error when missing node is required', function() {
            assert.throws(
                function() {
                    lazyGraph.solve('v');
                },
                Error,
                "m is undefined"
            );
        });

        it('should not throw an error when missing node is not required', function() {
            assert.doesNotThrow(
                function() {
                    lazyGraph.solve('m2');
                },
                Error
            );
        });
    });

    describe('solve(vertex) when graph has circular dependency', function() {

        beforeEach(function() {
            lazyGraph.receive(withCircularDependencies);
        });

        it('should throw an error when nodes dependent on each other are required', function() {
            assert.throws(
                function() {
                    lazyGraph.solve('v');
                },
                Error,
                'Dependency loop between m and m2'
            );
        });

        it('should not throw an error when nodes dependent on each other are not required', function() {
            assert.doesNotThrow(
                function() {
                    lazyGraph.solve('n');
                },
                Error
            );
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
            eagerGraph.receive(stats);
            assert.deepEqual(stats, eagerGraph.lazy.graph);
        });
    });

    describe('solve()', function() {

        before(function() {
            var solved;
        });

        beforeEach(function() {
            eagerGraph.receive(stats);
            solved = eagerGraph.solve();
        });

        it('should compute the queried node', function() {
            assert.notEqual(solved.m2, undefined);
        });

        it('should compute all the nodes of the graph', function() {
            assert.notEqual(solved.xs, undefined);
            assert.notEqual(solved.n, undefined);
            assert.notEqual(solved.m, undefined);
            assert.notEqual(solved.m2, undefined);
            assert.notEqual(solved.v, undefined);
        });

        it('should compute the queried node correctly', function() {
            assert.equal(solved.m2, 12.5);
        });

        it('should compute all the nodes of the graph correctly', function() {
            assert.deepEqual(solved.xs, [1, 2, 3, 6]);
            assert.equal(solved.n, 4);
            assert.equal(solved.m, 3);
            assert.equal(solved.m2, 12.5);
            assert.equal(solved.v, 3.5);
        });

    });

    describe('solve() when graph has a missing node', function() {

        beforeEach(function() {
            eagerGraph.receive(withMissingNode);
        });

        it('should throw an error', function() {
            assert.throws(
                function() {
                    eagerGraph.solve();
                },
                Error,
                "m is undefined"
            );
        });
    });

    describe('solve() when graph has circular dependency', function() {

        beforeEach(function() {
            eagerGraph.receive(withCircularDependencies);
        });

        it('should throw an error', function() {
            assert.throws(
                function() {
                    eagerGraph.solve();
                },
                Error,
                'Dependency loop between m2 and m'
            );
        });
    });
});
