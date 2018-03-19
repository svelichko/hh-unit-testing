var stats = {
    xs: () => [1, 2, 3, 6],
    n: (xs) => xs.length,
    m: function (xs, n) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum += xs[i];
        return sum / n;
    },
    m2: function (xs, n) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum += xs[i] * xs[i];
        return sum / n;
    },
    v: (m2, m) => m2 - m * m
};

var withMissingNode = {
    xs: () => [1, 2, 3, 6],
    n: (xs) => xs.length,
    m2: function (xs, n) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum += xs[i] * xs[i];
        return sum / n;
    },
    v: (m2, m) => m2 - m * m
}

var withCircularDependencies = {
    xs: () => [1, 2, 3, 6],
    n: (xs) => xs.length,
    m: function(xs, n, m2) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum += xs[i];
        return sum / n;
    },
    m2: function(xs, n, m) {
        var sum = 0;
        for (var i = 0; i < n; i++)
            sum += xs[i] * xs[i];
        return sum / n;
    },
    v: (m2, m) => m2 - m * m
}

module.exports = { stats, withMissingNode, withCircularDependencies };
