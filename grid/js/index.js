'use strict';

// D3 version of http://www.openprocessing.org/sketch/157801

var width = 500;
var height = 500;
var n = 100;
var data = [];

var svg = d3.select('#container').append('svg').attr('width', width).attr('height', height).append('g').attr("transform", 'translate(' + width / 2 + ', ' + height / 2 + ')');

for (var x = -n; x < n; x += n / 10) {
  for (var y = -n; y <= n; y += n / 10) {
    var d = (Math.pow(x, 2) + Math.pow(y, 2)) / 2;
    data.push({ x: x, y: y, d: d });
  }
}

svg.selectAll('circle').data(data).enter().append('circle').attr('cx', function (d) {
  return d.x;
}).attr('cy', function (d) {
  return d.y;
}).attr('r', 5).attr('fill', 'rgb(0, 150, 255)');

function update(t) {
  svg.selectAll('circle').attr("transform", function (d) {
    return 'translate(' + d.x + ', ' + d.y + ') rotate(' + radians(d.d + t) + ')';
  });
}

d3.timer(update);

function radians(degree) {
  return degree * Math.PI / 180;
}