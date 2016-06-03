'use strict';

var lineLength = 0;
var angle = 0;
var angleSpeed = 1;
var size = 1;

// d3 4.0 doesn't have scale yet
var hue = function hue(value) {
  var high = Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(window.innerHeight, 2));
  var low = 360;
  return low * value / high;
};

var svg = d3.select('body').append('svg').attr('height', window.innerHeight).attr('width', window.innerWidth).call(d3.drag(dragStarted).container(function () {
  return this;
}).subject(function () {
  var p = [d3.event.x, d3.event.y];return [p, p];
}));

function dragStarted() {
  var d = d3.event.subject;
  var container = svg.append('g').datum(d);
  var x0 = d3.event.x;
  var y0 = d3.event.y;

  d3.event.on("drag", function () {
    var x = d3.event.x;
    var y = d3.event.y;
    var dx = x - x0;
    var dy = y - y0;

    var distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    container.append('line').attr("transform", 'translate(' + x + ', ' + y + ') rotate(' + angle + ')').attr('x1', 0).attr('y1', 0).attr('x2', dx * size + 3).attr('y2', dy * size + 3).style('stroke', d3.hsl(hue(distance), 0.8, 0.5));
    angle += angleSpeed;
  });
}

d3.select('#clear').on('click', function () {
  d3.selectAll('g').remove();
});

d3.select('#range').on('change', function () {
  size = d3.event.target.value / 100;
});