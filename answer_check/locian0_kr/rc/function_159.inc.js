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
        operand.forEach((term, key) => {
            // Find all unique denominators in this subtree
            // Make sure to pass the third arg as TRUE
            // to get absolute values of all denominators (in case of any negative denominators)
            // to ensure preservation of directions of inequality
            denomArr[key] = findDenominators(term, true, operator === 'inequality');

            // Multiply all denominators in this subtree into a single quantity
            if (denomArr[key].length === 0) {
                denomArr[key] = ['natural', '1'];
            } else {
                const denomArr_k = denomArr[key];
                const prod = denomArr_k.map(term_denomArr_k => ['mul', term_denomArr_k]);
                denomArr[key] = array2ChainTree(prod, true);
            }
        });

        // Calculate the common denominator to multiply on all sides of the equation
        let commonD = denomArr.map(denom => ['mul', denom]);
        commonD = mulIdentity(array2ChainTree(commonD, true));

        // Construct a new tree with the common denominator multiplied
        // Execute only if commonD !== ['natural', '1']
        if (JSON.stringify(commonD) === JSON.stringify(['natural', '1'])) {
            return tree;
        }
        let newOperand = [];
        operand.forEach(side => {
            if (JSON.stringify(side) === JSON.stringify(['natural', '0'])) {
                newOperand = [...newOperand, side];
            } else if (side[0] === 'addchain') {
                let termArr = [];
                const [, ...side_1] = side;
                side_1.forEach(aterm => {
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
                    termArr = [...termArr, [aterm[0], newTree]];
                });
                newOperand = [...newOperand, array2ChainTree(termArr)];
            } else {
                const newSide = multFactor(side, ['mul', commonD]);
                newOperand = (isNumeric(side) && isNumeric(commonD)) ? [...newOperand, evalNumericValues(newSide)]
                    : newOperand = [...newOperand, newSide];
            }
        });
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
