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

  // get new numerator and denominator variables (ab/a^2c => b/c^2)
  const var_num_length = var_num.length;
  const var_den_length = var_den.length;
  for (let i = 0; i < var_num_length; i++) {
    for (let j = 0; j < var_den_length; j++) {
      if (var_den[j]) {
        if (var_num[i][1][1] === var_den[j][1][1]) {
          // 분모 분자 variable  일치
          const exp = var_num[i][2][1] - var_den[j][2][1]; //  a^x / a^y => x - y
          if (exp > 0) {
            // x > y
            var_num[i][2][1] = exp.toString();
            var_den[j] = null;
          } else if (exp < 0) {
            // x < y
            var_num[i] = null;
            var_den[j][2][1] = (-exp).toString();
          } else {
            // x === y
            var_num[i] = null;
            var_den[j] = null;
          }
          break;
        }
      }
    }
  }
  const new_var_num = simp_exp(var_num);
  const new_var_den = simp_exp(var_den);
  // form new numerator and denominator
  let new_num = [...new_var_num, ...other_num]; // variable + non variable
  const new_den = [...new_var_den, ...other_den]; // variable + non variable
  new_num.sort();
  new_den.sort();
  new_num =
    new_num.length === 0 ? ['natural', '1'] : form_mulchain(new_num, key_num);
  return new_den.length === 0
    ? new_num
    : [operator, new_num, form_mulchain(new_den, key_den)];
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
