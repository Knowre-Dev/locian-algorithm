import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { gcd } from '../rc/sub_functions.js'
export function eqIneqMulProp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (!['equation', 'inequality'].includes(operator)) {
        return tree;
    }
    switch (operator) {
        case 'equation': {
            const [, ...operand] = tree;
            const terms = operand;
            const [is_applicable, cons] = form_cons(terms);
            if (!is_applicable) {
                return tree;
            }
            const [is_not_applicable, g] = form_gcd(terms, cons);
            return is_not_applicable
                ? tree
                : form_equation(operand, g);
        }
        case 'inequality': {
            const [, ...operand] = tree;
            const max = Math.floor(operand.length / 2);
            let terms = [];
            for (let i = 0; i <= max; i++) {
                terms = [...terms, operand[2 * i]];
            }
            const [is_applicable, cons] = form_cons(terms);
            if (!is_applicable) {
                return tree;
            }
            const [is_not_applicable, g] = form_gcd(terms, cons);
            return is_not_applicable
                ? tree
                : form_inequality(operand, g, max);
        }
    }
}
function form_cons(terms) {
    let cons = terms.reduce((array, term) => [...array, ...sub_getConstant(term)], []);
    cons = [...new Set(cons)];
    let is_applicable = true;
    if (cons.includes(1) || cons.length === 0) {
        is_applicable = false;
    }
    return [is_applicable, cons];
}

function form_gcd(terms, cons) {
    const zero = JSON.stringify(['natural', '0']);
    const has_zero = terms.some(term => JSON.stringify(term) === zero);
    const g = cons.reduce((a, b) => gcd(a, b), cons[0]);
    const is_not_applicable = (cons.length === 1 && !has_zero) || g === 1;
    return [is_not_applicable, g];
}

function form_equation(operand, den) {
    let [left, right] = operand;
    const frac_function = tree_1 => fracSimpInt(fracSeparation(fracNegative(tree_1)));
    den = ['natural', den.toString()];
    left = frac_function(['fraction', left, den]);
    right = frac_function(['fraction', right, den]);
    return ['equation', left, right];
}

function form_inequality(operand, den, max) {
    const frac_function = tree_1 => fracSimpInt(fracSeparation(fracNegative(tree_1)));
    den = ['natural', den.toString()];
    let newOperand = [frac_function(['fraction', operand[0], den])];
    for (let i = 1; i <= max; i++) {
        const term_new = frac_function(['fraction', operand[2 * i], den]);
        newOperand = [...newOperand, operand[2 * i - 1], term_new];
    }
    return ['inequality', ...newOperand];
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
            const [, number] = tree;
            return number !== '0'
                ? [parseInt(number)]
                : [];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            let cons = operand.reduce((terms, term) => term[0] === 'mul'
                ? [...terms, ...sub_getConstant(term[1])]
                : terms,
            []);
            cons = [...new Set(cons)];
            if (cons.includes(1) && cons.length !== 1) {
                cons = cons.filter(term => term !== 1);
            }
            return cons;
        }
        case 'addchain': {
            const [, ...operand] = tree;
            return operand.reduce((a, b) => [...a, ...sub_getConstant(b[1])], []);
        }
        case 'negative': {
            const [, operand] = tree;
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
