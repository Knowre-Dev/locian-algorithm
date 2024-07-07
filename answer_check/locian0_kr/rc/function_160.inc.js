// tree negative정리
export function mulNegative(tree) {
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = mulNegative(operand[0]);
            const [op, term_1] = term
            return op === 'negative'
                ? term_1
                : [operator, term];
        }
        case 'mulchain': {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                const [, term_1] = term;
                if (term_1[0] === 'negative') {
                    sign *= -1;
                    [, term[1]] = term_1;
                }
                newOperand = [...newOperand, term];
            });
            const tree_new = [operator, ...newOperand];
            return sign === -1
                ? ['negative', tree_new]
                : tree_new;
        }
        default: {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                let term_new = mulNegative(term);
                const [op, term_new_1] = term_new;
                if (operator === 'fraction' && op === 'negative') {
                    sign *= -1;
                    term_new = term_new_1;
                }
                newOperand = [...newOperand, term_new];
            });
            const tree_new = [operator, ...newOperand];
            return sign === -1
                ? ['negative', tree_new]
                : tree_new;
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
