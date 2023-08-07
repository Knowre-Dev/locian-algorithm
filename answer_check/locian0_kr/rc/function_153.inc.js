
/*
Combines an addchain with at least one fraction into a single fraction
*/
import {mulIdentity} from '../rc/function_56.inc.js';
import {array2ChainTree, findDenominators, findGCF, multFactor} from '../rc/function_152.inc.js';
import {mulAssociative} from '../rc/function_157.inc.js';


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
        var denom = array2ChainTree(denomArr);
        var find = findGCF(denom);
        
        if (JSON.stringify(find['sym']) != JSON.stringify([])) {
            var denom_arr = [];
            for (var [k, f] of find.entries()) {
                if (k == 'const'){
                    denom_arr.push(['mul', f]);
                } else {
                    for (var f1 of f) {
                        denom_arr.push(['mul', f1]);
                    }               
                }         
            }          
            denom = ['mulchain'].concat(denom_arr);
        }    
        
        var newOperand = [];
        for (var term of operand) {
            var op = term[0];
            var subtree = term[1];
            
            var newN = multFactor(subtree, ['mul', denom], true);
            // Some postprocessing before adding to newOperand
            newN = mulAssociative(newN);
            newN = mulIdentity(newN);
            newOperand.push([op, newN]);
        }
        
        var newtree = array2ChainTree(newOperand);
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
import {LatexToTree} from '../checkmath.js';
var latex_1 = '1+\\frac{1}{2}';
var tree_1 = LatexToTree(latex_1);
var tree_11 = fracCombine(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/