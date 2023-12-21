import { addNegative } from '../rc/function_71.inc.js';

export function fracNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'negative': {
            const [, ...operand] = tree;
            const term = fracNegative(operand[0]);
            return term[0] === 'negative' ? term[1]
                : [operator, term];
        }
        case 'fraction': {
            const [, ...operand] = tree;
            let sign = 1;
            let num = fracNegative(operand[0]);
            let den = fracNegative(operand[1]);

            if (num[0] === 'negative') {
                sign *= -1;
                num = num[1];
            } else if (num[0] === 'addchain' && num[1][0] === 'sub') {
                sign *= -1;
                num = addNegative(['negative', num]);
            }

            if (den[0] === 'negative') {
                sign *= -1;
                den = den[1];
            } else if (den[0] === 'addchain' && den[1][0] === 'sub') {
                sign *= -1;
                den = addNegative(['negative', den]);
            }
            return sign === -1 ? ['negative', [operator, num, den]]
                : [operator, num, den];
        }
        case 'addchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                if (term[1][0] === 'fraction') {
                    const nterm = fracNegative(term[1]);
                    nterm[0] === 'negative' ? term[0] === 'add' ? newOperand.push(['sub', nterm[1]])
                        : term[0] === 'sub' ? newOperand.push(['add', nterm[1]])
                        : newOperand.push([term[0], nterm[1]])
                    : newOperand.push([term[0], nterm]);
                } else {
                    newOperand.push(term);
                }
            }
            return [operator, ...newOperand];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            let sign = 1;
            for (const term of operand) {
                const nterm = fracNegative(term[1]);
                if (nterm[0] === 'negative') {
                    sign *= -1;
                    newOperand.push([term[0], nterm[1]]);
                } else {
                    newOperand.push([term[0], nterm]);
                }
            }
            return sign === -1 ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        default: {
            const [, ...operand] = tree;
            const newOperand = operand.map(term => fracNegative(term));
            return [operator, ...newOperand];
        }
    }
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{125\\pi}{\\pi}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracNegative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
