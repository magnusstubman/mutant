var clone = require('clone');
var escodegen = require('escodegen');

var relationalOperators = ['==', '!=', '===', '!==', '>', '>=', '<', '<='];

var mutations;
var skip;
var calls;
var index;
var hasMutated;

exports.clear = function () {
  mutations = 0;
  calls = 0;
  skip = 0;
  index = 0;
  hasMutated = false;
};
exports.clear();

exports.next = function () {
  calls = 0;
  hasMutated = false;
};

exports.mutate = function (node) {
  calls++;

  if ((calls <= skip) || (hasMutated)) {
    return;
  }

  switch(getMutatable(node)) {
    case 'relational':
      mutations++;
      return mutateRelational(node);
  }  
};

exports.mutatables = function (node) {
  switch(getMutatable(node)) {
    case 'relational':
      return mutateMap[node.operator].length;
  }

  return 0;
};

var mutateRelational = function (node) {
  if (index === mutateMap[node.operator].length) {
    skip = calls;
    index = 0;
  } else {

    var str = mutations + " Mutating: " + escodegen.generate(node);

    node.operator = mutateMap[node.operator][index];
    hasMutated = true;
    index++;

    str += " to: " + escodegen.generate(node);
    console.log(str);
  }
};

var isRelationalExpression = function (node) {
  if (!node.operator) {
    return false;
  }

  if (relationalOperators.indexOf(node.operator) !== -1) {
    return true;
  }

  return false;
};

var getMutatable = function (node) {
  if (isRelationalExpression(node)) {
    return 'relational';
  } 

  return '';
};

// helpers
var cloneExcept = function (object, except) {
  var ret = clone(object, false);
  ret.splice(ret.indexOf(except),1);

  return ret;
};

var mutateMap = {};

for (var i = 0; i < relationalOperators.length; i++) {
  mutateMap[relationalOperators[i]] = 
    cloneExcept(relationalOperators, relationalOperators[i]);
}