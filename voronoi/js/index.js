'use strict';

var width = window.innerWidth;
var height = window.innerHeight;
var n = width * height / 3000;
var r = 5;
var color = d3.scale.quantize().domain([10000, 7250]).range(['#ea7b49', '#f39841', '#fcb639', '#baba55', '#79be73', '#32b0b4', '#4790c9', '#5261c9', '#7b5ab0', '#a45396', '#cd4c7d', '#f54563']);

function polygon(d) {
  return "M" + d.join("L") + "Z";
}

var data = d3.range(n).map(function (i) {
  var angle = r * (i + 10);
  return {
    x: angle * Math.cos(angle) + width / 2,
    y: angle * Math.sin(angle) + height / 2
  };
});

var voronoi = d3.geom.voronoi().x(function (d) {
  return d.x;
}).y(function (d) {
  return d.y;
});

var svg = d3.select('#container').append('svg').attr('width', width).attr('height', height);

var force = d3.layout.force().charge(-300).size([width, height]).on("tick", update);

force.nodes(data).start();

var circle = svg.selectAll('circle');
var path = svg.selectAll('path');

function update(e) {
  path = path.data(voronoi(data));
  path.attr('d', polygon);
  path.enter().append('path').style("fill", function (d) {
    return color(d3.geom.polygon(d).area());
  });

  path.on('mousemove', function (d, i) {
    data[i].x = data[i].x + Math.sin(i);
    data[i].y = data[i].y + Math.cos(i);
    force.nodes(data).start();
    path.on("mousemove", null);
  });

  path.exit().remove();

  circle = circle.data(data);
  circle.enter().append('circle').attr('r', 5);

  circle.attr('cx', function (d) {
    return d.x;
  }).attr('cy', function (d) {
    return d.y;
  }).attr('fill', '#fff').attr('fill-opacity', 0.9);

  circle.exit().remove();
}