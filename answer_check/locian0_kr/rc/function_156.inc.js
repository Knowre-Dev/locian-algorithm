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
            const varList = findVars([operator, ...operand]);
            if (varList.length === 0) {
                return [operator, ...operand];
            }
            // Pick a variable
            // and group among the terms not yet visited (i.e., accounted for)
            // that contains this variable/mulchain of variables
            const termIndices = [...operand.keys()];

            const coeffArr = {};
            coeffArr.const = [];
            for (const key in varList) {
                coeffArr[key.toString()] = [];
            }
            // Iterate through each variable in varList
            varList.forEach((variable, key) => {
                // All terms have been visited,
                // so no need to execute the outer foreach loop further
                if (termIndices.length !== 0) {
                    // Go through each unvisited child node in the tree
                    const key_string = key.toString();
                    operand.forEach((term, key_operand) => {
                        if (termIndices.includes(key_operand)) {
                            const [addOp] = term; // this is just 'add', 'sub', etc.
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
                                coeffArr[key_string] = [...coeffArr[key_string], [addOp, coeff]];
                                termIndices.splice(termIndices.indexOf(key_operand), 1);
                            }
                        }
                    }); // end going through each unvisited child node in the tree
                    // Convert each coefficient
                    // into either a single constant or an addchain of constants

                    if (coeffArr[key_string].length > 0) {
                        coeffArr[key_string] = array2ChainTree(coeffArr[key_string]);
                    }
                }
            });
            // Account for all constant terms, if any
            if (termIndices.length > 0) {
                coeffArr.const = termIndices.map(index => operand[index]);
                coeffArr.const = array2ChainTree(coeffArr.const);
            }
            // Construct the final list of new operands
            let newOperand = [];
            varList.forEach((variable, key_variable) => {
                // skip if there is no coefficient for this variable
                if (coeffArr[key_variable.toString()].length !== 0) {
                    let addOp = 'add';
                    let coeff = coeffArr[key_variable.toString()];
                    if (Array.isArray(coeff)) {
                        if (coeff[0] === 'negative') {
                            addOp = 'sub';
                            [, coeff] = coeff;
                        } else if (coeff[0] === 'pm') {
                            addOp = 'addsub';
                            [, coeff] = coeff;
                        }
                    }
                    newOperand = (JSON.stringify(coeff) === JSON.stringify(['natural', '1']))
                        ? [...newOperand, [addOp, variable]] // Omit coefficient of 1
                        : [...newOperand, [addOp, ['mulchain', ['mul', coeff], ['mul', variable]]]];
                }
            });
            // Don't forget any constant term
            if (coeffArr.const.length > 0) {
                const coeff = coeffArr.const;
                newOperand = (coeff[0] === 'negative')
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
            const baseArr = [];
            const expoArr = [];
            let ind = 0;
            loop_2: for (const term of operand) {
                const base = ['mul', term[1]];
                const expo = ['add', ['natural', '1']];
                if (base[1][0] === 'power') {
                    [, [, base[1], expo[1]]] = base;
                }
                if (expo[1][0] === 'negative') {
                    expo[0] = 'sub';
                    [, [, expo[1]]] = expo;
                }
                const baseArr_entries = baseArr.entries();
                const base_string = JSON.stringify(base);
                for (const [key, value] of baseArr_entries) {
                    if (base_string === JSON.stringify(value)) {
                        expoArr[key] = typeof expoArr[key] === 'undefined'
                            ? [expo]
                            : [...expoArr[key], expo];
                        continue loop_2;
                    }
                }
                baseArr[ind] = base;
                expoArr[ind] = [expo];
                ind++;
            }
            let newOperand = [];
            const zero = JSON.stringify(['natural', '0']);
            for (let i = 0; i < ind; i++) {
                expoArr[i] = exprSimpConst(array2ChainTree(expoArr[i]));
                if (JSON.stringify(expoArr[i]) !== zero) {
                    if (expoArr[i][0] === 'negative') {
                        baseArr[i][0] = 'div';
                        [, expoArr[i]] = expoArr[i];
                    }

                    const mTerm = [baseArr[i][0], ['power', baseArr[i][1], expoArr[i]]];
                    if (JSON.stringify(mTerm[1][2]) === JSON.stringify(['natural', '1'])) {
                        [, [, mTerm[1]]] = mTerm;
                    }
                    newOperand = [...newOperand, mTerm];
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
