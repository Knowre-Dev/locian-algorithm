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
            let sign = 1;
            let num = fracNegative(operand[0]);
            let den = fracNegative(operand[1]);
            [num, sign] = sign_simp(num, sign);
            [den, sign] = sign_simp(den, sign);
            const new_tree = [operator, num, den];
            return sign === -1
                ? ['negative', new_tree]
                : new_tree;
        }
        case 'addchain': {
            let newOperand = [];
            const signs = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ]);
            operand.forEach(term => {
                let term_add = term;
                if (term[1][0] === 'fraction') {
                    const nterm = fracNegative(term[1]);
                    term_add = nterm[0] === 'negative'
                        ? signs.has(term[0])
                            ? [signs.get(term[0]), nterm[1]]
                            : [term[0], nterm[1]]
                        : [term[0], nterm];
                }
                newOperand = [...newOperand, term_add];
            });
            return [operator, ...newOperand];
        }
        case 'mulchain': {
            let newOperand = [];
            let sign = 1;
            operand.forEach(term => {
                const nterm = fracNegative(term[1]);
                let term_mul;
                if (nterm[0] === 'negative') {
                    sign *= -1;
                    term_mul = [term[0], nterm[1]];
                } else {
                    term_mul = [term[0], nterm];
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
