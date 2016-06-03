'use strict';

Math.seedrandom(0);

var colorCount = 20;
var alphaValue = 0.57;

var hueValues = new Array(colorCount);
var saturationValues = new Array(colorCount);
var brightnessValues = new Array(colorCount);

var Color = function Color(container) {
  this.width = container.node().getBoundingClientRect().width;
  this.height = container.node().getBoundingClientRect().height;
  console.log(this.height);

  this.wrapper = container.append('svg').attr('width', this.width).attr('height', this.height);
  for (var i = 0; i < colorCount; i++) {
    if (i % 2 === 0) {
      hueValues[i] = Math.random() * 360;
      saturationValues[i] = Math.random();
      brightnessValues[i] = Math.random();
    } else {
      hueValues[i] = 195;
      saturationValues[i] = 1;
      brightnessValues[i] = Math.random();
    }
  }
  this.render();
};

Color.prototype.render = function () {
  var width = this.width;
  var height = this.height;
  var data = prePareData();

  this.wrapper.selectAll('rect').data(data).enter().append('rect').attr('x', function (d) {
    return d.x;
  }).attr('width', function (d) {
    return d.w;
  }).attr('y', function (d) {
    return d.y;
  }).attr('height', function (d) {
    return d.h;
  }).attr('fill', function (d, i) {
    var index = i % colorCount;
    return d3.hsl(hueValues[index], saturationValues[index], brightnessValues[index]);
  }).attr('fill-opacity', alphaValue).on('click', function () {});

  function prePareData() {
    var rowCount = Math.floor(getRandom(5, 20));
    var rowHeight = height / rowCount;
    var data = [];
    var parts = [];
    //each line
    for (var i = rowCount; i >= 0; i--) {
      var partCount = i + 1;
      var sumPartsNow = 0;
      var sumPartsTotal = 0;

      for (var ii = 0; ii < partCount; ii++) {
        //sub or not?
        if (Math.random() < 0.075) {
          var fragments = Math.floor(getRandom(2, 20));
          partCount = partCount + fragments;
          for (var iii = 0; iii < fragments; iii++) {
            parts.push(getRandom(0, 2));
          }
        } else {
          parts.push(getRandom(2, 20));
        }
      }

      for (var ii = 0; ii < partCount; ii++) {
        sumPartsTotal += parts[ii];
      }

      for (var ii = 0; ii < parts.length; ii++) {
        sumPartsNow += parts[ii];
        var d = {
          x: d3.scale.linear().domain([0, sumPartsTotal]).range([0, width])(sumPartsNow) - d3.scale.linear().domain([0, sumPartsTotal]).range([0, width])(parts[ii]),
          y: rowHeight * i,
          w: d3.scale.linear().domain([0, sumPartsTotal]).range([0, width])(parts[ii]),
          h: rowHeight * 1.5
        };
        data.push(d);
      }
    }
    return data;
  }
};

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

var c = new Color(d3.select('body'));