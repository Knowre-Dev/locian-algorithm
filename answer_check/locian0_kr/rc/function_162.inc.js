import { fracSimp } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { fracSimpVar } from '../rc/function_77.inc.js';
import { addFactoredFormVar } from '../rc/function_117.inc.js';

export function sub_addFactored(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    // 약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (JSON.stringify(tree) !== JSON.stringify(fracSimp(tree)) || JSON.stringify(tree) !== JSON.stringify(fracSimpVar(tree))) {
        return tree;
    }

    const [operator] = tree;

    switch (operator) {
        case 'addchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            const add_term = [];
            for (const term of operand) {
                if (term[0] === 'add') {
                    if (term[1][0] === 'addchain') {
                        const term_1_entries = term[1].entries();
                        for (const [key, term_term_1] of term_1_entries) {
                            if (key !== 0) {
                                add_term.push(term_term_1);
                            }
                        }
                    } else {
                        if (term[1][0] === 'mulchain') {
                            let addchain = false;
                            const term_1_entries = term[1].entries();
                            for (const [key, term_term_1] of term_1_entries) {
                                if (key !== 0 && term_term_1[1][0] === 'addchain') {
                                    addchain = term;
                                }
                            }
                            if (addchain !== false) {
                                add_term.push(addFactoredForm(addFactoredFormVar(addchain)));
                            } else {
                                add_term.push(term);
                            }
                        } else {
                            add_term.push(term);
                        }
                    }
                } else {
                    if (term[1][0] === 'addchain') {
                        const term_1_entries = term[1].entries();
                        for (const [key, term_term_1] of term_1_entries) {
                            if (key !== 0) {
                                term_term_1[0] === 'add' ? add_term.push(['sub', term_term_1[1]])
                                : add_term.push(['add', term_term_1[1]]);
                            }
                        }
                    } else {
                        if (term[1][0] === 'mulchain') {
                            let addchain = false;
                            const term_1_entries = term[1].entries();
                            for (const [key, term_term_1] of term_1_entries) {
                                if (key !== 0 && term_term_1[1][0] === 'addchain') {
                                    addchain = term;
                                    break;
                                }
                            }

                            addchain !== false ? add_term.push(addFactoredForm(addFactoredFormVar(addchain)))
                            : add_term.push(term);
                        } else {
                            add_term.push(term);
                        }
                    }
                }
            }

            return add_term.length !== 0 ? addFactoredFormVar(['addchain', ...add_term])
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                newOperand.push(sub_addFactored(term));
            }
            return [operator, ...newOperand];
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
