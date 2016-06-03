'use strict';

var r = 200;
var color = d3.scale.linear().domain([0, 6]).range([0, 360]);

var svg = d3.select('body').append('svg').attr('width', window.innerWidth).attr('height', window.innerHeight);

var keys = ["C", "D", "E", "F", "G", "A", "B"];
var frequency = keys.map(function (d, i) {
    return { frequency: 440 * Math.pow(2, (i - 7) / 12),
        color: color(i) };
});

var AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.oAudioContext;
if (!AudioContext) {
    console.error("AudioContext not supported");
};
if (!OscillatorNode.prototype.start) OscillatorNode.prototype.start = OscillatorNode.prototype.noteOn;
if (!OscillatorNode.prototype.stop) OscillatorNode.prototype.stop = OscillatorNode.prototype.noteOff;
var context = new AudioContext();

svg.on("click", function () {
    var f = getRandomFrequency();
    addSound(f.frequency);
    addCircle(d3.mouse, f.color);
});

function addSound(frequency) {
    var now = context.currentTime;
    var oscillator = context.createOscillator();
    var gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.value = frequency;
    gain.gain.linearRampToValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(.3, now + 0.5);
    gain.gain.linearRampToValueAtTime(0.6, now + 1);
    gain.gain.linearRampToValueAtTime(0.5, now + 1.5);
    gain.gain.linearRampToValueAtTime(0, now + 2);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(0);
    setTimeout(function () {
        oscillator.stop();
    }, 8000);
}

function addCircle(mouse, color) {
    for (var i = 1; i < 4; ++i) {
        var position = mouse(svg.node());
        var circle = svg.append("circle").attr('cx', position[0]).attr('cy', position[1]).attr('r', 0).style({ 'stroke-width': 20 / i,
            'stroke': d3.hsl(color, 0.8, 0.8), 'fill-opacity': 0 }).transition().delay(Math.pow(i, 2.5) * 50).duration(1000).ease('quad-in').attr('r', Math.random() * r).style('stroke-opacity', 0.3).each('end', function () {
            // d3.select(this).remove();
        });
    }
}

function getRandomFrequency() {
    return frequency[parseInt(Math.random() * (keys.length - 1))];
}