import {addNegative} from '../rc/function_28.inc.js';

export function ineqMulNeg(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var nOperands = tree_1.length;
        var newOperand = [];
        if (operator !== 'inequality') {
            newOperand = tree_1;
            
        } else {
            if (JSON.stringify(tree_1[0]) == JSON.stringify(['natural', '0'])) {
                var indZero = 0;
                var tree_11 = tree_1.slice(1);
                for (var subtree of tree_11) {
                    // If you see any nonnegative argument,
                    // just return the whole tree as it was before
                    if (Array.isArray(subtree) && 
                        (subtree[0] != 'negative' &&
                        !(subtree[0] == 'addchain' && subtree[1][0] == 'sub'))) {
                        return [operator].concat(tree_1);
                    }
                }
                
            } else if (JSON.stringify(tree_1[nOperands - 1]) == JSON.stringify(['natural', '0'])) {
                var indZero = nOperands - 1;
                var tree_11 = tree_1.slice(0, -1);
                for (var subtree of tree_11) {
                    if (Array.isArray(subtree) && 
                        (subtree[0] != 'negative' &&
                        !(subtree[0] == 'addchain' && subtree[1][0] == 'sub'))) {
                        return [operator].concat(tree_1);
                    }
                }
                
            } else {
                return [operator].concat(tree_1);
                
            }
            
            for (var subtree of tree_1) {
                if (JSON.stringify(subtree) == JSON.stringify(['natural', '0'])) {
                    newOperand.push(subtree);
                } else {
                    switch (subtree) {
                        case 'gt':
                            newOperand.push('lt');
                            break;
                        
                        case 'ge':
                            newOperand.push('le');
                            break;
                        
                        case 'le':
                            newOperand.push('ge');
                            break;
                        
                        case 'lt':
                            newOperand.push('gt');
                            break;
                        
                        default:
                            if (subtree[0] == 'negative') {
                                newOperand.push(subtree[1]);
                            } else {
                                newOperand.push(addNegative(['negative', subtree]));
                            }
                    }
                }
            }
            
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = ineqMulNeg;
var latex1 = '0\\lt (-4)(a)';
var latex2 = '0<-4a<-(2a+a)';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/