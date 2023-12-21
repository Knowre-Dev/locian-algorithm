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

    const [operator] = tree;
    switch (operator) {
        case 'natural':
        case 'decimal':
        case 'variable': {
            return tree;
        }
        case 'addchain': {
            // Recursive portion
            // added to allow for proper parse in case a power term is present
            const newtree = [];
            let [, ...operand] = tree;
            for (const term of operand) {
                newtree.push([term[0], groupLikeVariableTerms(term[1])]);
            }
            operand = newtree;

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
            let varList_entries = varList.entries();
            for (const [key, variable] of varList_entries) {
                if (termIndices.length === 0) {
                    // All terms have been visited,
                    // so no need to execute the outer foreach loop further
                    break;
                }

                // Go through each unvisited child node in the tree
                const operand_entries = operand.entries();
                const key_string = key.toString();
                for (const [key_operand, term] of operand_entries) {
                    if (termIndices.includes(key_operand)) {
                        const addOp = term[0]; // this is just 'add', 'sub', etc.
                        // If the term contains variable,
                        // then update the coefficient table
                        // and remove this term's index from
                        // the list of indices of not-yet-visited terms
                        if (termExists(variable, term[1], false, true)) {
                            let coeff = [];
                            if (JSON.stringify(variable) === JSON.stringify(term[1])) {
                                coeff = ['natural', '1'];
                            } else if (term[1][0] === 'mulchain') {
                                const [, ...term_1] = term[1];
                                for (const term_term_1 of term_1) {
                                    if (JSON.stringify(variable) !== JSON.stringify(term_term_1[1])) {
                                        coeff.push(term_term_1);
                                    }
                                }
                                coeff = array2ChainTree(coeff);
                            }
                            coeffArr[key_string].push([addOp, coeff]);
                            termIndices.splice(termIndices.indexOf(key_operand), 1);
                        }
                    }
                } // end going through each unvisited child node in the tree

                // Convert each coefficient
                // into either a single constant or an addchain of constants

                if (coeffArr[key_string].length > 0) {
                    coeffArr[key_string] = array2ChainTree(coeffArr[key_string]);
                }
            } // end iterating through each variable in varList

            // Account for all constant terms, if any
            if (termIndices.length > 0) {
                for (const index of termIndices) {
                    coeffArr.const.push(operand[index]);
                }
                coeffArr.const = array2ChainTree(coeffArr.const);
            }
            // Construct the final list of new operands
            const newOperand = [];
            varList_entries = varList.entries();
            for (const [key_variable, variable] of varList_entries) {
                // skip if there is no coefficient for this variable
                if (coeffArr[key_variable.toString()].length === 0) {
                    continue;
                }
                let addOp = 'add';
                let coeff = coeffArr[key_variable.toString()];
                if (Array.isArray(coeff)) {
                    if (coeff[0] === 'negative') {
                        addOp = 'sub';
                        coeff = coeff[1];
                    } else if (coeff[0] === 'pm') {
                        addOp = 'addsub';
                        coeff = coeff[1];
                    }
                }
                (JSON.stringify(coeff) === JSON.stringify(['natural', '1'])) ? newOperand.push([addOp, variable]) // Omit coefficient of 1
                : newOperand.push([addOp, ['mulchain', ['mul', coeff], ['mul', variable]]]);
            }
            // Don't forget any constant term
            if (coeffArr.const.length > 0) {
                const coeff = coeffArr.const;
                (coeff[0] === 'negative') ? newOperand.push(['sub', coeff[1]])
                : newOperand.push(['add', coeff]);
            }

            // If there is only one operand, just output that operand
            // with an appropriate sign as applicable
            return newOperand.length === 1 ? array2ChainTree(newOperand)
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            // Recursive portion
            let [, ...operand] = tree;
            const newtree = [];
            for (const term of operand) {
                newtree.push([term[0], groupLikeVariableTerms(term[1])]);
            }
            operand = newtree;

            // Combine each repeating term into an exponential term
            const baseArr = [];
            const expoArr = [];
            let ind = 0;

            for (const term of operand) {
                const base = ['mul', term[1]];
                const expo = ['add', ['natural', '1']];
                if (base[1][0] === 'power') {
                    expo[1] = base[1][2];
                    base[1] = base[1][1];
                }
                if (expo[1][0] === 'negative') {
                    expo[0] = 'sub';
                    expo[1] = expo[1][1];
                }

                let tk = -1;
                const baseArr_entries = baseArr.entries()
                for (const [i, v] of baseArr_entries) {
                    if (JSON.stringify(base) === JSON.stringify(v)) {
                        tk = i;
                        break;
                    }
                }

                if (tk === -1) {
                    baseArr[ind] = base;
                    expoArr[ind] = [];
                    expoArr[ind].push(expo);
                    ind++;
                } else {
                    if (typeof expoArr[tk] === 'undefined') {
                        expoArr[tk] = [];
                    }
                    expoArr[tk].push(expo);
                }
            }

            const range = [];
            for (let i = 0; i < ind; i++) {
                range.push(i);
            }
            const newOperand = [];
            for (const k of range) {
                expoArr[k] = array2ChainTree(expoArr[k]);
                expoArr[k] = exprSimpConst(expoArr[k]);
                if (JSON.stringify(expoArr[k]) === JSON.stringify(['natural', '0'])) {
                    continue;
                }
                if (expoArr[k][0] === 'negative') {
                    baseArr[k][0] = 'div';
                    expoArr[k] = expoArr[k][1];
                }

                const mTerm = [baseArr[k][0], ['power', baseArr[k][1], expoArr[k]]];
                if (JSON.stringify(mTerm[1][2]) === JSON.stringify(['natural', '1'])) {
                    mTerm[1] = mTerm[1][1];
                }
                newOperand.push(mTerm);
            }

            // Snippet 1
            // If there is only one operand, just output that operand
            // with inversion, as applicable
            if (newOperand.length === 1) {
                return newOperand[0][0] === 'div' ? ['fraction', ['natural', '1'], newOperand[0][1]]
                    : newOperand[0][1];
            }
            // Prepend 1 at the front if all terms are division terms
            let allDiv = true;
            for (const newOpd of newOperand) {
                if (newOpd[0] === 'mul') {
                    allDiv = false;
                    break;
                }
            }
            return allDiv ? [operator, ...newOperand.unshift(['mul', ['natural', '1']])]
                : [operator, ...newOperand];
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const subtree of operand) {
                newOperand.push(groupLikeVariableTerms(subtree));
            }
            return [operator, ...newOperand];
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
