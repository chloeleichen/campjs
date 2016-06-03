'use strict';

var width = 600;
var height = 600;
var frequency = .001;
var noiseInterval = Math.PI;
var n = 50;

var svg = d3.select('#container').append('svg').attr('width', width).attr('height', height).append('g');

var xScale = d3.scale.linear().domain([-1, 1]).range([0, width]);

var yScale = d3.scale.linear().domain([-1, 1]).range([0, height]);

var colorScale = d3.scale.linear().domain([0, n]).range([100, 360]);

noise.seed(Math.random());

var createAgents = function createAgents(t) {
  for (var i = 0; i < n; i++) {
    var x = xScale(noise.perlin2(i * noiseInterval + t / 5 * frequency, i * noiseInterval + t / 5 * frequency));
    var y = yScale(noise.perlin2(i * noiseInterval + 1 + t / 5 * frequency, i * noiseInterval + 1 + t / 5 * frequency));

    svg.append('circle').attr('r', 5).attr('cx', x).attr('cy', y).attr('fill-opacity', 0.8).attr('fill', d3.hsl(colorScale(i), 0.5, 0.5)).transition().delay(50).attr('fill-opacity', 0).attr('r', 0).each('end', function () {
      d3.select(this).remove();
    });
  }
};
d3.timer(createAgents);