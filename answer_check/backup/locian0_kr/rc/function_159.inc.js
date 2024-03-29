import {mulIdentity} from '../rc/function_56.inc.js';
import {array2ChainTree, evalNumericValues, findDenominators, isNumeric, multFactor} from '../rc/function_152.inc.js';

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
            denomArr[k] = findDenominators(subtree, true, operator == 'inequality');
            
            // Multiply all denominators in this subtree into a single quantity
            if (denomArr[k].length == 0) {
                denomArr[k] = ['natural', '1'];
            } else {
                var prod = [];
                for (var dd of denomArr[k])
                    prod.push(['mul', dd]);
                denomArr[k] = array2ChainTree(prod, true);
            }
        }
        
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
                    if (isNumeric(side) && isNumeric(commonD))
                        newSide = evalNumericValues(newSide);
                    newOperand.push(newSide);
                }
            }
        }
    } else {
        newOperand = tree_1;
    }
    
    tree_1 = [operator].concat(newOperand);
    return tree_1;
}

/*

import {LatexToTree} from '../checkmath.js';
var latex_1 = '\\frac{x4}{4}=\\frac{2y}{3}';
var tree_1 = LatexToTree(latex_1);
var tree_11 = mulAllSidesByCommonDenom(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/