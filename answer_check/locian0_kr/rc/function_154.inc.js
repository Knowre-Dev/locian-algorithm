/*
Simplifies any numerical constant expression inside the given tree

Author: epark
*/

import { addAssociative } from '../rc/function_45.inc.js';
import { fracDecimal } from '../rc/function_49.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { addIdentity } from '../rc/function_55.inc.js';
import { mulIdentity } from '../rc/function_56.inc.js';
import { powIdentity } from '../rc/function_59.inc.js';
import { fracComplex } from '../rc/function_69.inc.js';
import { addNegative } from '../rc/function_71.inc.js';
import { fracSimpInt } from '../rc/function_76.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';
import { mulZero } from '../rc/function_82.inc.js';
import { mulAssociative } from '../rc/function_157.inc.js';
import { divFrac } from '../rc/function_161.inc.js';
import { array2ChainTree, findGCF, isNumeric } from './sub_functions.js';

export function exprSimpConst(tree = null) {
    if (!Array.isArray(tree) || tree.length === 0) {
        return tree;
    }

    const [operator, ...operand] = tree;

    switch (operator) {
        case 'infinity': // fin
        case 'natural': // fin
        case 'variable': { // fin
            return tree;
        }
        case 'decimal': { // fin
            // Possible output type: fraction
            return fracDecimal(tree);// decimal => fraction
        }
        case 'rdecimal': { // fin
            // Possible output type: fraction
            return rdecToFrac(tree); // rdecimal => fraction
        }
        case 'mfraction': {
            return fracMfrac(tree);
        }
        case 'negative': { // fin
            // Possible output type: ANYTHING
            const operand_new = exprSimpConst(operand[0]);
            return operand_new[0] === 'negative' // negative이므로 상쇄 -(-a) = a
                ? operand_new[1]
                : [operator, operand_new];
        }
        case 'absolute': { // fin
            // Possible output types:
            // absolute,
            // natural, fraction (numerical), decimal, rdecimal, power (numerical)
            let operand_new = exprSimpConst(operand[0]);
            if (operand_new[0] === 'negative') { // absolute 이므로 negatgive 제거 |-a| = a
                [, operand_new] = operand_new;
            }
            return isNumeric(operand_new, true)
                ? operand_new
                : [operator, operand_new];
        }
        case 'fraction': { // fin
            // Possible output types: ANYTHINGlet
            const [num, den] = operand;
            const is_power = num[0] === 'power' && den[0] === 'power' && JSON.stringify(num[2]) === JSON.stringify(den[2]);// a^c / b^c 꼴
            return is_power
                ? exprSimpConst(['power', ['fraction', num[1], den[1]], num[2]])
                : fracSimpVar(fracSimpInt(fracNegative(fracComplex([operator, exprSimpConst(num), exprSimpConst(den)]))));
        }
        case 'nthroot': // a^(1/n)
        case 'squareroot': { // a^(1/2)
            // rootN is the n in nth root (e.g., 2 for square root, 3 for a cubic root)

            const number = operator === 'squareroot'
                ? ['natural', '2']
                : exprSimpConst(operand[0]);
            const radicand = operator === 'squareroot'
                ? exprSimpConst(operand[0])
                : exprSimpConst(operand[1]);
            const exp = fracComplex(['fraction', ['natural', '1'], number]);
            return exprSimpConst(['power', radicand, exp]);
        }
        case 'addchain': { // fin
            return simp_addchain(operator, operand);
        }
        case 'mulchain': { // fin
            return simp_mulchain(tree);
        }
        case 'power': {
            return simp_power(operand);
        }
        default: {
            const operand_new = operand.map(term => exprSimpConst(term));
            return [operator, ...operand_new];
        }
    }
}

function simp_addchain(operator, operand) {
    operand = addNegative(addAssociative(addIdentity(array2ChainTree(operand))));
    if (operand[0] !== 'addchain') {
        return operand;
    }
    [, ...operand] = operand;
    let terms = [];
    const signs = new Map([
        ['add', 'sub'],
        ['sub', 'add']
    ]);
    operand.forEach(term => {
        let [op, term_1] = term;
        term_1 = exprSimpConst(term_1);
        if (term_1[0] === 'negative') { // negative 나오면 부호 변경
            [, term_1] = term_1;
            op = signs.get(op);
        }
        terms = [...terms, [op, term_1]];
    });
    return array2ChainTree(terms, true);
}

function simp_mulchain(tree) {
    const [, ...operand] = mulAssociative(tree);
    let terms = [];
    let sign = 1;
    operand.forEach(term => {
        let [op, term_1] = term;
        term_1 = exprSimpConst(term_1);
        // Take all negative signs out to the front
        if (Array.isArray(term_1) && term_1[0] === 'negative') {
            sign *= -1;
            [, term_1] = term_1;
        }
        terms = [...terms, [op, term_1]];
    });
    const newtree = mulAssociative(mulIdentity(mulZero(array2ChainTree(terms, true))));
    return sign === -1
        ? ['negative', newtree]
        : newtree;
}

function simp_power(operand) {
    // Possible output types:
    // negative, fraction, squareroot, power
    let [base, exp] = operand;
    base = exprSimpConst(base);
    exp = exprSimpConst(exp);
    // If the original expotree is a fraction with even denominator,
    // the result must work with the absolute value of the original base
    // So make a flag variable to store that info
    let is_even_root = false;
    if (exp[0] === 'fraction') {
        const GCF = findGCF(exp[2]);
        is_even_root = JSON.stringify(GCF.const) === JSON.stringify(['natural', '2']);
    }

    // Simplify (a^b)^c to a^(bc)
    if (base[0] === 'power') {
        exp = ['mulchain', ['mul', base[2]], ['mul', exp]];
        exp = exprSimpConst(mulAssociative(exp));
        [, base] = base;
    }
    // Remember, ((x^(2k-1))^2)^(1/2) === |x|^(2k-1), not x
    // Reflect this by modifying basetree as applicable
    const con = findGCF(exp).const;
    const is_odd_expo = JSON.stringify(con) === JSON.stringify(['natural', '1']);
    if (exp[0] === 'natural' && is_odd_expo && is_even_root) {
        base = ['absolute', base];
    }
    let newOperand = [];
    // Convert fraction to division just to make coding easier
    // The if statement below is omitted out (epark 20180830)
    // because this causes NAN output for inputs like ((103/100)^t),
    // where changing this to (103^t)/(100^t) for large t
    // causes float values to become NAN at evaluateEx_new

    if (base[0] === 'mulchain') {
        let [, ...operand_b] = base;
        operand_b = operand_b.map(term => [term[0], exprSimpConst(['power', term[1], exp])])
        newOperand = [...newOperand, operand_b];
    } else {
        newOperand = [...newOperand, ['mul', ['power', base, exp]]];
    }

    // Remove any power of 1 before returning
    return powIdentity(divFrac(array2ChainTree(newOperand, true)));
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);

let tree_11 = exprSimpConst(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
