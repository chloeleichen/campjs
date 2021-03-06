'use strict';

var width = 500,
    height = 500,
    theta = 25 * Math.PI / 180,
    length = 11,
    x0 = width / 2,
    y0 = height,
    t0 = -Math.PI / 2.2,
    n = 5;

function tree(string) {
    var stack = [],
        root = { path: [[x0, y0]], children: [] },
        state = { x: x0, y: y0, t: t0, branch: root };
    var commands = {

        'X': function X() {},
        'F': function F() {
            state.x += length * Math.cos(state.t);
            state.y += length * Math.sin(state.t);
            state.branch.path[1] = [state.x, state.y];
        },
        '+': function _() {
            state.t += theta;
        },
        '-': function _() {
            state.t -= theta;
        },
        '[': function _() {
            stack.push(state);
            state = Object.create(state);
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        },
        ']': function _() {
            state = stack.pop();
            state = Object.create(state);
            state.depth += 1;
            var branch = { path: [[state.x, state.y]], children: [] };
            state.branch.children.push(branch);
            state.branch = branch;
        }
    };
    string.split('').forEach(function (c) {
        commands[c]();
    });
    return root;
}

var data = tree(l(n, { "X": "FF", "F": "XF-[-F+F]+[+F-F]" }, "X"));

var line = d3.svg.line().x(function (d) {
    return d[0];
}).y(function (d) {
    return d[1];
});

var svg = d3.select("#container").append("svg").attr("width", width).attr("height", height).datum(data).each(grow(3));

function grow(weight) {
    return function (d) {
        if (d.path[1]) {
            d3.select(this).append("path").attr("stroke", "black").attr("stroke-opacity", 0.9).attr("stroke-width", weight).attr("fill", "none").datum(d.path).attr("d", line).each(function () {
                d3.select(this).attr("stroke-dasharray", "0," + this.getTotalLength());
            }).transition().ease("linear").duration(300).attrTween("stroke-dasharray", tweenDash);
            d3.select(this).append("circle").data([d.path[1]]).attr('cx', function (d) {
                return d[0];
            }).attr('cy', function (d) {
                return d[1];
            }).attr('fill', '#e67e22').attr('fill-opacity', 1).attr('r', 0).transition().attr('r', 1.5).delay(400);
        }

        d3.select(this).selectAll("g").data(d.children).enter().append("g").transition().delay(100).each("start", grow(weight - 0.03));
    };
}
function l(n, rules, str) {
    return n === 0 ? str : l(--n, rules, str.replace(/./g, function (c) {
        return rules[c] || c;
    }));
}
// http://bl.ocks.org/mbostock/5649592
function tweenDash() {
    var l = this.getTotalLength(),
        i = d3.interpolateString("0," + l, l + "," + l);
    return function (t) {
        return i(t);
    };
}