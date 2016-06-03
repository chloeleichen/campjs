'use strict';

var damping = 0.7;
var kSpeed = 3.0;
var minDistFactor = 2.5;
var nParticles = 2000;
var catSpeed = 2;
var nFrames = 6;

var imageWidth = 200;
var imageHeight = 150;

var width = 600;
var height = 450;

var imageScale = width / imageWidth;
var cats = [];

var particles = [];
var reference = void 0;

var medArea = width * height / nParticles;
var medRadius = Math.sqrt(medArea / Math.PI);
var minRadius = medRadius;
var maxRadius = medRadius * medRadius * 1;

var canvas = d3.select('body').append('canvas').attr('width', imageWidth).attr('height', imageHeight);

var svg = d3.select('#container').append('svg').attr('width', width).attr('height', height).append('g');

var context = canvas.node().getContext('2d');
var imageSrc = d3.range(0, nFrames).map(function (i) {
  return 'images/cats' + i + '.jpg';
});

function getImage(url) {
  return new Promise(function (resolve, reject) {
    var image = new Image();
    image.src = url;
    cats.push(image);
    image.onload = function () {
      resolve(url);
    };
    image.onerror = function () {
      reject(url);
    };
  });
}

var getImagePromises = imageSrc.map(function (url) {
  return getImage(url);
});

Promise.all(getImagePromises).then(function () {
  start();
}).catch(function (error) {
  console.log(error);
});

function start() {
  cats.forEach(function (cat, i) {
    context.drawImage(cat, 0, 0);
    cats[i] = context.getImageData(0, 0, imageWidth, imageHeight);
    cats[i].id = i;
  });
  for (var i = 0; i < nParticles; ++i) {
    var particle = new Particle(Math.random() * width, Math.random() * height);
    particles.push(particle);
  }
  svg.selectAll('cricle').data(particles).enter().append('circle').attr('cx', function (d) {
    return d.x;
  }).attr('cy', function (d) {
    return d.y;
  }).attr('r', medRadius / 2);
  reference = cats[0];
  update();
}

function update() {
  d3.timer(function (t) {
    doPhysics(t);
    svg.selectAll('circle').data(particles).attr('cx', function (d) {
      return d.x;
    }).attr('cy', function (d) {
      return d.y;
    }).style('fill', function (d) {
      return d3.hsl(d3.scale.linear().domain([minRadius, maxRadius]).range([0, 360])(d.rad), 0.8, d3.scale.linear().domain([minRadius, maxRadius]).range([0, 1])(d.rad));
    });
  });
}

function doPhysics(t) {
  var frameCount = t;
  if (frameCount % catSpeed === 0) {
    reference = cats[frameCount / catSpeed % nFrames];
  }
  for (var i = 0; i < nParticles; ++i) {
    var px = parseInt(particles[i].x / imageScale, 10);
    var py = parseInt(particles[i].y / imageScale, 10);
    if (px >= 0 && px < reference.width && py >= 0 && py < reference.height) {
      // get red color
      var v = reference.data[(imageWidth * py + px) * 4];
      particles[i].rad = d3.scale.linear().domain([0, 1]).range([minRadius, maxRadius])(v / 255);
    }
  }
  for (var _i = 0; _i < nParticles; ++_i) {
    var p = particles[_i];
    p.fx = p.fy = p.wt = 0;
    p.vx *= damping;
    p.vy *= damping;
  }

  // Particle -> particle interactions
  for (var _i2 = 0; _i2 < nParticles - 1; ++_i2) {
    var _p = particles[_i2];
    for (var j = _i2 + 1; j < nParticles; ++j) {
      var pj = particles[j];
      if (_i2 === j || Math.abs(pj.x - _p.x) > _p.rad * minDistFactor || Math.abs(pj.y - _p.y) > _p.rad * minDistFactor) {
        continue;
      }

      var dx = _p.x - pj.x;
      var dy = _p.y - pj.y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      var maxDist = _p.rad + pj.rad;
      var diff = maxDist - distance;
      if (diff > 0) {
        var scale = diff / maxDist;
        scale = Math.pow(scale, 2);
        _p.wt += scale;
        pj.wt += scale;
        scale = scale * kSpeed / distance;
        _p.fx += dx * scale;
        _p.fy += dy * scale;
        pj.fx -= dx * scale;
        pj.fy -= dy * scale;
      }
    }
  }

  for (var _i3 = 0; _i3 < nParticles; ++_i3) {
    var _p2 = particles[_i3];
    // keep within edges
    var _dx = void 0;
    var _dy = void 0;
    var _distance = void 0;
    var _scale = void 0;
    var _diff = void 0;
    var _maxDist = _p2.rad;

    // left edge
    _distance = _dx = _p2.x - 0;
    _dy = 0;
    _diff = _maxDist - _distance;
    if (_diff > 0) {
      _scale = _diff / _maxDist;
      _scale = _scale * _scale;
      _p2.wt += _scale;
      _scale = _scale * kSpeed / _distance;
      _p2.fx += _dx * _scale;
      _p2.fy += _dy * _scale;
    }
    // right edge
    _dx = _p2.x - width;
    _dy = 0;
    _distance = -_dx;
    _diff = _maxDist - _distance;
    if (_diff > 0) {
      _scale = _diff / _maxDist;
      _scale = _scale * _scale;
      _p2.wt += _scale;
      _scale = _scale * kSpeed / _distance;
      _p2.fx += _dx * _scale;
      _p2.fy += _dy * _scale;
    }
    // top edge
    _distance = _dy = _p2.y - 0;
    _dx = 0;
    _diff = _maxDist - _distance;
    if (_diff > 0) {
      _scale = _diff / _maxDist;
      _scale = _scale * _scale;
      _p2.wt += _scale;
      _scale = _scale * kSpeed / _distance;
      _p2.fx += _dx * _scale;
      _p2.fy += _dy * _scale;
    }
    // bot edge
    _dy = _p2.y - height;
    _dx = 0;
    _distance = -_dy;
    _diff = _maxDist - _distance;
    if (_diff > 0) {
      _scale = _diff / _maxDist;
      _scale = _scale * _scale;
      _p2.wt += _scale;
      _scale = _scale * kSpeed / _distance;

      _p2.fx += _dx * _scale;
      _p2.fy += _dy * _scale;
    }
    if (_p2.wt > 0) {
      _p2.vx += _p2.fx / _p2.wt;
      _p2.vy += _p2.fy / _p2.wt;
    }
    _p2.x += _p2.vx;
    _p2.y += _p2.vy;
  }
}

var Particle = function Particle(_x, _y) {
  return {
    vx: 0,
    vy: 0,
    x: _x,
    y: _y,
    rad: 1,
    wt: 0,
    fx: 0,
    fy: 0
  };
};
