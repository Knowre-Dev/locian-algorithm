import { mulIdentity } from '../rc/function_56.inc.js';
import { array2ChainTree, evalNumericValues, findDenominators, isNumeric, multFactor } from '../rc/function_152.inc.js';

export function mulAllSidesByCommonDenom(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    if (operator === 'equation' || operator === 'inequality') {
        // Remove any complex fractions
        // tree = fracComplex(tree); Gurantee this instead by precondition (better performance)

        // Initialize array to store product of all denominators in each side
        const [, ...operand] = tree;
        const denomArr = [];
        const operand_entries = operand.entries()
        for (const [key, term] of operand_entries) {
            // Find all unique denominators in this subtree
            // Make sure to pass the third arg as TRUE
            // to get absolute values of all denominators (in case of any negative denominators)
            // to ensure preservation of directions of inequality
            denomArr[key] = findDenominators(term, true, operator === 'inequality');

            // Multiply all denominators in this subtree into a single quantity
            if (denomArr[key].length === 0) {
                denomArr[key] = ['natural', '1'];
            } else {
                const prod = [];
                const denomArr_k = denomArr[key];
                for (const term_denomArr_k of denomArr_k) {
                    prod.push(['mul', term_denomArr_k]);
                }
                denomArr[key] = array2ChainTree(prod, true);
            }
        }

        // Calculate the common denominator to multiply on all sides of the equation
        let commonD = denomArr.map(denom => ['mul', denom]);
        commonD = mulIdentity(array2ChainTree(commonD, true));

        // Construct a new tree with the common denominator multiplied
        // Execute only if commonD !== ['natural', '1']
        if (JSON.stringify(commonD) === JSON.stringify(['natural', '1'])) {
            return tree;
        }
        const newOperand = [];
        for (const side of operand) {
            if (JSON.stringify(side) === JSON.stringify(['natural', '0'])) {
                newOperand.push(side);
            } else if (side[0] === 'addchain') {
                const termArr = [];
                const [, ...side_1] = side;
                for (const aterm of side_1) {
                    let newTree;
                    if (JSON.stringify(aterm[1]) === JSON.stringify(['natural', '1'])) {
                        newTree = commonD;
                    } else if (JSON.stringify(aterm[1]) === JSON.stringify(['negative', ['natural', '1']])) {
                        newTree = ['negative', commonD];
                    } else {
                        newTree = multFactor(aterm[1], ['mul', commonD], true);
                        if (isNumeric(aterm[1]) && isNumeric(commonD)) {
                            newTree = evalNumericValues(newTree);
                        }
                    }
                    termArr.push([aterm[0], newTree]);
                }
                newOperand.push(array2ChainTree(termArr));
            } else {
                let newSide = multFactor(side, ['mul', commonD]);
                if (isNumeric(side) && isNumeric(commonD)) {
                    newSide = evalNumericValues(newSide);
                }
                newOperand.push(newSide);
            }
        }
        return [operator, ...newOperand];
    }
    return tree;
}

/*

import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{x4}{4}=\\frac{2y}{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = mulAllSidesByCommonDenom(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
