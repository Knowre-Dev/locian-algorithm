import { mulIdentity } from '../rc/function_56.inc.js';
import { array2ChainTree, evalNumericValues, findDenominators, isNumeric, multFactor } from '../rc/function_152.inc.js';

export function mulAllSidesByCommonDenom(tree = null) {
    if (!Array.isArray(tree) || !['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }
    // Remove any complex fractions
    // tree = fracComplex(tree); Gurantee this instead by precondition (better performance)

    // Initialize array to store product of all denominators in each side
    const [operator, ...operand] = tree;
    let denoms = [];
    operand.forEach(term => {
        // Find all unique denominators in this subtree
        // Make sure to pass the third arg as TRUE
        // to get absolute values of all denominators (in case of any negative denominators)
        // to ensure preservation of directions of inequality
        const denom = findDenominators(term, true, operator === 'inequality');

        // Multiply all denominators in this subtree into a single quantity
        if (denom.length === 0) {
            denoms = [...denoms, ['natural', '1']];
        } else {
            const prod = denom.map(term_1 => ['mul', term_1]);
            denoms = [...denoms, array2ChainTree(prod, true)];
        }
    });

    // Calculate the common denominator to multiply on all sides of the equation
    let denom_comm = denoms.map(denom => ['mul', denom]);
    denom_comm = mulIdentity(array2ChainTree(denom_comm, true));

    // Construct a new tree with the common denominator multiplied
    // Execute only if denom_comm !== ['natural', '1']
    if (JSON.stringify(denom_comm) === JSON.stringify(['natural', '1'])) {
        return tree;
    }
    let newOperand = [];
    const zero = JSON.stringify(['natural', '0']);
    const one = JSON.stringify(['natural', '1']);
    const minus_one = JSON.stringify(['negative', ['natural', '1']]);
    operand.forEach(side => {
        if (JSON.stringify(side) === zero) {
            newOperand = [...newOperand, side];
        } else if (side[0] === 'addchain') {
            let terms = [];
            const [, ...side_1] = side;
            side_1.forEach(term => {
                let new_term = [];
                if (JSON.stringify(term[1]) === one) {
                    new_term = denom_comm;
                } else if (JSON.stringify(term[1]) === minus_one) {
                    new_term = ['negative', denom_comm];
                } else {
                    new_term = multFactor(term[1], ['mul', denom_comm], true);
                    if (isNumeric(term[1]) && isNumeric(denom_comm)) {
                        new_term = evalNumericValues(new_term);
                    }
                }
                terms = [...terms, [term[0], new_term]];
            });
            newOperand = [...newOperand, array2ChainTree(terms)];
        } else {
            const newSide = multFactor(side, ['mul', denom_comm]);
            newOperand = isNumeric(side) && isNumeric(denom_comm)
                ? [...newOperand, evalNumericValues(newSide)]
                : [...newOperand, newSide];
        }
    });
    return [operator, ...newOperand];
}

/*

import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{x4}{4}=\\frac{2y}{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = mulAllSidesByCommonDenom(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
