import { addNegative } from '../rc/function_71.inc.js';

export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];

    switch (operator) {
        case 'negative': {
            const tree_1 = tree.slice(1);
            let newOperand = [];
            newOperand.push(addFactorNegative(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
            return [operator].concat(newOperand);
        }
        case 'mulchain': {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            let sign = 1;
            const termArr = [];
            const factArr = [];
            for (const term of tree_1) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        let addchain = term[1];
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1 * sign;
                        }
                        factArr.push(['mul', addchain]);
                    } else {
                        termArr.push(term);
                    }
                } else {
                    termArr.push(term);
                }
            }

            for (const term of termArr) {
                newOperand.push(term);
            }
            for (const term of factArr) {
                newOperand.push(term);
            }
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
        case 'addchain': {
            const tree_1 = tree.slice(1);
            let newOperand = [];
            let sign = 1;
            let addchain = ['addchain'].concat(tree_1);
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign = -1 * sign;
            }
            newOperand = addchain.slice(1);
            return sign === -1 ? ['negative', [operator].concat(newOperand)]
                : [operator].concat(newOperand);
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(addFactorNegative(v));
            }
            return [operator].concat(newOperand);
        }
    }
}
