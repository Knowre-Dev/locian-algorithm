

/*
Combines an addchain with at least one fraction into a single fraction
*/
import {mulAssociative} from '../rc/function_1.inc.js';
import {mulIdentity} from '../rc/function_13.inc.js';
import {array2ChainTree, findDenominators, multFactor} from '../rc/function_135.inc.js';

export function fracCombine(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1) || tree_1.length < 1) {
        return tree_1;
    }
    
    var operator = tree_1[0];
    var operand = tree_1.slice(1);
    if (operator == 'addchain') {
        var denomArr = findDenominators(tree_1, true);
        if (denomArr.length == 0) {
            return [operator].concat(operand);
        }
        for (var [k, d] of denomArr.entries()) {
            denomArr[k] = ['mul', d];
        }
        var denomArr_unique = [];
        for (var denom of denomArr) {
            var is_unique = true;
            for (var v of denomArr_unique) {
                if (JSON.stringify(denom) == JSON.stringify(v)) {
                    is_unique = false;
                    break;
                }
            }
            if (is_unique) {
                denomArr_unique.push(denom);
            }
        }
        
        denomArr = denomArr_unique;
        var denom = array2ChainTree(denomArr);
        
        var newOperand = [];
        for (var term of operand) {
            var op = term[0];
            var subtree = term[1];
            
            var newN = multFactor(subtree, ['mul', denom], true);
            
            // Some postprocessing before adding to newOperand
            var newN = mulAssociative(newN);
            newN = mulIdentity(newN);
            
            newOperand.push([op, newN]);
        }
        var newtree = array2ChainTree(newOperand);
        
        /*//
        newtree = addAssociative(newtree);
        newtree = addNegative(newtree);
        //*/
        return ['fraction', newtree, denom];
        
    } else {
        var newOperand = [];
        for (var subtree of operand) {
            newOperand.push(fracCombine(subtree));
        }
        operand = newOperand;
        
    }
    
    return [operator].concat(operand);
    
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracCombine;
var latex1 = '\\tan\\frac{1}{2}(x+1)';
var tree1 = LatexToTree(latex1);
var tree11 = func(tree1);

console.log(JSON.stringify(tree11, null, 4));
*/
