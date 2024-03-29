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
            return fracDecimal(tree);
        }
        case 'rdecimal': { // fin
            // Possible output type: fraction
            return rdecToFrac(tree);
        }
        case 'mfraction': {
            return fracMfrac(tree);
        }
        case 'negative': { // fin
            // Possible output type: ANYTHING
            const subresult = exprSimpConst(tree[1]);

            return subresult[0] === 'negative'
                ? subresult[1]
                : [operator, subresult];
        }
        case 'absolute': { // fin
            // Possible output types:
            // absolute,
            // natural, fraction (numerical), decimal, rdecimal, power (numerical)
            let subresult = exprSimpConst(operand[0]);
            if (subresult[0] === 'negative') {
                [, subresult] = subresult;
            }
            return isNumeric(subresult, true)
                ? subresult
                : [operator, subresult];
        }
        case 'fraction': { // fin
            // Possible output types: ANYTHINGlet
            // const [, ...operand] = tree;
            const is_power = operand[0][0] === 'power' && operand[1][0] === 'power' && operand[0][2] === operand[1][2];
            return is_power
                ? exprSimpConst(['power', ['fraction', operand[0][1], operand[1][1]], operand[0][2]])
                : fracSimpVar(fracSimpInt(fracNegative(fracComplex([operator, exprSimpConst(operand[0]), exprSimpConst(operand[1])]))));
        }
        case 'nthroot':
        case 'squareroot': {
            // rootN is the n in nth root (e.g., 2 for square root, 3 for a cubic root)
            // const [, ...operand] = tree;
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
            operand.forEach(term => {
                let [op] = term;
                let subtree = exprSimpConst(term[1]);
                if (subtree[0] === 'negative') {
                    [, subtree] = subtree;
                    op = op === 'add'
                        ? 'sub'
                        : 'add';
                }
                termArr = [...termArr, [op, subtree]];
            });
            return array2ChainTree(termArr, true);
        }
        case 'mulchain': { // fin
            [, ...operand] = mulAssociative(array2ChainTree(operand));
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
            let basetree = exprSimpConst(operand[0]);
            let expotree = exprSimpConst(operand[1]);
            // If the original expotree is a fraction with even denominator,
            // the result must work with the absolute value of the original base
            // So make a flag variable to store that info
            let evenRootFlag = false;
            if (expotree[0] === 'fraction') {
                const gcfArr = findGCF(expotree[2], ['natural', '2']);
                evenRootFlag = JSON.stringify(gcfArr.const) === JSON.stringify(['natural', '2']);
            }

            // Simplify (a^b)^c to a^(bc)
            if (basetree[0] === 'power') {
                expotree = ['mulchain', ['mul', basetree[2]], ['mul', expotree]];
                expotree = exprSimpConst(mulAssociative(expotree));
                [, basetree] = basetree;
            }
            // Remember, ((x^(2k-1))^2)^(1/2) === |x|^(2k-1), not x
            // Reflect this by modifying basetree as applicable
            const cons = findGCF(expotree, ['natural', '2']).const;
            const oddExpoFlag = JSON.stringify(cons) === JSON.stringify(['natural', '1']);
            if (expotree[0] === 'natural' && oddExpoFlag && evenRootFlag) {
                basetree = ['absolute', basetree];
            }
            let mtermArr = [];
            // Convert fraction to division just to make coding easier
            // The if statement below is omitted out (epark 20180830)
            // because this causes NAN output for inputs like ((103/100)^t),
            // where changing this to (103^t)/(100^t) for large t
            // causes float values to become NAN at evaluateEx_new

            if (basetree[0] === 'mulchain') {
                const [, ...operand_basetree] = basetree;
                mtermArr = [...mtermArr, ...operand_basetree.map(term => [term[0], exprSimpConst(['power', term[1], expotree])])];
            } else {
                mtermArr = [...mtermArr, ['mul', ['power', basetree, expotree]]];
            }

            // Remove any power of 1 before returning
            return powIdentity(divFrac(array2ChainTree(mtermArr, true)));
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
