#!/usr/bin/env node

var path = require('path');
var argv = require('optimist').argv;
var fs = require('fs');
var acorn = require('acorn');
var escodegen = require('escodegen');
var clone = require('clone');
var walk = require(path.join(path.dirname(require.resolve('acorn')), path.join('util', 'walk.js')));
var mutator = require('./mutator');

if ((typeof argv.input === 'undefined') || (typeof argv.output === 'undefined')) {
  var usage = 'use the \'--input\' argument to specify a file to mutate\n';
  usage += 'use the \'--output\' argument to specify output folder for mutants';

  console.log(usage);
  process.exit(-1);
}

try {
  fs.mkdirSync(argv.output);
} catch (e) {
  if (-1 == e.message.indexOf('EEXIST')) { 
    throw e 
  } 
}

var inputContents;

try {
  inputContents = fs.readFileSync(argv.input, 'utf8'); 
} catch (e) {
  if (e.code === 'ENOENT') {
    console.log('input file not found!');
    process.exit(-1);
  } else {
    throw e;
  }
}


// console.log('input:');
// console.log(inputContents);

var count = 0;

var ast = acorn.parse(inputContents);
var hasMutated = false;

walk.simple(ast, {
  Expression: function (node) {
    count += mutator.mutatables(node);
  }
});

console.log(count + ' mutatable nodes found');

var i = 0;
var ast = acorn.parse(inputContents);

walk.simple(ast, {
  Expression: function (node) {
    mutator.mutate(node, function () {
      i++;

      var mutant = escodegen.generate(ast);

      var zeroes = (new Array(((count.toString().length - i.toString().length)) + 1)).join("0")

      var outputPath = path.join(argv.output, 'mutant' + zeroes + i + '.js');
    
      console.log('Writing ' + outputPath);

      fs.writeFileSync(outputPath, mutant, 'utf8');
    })
  }
});

var mutant = escodegen.generate(ast);

var zeroes = (new Array(((count.toString().length - (i+1).toString().length)) + 1)).join("0")

var outputPath = path.join(argv.output, 'mutant' + zeroes + (i+1) + '.js');
fs.writeFileSync(outputPath, mutant, 'utf8');
