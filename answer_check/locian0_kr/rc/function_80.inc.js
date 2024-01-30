export function addPolyZero(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const [operator] = tree;
    if (operator === 'addchain') {
        const [, ...operand] = tree;
        const newOperand = operand.map(term => (term[0] === 'sub' && checkZeroEquiv(term[1])) ? ['add', term[1]]
            : term);
        return [operator, ...newOperand];
    }
    const [, ...operand] = tree;
    return [operator, ...operand.map(term => addPolyZero(term))];
}

export function checkZeroEquiv(tree) {
    if (!Array.isArray(tree)) {
        return false;
    }

    const [operator] = tree;
    switch (operator) {
        case 'fraction': {
            return checkZeroEquiv(tree[1]);
        }
        case 'mulchain': {
            const [, operand] = tree;
            return operand.some(term => JSON.stringify(term) === JSON.stringify(['natural', '0']));
        }
        case 'natural': {
            return tree[1] === '0';
        }
        default: {
            return false;
        }
    }
}

/*
import { LatexToTree, compareMathTree } from '../checkmath.js';

let tree_1 = LatexToTree('0x+x');
let tree_2 = LatexToTree('-0x+x');
tree_1 = addPolyZero(tree_1);
tree_2 = addPolyZero(tree_2);
const result_1 = JSON.stringify(tree_1, null, 4);
const result_2 = JSON.stringify(tree_2, null, 4);
const result = compareMathTree(tree_1, tree_2);
console.log(result_1);
console.log(result_2);
console.log(result);
*/
