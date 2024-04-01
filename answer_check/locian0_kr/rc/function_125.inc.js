import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { gcd } from '../rc/sub_functions.js'
export function eqIneqMulProp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    const frac_function = tree_1 => fracSimpInt(fracSeparation(fracNegative(tree_1)));
    switch (operator) {
        case 'equation': {
            const [, ...operand] = tree;
            let con = [...sub_getConstant(operand[0]), ...sub_getConstant(operand[1])];
            con = [...new Set(con)];
            const con_length = con.length;

            if (con.includes(1) || con_length === 0) {
                return tree;
            }
            if (con_length === 1) {
                const zero = JSON.stringify(['natural', '0']);
                const deno = ['natural', con[0]];
                return JSON.stringify(operand[0]) === zero
                    ? [operator, ...frac_function(['fraction', operand[0], deno]), frac_function(['fraction', operand[1], deno])]
                    : JSON.stringify(operand[1]) === zero
                        ? [operator, frac_function(['fraction', operand[0], deno]), frac_function(['fraction', operand[1], deno])]
                        : tree;
            }
            let [div, ...con_rest] = con;
            div = con_rest.reduce((a, b) => gcd(a, b), div);
            return div === 1
                ? tree
                : [operator, frac_function(['fraction', operand[0], ['natural', div.toString()]]), frac_function(['fraction', operand[1], ['natural', div.toString()]])];
        }
        case 'inequality': {
            const [, ...operand] = tree;
            let con = [];
            const max = Math.floor(operand.length / 2);
            for (let i = 0; i <= max; i++) {
                con = [...con, ...sub_getConstant(operand[2 * i])];
            }
            con = [...new Set(con)];
            const con_length = con.length;
            if (con.includes(1) || con_length === 0) {
                return tree;
            }
            if (con_length === 1) {
                const zero = JSON.stringify(['natural', '0']);
                if (operand.some(term => JSON.stringify(term) === zero)) {
                    const deno = ['natural', con[0]];
                    let newOperand = [frac_function(['fraction', operand[0], deno])];
                    for (let i = 1; i <= max; i++) {
                        newOperand = [...newOperand, operand[2 * i - 1], frac_function(['fraction', operand[2 * i], deno])];
                    }
                    return [operator, ...newOperand];
                }
                return tree;
            }
            let [div, ...con_rest] = con
            div = con_rest.reduce((a, b) => gcd(a, b), div);
            if (div === 1) {
                return tree;
            }
            const deno = ['natural', div.toString()];
            let newOperand = [frac_function(['fraction', operand[0], deno])];
            for (let i = 1; i <= max; i++) {
                newOperand = [...newOperand, operand[2 * i - 1], frac_function(['fraction', operand[2 * i], deno])];
            }
            return [operator, ...newOperand];
        }
        default: {
            return tree;
        }
    }
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '2\\pi x=4\\pi  ';
let latex_2 = '2x=4';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = eqIneqMulProp(tree_1);
let tree_21 = eqIneqMulProp(tree_2);
let result1 = JSON.stringify(tree_11, null, 4);
let result2 = JSON.stringify(tree_21, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/

export function sub_getConstant(tree) {
    if (!Array.isArray(tree)) {
        return [];
    }
    const [operator] = tree;
    switch (operator) {
        case 'natural': {
            const [, ...operand] = tree;
            return operand[0] !== '0'
                ? [parseInt(operand[0])]
                : [];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let con = operand.reduce((terms, term) => term[0] === 'mul'
                ? [...terms, ...sub_getConstant(term[1])]
                : terms,
            []);
            con = [...new Set(con)];
            if (con.includes(1) && con.length !== 1) {
                con = con.filter(term_c => term_c !== 1);
            }
            return con;
        }
        case 'addchain': {
            const [, ...operand] = tree;
            return operand.reduce((a, b) => [...a, ...sub_getConstant(b[1])], []);
        }
        case 'negative': {
            const [, ...operand] = tree;
            return operand.reduce((a, b) => [...a, ...sub_getConstant(b)], []);
        }
        case 'power':
        case 'variable': {
            return [1];
        }
        default: {
            return [];
        }
    }
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '2+b+3a';
let latex_2 = '2a+3x^2';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = sub_getConstant(tree_1);
let tree_21 = sub_getConstant(tree_2);
let result1 = JSON.stringify(tree_11, null, 4);
let result2 = JSON.stringify(tree_21, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
/*
export function sub_div(tree, deno) {
    const frac = ['fraction', tree, deno];
    return fracSimpInt(fracSeparation(fracNegative(frac)));
}
*/
