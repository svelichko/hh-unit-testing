function LazyGraph() {
    this.receive = function (graph) {

        // load the graph
        this.graph = graph;

        // create an empty object for calculation results
        this.obj = {};

        // create an object, which maps vertex names to their statuses to catch dependency loops
        this.beingComputed = {};
    }

    this.solve = function (vertex) {

        // if the vertex isn't solved yet
        if (typeof this.obj[vertex] === 'undefined') {
            // mark the current vertex as 'being computed'
            this.beingComputed[vertex] = true;

            // find function with the same name in the graph
            if (typeof this.graph[vertex] === 'function') {

                // get argument names as strings
                var argnames = this.graph[vertex].toString().split('(')[1].split(')')[0].split(',');
                var argvalues = [];

                // if arguments aren't solved yet, solve them first
                for (var i = 0; i < argnames.length; i++) {
                    if (argnames[i].trim().length > 0 && typeof this.obj[argnames[i].trim()] === 'undefined') {

                        // check if there is a dependency loop
                        if (this.beingComputed[argnames[i].trim()])
                            throw new Error('Dependency loop between ' + vertex + ' and ' + argnames[i].trim());

                        // if any of the arguments cannot be solved, throw undefined
                        if (typeof arguments.callee.call(this, argnames[i].trim()) === 'undefined')
                            throw new Error(argnames[i].trim() + ' is undefined');
                    }
                    argvalues.push(this.obj[argnames[i].trim()])
                }

                // then, solve the current vertex
                this.obj[vertex] = this.graph[vertex].apply({}, argvalues);

                // mark current vertex as not 'being computed' anymore
                this.beingComputed[vertex] = false;

                // return the current vertex
                return this.obj[vertex];
            }

            // if the function is not found, return undefined
            throw new Error(vertex + ' is undefined');
        }

        // if the vertex is solved, return it
        return this.obj[vertex];
    }
}

function EagerGraph() {

    this.receive = function (graph) {
        this.lazy = new LazyGraph();
        this.lazy.receive(graph);
    }

    this.solve = function () {
        for (var vertex in this.lazy.graph) {
            if (typeof this.lazy.obj[vertex] === 'undefined')
                this.lazy.solve(vertex);
        }

        this.obj = this.lazy.obj;

        return this.obj;
    }
}

module.exports.LazyGraph = LazyGraph;
module.exports.EagerGraph = EagerGraph;
