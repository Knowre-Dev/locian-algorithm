import {addNegative} from '../rc/function_71.inc.js';
import _ from 'lodash';


export function ineqMulNeg(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'inequality') {
        var flag;
        if (tree_1[0][0] === 'negative') {
            newOperand.push(tree_1[0][1]);              
            flag = true;
        } else if(tree_1[0][0] === 'addchain' && tree_1[0][1][0] === 'sub') {
            newOperand.push(addNegative(['negative', tree_1[0]]));    
            flag = true;
        }else{
            newOperand.push(tree_1[0]);
            flag = false;
        }  
        if (flag === true) {
            for (var i = 1; i < tree_1.length; i++) {
                if (i % 2 !== 0) {
                    if (tree_1[i] === 'gt') {
                        newOperand.push('lt');
                    } else if (tree_1[i] === 'ge') {
                        newOperand.push('le');
                    } else if (tree_1[i] === 'lt') {
                        newOperand.push('gt');
                    }else{
                        newOperand.push('ge');
                    }
                } else {
                    if (tree_1[i][0] === 'negative') {
                        newOperand.push(tree_1[i][1]);
                    } else if (tree_1[i][0] === 'addchain') {
                        newOperand.push(addNegative(['negative', tree_1[i]]));
                    } else if (tree_1[i][0] === 'natural' && tree_1[i][1] === '0') {
                        newOperand.push(tree_1[i]);
                    } else {
                        newOperand.push(['negative', tree_1[i]]);
                    }
                }
            }
        } else {
            newOperand = tree_1;
        }            
    } else {
        newOperand = tree_1;
    }   
    tree_1 = [operator].concat(newOperand);        
    
    
    return tree_1;
}

export function ineqMulNegUS(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var nOperands = tree_1.length;
    var newOperand = [];
    if (operator !== 'inequality') {
        newOperand = tree_1;           
    } else {
        if (JSON.stringify(tree_1[0]) === JSON.stringify(['natural', '0'])) {
            //var indZero = 0;
            var tree_2 = tree_1.slice(1);
            for (var subtree of tree_2) {
                // If you see any nonnegative argument,
                // just return the whole tree as it was before
                if (Array.isArray(subtree) && 
                    (subtree[0] !== 'negative' &&
                    !(subtree[0] === 'addchain' && subtree[1][0] === 'sub'))) {
                    return [operator].concat(tree_1);
                }
            }
        } else if (JSON.stringify(tree_1[nOperands - 1]) === JSON.stringify(['natural', '0'])) {
            //var indZero = nOperands - 1;
            var tree_2 = tree_1.slice(0, -1);
            for (var subtree of tree_2) {
                if (Array.isArray(subtree) && 
                    (subtree[0] !== 'negative' &&
                        !(subtree[0] === 'addchain' && subtree[1][0] === 'sub'))) {
                    return [operator].concat(tree_1);
                }
            }
        } else {
            return [operator].concat(tree_1);   
        }
        
        for (var subtree of tree_1) {
            if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
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
                        if (subtree[0] === 'negative') {
                            newOperand.push(subtree[1]);
                        } else {
                            newOperand.push(addNegative(['negative', subtree]));
                        }
                }
            }
        }
        
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '-ab<0';
var latex_2 = '-ab<0';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);

var tree_11 = ineqMulNeg(tree_1);
var tree_21 = ineqMulNegUS(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/