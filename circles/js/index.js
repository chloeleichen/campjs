"use strict";

// http://algorithmicbotany.org/papers/abop/abop-ch4.pdf
var width = window.innerWidth;
var height = window.innerHeight;

// number of circles
var n = 20;
// number of floret in each circle
var m = 20;

// the divergence angle between the position vectors of any two successive florets is constant
var ALPHA = 137.5;

var alpha = ALPHA * Math.PI / 180;

var svg = d3.select("#container").append("svg").attr("width", width).attr("height", height).append("g").attr('transform', "translate(" + width / 2 + "," + height / 2 + ")");

var data = [];

for (var r = 1; r <= n; r++) {
    for (var theta = 0; theta < Math.PI * 2; theta += 2 * Math.PI / m) {
        data.push({ r: r,
            cx: r * r * Math.cos(theta + alpha * r),
            cy: r * r * Math.sin(theta + alpha * r)
        });
    }
}

var colorScale = d3.scale.linear().range([0, data.length]).domain([0, 180]);

var florets = svg.selectAll('circle').data(data).enter().append('circle').attr('cx', function (d) {
    return d.cx;
}).attr('cy', function (d) {
    return d.cy;
}).attr('r', 0.1).attr('fill', function (d, i) {
    return d3.hsl(colorScale(i), 0.5, 0.7);
}).attr("fill-opacity", 0.6);

d3.timer(function (t) {
    florets.attr("r", function (d, i) {
        return (Math.sin(i * t / 200000) + 1) * d.r;
    });
    svg.attr('transform', "translate(" + width / 2 + "," + height / 2 + ") rotate(" + t / 100 % 360 + ")");
});