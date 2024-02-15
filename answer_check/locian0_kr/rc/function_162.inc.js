import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { addFactoredFormVar } from '../rc/function_117.inc.js';

export function sub_addFactored(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    const tree_1 = JSON.stringify(tree)
    if (tree_1 !== JSON.stringify(fracSimp(tree)) || tree_1 !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }

    const [operator, ...operand] = tree;

    switch (operator) {
        case 'addchain': {
            const newOperand = [];
            let add_term = [];
            for (const term of operand) {
                if (term[0] === 'add') {
                    if (term[1][0] === 'addchain') {
                        add_term = [...add_term, ...term[1].slice(1)];
                    } else {
                        if (term[1][0] === 'mulchain') {
                            const [, [, ...operand_term_1]] = term;
                            add_term = operand_term_1.some(term_term_1 => term_term_1[1][0] === 'addchain')
                                ? [...add_term, addFactoredForm(addFactoredFormVar(term))]
                                : [...add_term, term];
                        } else {
                            add_term = [...add_term, term];
                        }
                    }
                } else {
                    if (term[1][0] === 'addchain') {
                        const [, [, ...operand_term_1]] = term;
                        add_term = [...add_term, ...operand_term_1.map(term_term_1 => term_term_1[0] === 'add'
                            ? ['sub', term_term_1[1]]
                            : ['add', term_term_1[1]])
                        ];
                    } else {
                        if (term[1][0] === 'mulchain') {
                            const [, [, ...operand_term_1]] = term;
                            add_term = operand_term_1.some(term_term_1 => term_term_1[1][0] === 'addchain')
                                ? [...add_term, addFactoredForm(addFactoredFormVar(term))]
                                : [...add_term, term];
                        } else {
                            add_term = [...add_term, term];
                        }
                    }
                }
            }
            return add_term.length !== 0
                ? addFactoredFormVar(['addchain', ...add_term])
                : [operator, ...newOperand];
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
