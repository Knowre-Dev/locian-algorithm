import {mulIdentity} from '../rc/function_13.inc.js';
import {array2ChainTree, evalNumericValues, findDenominators, isNumeric, multFactor} from '../rc/function_135.inc.js';



export function mulAllSidesByCommonDenom(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    
    var newOperand = [];
    
    var operator = tree_1.shift();
    if (operator === 'equation' || operator === 'inequality') {
        // Remove any complex fractions
        //tree = fracComplex(tree); Gurantee this instead by precondition (better performance)
        
        // Initialize array to store product of all denominators in each side
        var denomArr = [];
        for (var [k, subtree] of tree_1.entries()) {
            // Find all unique denominators in this subtree
            // Make sure to pass the third arg as TRUE
            // to get absolute values of all denominators (in case of any negative denominators)
            // to ensure preservation of directions of inequality
            denomArr[k] = findDenominators(subtree, true, operator);
            var denomArr_k = [];
            for (var denom of denomArr[k]) {
                var is_unique = true; 
                for (var v of denomArr_k) {
                    if (JSON.stringify(denom) == JSON.stringify(v)) {
                        is_unique = false;
                    }
                }
                if (is_unique) {
                    denomArr_k.push(denom);
                }
            }
            denomArr[k] = denomArr_k;
            // Multiply all denominators in this subtree into a single quantity
            
            if (denomArr[k].length == 0) {
                denomArr[k] = ['natural', '1'];
            } else {
                var prod = [];
                for (var dd of denomArr[k]) {
                    var is_unique = true;
                    for (var d of prod) {
                        if (JSON.stringify(dd) == JSON.stringify(d)) {
                            is_unique = false; 
                            break
                        }
                    }
                    if (is_unique) {
                        prod.push(['mul', dd]);
                    }
                }
                denomArr[k] = array2ChainTree(prod, true);
            }
            
        }
        var denomArr_unique = [];
        for (var denom of denomArr) {
            var is_unique = true; 
            for (var v of denomArr_unique) {
                if (JSON.stringify(denom) == JSON.stringify(v)) {
                    is_unique = false;
                }
            }
            if (is_unique) {
                denomArr_unique.push(denom);
            }
        }
        denomArr = denomArr_unique;
        
        // Calculate the common denominator to multiply on all sides of the equation
        var commonD = [];
        
        for (var denom of denomArr) {
            commonD.push(['mul', denom]);
        }
        commonD = array2ChainTree(commonD, true);
       
        commonD = mulIdentity(commonD);
        
        // Construct a new tree with the common denominator multiplied
        // Execute only if commonD != ['natural', '1']
        if (JSON.stringify(commonD) == JSON.stringify(['natural', '1'])) {
            newOperand = tree_1;
        } else {
            for (var side of tree_1) {
                if (JSON.stringify(side) == JSON.stringify(['natural', '0'])) {
                    newOperand.push(side);
                } else if (side[0] == 'addchain') {
                    var termArr = [];
                    var side_1 = side.slice(1);
                    for (var aterm of side_1) {
                        var newTree;
                        if (JSON.stringify(aterm[1]) == JSON.stringify(['natural', '1'])) {
                            newTree = commonD;
                        } else if (JSON.stringify(aterm[1]) == JSON.stringify(['negative', ['natural', '1']])) {
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
                    var newSide = multFactor(side, ['mul', commonD]);
                    if (isNumeric(side) && isNumeric(commonD)) {
                        newSide = evalNumericValues(newSide);
                    }
                    newOperand.push(newSide);
                }
            }
        }
        
    } else {
        newOperand = tree_1;
    }
    
    tree_1 = [operator].concat(newOperand);
    //tree = exprSimpConst(tree);
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulAllSidesByCommonDenom;
var latex1 = '9x^{2}+12x-4=0';
var latex2 = '\\frac{9}{2}x^{2}+6x-2=0';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/