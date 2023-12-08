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

    const operator = tree[0];

    switch (operator) {
        case 'addchain': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            const add_term = [];
            for (const t of tree_1) {
                if (t[0] === 'add') {
                    if (t[1][0] === 'addchain') {
                        const t_1_entries = t[1].entries();
                        for (const [k, t11] of t_1_entries) {
                            if (k !== 0) {
                                add_term.push(t11);
                            }
                        }
                    } else {
                        if (t[1][0] === 'mulchain') {
                            let addchain = false;
                            const t_1_entries = t[1].entries();
                            for (const [k, t1] of t_1_entries) {
                                if (k !== 0 && t1[1][0] === 'addchain') {
                                    addchain = t;
                                }
                            }
                            if (addchain !== false) {
                                add_term.push(addFactoredForm(addFactoredFormVar(addchain)));
                            } else {
                                add_term.push(t);
                            }
                        } else {
                            add_term.push(t);
                        }
                    }
                } else {
                    if (t[1][0] === 'addchain') {
                        const t_1_entries = t[1].entries();
                        for (const [k, t11] of t_1_entries) {
                            if (k !== 0) {
                                t11[0] === 'add' ? add_term.push(['sub', t11[1]])
                                : add_term.push(['add', t11[1]]);
                            }
                        }
                    } else {
                        if (t[1][0] === 'mulchain') {
                            let addchain = false;
                            const t_1_entries = t[1].entries();
                            for (const [k, t1] of t_1_entries) {
                                if (k !== 0 && t1[1][0] === 'addchain') {
                                    addchain = t;
                                    break;
                                }
                            }

                            if (addchain !== false) {
                                add_term.push(addFactoredForm(addFactoredFormVar(addchain)));
                            } else {
                                add_term.push(t);
                            }
                        } else {
                            add_term.push(t);
                        }
                    }
                }
            }

            return add_term.length !== 0 ? addFactoredFormVar(['addchain'].concat(add_term))
                : [operator].concat(newOperand);
        }
        case 'mulchain': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const t of tree_1) {
                newOperand.push(sub_addFactored(t));
            }
            return [operator].concat(newOperand);
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
