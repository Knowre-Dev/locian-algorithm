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
  // [ total variable count, array of non variable terms]
  const [numCount, other_num] = updateVariableCount({ tree: num, map: varMap, increment: 1 });
  if (numCount === 0) {
    // no variables in num
    return [operator, num, den];
  }

  // updateVariableCount for den, returns
  // [ total variable count, array of non variable terms]
  const [denCount, other_den] = updateVariableCount({ tree: den, map: varMap, increment: -1 });
  if (denCount === 0) {
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
      newNumerators.push(convertToMulchain(key, value));
      // if power < 0 add to denominator, make power positive again
    } else if (value < 0) {
      newDenominators.push(convertToMulchain(key, -value));
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

function form_mulchain(terms, key) {
  return terms.length === 1
    ? terms[0][1]
    : key === 0
      ? mulCommutative(['mulchain', ...terms]) // 맨앞에만 non variable (3abc)
      : sub_mulCommutative(['mulchain', ...terms]); /// 그외 (abc)
}

function updateVariableCount({ tree, map, increment }) {
  let var_tree = []; // variable
  let other_tree = []; // non variable
  let key_tree = 0; // 분자중kvraiable 아닌것이 제일 앞에만 있는지 확인하기 위함 (최종적으로  num_key === 1 인지 확인) (3ab)
  const [operator, ...operand] = tree;
  if (operator === 'variable') {
    // varialle  (a)
    var_tree = [['power', tree, ['natural', '1']]]; // a => a^1 (나중 계산을 위해)
  } else if (operator === 'power' && operand[0][0] === 'variable') {
    // power (a^2, b^2, c^2)
    var_tree = [tree];
  } else if (operator === 'mulchain') {
    // mulchain (abc, ab^2(ac))
    const vars = new Map(); // variable 위치 map
    let key_var = 0; // variable  위치
    operand.forEach((term, key) => {
      if (term[0] === 'mul' && term[1][0] === 'variable') {
        // variable (a, b, c)
        if (typeof vars.get(term[1][1]) === 'undefined') {
          // 세로운 variable
          vars.set(term[1][1], key_var);
          var_tree = [...var_tree, ['power', term[1], ['natural', '1']]]; // a => a^1
          key_var++;
        } else {
          // 기존  variable
          const key_1 = vars.get(term[1][1]);
          var_tree[key_1][2][1] = (
            parseInt(var_tree[key_1][2][1]) + 1
          ).toString(); // a^2a => a^3
        }
      } else if (
        term[0] === 'mul' &&
        term[1][0] === 'power' &&
        term[1][1][0] === 'variable'
      ) {
        // power a^2, b^2, c^2
        var_tree = [...var_tree, term[1]];
        key_var++;
      } else {
        // non variable (ab^2(ac)(c+d) => ac, c+d)
        key_tree = key;
        other_tree = [...other_tree, term];
      }
    });
  }
  return [var_tree, other_tree, key_tree];
}
