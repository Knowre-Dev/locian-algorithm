/*
Groups variable terms in addchain into like terms (i.e., with the same variables)
Note: Does NOT handle terms where variable is in the denominator

PRECONDITIONS:
1. No mulchain within mulchain or addchain within addchain
2. Input is an addchain of i) variables, ii) constants, and
   iii) mulchains only with i) and at most one ii)
3. No variable is in the denominator of any fraction

Parameters:
tree: A Laco tree

Returns:
A new tree with like terms grouped together into mulchains of an addchain and variable(s)

*/

import { array2ChainTree, findVars, termExists } from '../rc/function_152.inc.js';
import { exprSimpConst } from '../rc/function_154.inc.js';

export function groupLikeVariableTerms(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let [operator, ...operand] = tree;
    switch (operator) {
        case 'natural':
        case 'decimal':
        case 'variable': {
            return tree;
        }
        case 'addchain': {
            // Recursive portion
            // added to allow for proper parse in case a power term is present
            operand = operand.map(term => [term[0], groupLikeVariableTerms(term[1])])
            // Find all variables in this tree
            const vars = findVars([operator, ...operand]);//  variable 수집
            if (vars.length === 0) {
                return [operator, ...operand];
            }
            // Pick a variable
            // and group among the terms not yet visited (i.e., accounted for)
            // that contains this variable/mulchain of variables
            const keys = [...operand.keys()];

            const coeffs = {};
            coeffs.const = [];
            for (const key in vars) {
                coeffs[key.toString()] = [];
            }
            // Iterate through each variable in vars
            vars.forEach((variable, key_var) => {
                // All terms have been visited,
                // so no need to execute the outer foreach loop further
                if (keys.length !== 0) {
                    // Go through each unvisited child node in the tree
                    const key_string = key_var.toString();
                    operand.forEach((term, key_operand) => {
                        if (keys.includes(key_operand)) {
                            const [op] = term; // this is just 'add', 'sub', etc.
                            // If the term contains variable,
                            // then update the coefficient table
                            // and remove this term's index from
                            // the list of indices of not-yet-visited terms
                            if (termExists(variable, term[1], false, true)) {
                                let coeff = [];
                                if (JSON.stringify(variable) === JSON.stringify(term[1])) {
                                    coeff = ['natural', '1'];
                                } else if (term[1][0] === 'mulchain') {
                                    const [, [, ...term_1]] = term;
                                    coeff = term_1.filter(term_term_1 => JSON.stringify(variable) !== JSON.stringify(term_term_1[1]));
                                    coeff = array2ChainTree(coeff);
                                }
                                coeffs[key_string] = [...coeffs[key_string], [op, coeff]];
                                keys.splice(keys.indexOf(key_operand), 1);
                            }
                        }
                    }); // end going through each unvisited child node in the tree
                    // Convert each coefficient
                    // into either a single constant or an addchain of constants

                    if (coeffs[key_string].length > 0) {
                        coeffs[key_string] = array2ChainTree(coeffs[key_string]);
                    }
                }
            });
            // Account for all constant terms, if any
            if (keys.length > 0) {
                coeffs.const = array2ChainTree(keys.map(k => operand[k]));
            }
            // Construct the final list of new operands
            let newOperand = [];
            const ops = new Map([
                ['negative', 'sub'],
                ['pm', 'addsub']
            ]);
            vars.forEach((variable, key_var) => {
                // skip if there is no coefficient for this variable
                if (coeffs[key_var.toString()].length !== 0) {
                    let op = 'add';
                    let coeff = coeffs[key_var.toString()];
                    if (Array.isArray(coeff) && ops.has(coeff[0])) {
                        op = ops.get(coeff[0]);
                        [, coeff] = coeff;
                    }
                    newOperand = JSON.stringify(coeff) === JSON.stringify(['natural', '1'])
                        ? [...newOperand, [op, variable]] // Omit coefficient of 1
                        : [...newOperand, [op, ['mulchain', ['mul', coeff], ['mul', variable]]]];
                }
            });
            // Don't forget any constant term
            if (coeffs.const.length > 0) {
                const coeff = coeffs.const;
                newOperand = coeff[0] === 'negative'
                    ? [...newOperand, ['sub', coeff[1]]]
                    : [...newOperand, ['add', coeff]];
            }

            // If there is only one operand, just output that operand
            // with an appropriate sign as applicable
            return newOperand.length === 1
                ? array2ChainTree(newOperand)
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            // Recursive portion
            operand = operand.map(term => [term[0], groupLikeVariableTerms(term[1])]);
            // Combine each repeating term into an exponential term
            const bases = [];
            const expos = [];
            let ind = 0;
            loop_2: for (const term of operand) {
                const [, term_1] = term; // term = ['mul', term_1];
                const base = term_1[0] === 'power' // ['power', a, b] ?
                    ? ['mul', term_1[1]]
                    : ['mul', term_1];
                const expo = term_1[0] === 'power' // ['power', a, b] ?
                    ? term_1[2][0] === 'negative' // a = ['negative', a_1]
                        ? ['sub', term_1[2][1]]
                        : ['add', term_1[2]]
                    : ['add', ['natural', '1']];

                const bases_entries = bases.entries();
                const base_string = JSON.stringify(base);
                for (const [key, value] of bases_entries) {
                    if (base_string === JSON.stringify(value)) {
                        expos[key] = typeof expos[key] === 'undefined'
                            ? [expo]
                            : [...expos[key], expo];
                        continue loop_2;
                    }
                }
                bases[ind] = base;
                expos[ind] = [expo];
                ind++;
            }
            let newOperand = [];
            const zero = JSON.stringify(['natural', '0']);
            const one = JSON.stringify(['natural', '1']);
            for (let i = 0; i < ind; i++) {
                let expo_i = exprSimpConst(array2ChainTree(expos[i]));
                if (JSON.stringify(expo_i) !== zero) {
                    if (expo_i[0] === 'negative') {
                        bases[i][0] = 'div';
                        [, expo_i] = expo_i;
                    }
                    const term = JSON.stringify(expo_i) === one
                        ? bases[i]
                        : [bases[i][0], ['power', bases[i][1], expo_i]];
                    newOperand = [...newOperand, term];
                }
            }
            // Snippet 1
            // If there is only one operand, just output that operand
            // with inversion, as applicable
            if (newOperand.length === 1) {
                return newOperand[0][0] === 'div'
                    ? ['fraction', ['natural', '1'], newOperand[0][1]]
                    : newOperand[0][1];
            }
            // Prepend 1 at the front if all terms are division terms
            return newOperand.some(newOpd => newOpd[0] === 'mul')
                ? [operator, ...newOperand]
                : [operator, ['mul', ['natural', '1'], ...newOperand]];
        }
        default: {
            return [operator, ...operand.map(term => groupLikeVariableTerms(term))];
        }
    }
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x*x';
let tree1 = groupLikeVariableTerms(LatexToTree(latex_1));
let result_1 = JSON.stringify(tree1, null, 4);
console.log(result_1);
*/
