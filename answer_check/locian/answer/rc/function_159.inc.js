import { mulIdentity } from '../rc/function_56.inc.js';
import { array2ChainTree, evalNumericValues, findDenominators, isNumeric, multFactor } from '../rc/sub_functions.js';

export function mulAllSidesByCommonDenom(tree = null) {
    if (!Array.isArray(tree) || !['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }
    // Remove any complex fractions
    // tree = fracComplex(tree); Gurantee this instead by precondition (better performance)

    // Initialize array to store product of all denominators in each side
    const [operator, ...operand] = tree;
    let dens = [];
    operand.forEach(term => {
        // Find all unique denominators in this subtree
        // Make sure to pass the third arg as TRUE
        // to get absolute values of all denominators (in case of any negative denominators)
        // to ensure preservation of directions of inequality
        const den = findDenominators(term, true, operator === 'inequality');

        // Multiply all denominators in this subtree into a single quantity
        if (den.length !== 0) {
            dens = [...dens, ...den];
            /* original code, don't delete
            den = den.map(term_1 => ['mul', term_1]);
            dens = [...dens, array2ChainTree(den, true)];
            */
        }
    });

    // Calculate the common denominator to multiply on all sides of the equation
    let den_com = [];
    if (dens.length === 0) {
        den_com = ['natural', '1'];
    } else {
        den_com = dens.map(den => ['mul', den]);
        den_com = mulIdentity(array2ChainTree(den_com, true));
    }

    // Construct a new tree with the common denominator multiplied
    // Execute only if denom_comm !== ['natural', '1']
    const one = JSON.stringify(['natural', '1']);
    if (JSON.stringify(den_com) === one) {
        return tree;
    }
    let newOperand = [];
    const zero = JSON.stringify(['natural', '0']);
    const is_numeric_den_com = isNumeric(den_com);
    operand.forEach(term => {
        const [op, ...terms_1] = term;
        if (JSON.stringify(term) === zero) {
            newOperand = [...newOperand, term];
        } else if (op === 'addchain') {
            const term_new = form_new_term_addchain(terms_1, den_com, is_numeric_den_com);
            newOperand = [...newOperand, term_new];
        } else {
            let term_new = multFactor(term, ['mul', den_com]);
            if (isNumeric(term) && is_numeric_den_com) {
                term_new = evalNumericValues(term_new);
            }
            newOperand = [...newOperand, term_new];
        }
    });
    return [operator, ...newOperand];
}

function form_new_term_addchain(terms_1, den_com, is_numeric_den_com) {
    const one = JSON.stringify(['natural', '1']);
    const minus_one = JSON.stringify(['negative', ['natural', '1']]);
    let terms_new = [];
    terms_1.forEach(term_1 => {
        let term_new = [];
        const [op_1, term_11] = term_1;
        const term_11_s = JSON.stringify(term_11);
        if (term_11_s === one) {
            term_new = den_com;
        } else if (term_11_s === minus_one) {
            term_new = ['negative', den_com];
        } else {
            term_new = multFactor(term_11, ['mul', den_com], true);
            if (isNumeric(term_11) && is_numeric_den_com) {
                term_new = evalNumericValues(term_new);
            }
        }
        terms_new = [...terms_new, [op_1, term_new]];
    });
    return array2ChainTree(terms_new)
}

/*

import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{x4}{4}=\\frac{2y}{3}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = mulAllSidesByCommonDenom(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
