import { termExists } from '../rc/function_152.inc.js';

export function makeOneSideOfEqIneqZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    const operator = tree[0];
    switch (operator) {
        case 'equation': {
            const tree_1 = tree.slice(1);
            for (const subtree of tree_1) {
                if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
                    return tree;
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of equalities is already identically zero

            const tree_1_entries = tree_1.entries();
            const newOperand = [];
            for (const [k, v] of tree_1_entries) {
                let temp;
                if (k === 0) {
                    temp = ['natural', '0'];
                } else {
                    temp = v;
                    if (v[0] !== 'addchain') {
                        temp = ['addchain', ['add', v]];
                    }
                    temp.push(['sub', tree_1[0]]);
                }
                newOperand.push(temp);
            }
            return [operator].concat(newOperand);
        }
        case 'inequality': {
            const tree_1 = tree.slice(1);
            for (const subtree of tree_1) {
                if (JSON.stringify(subtree) === JSON.stringify(['natural', '0'])) {
                    return [operator].concat(tree_1);
                }
            }
            // From here on, we are guaranteed that
            // no side in the chain of inequalities is already identically zero

            const tree_1_entries = tree_1.entries();
            const newOperand = [];
            for (const [k, v] of tree_1_entries) {
                let temp;
                if (k === 0) {
                    temp = ['natural', '0'];
                } else {
                    temp = v;
                    if (!['lt', 'le', 'ge', 'gt'].includes(v) &&
                        !termExists('infinity', v)) {
                        if (v[0] !== 'addchain') {
                            temp = ['addchain', ['add', v]];
                        }
                        temp.push(['sub', tree_1[0]]);
                    }
                }
                newOperand.push(temp);
            }
            return [operator].concat(newOperand);
        }
        default: {
            return tree;
        }
    }
    // NOTE: This function does not distribute the minus sign
    //     Use addNegative() right after this function to perform that transformation
}
