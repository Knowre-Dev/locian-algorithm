export function mulIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    switch (operator) {
        case 'negative': {
            const tree_1 = tree.slice(1);
            let newOperand = [];
            newOperand.push(mulIdentity(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
            return [operator].concat(newOperand);
        }
        case 'mulchain': {
            const tree_1 = tree.slice(1);
            let newOperand = [];
            let sign = 1;
            for (const v of tree_1) {
                if (v[1][0] === 'natural' && v[1][1] === '1') {
                    continue;
                } else if (v[1][0] === 'negative' && v[1][1][0] === 'natural' && v[1][1][1] === '1') {
                    sign = -1;
                } else {
                    newOperand.push(mulIdentity(v));
                }
            }
            if (newOperand.length === 1) {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
            if (sign === -1) {
                newOperand = [[operator].concat(newOperand)];
                operator = 'negative';
            }
            return [operator].concat(newOperand);
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(mulIdentity(v));
            }
            return [operator].concat(newOperand);
        }
    }
}
