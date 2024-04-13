export function mulNegative(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const newOperand = mulNegative(operand[0]);
            return newOperand[0] === 'negative'
                ? newOperand[1]
                : [operator, newOperand];
        }
        case 'mulchain': {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                if (term[1][0] === 'negative') {
                    sign *= -1;
                    [, [, term[1]]] = term;
                }
                newOperand = [...newOperand, term];
            });
            return sign === -1
                ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        default: {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                let new_term = mulNegative(term);
                if (operator === 'fraction' && new_term[0] === 'negative') {
                    sign *= -1;
                    [, new_term] = new_term;
                }
                newOperand = [...newOperand, new_term];
            });
            return sign === -1
                ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
    }
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '-3x';
const tree_1 = LatexToTree(latex_1);
const tree_11 = mulNegative(tree_1);
console.log(JSON.stringify(tree_11, null, 4));
*/
