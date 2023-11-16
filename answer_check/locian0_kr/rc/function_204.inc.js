import {addNegative} from '../rc/function_71.inc.js';
import _ from 'lodash';


export function addNegaToSub(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'addchain') {
        for (let [k, v] of tree_1.entries()) {
            
            if (k === 0) {
                if (v[0] === 'add' && v[1][0] === 'negative') {
                    newOperand.push(['sub', v[1][1]]);
                } else if (v[0] === 'add' && v[1][0] === 'positive') {
                    newOperand.push(['add', v[1][1]]);
                } else {
                    newOperand.push(v);
                }
            } else {                
                newOperand.push(v);
            }
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(addNegative(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    
    return tree_1;
}

/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '(+2)+2';
let latex_2 = '+2+2';
let tree1 = addNegaToSub(LatexToTree(latex_1));
let tree2 = addNegaToSub(LatexToTree(latex_2));
let result1 = JSON.stringify(tree1, null, 4);
let result2 = JSON.stringify(tree2, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree1, null, 4));
console.log(JSON.stringify(tree2, null, 4));
*/