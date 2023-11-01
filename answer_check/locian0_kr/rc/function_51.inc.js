export function posiSign(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'positive') {
            var operator = tree_1[0].shift();
            var newOperand = tree_1[0];
        } else {
            for (var v of tree_1) {
                newOperand.push(posiSign(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

var tree_1 = LatexToTree("+3");
var tree_2 = LatexToTree("3");
tree_1 = posiSign(tree_1);
tree_2 = posiSign(tree_2);
var result_1 = JSON.stringify(tree_1, null, 4);
var result_2 = JSON.stringify(tree_2, null, 4);
var result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/
