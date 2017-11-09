/* jshint node: true */

var util = require('util');

var napa = require('napajs');

var argv = require('yargs').argv;

var zoneName = argv.zone || 'napa-zone';
var zoneWorkers = argv.workers || 2;
var runCount = argv.count || 6;

var zone = napa.zone.node;

if (zoneName === 'node') {
  zoneWorkers = '?';
} else {
  zone = napa.zone.create(zoneName, { workers: zoneWorkers });
}

console.log('running %s zone with %s workers', zoneName, zoneWorkers);

var count = 0;

function longWork() {
  var sleep = 1000;
  var now = Date.now();
  var target = new Date(now + sleep);

  while (new Date(now) < target) {
    now = Date.now();
  }
}

function exec() {
  var i = count++;
  var start = Date.now();

  console.log('starting', i);

  zone.execute(longWork).then(function () {
    console.log('done', i, 'in', Date.now() - start, 'ms');
  });
}

while (runCount--) {
  exec();
}

console.log('end of script');
