export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let operator = tree[0];
    if (operator === 'addchain') {
        const tree_1 = tree.slice(1);
        let newOperand = [];
        for (const v of tree_1) {
            if (!(v[1][0] === 'natural' && v[1][1] === '0')) {
                newOperand.push(v);
            }
        }
        const newOperand_length = newOperand.length;
        switch (newOperand_length) {
            case 0: {
                operator = 'natural';
                newOperand = ['0'];
                break;
            }
            case 1: {
                switch (newOperand[0][0]) {
                    case 'add': {
                        operator = newOperand[0][1].shift();
                        newOperand = newOperand[0][1];
                        break;
                    }
                    case 'sub': {
                        operator = 'negative';
                        newOperand = [newOperand[0][1]];
                        break;
                    }
                    case 'addsub': {
                        operator = 'pm';
                        newOperand = [newOperand[0][1]];
                        break;
                    }
                    case 'subadd': {
                        operator = 'mp';
                        newOperand = [newOperand[0][1]];
                        break;
                    }
                }
                break;
            }
        }
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(addIdentity(v));
    }
    return [operator].concat(newOperand);
}
