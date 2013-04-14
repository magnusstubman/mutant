var clone = require('clone');

var relationalOperators = ['==', '!=', '===', '!==', '>', '>=', '<', '<='];

var mutations = 0;

exports.mutate = function (node, callback) {
  switch(getMutatable(node)) {
    case 'relational':
      mutateRelational(node, callback);
      break;
  }  
};

exports.mutatables = function (node) {
  switch(getMutatable(node)) {
    case 'relational':
      return mutateMap[node.operator].length;
  }

  return 0;
};

var mutateRelational = function (node, callback) {
  var original = node.operator;

  for (var i = 0; i < mutateMap[node.operator].length; i++) {
    mutations++;
    node.operator = mutateMap[node.operator][i];
    callback();
    node.operator = original;
  }
};

var isRelationalExpression = function (node) {

  if (!node.operator) {
    return false;
  }

  if (node.type !== 'BinaryExpression') {
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