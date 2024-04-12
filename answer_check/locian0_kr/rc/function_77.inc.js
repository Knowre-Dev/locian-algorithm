import { mulCommutative } from '../rc/function_46.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

/* tree (math tree)
2 : ['natural', '2']
a : ['variable', 'a']
a / 2 : ['fraction', ['variable', 'a'], ['natural', '2']]
a^2 : ['power', ['variable', 'a'], ['natural', '2']]
2a : ['mulchain', ['mul', ['natural', '2']], ['mul', ['variable', '2']]]
*/

export function fracSimpVar(tree) {
  if (!Array.isArray(tree)) {
    // arry 아닌 경우
    return tree;
  }

  const [operator, ...operand] = tree;
  if (operator !== 'fraction') {
    // fraction 아닌 경우
    return [operator, ...operand.map((term) => fracSimpVar(term))];
  }

  const num = fracSimpVar(operand[0]);
  const den = fracSimpVar(operand[1]);
  // variable 수 세는 맵 { "a": -1, "b": 1, "c": 0 }
  let varMap = new Map();
  // updateVariableCount for num, returns
  // [ if variableExists, array of non variable terms]
  const [hasNumVar, other_num] = updateVariableCount({ tree: num, map: varMap, increment: 1 });
  if (!hasNumVar) {
    // no variables in num
    return [operator, num, den];
  }

  // updateVariableCount for den, returns
  // [ if variableExists, array of non variable terms]
  const [hasDenVar, other_den] = updateVariableCount({ tree: den, map: varMap, increment: -1 });
  if (!hasDenVar) {
    // no variables in den
    return [operator, num, den];
  }
  // fill new numerator and denominator with other terms first
  let newNumerators = [...other_num]
  let newDenominators = [...other_den]

  // variable 맵 사용해서 변수 텀 추가
  varMap.forEach((value, key) => {
    // if power > 0 add no numerator
    if (value > 0) {
      newNumerators.push(convertToMulTerm(key, value));
      // if power < 0 add to denominator, make power positive again
    } else if (value < 0) {
      newDenominators.push(convertToMulTerm(key, -value));
    }
    // Entries with value 0 are ignored
  });

  newNumerators.sort(); // b2ac -> 2abc
  newDenominators.sort();
  newNumerators = newNumerators.length === 0
    ? ['natural', '1']
    : form_mulchain(newNumerators);

  return newDenominators.length === 0
    ? newNumerators
    : [operator, newNumerators, form_mulchain(newDenominators)];
}

// ['mul', operand] 만들기 (variable or power) 설정
function convertToMulTerm(key, value) {
  const val = value === 1
    ? ['mul', ['variable', key]]
    : ['mul', ['power', ['variable', key], ['natural', value.toString()]]];
  return val
}

function form_mulchain(terms, key) {
  return terms.length === 1
    ? terms[0][1]
    : key === 0
      ? mulCommutative(['mulchain', ...terms]) // 맨앞에만 non variable (3abc)
      : sub_mulCommutative(['mulchain', ...terms]); /// 그외 (abc)
}
function incrementMap(map, operand, increment) {
  const [base, exponent] = operand;
  const [, variable] = base;
  const [, stringNum] = exponent;
  const num = parseInt(stringNum);
  const incrementTotal = increment*num
  if (map.has(variable)) {
    map.set(variable, map.get(variable) + incrementTotal)
  } else {
    map.set(variable, incrementTotal);
  }
}

function updateVariableCount({ tree, map, increment }) {
  let hasVar = false;
  let other_tree = []; // non variable
  const [operator, ...operand] = tree;
  if (operator === 'variable') { // varialle  (a)
    hasVar = true
    // power operand 받아서 맵 설정 또는 증가
    // ex: [["variable", "a"], ["natural", "n"]] -> map {"a": "n"}
    // single variable pass in a^1
    incrementMap(map, [tree, ['natural', '1']], increment); //
  } else if (operator === 'power' && operand[0][0] === 'variable') {
    hasVar = true;
    // increment 'a' count by exponent in power operand
    incrementMap(map, operand, increment);
  } else if (operator === 'mulchain') {
    // mulchain (abc, ab^2(ac))
    operand.forEach(term => {
      if (term[0] === 'mul' && term[1][0] === 'variable') {
        hasVar = true;
        // variable (a, b, c)
        // 'a' pass in a^1
        incrementMap(map, [term[1], ['natural', '1']], increment);
      } else if (
        term[0] === 'mul' &&
        term[1][0] === 'power' &&
        term[1][1][0] === 'variable'
      ) {
        // power a^2, b^2, c^2
        hasVar = true;
        incrementMap(map, [term[1][1], term[1][2]], increment);
      } else {
        // non variable (ab^2(ac)(c+d) => ac, c+d)
        other_tree.push(term)
      }
    });
  }
  return [hasVar, other_tree];
}
