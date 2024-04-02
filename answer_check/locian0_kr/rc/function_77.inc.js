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
    if (!Array.isArray(tree)) { // arry 아닌 경우
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') { // fraction 아닌 경우
        return [operator, ...operand.map(term => fracSimpVar(term))];
    }

    const num = fracSimpVar(operand[0]);
    const den = fracSimpVar(operand[1]);

    // get the variables in the numerator
    const [var_num, other_num, key_num] = term_info(num);
    if (var_num.length === 0) { // no variables in num
        return [operator, num, den];
    }

    // get the variables in the denominator
    const [var_den, other_den, key_den] = term_info(den);
    if (var_den.length === 0) { // no variables in den
        return [operator, num, den];
    }

    // get new numerator and denominator variables (ab/a^2c => b/c^2)
    const var_num_length = var_num.length;
    const var_den_length = var_den.length;
    for (let i = 0; i < var_num_length; i++) {
        for (let j = 0; j < var_den_length; j++) {
            if (var_den[j]) {
                if (var_num[i][1][1] === var_den[j][1][1]) { // 분모 분자 variable  일치
                    const exp = var_num[i][2][1] - var_den[j][2][1]; //  a^x / a^y => x - y
                    if (exp > 0) { // x > y
                        var_num[i][2][1] = exp.toString();
                        var_den[j] = null;
                    } else if (exp < 0) { // x < y
                        var_num[i] = null;
                        var_den[j][2][1] = (-exp).toString();
                    } else { // x === y
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
    new_num = new_num.length === 0
        ? ['natural', '1']
        : form_mulchain(new_num, key_num);
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

function simp_exp(terms) { // a^1b^2 => ab^2
    let terms_simp = [];
    terms.forEach(term => {
        if (term) {
            const new_n = term[2][1] === '1'
                ? ['mul', term[1]] // exponent === 1
                : ['mul', term]; /// expoient !== 1
                terms_simp = [...terms_simp, new_n];
        }
    });
    return terms_simp;
}

function term_info(tree) {
    let var_tree = []; // variable
    let other_tree = []; // non variable
    let key_tree = 0; // 분자중 vraiable 아닌것이 제일 앞에만 있는지 확인하기 위함 (최종적으로  num_key === 0 인지 확인) (3ab)
    const [operator, ...operand] = tree;
    if (operator === 'variable') { // varialle  (a)
        var_tree = [['power', tree, ['natural', '1']]];// a => a^1 (나중 계산을 위해)
    } else if (operator === 'power' && operand[0][0] === 'variable') { // power (a^2, b^2, c^2)
        var_tree = [tree];
    } else if (operator === 'mulchain') { // mulchain (abc, ab^2(ac))
        const vars = new Map();// variable 위치 map
        let key_var = 0; // variable  위치
        operand.forEach((term, key) => {
            if (term[0] === 'mul' && term[1][0] === 'variable') { // variable (a, b, c)
                if (typeof vars.get(term[1][1]) === 'undefined') { // 세로운 variable
                    vars.set(term[1][1], key_var);
                    var_tree = [...var_tree, ['power', term[1], ['natural', '1']]]; // a => a^1
                    key_var++;
                } else { // 기존  variable
                    const key_1 = vars.get(term[1][1]);
                    var_tree[key_1][2][1] = (parseInt(var_tree[key_1][2][1]) + 1).toString(); // a^2a => a^3
                }
            } else if (term[0] === 'mul' && term[1][0] === 'power' && term[1][1][0] === 'variable') { // power a^2, b^2, c^2
                var_tree = [...var_tree, term[1]];
                key_var++;
            } else { // non variable (ab^2(ac)(c+d) => ac, c+d)
                key_tree = key;
                other_tree = [...other_tree, term];
            }
        });
    }
    return [var_tree, other_tree, key_tree];
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\frac{3ab^2a}{b(a+b)}';
const tree_1 = LatexToTree(latex_1);
const tree_11 = fracSimpVar(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = 'aa';
const tree_1 = LatexToTree(latex_1);
const tree_11 = term_info(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
/*
export function fracSimpVar_old(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    if (operator !== 'fraction') {
        return [operator, ...operand.map(term => fracSimpVar(term))];
    }

    const num = fracSimpVar(operand[0]);
    const den = fracSimpVar(operand[1]);

    // get the variables in the numerator
    let varNum = [];
    let narrNum = [];
    let num_key = 0;
    const [operator_num, ...operand_num] = num;
    if (operator_num === 'variable') {
        varNum = [['power', num, ['natural', '1']]];
    } else if (operator_num === 'power' && operand_num[0][0] === 'variable') {
        varNum = [num];
    } else if (operator_num === 'mulchain') {
        const vars = new Map();
        let key_var = 0;
        operand_num.forEach((term, key) => {
            if (term[0] === 'mul' && term[1][0] === 'variable') {
                if (!vars.get(term[1][1])) {
                    vars.set(term[1][1], key_var);
                    varNum = [...varNum, ['power', term[1], ['natural', '1']]];
                } else {
                    const key_1 = vars.get(term[1][1]);
                    varNum[key_1][2][1] = (varNum[key_1][2][1] + 1).toString();
                }
                key_var++
            } else if (term[0] === 'mul' && term[1][0] === 'power' && term[1][1][0] === 'variable') {
                varNum = [...varNum, term[1]];
                key_var++
            } else {
                num_key = key;
                narrNum = [...narrNum, term];
            }
        });
    }
    if (varNum.length === 0) { // no variables in num
        return [operator, num, den];
    }
    // get the variables in the denominator
    let varDen = [];
    let narrDen = [];
    let den_key = 0;
    const [operator_den, ...operand_den] = den
    if (operator_den === 'variable') {
        varDen = [['power', den, ['natural', '1']]];
    } else if (operator_den === 'power' && operand_den[0][0] === 'variable') {
        varDen = [den];
    } else if (operator_den === 'mulchain') {
        const vars = new Map();
        let key_var = 0;
        operand_den.forEach((term, key) => {
            if (term[0] === 'mul' && term[1][0] === 'variable') {
                if (!vars.get(term[1][1])) {
                    vars.set(term[1][1], key_var);
                    varDen = [...varDen, ['power', term[1], ['natural', '1']]];
                } else {
                    const key_1 = vars.get(term[1][1]);
                    varDen[key_1][2][1] = (varDen[key_1][2][1] + 1).toString();
                }
                key_var++;
            } else if (term[0] === 'mul' && term[1][0] === 'power' && term[1][1][0] === 'variable') {
                varDen = [...varDen, term[1]];
                key_var++;
            } else {
                den_key = key;
                narrDen = [...narrDen, term];
            }
        });
    }

    if (varDen.length === 0) { // no variables in den
        return [operator, num, den];
    }

    // get new numerator and denominator variables

    varNum.sort();
    varDen.sort();
    let new_varNum = [];
    let new_varDen = [];
    let new_varNum_rest = [];
    let new_varDen_rest = [];
    const varNum_length = varNum.length;
    const varDen_length = varDen.length;
    let j_den = 0;
    for (let i = 0; i < varNum_length; i++) {
        for (let j = j_den; j < varDen_length; j++) {
            if (varNum[i][1][1] < varDen[j][1][1]) {
                new_varNum = varNum[i][2][1] === '1'
                    ? [...new_varNum, ['mul', varNum[i][1]]]
                    : [...new_varNum, ['mul', varNum[i]]];
                if (i === varNum_length - 1) {
                    new_varDen_rest = varDen.slice(j);
                }
                break;
            } else if (varNum[i][1][1] === varDen[j][1][1]) {
                const exp = varNum[i][2][1] - varDen[j][2][1];
                if (exp > 0) {
                    new_varNum = exp === 1
                        ? [...new_varNum, ['mul', varNum[i][1]]]
                        : [...new_varNum, ['mul', ['power', varNum[i][1], ['natural', exp.toString()]]]];
                } else if (exp < 0) {
                    new_varDen = exp === -1
                        ? [...new_varDen, ['mul', varDen[j][1]]]
                        : [...new_varDen, ['mul', ['power', varDen[j][1], ['natural', (-exp).toString()]]]];
                }
                if (i === varNum_length - 1) {
                    new_varDen_rest = varDen.slice(j + 1);
                }
                if (j === varDen_length - 1) {
                    new_varNum_rest = varNum.slice(i + 1);
                }
                j_den = j + 1;
                break;
            } else if (varNum[i][1][1] > varDen[j][1][1]) {
                new_varDen = varDen[j][2][1] === '1'
                    ? [...new_varDen, ['mul', varDen[j][1]]]
                    : [...new_varDen, ['mul', varDen[j]]];
                if (j === varDen_length - 1) {
                    new_varNum_rest = varNum.slice(i);
                }
            }
        }
    }
    new_varNum_rest = new_varNum_rest.map(n =>
        n[2][1] === '1'
            ? ['mul', n[1]]
            : ['mul', n]
    );
    new_varDen_rest = new_varDen_rest.map(d =>
        d[2][1] === '1'
            ? ['mul', d[1]]
            : ['mul', d]
    );
    const arrNum = [...new_varNum, ...new_varNum_rest, ...narrNum];
    const arrDen = [...new_varDen, ...new_varDen_rest, ...narrDen];
    arrNum.sort();
    arrDen.sort();
    const arrNum_length = arrNum.length;
    const new_num = arrNum_length === 0
        ? ['natural', '1']
        : arrNum_length === 1
            ? arrNum[0][1]
            : num_key === 0
                ? mulCommutative(['mulchain', ...arrNum])
                : sub_mulCommutative(['mulchain', ...arrNum]);
    const arrDen_length = arrDen.length;
    return arrDen_length === 0
        ? new_num
        : arrDen_length === 1
            ? [operator, new_num, arrDen[0][1]]
            : den_key === 0
                ? [operator, new_num, mulCommutative(['mulchain', ...arrDen])]
                : [operator, new_num, sub_mulCommutative(['mulchain', ...arrDen])];
}
*/
