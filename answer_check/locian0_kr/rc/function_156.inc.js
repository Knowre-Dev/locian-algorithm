
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
//import {mulIdentity} from '../rc/function_59.inc.js';
import {array2ChainTree, findVars, termExists} from '../rc/function_152.inc.js';
import {exprSimpConst} from '../rc/function_154.inc.js';
import _ from 'lodash';


export function groupLikeVariableTerms(tree = null) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    switch (operator) {
        case 'natural':
        case 'decimal':
        case 'variable':
            newOperand = tree_1;
            break;
        case 'addchain':
            // Recursive portion
            // added to allow for proper parse in case a power term is present
            var newtree = [];
            for (var term of tree_1) {
                newtree.push([term[0], groupLikeVariableTerms(term[1])]);
            }
            tree_1 = newtree;
            
            // Find all variables in this tree
            var varList = findVars([operator].concat(tree_1));
            if (varList.length === 0) {
                newOperand = tree_1;
                break;
            }
            // Pick a variable
            // and group among the terms not yet visited (i.e., accounted for)
            // that contains this variable/mulchain of variables
            var termIndices = [...tree_1.keys()];
            
            var coeffArr = new Object();
            coeffArr['const'] = [];
            for (var k in varList) {
                coeffArr[k.toString()] = [];
            }
            // Iterate through each variable in varList
            for (var [k, variable] of varList.entries()) {
                
                if (termIndices.length === 0) {
                    // All terms have been visited,
                    //so no need to execute the outer foreach loop further
                    break;
                }
                
                // Go through each unvisited child node in the tree
                for (var [tk, term] of tree_1.entries()) {
                    if (termIndices.includes(tk)) {
                        var addOp = term[0]; // this is just 'add', 'sub', etc.
                        
                        // If the term contains variable,
                        // then update the coefficient table
                        // and remove this term's index from
                        // the list of indices of not-yet-visited terms
                        if (termExists(variable, term[1], false, true)) {
                            var coeff = [];
                            if (JSON.stringify(variable) === JSON.stringify(term[1])) {
                                coeff = ['natural', '1'];
                            } else if (term[1][0] === 'mulchain') {
                                var term_1 = term[1].slice(1);
                                for (var m of term_1) {
                                    if (JSON.stringify(variable) !== JSON.stringify(m[1])) {
                                        coeff.push(m);
                                    }
                                }
                                coeff = array2ChainTree(coeff);
                                
                            }
                            coeffArr[k.toString()].push([addOp, coeff]);
                            termIndices.splice(termIndices.indexOf(tk), 1);
                        }
                    }
                    
                } // end going through each unvisited child node in the tree
                
                // Convert each coefficient
                // into either a single constant or an addchain of constants
                if (coeffArr[k.toString()].length > 0) {
                    coeffArr[k.toString()] = array2ChainTree(coeffArr[k.toString()]);
                }
                
            } // end iterating through each variable in varList
            
            // Account for all constant terms, if any
            if (termIndices.length > 0) {
                var k = 'const';
                for (var tk of termIndices) {
                    coeffArr[k.toString()].push(tree_1[tk]);
                }
                coeffArr[k.toString()] = array2ChainTree(coeffArr[k.toString()]);
            }
            
            // Construct the final list of new operands
            for (var [k, variable] of varList.entries()) {
                // skip if there is no coefficient for this variable
                
                if (coeffArr[k.toString()].length === 0) {
                    continue;
                }
                var addOp = 'add';
                var coeff = coeffArr[k.toString()];
                if (Array.isArray(coeff)) {
                    if (coeff[0] === 'negative') {
                        addOp = 'sub';
                        coeff = coeff[1];
                    } else if (coeff[0] === 'pm') {
                        addOp = 'addsub';
                        coeff = coeff[1];
                    }
                }
                if (JSON.stringify(coeff) === JSON.stringify(['natural', '1'])) {
                    // Omit coefficient of 1
                    newOperand.push([addOp, variable]);
                } else {
                    newOperand.push([addOp, ['mulchain', ['mul', coeff], ['mul', variable]]]);
                }
            }
            // Don't forget any constant term
            if (coeffArr['const'].length > 0) {
                coeff = coeffArr['const'];
                if (coeff[0] === 'negative') {
                    newOperand.push(['sub', coeff[1]]);
                } else {
                    newOperand.push(['add', coeff]);
                }
            }
            
            // If there is only one operand, just output that operand
            // with an appropriate sign as applicable
            if (newOperand.length === 1) {
                return array2ChainTree(newOperand);
            }
            break;
            
        case 'mulchain':
            // Recursive portion
            var newtree = [];
            for (var term of tree_1) {
                newtree.push([term[0], groupLikeVariableTerms(term[1])]);
            }
            tree_1 = newtree;
            
            // Combine each repeating term into an exponential term
            var baseArr = [];
            var expoArr = [];
            var ind = 0;
            
            for (var term of tree_1) {
                var base = ['mul', term[1]];
                var expo = ['add', ['natural', '1']];
                if (base[1][0] === 'power') {
                    expo[1] = base[1][2];
                    base[1] = base[1][1];
                }
                if (expo[1][0] === 'negative') {
                    expo[0] = 'sub';
                    expo[1] = expo[1][1];
                }
                
                var tk = -1;
                for (var [i, v] of baseArr.entries()) {
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
            
            var range = [];
            for (var i = 0; i <= ind-1; i++) {
                range.push(i);
            }
            
            for (var k of range) {
                
                expoArr[k] = array2ChainTree(expoArr[k]);
                expoArr[k] = exprSimpConst(expoArr[k]);
                if (JSON.stringify(expoArr[k]) === JSON.stringify(['natural', '0'])) {
                    continue;
                }
                if (expoArr[k][0] === 'negative') {
                    baseArr[k][0] = 'div';
                    expoArr[k] = expoArr[k][1];
                }
                
                var mTerm = [baseArr[k][0], ['power', baseArr[k][1], expoArr[k]]];
                if (JSON.stringify(mTerm[1][2]) === JSON.stringify(['natural', '1'])) {
                    mTerm[1] = mTerm[1][1];
                }
                
                newOperand.push(mTerm);
            }
            
            /* Snippet 1 */
            
            // If there is only one operand, just output that operand
            // with inversion, as applicable
            if (newOperand.length === 1) {
                if (newOperand[0][0] === 'div') {
                    return ['fraction', ['natural', '1'], newOperand[0][1]];
                } else {
                    return newOperand[0][1];
                }
            }
            
            // Prepend 1 at the front if all terms are division terms
            var allDiv = true;
            for (var newOpd of newOperand) {
                if (newOpd[0] === 'mul')
                    allDiv = false;
            }
            if (allDiv) {
                newOperand.unshift(['mul', ['natural', '1']]);
            }
            break;
        
        case 'fraction':
        default:
            for (var subtree of tree_1) {
                newOperand.push(groupLikeVariableTerms(subtree));
            }
    }
    
    tree_1 = [operator].concat(newOperand);
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'x*x';
var tree1 = groupLikeVariableTerms(LatexToTree(latex_1));
var result_1 = JSON.stringify(tree1, null, 4);
console.log(result_1);
*/
