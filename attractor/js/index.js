"use strict";

var xCount = 401;
var yCount = 41;
var gridSize = 400;
var width = 700;
var height = 700;

var radius = 150;
var ramp = 1;

var svg = d3.select("#container").append("svg").attr("width", width).attr("height", height).append('g');

var data = d3.range(0, yCount).map(function (y) {
  return d3.range(0, xCount).map(function (x) {
    return {
      x: x * (gridSize / (xCount - 1)) + (width - gridSize) / 2,
      y: gridSize / (yCount - 1) * y + (height - gridSize) / 2,
      velocity: { x: 0, y: 0 }
    };
  });
});

var line = d3.svg.line().x(function (d) {
  return d.x + d.velocity.x;
}).y(function (d) {
  return d.y + d.velocity.y;
});

var grids = svg.selectAll('g').data(data).enter().append('g');

var nodes = grids.append('path').attr('d', line).style("stroke", '#000');

var Attractor = function Attractor() {};

Attractor.prototype.attract = function (node, _x, _y, _strength) {
  var x = _x;
  var y = _y;
  var strength = _strength;
  var dx = x - node.x;
  var dy = y - node.y;

  var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

  if (d > 0 && d < radius) {
    var s = Math.pow(d / radius, 1 / ramp);
    var f = s * 9 * strength * (1 / (s + 1) + (s - 3) / 4) / d;
    node.velocity.x += dy * f;
    node.velocity.y -= dx * f;
  }
};

var myAttractor = new Attractor();

function update(t) {
  var x = width / 2;
  var y = height / 2;
  var strength = Math.sin(t / 2000) * 10;
  for (var i = 0; i < yCount; i++) {
    for (var j = 0; j < xCount; j++) {
      myAttractor.attract(data[i][j], x, y, strength);
    }
  }
  grids.data(data).selectAll('path').attr('d', line);
}

d3.timer(update);