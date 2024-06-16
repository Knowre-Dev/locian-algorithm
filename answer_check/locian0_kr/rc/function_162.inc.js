import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { addFactoredFormVar } from '../rc/function_117.inc.js';
export function sub_addFactored(tree = null) {
    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (!Array.isArray(tree)) {
        return tree;
    }
    const tree_s = JSON.stringify(tree)
    if (tree_s !== JSON.stringify(fracSimp(tree)) || tree_s !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }
    const [operator, ...operand] = tree;

    switch (operator) {
        case 'addchain': {
            let operand_new = [];
            const ops = new Map([
                ['add', 'sub'],
                ['sub', 'add']
            ])
            operand.forEach(term => {
                const [op, [operator_1, ...terms_1]] = term;
                const terms_new = operator_1 === 'addchain'
                    ? op === 'add'
                        ? terms_1
                        : terms_1.map(term_1 => [ops.get(term_1[0]), term_1[1]])
                    : operator_1 === 'mulchain' && terms_1.some(term_1 => term_1[1][0] === 'addchain')
                        ? [addFactoredForm(addFactoredFormVar(term))]
                        : [term];
                operand_new = [...operand_new, ...terms_new];
            })
            return addFactoredFormVar(['addchain', ...operand_new]);
        }
        case 'mulchain': {
            const operand_new = operand.map(term => sub_addFactored(term));
            return [operator, ...operand_new];
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
