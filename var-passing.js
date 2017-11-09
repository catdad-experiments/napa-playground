/* jshint node: true */

var argv = require('yargs').argv;
var iterations = argv.iterations || 15;
var size = argv.size || 1000;
var ratio = argv.ratio || 3;

var napa = require('napajs');
var zone = napa.zone.create('zone1', { workers: parseInt(iterations/ratio) });

function getBigJsonString(c) {
  var obj = {
    str: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mauris risus, volutpat sed eros in, consectetur rhoncus sapien. Sed faucibus ultrices tincidunt.',
    arr: [123.45, 678.91, 234.56, 789.01]
  };

  while (obj.str.length < c) {
    obj.str += ' ' + obj.str;
  }

  while (obj.arr.length < c) {
    obj.arr = obj.arr.concat(obj.arr);
  }

  return JSON.stringify(obj);
}

var startGen = Date.now();
var largeJson = getBigJsonString(size);
console.log('JSON string of length %s created in %sms', largeJson.length, Date.now() - startGen, 'ms');

function parse(str) {
  return JSON.parse(str);
}

function napaParse(i) {
  var start = Date.now();

  zone.execute(parse, [largeJson]).then(function (result) {
    // make sure to get the value, so that the result actually gets marshalled
    var val = result.value;
    console.log('%s done in %sms', i, Date.now() - start);
  });
}

function normalParse(i) {
  var start = Date.now();

  // we have a result, easy as that
  var result = parse(largeJson);

  console.log('%s done in %sms', i, Date.now() - start);
}

var normalCount = iterations;
while (normalCount--) {
  normalParse(normalCount + ' normal parse');
}

console.log('----------------------------------');

var napaCount = iterations;
while (napaCount--) {
  napaParse(napaCount + ' napa parse');
}
