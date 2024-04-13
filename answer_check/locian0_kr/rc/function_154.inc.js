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
import { array2ChainTree, findGCF, isNumeric } from '../rc/function_152.inc.js';
import { mulAssociative } from '../rc/function_157.inc.js';
import { divFrac } from '../rc/function_161.inc.js';

export function exprSimpConst(tree = null) {
    if (!Array.isArray(tree) || tree.length === 0) {
        return tree;
    }

    let [operator, ...operand] = tree;

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
            const subresult = exprSimpConst(operand[0]);
            return subresult[0] === 'negative' // negative이므로 상쇄 -(-a) = a
                ? subresult[1]
                : [operator, subresult];
        }
        case 'absolute': { // fin
            // Possible output types:
            // absolute,
            // natural, fraction (numerical), decimal, rdecimal, power (numerical)
            let subresult = exprSimpConst(operand[0]);
            if (subresult[0] === 'negative') { // absolute 이므로 negatgive 제거 |-a| = a
                [, subresult] = subresult;
            }
            return isNumeric(subresult, true)
                ? subresult
                : [operator, subresult];
        }
        case 'fraction': { // fin
            // Possible output types: ANYTHINGlet
            const is_power = operand[0][0] === 'power' && operand[1][0] === 'power' && JSON.stringify(operand[0][2]) === JSON.stringify(operand[1][2]);// a^c / b^c 꼴
            return is_power
                ? exprSimpConst(['power', ['fraction', operand[0][1], operand[1][1]], operand[0][2]])
                : fracSimpVar(fracSimpInt(fracNegative(fracComplex([operator, exprSimpConst(operand[0]), exprSimpConst(operand[1])]))));
        }
        case 'nthroot': // a^(1/n)
        case 'squareroot': { // a^(1/2)
            // rootN is the n in nth root (e.g., 2 for square root, 3 for a cubic root)
            let rootN = [];
            let radicand = [];
            if (operator === 'squareroot') {
                rootN = ['natural', '2'];
                radicand = exprSimpConst(operand[0]);
            } else {
                rootN = exprSimpConst(operand[0]);
                radicand = exprSimpConst(operand[1]);
            }
            return exprSimpConst(['power', radicand, fracComplex(['fraction', ['natural', '1'], rootN])]);
        }
        case 'addchain': { // fin
            operand = addNegative(addAssociative(addIdentity(array2ChainTree(operand))));
            if (operand[0] !== 'addchain') {
                return operand;
            }

            [, ...operand] = operand;
            let termArr = [];
            const signs = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ]);
            operand.forEach(term => {
                let [op, term_1] = term;
                let subtree = exprSimpConst(term_1);
                if (subtree[0] === 'negative') { // negative 나오면 부호 변경
                    [, subtree] = subtree;
                    op = signs.get(op);
                }
                termArr = [...termArr, [op, subtree]];
            });
            return array2ChainTree(termArr, true);
        }
        case 'mulchain': { // fin
            [, ...operand] = mulAssociative(tree);
            let termArr = [];
            let sign = 1;
            operand.forEach(term => {
                let subtree = exprSimpConst(term[1]);
                // Take all negative signs out to the front
                if (Array.isArray(subtree) && subtree[0] === 'negative') {
                    sign *= -1;
                    [, subtree] = subtree;
                }
                termArr = [...termArr, [term[0], subtree]];
            });
            const newtree = mulAssociative(mulIdentity(mulZero(array2ChainTree(termArr, true))));
            return sign === -1
                ? ['negative', newtree]
                : newtree;
        }
        case 'power': {
            // Possible output types:
            // negative, fraction, squareroot, power
            let base = exprSimpConst(operand[0]);
            let expo = exprSimpConst(operand[1]);
            // If the original expotree is a fraction with even denominator,
            // the result must work with the absolute value of the original base
            // So make a flag variable to store that info
            let is_even_root = false;
            if (expo[0] === 'fraction') {
                const GCF = findGCF(expo[2]);
                // const GCF = findGCF(expo[2], ['natural', '2']);
                is_even_root = JSON.stringify(GCF.const) === JSON.stringify(['natural', '2']);
            }

            // Simplify (a^b)^c to a^(bc)
            if (base[0] === 'power') {
                expo = ['mulchain', ['mul', base[2]], ['mul', expo]];
                expo = exprSimpConst(mulAssociative(expo));
                [, base] = base;
            }
            // Remember, ((x^(2k-1))^2)^(1/2) === |x|^(2k-1), not x
            // Reflect this by modifying basetree as applicable
            const cons = findGCF(expo).const;
            // const cons = findGCF(expo, ['natural', '2']).const;
            const is_odd_expo = JSON.stringify(cons) === JSON.stringify(['natural', '1']);
            if (expo[0] === 'natural' && is_odd_expo && is_even_root) {
                base = ['absolute', base];
            }
            let newOperand = [];
            // Convert fraction to division just to make coding easier
            // The if statement below is omitted out (epark 20180830)
            // because this causes NAN output for inputs like ((103/100)^t),
            // where changing this to (103^t)/(100^t) for large t
            // causes float values to become NAN at evaluateEx_new

            if (base[0] === 'mulchain') {
                const [, ...operand_base] = base;
                newOperand = [...newOperand, ...operand_base.map(term => [term[0], exprSimpConst(['power', term[1], expo])])];
            } else {
                newOperand = [...newOperand, ['mul', ['power', base, expo]]];
            }

            // Remove any power of 1 before returning
            return powIdentity(divFrac(array2ChainTree(newOperand, true)));
        }
        default: {
            return [operator, ...operand.map(term => exprSimpConst(term))];
        }
    }
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);

let tree_11 = exprSimpConst(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
