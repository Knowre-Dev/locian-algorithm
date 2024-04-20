import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { addFactoredFormVar } from '../rc/function_117.inc.js';
export function sub_addFactored(tree = null) {
    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (!Array.isArray(tree)) {
        return tree;
    }
    const tree_1 = JSON.stringify(tree)
    if (tree_1 !== JSON.stringify(fracSimp(tree)) || tree_1 !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }
    const [operator, ...operand] = tree;

    switch (operator) {
        case 'addchain': {
            let add_terms = [];
            const signs = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ]);
            for (const term of operand) {
                const [sign, [operator_term_1, ...operand_term_1]] = term;
                add_terms = operator_term_1 === 'addchain'
                    ? sign === 'add'
                        ? [...add_terms, ...operand_term_1]
                        : [...add_terms, ...operand_term_1.map(term_term_1 => [signs.get(term_term_1[0]), term_term_1[1]])]
                    : operator_term_1 === 'mulchain' && operand_term_1.some(term_term_1 => term_term_1[1][0] === 'addchain')
                        ? [...add_terms, addFactoredForm(addFactoredFormVar(term))]
                        : [...add_terms, term];
            }
            return addFactoredFormVar(['addchain', ...add_terms]);
        }
        case 'mulchain': {
            return [operator, ...operand.map(term => sub_addFactored(term))];
        }
        default: {
            return tree;
        }
    }
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(2-12a)+(3a+6)\\sqrt{2}';
latex_1 = '(3a+6)\\sqrt{2}+(2-12a)';
let tree_1 = LatexToTree(latex_1);
let tree_11 = sub_addFactored(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/
