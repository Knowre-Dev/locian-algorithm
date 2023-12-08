export function intervalSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    switch (operator) {
        case 'interval': {
            const tree_1 = tree.slice(1);
            let newOperand = [];
            operator = 'inequality';
            newOperand = [
                tree_1[2],
                tree_1[3] === ')' ? 'gt' : 'ge',
                vari,
                tree_1[0] === '(' ? 'gt' : 'ge',
                tree_1[1]
            ];
            return [operator].concat(newOperand);
        }
        case 'tuple': { // jhshin
            const tree_1 = tree.slice(1);
            return ['inequality', tree_1[1], 'gt', vari, 'gt', tree_1[0]];
        }
        case 'setname': {
            const tree_1 = tree.slice(1);
            // let newOperand = [];
            return tree_1[0] === 'real' ? ['inequality', ['infinity'], 'gt', vari, 'gt', ['negative', ['infinity']]]
                : [operator].concat([]);
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(intervalSetNot(v));
            }
            return [operator].concat(newOperand);
        }
    }
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
