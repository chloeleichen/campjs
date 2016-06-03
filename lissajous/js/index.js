"use strict";

var width = 400;
var height = 400;
var range = d3.range(-40 * Math.PI, 40 * Math.PI, 0.02);

var svg = d3.select("#container").append("svg").attr("width", width).attr("height", height).style("background", "#000").append("g").attr("transform", "translate(" + width / 2 + ", " + height / 2 + ")");
var spiral = svg.append("path").attr("fill", "none").attr("stroke", "#fff").attr("stroke-opacity", 1).attr("stroke-width", 0.5);

// http://goatlink.deviantart.com/art/lissajous-curves-338721857
function updateData(t) {
  var data = new Array(range.length);
  for (var i = 0; i < data.length; i++) {
    var p = range[i];
    data[i] = {
      x: 0.18 * width * (Math.sin(4.01 * p + t / 2000) + Math.sin(3 * p + t / 2000)),
      y: 0.18 * height * (Math.sin(2.005 * p + t / 4000) + Math.sin(1.01 * p + t / 2000))
    };
  }
  return data;
}

var line = d3.svg.line().x(function (d) {
  return d.x;
}).y(function (d) {
  return d.y;
});

d3.timer(function (t) {
  spiral.datum(updateData(t)).attr('d', line);
});