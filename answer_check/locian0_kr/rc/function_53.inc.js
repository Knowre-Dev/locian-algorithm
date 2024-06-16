// import { addNegative } from '../rc/function_71.inc.js';
// fraction의 negative 정리
import { sign_change } from '../rc/sub_functions.js';
export function fracNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const term = fracNegative(operand[0]);
            return term[0] === 'negative'
                ? term[1]
                : [operator, term];
        }
        case 'fraction': {
            let [num, den] = operand;
            num = fracNegative(num);
            den = fracNegative(den);
            let sign = 1;
            [num, sign] = sign_simp(num, sign);
            [den, sign] = sign_simp(den, sign);
            const tree_new = [operator, num, den];
            return sign === -1
                ? ['negative', tree_new]
                : tree_new;
        }
        case 'addchain': {
            let newOperand = [];
            const signs = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ]);
            operand.forEach(term => {
                let term_add = term;
                let [op, term_1] = term;
                if (term_1[0] === 'fraction') {
                    term_1 = fracNegative(term_1);
                    term_add = term_1[0] === 'negative'
                        ? signs.has(op)
                            ? [signs.get(op), term_1[1]]
                            : [op, term_1[1]]
                        : [op, term_1];
                }
                newOperand = [...newOperand, term_add];
            });
            return [operator, ...newOperand];
        }
        case 'mulchain': {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                let [op, term_1] = term;
                term_1 = fracNegative(term_1);
                let term_mul;
                if (term_1[0] === 'negative') {
                    sign *= -1;
                    term_mul = [op, term_1[1]];
                } else {
                    term_mul = [op, term_1];
                }
                newOperand = [...newOperand, term_mul];
            });
            const new_tree = [operator, ...newOperand];
            return sign === -1
                ? ['negative', new_tree]
                : new_tree;
        }
        default: {
            return [operator, ...operand.map(term => fracNegative(term))];
        }
    }
}

function sign_simp(term, sign) {
    if (term[0] === 'negative') {
        sign *= -1;
        [, term] = term;
    } else if (term[0] === 'addchain' && term[1][0] === 'sub') {
        sign *= -1;
        term = sign_change(term);
    }
    return [term, sign];
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '\\frac{125\\pi}{\\pi}';
let tree_1 = LatexToTree(latex_1);
let tree_11 = fracNegative(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
