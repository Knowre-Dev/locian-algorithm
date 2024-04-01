import { mulCommutative } from '../rc/function_46.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';
// import _ from ' ';

export function fracSimpVar(tree) {
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
    const varNum_length = varNum.length;
    const varDen_length = varDen.length;
    for (let i = 0; i < varNum_length; i++) {
        for (let j = 0; j < varDen_length; j++) {
            if (varDen[j]) {
                if (varNum[i][1][1] === varDen[j][1][1]) {
                    const exp = varNum[i][2][1] - varDen[j][2][1];
                    if (exp > 0) {
                        varNum[i][2][1] = exp.toString();
                        varDen[j] = null;
                    } else if (exp < 0) {
                        varNum[i] = null;
                        varDen[j][2][1] = (-exp).toString();
                    } else {
                        varNum[i] = null;
                        varDen[j] = null;
                    }
                    break;
                }
            }
        }
    }
    let new_varNum = [];
    varNum.forEach(n => {
        if (n) {
            const new_n = n[2][1] === '1'
                ? ['mul', n[1]]
                : ['mul', n];
            new_varNum = [...new_varNum, new_n];
        }
    });
    let new_varDen = [];
    varDen.forEach(d => {
        if (d) {
            const new_d = d[2][1] === '1'
                ? ['mul', d[1]]
                : ['mul', d];
            new_varDen = [...new_varDen, new_d];
        }
    });
    // form new numerator and denominator
    const arrNum = [...new_varNum, ...narrNum];
    const arrDen = [...new_varDen, ...narrDen];
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
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\frac{2}{2(a+2)}';
const tree_1 = LatexToTree(latex_1);
const tree_11 = fracSimpVar_old(tree_1);
const result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/

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
