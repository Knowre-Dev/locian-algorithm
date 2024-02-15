export function intervalSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'interval': {
            const newOperand = [
                operand[2],
                operand[3] === ')'
                    ? 'gt'
                    : 'ge',
                vari,
                operand[0] === '('
                    ? 'gt'
                    : 'ge',
                operand[1]
            ];
            return ['inequality', ...newOperand];
        }
        case 'tuple': {
            return ['inequality', operand[1], 'gt', vari, 'gt', operand[0]];
        }
        case 'setname': {
            return operand[0] === 'real'
                ? ['inequality', ['infinity'], 'gt', vari, 'gt', ['negative', ['infinity']]]
                : [operator, ...[]];
        }
        default: {
            return [operator, ...operand.map(term => intervalSetNot(term))];
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
