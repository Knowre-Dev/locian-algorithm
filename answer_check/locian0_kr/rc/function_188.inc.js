export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    switch (operator) {
        case 'nthroot': {
            const tree_1 = tree.slice(1);
            switch (tree_1[1][0]) {
                case 'mulchain': { // 루트 안이 곱셈식일 경우
                    const newOperand = [];
                    // operator = 'mulchain';
                    const tree_1_1 = tree_1[1];
                    for (const v of tree_1_1) {
                        Array.isArray(v) ? newOperand.push([v[0], rootToExp(['nthroot', tree_1[0], v[1]])])
                        : newOperand.push(v);
                    }
                    return newOperand;
                }
                case 'power': { // 루트 안이 거듭제곱일 경우
                    return ['power', tree_1[1][1], ['fraction', tree_1[1][2], tree_1[0]]];
                }
                default: {
                    return ['power', tree_1[1], ['fraction', ['natural', '1'], tree_1[0]]];
                }
            }
        }
        case 'squareroot': {
            return rootToExp(['nthroot'].concat([['natural', '2']].concat(tree.slice(1))));
        }
        default: {
            const tree_1 = tree.slice(1);
            const newOperand = [];
            for (const v of tree_1) {
                newOperand.push(rootToExp(v));
            }
            return [operator].concat(newOperand);
        }
    }
}
