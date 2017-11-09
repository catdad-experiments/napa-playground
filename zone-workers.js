/* jshint node: true */

var napa = require('napajs');
var zone1 = napa.zone.create('zone1', { workers: 6 });

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

  zone1.execute(longWork).then(function () {
    console.log('done', i, 'in', Date.now() - start, 'ms');
  });
}

exec();
exec();
exec();
exec();
exec();
exec();

console.log('end of script');
