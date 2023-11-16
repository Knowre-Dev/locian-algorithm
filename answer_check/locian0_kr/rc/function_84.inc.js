import _ from 'lodash';

export function intervalSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);

    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'interval') {
        operator = 'inequality';
        newOperand = [
            tree_1[2],
            tree_1[3] === ')' ? 'gt' : 'ge',
            vari,
            tree_1[0] === '(' ? 'gt' : 'ge',
            tree_1[1]
        ];
    } else if (operator === 'tuple') { // jhshin
        operator = 'inequality';
        newOperand = [
            tree_1[1],
            'gt',
            vari,
            'gt',
            tree_1[0]
        ];
    } else if (operator === 'setname') {
        if (tree_1[0] === 'real') {
            operator = 'inequality';
            newOperand = [
                ['infinity'],
                'gt',
                vari,
                'gt',
                ['negative', ['infinity']]
            ];
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(intervalSetNot(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree, compareMathTree, is_equal_tree} from "../checkmath.js";

let tree_1 = LatexToTree("4\\gt\\pi\\gt2");
let tree_2 = LatexToTree("(2,4)");
tree_1 = intervalSetNot(tree_1);
tree_2 = intervalSetNot(tree_2);
let result_1 = JSON.stringify(tree_1, null, 4);
let result_2 = JSON.stringify(tree_2, null, 4);
let result = compareMathTree(tree_1, tree_2);
console.log(result);
console.log(result_1);
console.log(result_2);
*/