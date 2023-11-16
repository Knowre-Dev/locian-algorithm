import _ from 'lodash';

export function posiSign(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'positive') {
        operator = tree_1[0].shift();
        newOperand = tree_1[0];
    } else {
        for (let v of tree_1) {
            newOperand.push(posiSign(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

let tree_1 = LatexToTree("+3");
let tree_2 = LatexToTree("3");
tree_1 = posiSign(tree_1);
tree_2 = posiSign(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/
