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
        const narrNum = [];
        let num_key = 0;
        if (num[0] === 'variable') {
            varNum.push(['power', num, ['natural', '1']]);
        } else if (num[0] === 'power' && num[1][0] === 'variable') {
            varNum.push(num);
        } else if (num[0] === 'mulchain') {
            const vars = [];
            const [, ...num_1] = num;
            const num_1_entries = num_1.entries()
            for (const [key, term] of num_1_entries) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'variable') {
                        if (!vars.includes(term[1][1])) {
                            vars[key] = term[1][1];
                            varNum[key] = ['power', term[1], ['natural', '1']];
                        } else {
                            // let search = vars.indexOf();
                            let search;
                            const vars_entries = vars.entries();
                            for (const [key_vari, vari] of vars_entries) {
                                if (JSON.stringify(vari) === JSON.stringify(term[1][1])) {
                                    search = key_vari;
                                    break;
                                }
                            }
                            varNum[search] = ['power', term[1], ['natural', (parseInt(varNum[search][2][1]) + 1).toString()]];
                        }
                    } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                        varNum[key] = term[1];
                    } else {
                        num_key = key;
                        narrNum.push(term);
                    }
                } else {
                    num_key = key;
                    narrNum.push(term);
                }
            }
            varNum = Object.values(varNum);
        }
        // get the variables in the denominator
        let varDen = [];
        const narrDen = [];
        let den_key = 0;
        if (den[0] === 'variable') {
            varDen.push(['power', den, ['natural', '1']]);
        } else if (den[0] === 'power' && den[1][0] === 'variable') {
            varDen.push(den);
        } else if (den[0] === 'mulchain') {
            const vars = [];
            const [, ...den_1] = den;
            const den_1_entries = den_1.entries();
            for (const [key, term] of den_1_entries) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'variable') {
                        if (!vars.includes(term[1][1])) {
                            vars[key] = term[1][1];
                            varDen[key] = ['power', term[1], ['natural', '1']];
                        } else {
                            let search;
                            const vars_entries = vars.entries();
                            for (const [key_vari, vari] of vars_entries) {
                                if (JSON.stringify(vari) === JSON.stringify(term[1][1])) {
                                    search = key_vari;
                                    break;
                                }
                            }
                            varDen[search][2][1] = (parseInt(varDen[search][2][1]) + 1).toString();
                        }
                    } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                        varDen[key] = term[1];
                    } else {
                        den_key = key;
                        narrDen.push(term);
                    }
                } else {
                    den_key = key;
                    narrDen.push(term);
                }
            }
        }
        varDen = Object.values(varDen);
        const newVarNum = [];
        for (const vn of varNum) {
            if (!varDen.includes(vn)) {
                newVarNum.push(vn);
            }
        }
        const newVarDen = [];
        for (const vd of varDen) {
            if (!varNum.includes(vd)) {
                newVarDen.push(vd);
            }
        }
        // get new numerator and denominator variables
        newVarNum.sort();// added
        newVarDen.sort();// added
        if (newVarNum.length !== 0 && newVarDen.length !== 0) {
            let numk = 0;
            let deni = 0;
            const newNum = [];
            const newDen = [];
            const newVarNum_length = newVarNum.length;
            const newVarDen_length = newVarDen.length;
            for (let k = numk; k < newVarNum_length; k++) {
                for (let i = deni; i < newVarDen_length; i++) {
                    if (newVarNum[k][1][1] < newVarDen[i][1][1]) {
                        newVarNum[k][2][1] === '1' ? newNum.push(newVarNum[k][1])
                        : newNum.push(newVarNum[k]);
                        numk++;
                        if (numk === newVarNum.length) {
                            for (let j = deni; j < newVarDen_length; j++) {
                                newVarDen[j][2][1] === '1' ? newDen.push(newVarDen[j][1])
                                : newDen.push(newVarDen[j]);
                            }
                        }

                        break;
                    } else if (newVarNum[k][1][1] === newVarDen[i][1][1]) {
                        const expo = parseInt(newVarNum[k][2][1]) - parseInt(newVarDen[i][2][1]);
                        if (expo > 0) {
                            expo === 1 ? newNum.push(['variable', newVarNum[k][1][1]])
                            : newNum.push(['power', ['variable', newVarNum[k][1][1]], ['natural', expo.toString()]]);
                        } else if (expo < 0) {
                            expo === -1 ? newDen.push(['variable', newVarDen[i][1][1]])
                            : newDen.push(['power', ['variable', newVarDen[i][1][1]], ['natural', (Math.abs(expo)).toString()]]);
                        }
                        numk++;
                        deni++;
                        if (numk === newVarNum.length) {
                            for (let j = deni; j < newVarDen_length; j++) {
                                newVarDen[j][2][1] === '1' ? newDen.push(newVarDen[j][1])
                                : newDen.push(newVarDen[j]);
                            }
                        }
                        if (deni === newVarDen.length) {
                            for (let j = numk; j < newVarNum_length; j++) {
                                newVarNum[j][2][1] === '1' ? newNum.push(newVarNum[j][1])
                                : newNum.push(newVarNum[j]);
                            }
                        }
                        break;
                    } else if (newVarNum[k][1][1] > newVarDen[i][1][1]) {
                        newVarDen[i][2][1] === '1' ? newDen.push(newVarDen[i][1])
                        : newDen.push(newVarDen[i]);
                        deni++;
                        if (deni === newVarDen.length) {
                            for (let j = numk; j < newVarNum_length; j++) {
                                newVarNum[j][2][1] === '1' ? newNum.push(newVarNum[j][1])
                                : newNum.push(newVarNum[j]);
                            }
                        }
                    }
                }
            }

            // put the new variables back into the numerator and denominator
            const arrNum = [];

            if (newNum.length > 0) {
                for (const term of newNum) {
                    arrNum.push(['mul', term]);
                }
            }
            if (narrNum.length > 0) {
                for (const term of narrNum) {
                    arrNum.push(term);
                }
            }
            const newOperand = [];
            arrNum.sort();// added
            const arrNum_length = arrNum.length;
            switch (arrNum_length) {
                case 0: {
                    newOperand.push(['natural', '1']);
                    break;
                }
                case 1: {
                    newOperand.push(arrNum[0][1]);
                    break;
                }
                default: {
                    num_key === 0 ? newOperand.push(mulCommutative(['mulchain', ...arrNum]))
                    : newOperand.push(sub_mulCommutative(['mulchain', ...arrNum]));
                }
            }

            const arrDen = [];
            if (newDen.length > 0) {
                for (const term of newDen) {
                    arrDen.push(['mul', term]);
                }
            }

            if (narrDen.length > 0) {
                for (const term of narrDen) {
                    arrDen.push(term);
                }
            }
            arrDen.sort(); // added
            const arrDen_length = arrDen.length;
            switch (arrDen_length) {
                case 0: {
                    return newOperand[0];
                }
                case 1: {
                    return [operator, ...newOperand, arrDen[0][1]];
                }
                default: {
                    return den_key === 0 ? [operator, ...newOperand, mulCommutative(['mulchain', ...arrDen])]
                        : [operator, ...newOperand, sub_mulCommutative(['mulchain', ...arrDen])]
                }
            }
        }
        if (varDen.length === newVarDen.length && varNum.length === newVarNum.length) {
            return [operator, num, den];
        }
        const newNum = [];
        for (const nn of newVarNum) {
            nn[2][1] === '1' ? newNum.push(nn[1])
            : newNum.push(nn);
        }
        const arrNum = [];
        if (newNum.length > 0) {
            for (const term of newNum) {
                arrNum.push(['mul', term]);
            }
        }
        if (narrNum.length > 0) {
            for (const term of narrNum) {
                arrNum.push(term);
            }
        }
        const newOperand = [];
        const arrNum_length = arrNum.length;
        switch (arrNum_length) {
            case 0: {
                newOperand.push(['natural', '1']);
                break;
            }
            case 1: {
                newOperand.push(arrNum[0][1]);
                break;
            }
            default: {
                newOperand.push(mulCommutative(['mulchain', ...arrNum]));
            }
        }

        const newDen = [];
        for (const nn of newVarDen) {
            nn[2][1] === '1' ? newDen.push(nn[1])
            : newDen.push(nn);
        }
        const arrDen = [];
        if (newDen.length > 0) {
            for (const term of newDen) {
                arrDen.push(['mul', term]);
            }
        }
        if (narrDen.length > 0) {
            for (const term of narrDen) {
                arrDen.push(term);
            }
        }
        const arrDen_length = arrDen.length;
        switch (arrDen_length) {
            case 0: {
                return newOperand[0];
            }
            case 1: {
                return [operator, ...newOperand, arrDen[0][1]];
            }
            default: {
                return [operator, ...newOperand, mulCommutative(['mulchain', ...arrDen])];
            }
        }
    }
    const [, ...operand] = tree;
    const newOperand = [];
    for (const term of operand) {
        newOperand.push(fracSimpVar(term));
    }
    return [operator, ...newOperand];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{c^2}{ac+bc}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracSimpVar(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
