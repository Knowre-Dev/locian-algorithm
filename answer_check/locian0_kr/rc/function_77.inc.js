import { mulCommutative } from '../rc/function_46.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';

export function fracSimpVar(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'fraction') {
        const [, ...operand] = tree;
        const num = fracSimpVar(operand[0]);
        const den = fracSimpVar(operand[1]);

        // get the variables in the numerator
        let varNum = [];
        let narrNum = [];
        let num_key = 0;
        if (num[0] === 'variable') {
            varNum = [...varNum, ['power', num, ['natural', '1']]];
        } else if (num[0] === 'power' && num[1][0] === 'variable') {
            varNum = [...varNum, num];
        } else if (num[0] === 'mulchain') {
            const vars = [];
            const [, ...num_1] = num;
            num_1.forEach((term, key) => {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'variable') {
                        if (!vars.includes(term[1][1])) {
                            vars[key] = term[1][1];
                            varNum[key] = ['power', term[1], ['natural', '1']];
                        } else {
                            const vars_entries = vars.entries();
                            const term_11 = JSON.stringify(term[1][1]);
                            for (const [key_vari, vari] of vars_entries) {
                                if (JSON.stringify(vari) === term_11) {
                                    varNum[key_vari] = ['power', term[1], ['natural', (parseInt(varNum[key_vari][2][1]) + 1).toString()]];
                                    break;
                                }
                            }
                        }
                    } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                        [, varNum[key]] = term;
                    } else {
                        num_key = key;
                        narrNum = [...narrNum, term];
                    }
                } else {
                    num_key = key;
                    narrNum = [...narrNum, term];
                }
            });
            varNum = Object.values(varNum);
        }
        // get the variables in the denominator
        let varDen = [];
        let narrDen = [];
        let den_key = 0;
        if (den[0] === 'variable') {
            varDen = [...varDen, ['power', den, ['natural', '1']]];
        } else if (den[0] === 'power' && den[1][0] === 'variable') {
            varDen = [...varDen, den];
        } else if (den[0] === 'mulchain') {
            const vars = [];
            const [, ...den_1] = den;
            den_1.forEach((term, key) => {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'variable') {
                        if (!vars.includes(term[1][1])) {
                            vars[key] = term[1][1];
                            varDen[key] = ['power', term[1], ['natural', '1']];
                        } else {
                            const vars_entries = vars.entries();
                            const term_11 = JSON.stringify(term[1][1]);
                            for (const [key_vari, vari] of vars_entries) {
                                if (JSON.stringify(vari) === term_11) {
                                    varDen[key_vari][2][1] = (parseInt(varDen[key_vari][2][1]) + 1).toString();
                                    break;
                                }
                            }
                        }
                    } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                        varDen[key] = term[1];
                    } else {
                        den_key = key;
                        narrDen = [...narrDen, term];
                    }
                } else {
                    den_key = key;
                    narrDen = [...narrDen, term];
                }
            });
        }
        varDen = Object.values(varDen);
        let newVarNum = [];
        varNum.forEach(vn => {
            if (!varDen.includes(vn)) {
                newVarNum = [...newVarNum, vn];
            }
        });
        let newVarDen = [];
        varDen.forEach(vd => {
            if (!varNum.includes(vd)) {
                newVarDen = [...newVarDen, vd];
            }
        });
        // get new numerator and denominator variables
        newVarNum.sort();// added
        newVarDen.sort();// added
        const newVarNum_length = newVarNum.length;
        const newVarDen_length = newVarDen.length;
        if (newVarNum.length !== 0 && newVarDen.length !== 0) {
            let numk = 0;
            let deni = 0;
            let newNum = [];
            let newDen = [];
            for (let k = numk; k < newVarNum_length; k++) {
                for (let i = deni; i < newVarDen_length; i++) {
                    if (newVarNum[k][1][1] < newVarDen[i][1][1]) {
                        newNum = newVarNum[k][2][1] === '1' ? [...newNum, newVarNum[k][1]]
                            : [...newNum, newVarNum[k]];
                        numk++;
                        if (numk === newVarNum.length) {
                            for (let j = deni; j < newVarDen_length; j++) {
                                newDen = newVarDen[j][2][1] === '1' ? [...newDen, newVarDen[j][1]]
                                    : [...newDen, newVarDen[j]];
                            }
                        }
                        break;
                    } else if (newVarNum[k][1][1] === newVarDen[i][1][1]) {
                        const expo = parseInt(newVarNum[k][2][1]) - parseInt(newVarDen[i][2][1]);
                        if (expo > 0) {
                            newNum = expo === 1 ? [...newNum, ['variable', newVarNum[k][1][1]]]
                                : [...newNum, ['power', ['variable', newVarNum[k][1][1]], ['natural', expo.toString()]]];
                        } else if (expo < 0) {
                            newDen = expo === -1 ? [...newDen, ['variable', newVarDen[i][1][1]]]
                                : [...newDen, ['power', ['variable', newVarDen[i][1][1]], ['natural', (Math.abs(expo)).toString()]]];
                        }
                        numk++;
                        deni++;
                        if (numk === newVarNum.length) {
                            for (let j = deni; j < newVarDen_length; j++) {
                                newDen = newVarDen[j][2][1] === '1' ? [...newDen, newVarDen[j][1]]
                                    : [...newDen, newVarDen[j]];
                            }
                        }
                        if (deni === newVarDen.length) {
                            for (let j = numk; j < newVarNum_length; j++) {
                                newNum = newVarNum[j][2][1] === '1' ? [...newNum, newVarNum[j][1]]
                                    : [...newNum, newVarNum[j]];
                            }
                        }
                        break;
                    } else if (newVarNum[k][1][1] > newVarDen[i][1][1]) {
                        newDen = newVarDen[i][2][1] === '1' ? [...newDen, newVarDen[i][1]]
                            : [...newDen, newVarDen[i]];
                        deni++;
                        if (deni === newVarDen.length) {
                            for (let j = numk; j < newVarNum_length; j++) {
                                newNum = newVarNum[j][2][1] === '1' ? [...newNum, newVarNum[j][1]]
                                    : [...newNum, newVarNum[j]];
                            }
                        }
                    }
                }
            }

            // put the new variables back into the numerator and denominator
            let arrNum = [];

            if (newNum.length > 0) {
                arrNum = [...arrNum, ...newNum.map(term => ['mul', term])];
            }
            if (narrNum.length > 0) {
                arrNum = [...arrNum, ...narrNum];
            }
            arrNum.sort();// added
            const arrNum_length = arrNum.length;
            const newOperand = arrNum_length === 0 ? [['natural', '1']]
                : arrNum_length === 1 ? [arrNum[0][1]]
                : num_key === 0 ? [mulCommutative(['mulchain', ...arrNum])]
                : [sub_mulCommutative(['mulchain', ...arrNum])];
            let arrDen = [];
            if (newDen.length > 0) {
                arrDen = [...arrDen, ...newDen.map(term => ['mul', term])];
            }

            if (narrDen.length > 0) {
                arrDen = [...arrDen, ...narrDen];
            }
            arrDen.sort(); // added
            const arrDen_length = arrDen.length;
            return arrDen_length === 0 ? newOperand[0]
                : arrDen_length === 1 ? [operator, ...newOperand, arrDen[0][1]]
                : den_key === 0 ? [operator, ...newOperand, mulCommutative(['mulchain', ...arrDen])]
                : [operator, ...newOperand, sub_mulCommutative(['mulchain', ...arrDen])];
        }
        if (varDen.length === newVarDen_length && varNum.length === newVarNum_length) {
            return [operator, num, den];
        }
        let newNum = [];
        newVarNum.forEach(nn => {
            newNum = nn[2][1] === '1' ? [...newNum, nn[1]]
                : [...newNum, nn];
        })

        let arrNum = [];
        if (newNum.length > 0) {
            arrNum = [...arrNum, ...newNum.map(term => ['mul', term])];
        }
        if (narrNum.length > 0) {
            arrNum = [...arrNum, ...narrNum];
        }
        const arrNum_length = arrNum.length;
        const newOperand = arrNum_length === 0 ? [['natural', '1']]
            : arrNum_length === 1 ? [arrNum[0][1]]
            : [mulCommutative(['mulchain', ...arrNum])];

        let newDen = [];
        newVarDen.forEach(nn => {
            newDen = nn[2][1] === '1' ? [...newDen, nn[1]]
                : [...newDen, nn];
        });

        let arrDen = [];
        if (newDen.length > 0) {
            arrDen = [...arrDen, ...newDen.map(term => ['mul', term])];
        }
        if (narrDen.length > 0) {
            arrDen = [...arrDen, ...narrDen];
        }
        const arrDen_length = arrDen.length;
        return arrDen_length === 0 ? newOperand[0]
            : arrDen_length === 1 ? [operator, ...newOperand, arrDen[0][1]]
            : [operator, ...newOperand, mulCommutative(['mulchain', ...arrDen])];
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => fracSimpVar(term))];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{c^2}{ac+bc}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracSimpVar(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
