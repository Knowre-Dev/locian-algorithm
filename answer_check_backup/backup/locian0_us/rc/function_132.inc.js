

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

import {exprSimpConst} from '../rc/function_133.inc.js';
import {array2ChainTree, findVars, termExists} from '../rc/function_135.inc.js';


export function groupLikeVariableTerms(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    
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
            if (varList.length == 0) {
                newOperand = tree_1;
                break;
            }
            
            var termIndices = [...tree_1.keys()];
            var coeffArr = new Object();
            coeffArr['const'] = [];
            for (var k in varList) {
                coeffArr[k.toString()] = [];
            }
            
            // Iterate through each variable in varList
            for (var [k, variable] of varList.entries()) {
                if (termIndices.length == 0) {
                    // All terms have been visited,
                    //so no need to execute the outer foreach loop further
                    break;
                }
                
                // Go through each unvisited child node in the tree
                for (var [tk, term] of tree_1.entries()) {
                    if (termIndices.includes(tk)) {
                        var addOp = term[0]; // $this is just 'add', 'sub', etc.
                        
                        // If the term contains $variable,
                        // then update the coefficient table
                        // and remove this term's index from
                        // the list of indices of not-yet-visited terms
                        if (termExists(variable, term[1], false, true)) {
                            var coeff;
                            if (JSON.stringify(variable) == JSON.stringify(term[1])) {
                                coeff = ['natural', '1'];
                            } else if (term[1][0] === 'mulchain') {
                                coeff = [];
                                var term_1 = term[1].slice(1);
                                for (var m of term_1) {
                                    if (JSON.stringify(variable) != JSON.stringify(m[1])) {
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
                if (coeffArr[k].length > 0) {
                   coeffArr[k] = array2ChainTree(coeffArr[k]);
                }
                
            } // end iterating through each variable in varList
            
            // Account for all constant terms, if any
            if (termIndices.length > 0) {
                for (var tk of termIndices) {
                    coeffArr['const'].push(tree_1[tk]);
                }
                coeffArr['const'] = array2ChainTree(coeffArr['const']);
                
            }

            
      
            
            coeffArr['const'] = array2ChainTree(coeffArr['const']);
            // Construct the final list of new operands
            for (var [k, variable] of varList.entries()) {
                // skip if there is no coefficient for this variable
                
                if (JSON.stringify(coeffArr[k.toString()]) == JSON.stringify([])) {
                    continue;
                } else {
                    coeffArr[k.toString()] = array2ChainTree(coeffArr[k.toString()]);
                }
                
                var addOp = 'add';
                var coeff = coeffArr[k.toString()];
                if (coeff[0] == 'negative') {
                    addOp = 'sub';
                    coeff = coeff[1];
                } else if (coeff[0] == 'pm') {
                    addOp = 'addsub';
                    coeff = coeff[1];
                }
                if (JSON.stringify(coeff) == JSON.stringify(['natural', '1'])) {
                    // Omit coefficient of 1
                    newOperand.push([addOp, variable]);
                } else {
                    newOperand.push([addOp, ['mulchain', ['mul', coeff], ['mul', variable]]]);
                }
            }
            
            // Don't forget any constant term
            if (coeffArr['const'].length > 0) {
                var coeff = coeffArr['const'];
                if (coeff[0] == 'negative') {
                    newOperand.push(['sub', coeff[1]]);
                } else {
                    newOperand.push(['add', coeff]);
                }
            }
            
            // If there is only one operand, just output that operand
            // with an appropriate sign as applicable
            if (newOperand.length == 1) {
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
                var base = term;
                var expo = ['add', ['natural', '1']];
                
                if (base[1][0] == 'power') {
                    expo[1] = base[1][2];
                    base[1] = base[1][1];
                }
                if (expo[1][0] == 'negative') {
                    expo[0] = 'sub';
                    expo[1] = expo[1][1];
                }
                var tk = -1;
                
                for (var [k, v] of baseArr.entries()) {
                    
                    if (JSON.stringify(base) == JSON.stringify(v)) {
                        tk = k;
                        break;
                    }
                }
                
                if (tk === -1) {
                    baseArr[ind] = base;
                    expoArr[ind] = [];
                    expoArr[ind].push(expo);
                    ind++;
                } else {
                    expoArr[tk].push(expo);
                }
            }
            for (var k = 0; k <= ind - 1; k++) {
                expoArr[k] = array2ChainTree(expoArr[k]);
                expoArr[k] = exprSimpConst(expoArr[k]);
                
                if (JSON.stringify(expoArr[k]) == JSON.stringify(['natural', '0'])) {
                    continue;
                }
                if (expoArr[k][0] == 'negative') {
                    baseArr[k][0] = 'div';
                    expoArr[k] = expoArr[k][1];
                }
                
                var mTerm = [baseArr[k][0], ['power', baseArr[k][1], expoArr[k]]];
                
                if (JSON.stringify(mTerm[1][2]) == JSON.stringify(['natural', '1'])) {
                    mTerm[1] = mTerm[1][1];

                }
                newOperand.push(mTerm);
            }
            
            
            // If there is only one operand, just output that operand
            // with inversion, as applicable
            if (newOperand.length == 1) {
                if (newOperand[0][0] == 'div') {
                    return ['fraction', ['natural', '1'], newOperand[0][1]];
                } else {
                    return newOperand[0][1];
                }
            }
            
            // Prepend 1 at the front if all terms are division terms
            var allDiv = true;
            for (var newOpd of newOperand) {
                if (newOpd[0] == 'mul') {
                    allDiv = false;
                }
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
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = groupLikeVariableTerms;
//func = findVars;
var latex1 = '2(1-x)x^2+2(-1+x)x+3(-1+x)';
var tree1 = LatexToTree(latex1);

var tree11 = func(tree1);

console.log(JSON.stringify(tree11, null, 4));
*/
/*
function coefficient_variable(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (isNumeric_trans(tree_1)) {
        return [tree_1, []];
    }
    var coefficient = [];
    var variable = [];
    var operator = tree_1.shift();

    if (operator == 'variable') {
        coefficient = ['natural', '1'];
        variable = [operator].concat(tree_1);
        return [coefficient, variable];
    } 
    
    if (operator == 'power') {

        if (tree_1[0][0] == 'variable') {
            coefficient = ['natural', '1'];
            variable = [operator].concat(tree_1);
        } else {
            coefficient = [operator].concat(tree_1);
        }
        return [coefficient, variable];
    }
   
    if (operator == 'mulchain') {
        
        for (var v of tree_1) {
            
            if (isNumeric_trans(v[1])) {
                coefficient.push(v);
                
            } else if (v[1][0] == 'variable') {
                variable.push(v);
            } else if (v[1][0] == 'power') {
                if (v[1][1][0] == 'variable') {
                    variable.push(v);
                } else {
                    coefficient.push(v);
                }
            } else {
                coefficient.push(v);
            }
        }

        if (coefficient.length == 0) {
            coefficient = ['natural', '1'];
        } else if (coefficient.length == 1) {
            coefficient = coefficient[0][1];
        } else {
            coefficient = ['mulchain'].concat(coefficient);
        }

        if (variable.length == 1) {
            variable = variable[0][1];
        } else if (variable.length >= 2) {
            variable = ['mulchain'].concat(variable);
        }
        return [coefficient, variable];
    }

    return [tree_1, variable];
}


export function isNumeric_trans(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return false;
    }

    if (JSON.stringify(tree_1) == JSON.stringify(['variable', 'pi'])) {
        return true;
    }
    if (JSON.stringify(tree_1) == JSON.stringify(['variable', 'e'])) {
        return true;
    }
    if (tree_1[0] == 'absolute') {
        return isNumeric_trans(tree_1[1]);
    }
    if (tree_1[0] == 'negative') {
        return isNumeric_trans(tree_1[1]);
    }
    var fracIsNumeric = tree_1[0] == 'fraction';
    var powIsNumeric = tree_1[0] == 'power';

    // The second term in logical AND evaluates only if tree is a fraction
    fracIsNumeric = fracIsNumeric && isNumeric_trans(tree_1[1]);
    fracIsNumeric = fracIsNumeric && isNumeric_trans(tree_1[2]);
    // The second term in logical AND evaluates only if tree is a power
    powIsNumeric = powIsNumeric && isNumeric_trans(tree_1[1]);
    powIsNumeric = powIsNumeric && isNumeric_trans(tree_1[2]);
    
    
    return ['natural', 'decimal', 'rdecimal'].includes(tree_1[0]) || fracIsNumeric || powIsNumeric;
}
*/
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = coefficient_variable;
var latex1 = '2\\pi x';
var tree1 = LatexToTree(latex1);

var tree11 = func(tree1);
console.log(JSON.stringify(tree11, null, 4));
*/


