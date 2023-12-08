export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    let operator = tree[0];
    if (operator === 'mulchain') {
        const tree_1 = tree.slice(1);
        if (tree_1[0][1][0] === 'negative' && tree_1[0][1][1][0] === 'natural' && tree_1[0][1][1][1] !== '1') {
            operator = 'negative';
            const first_term = tree_1.shift();
            let newTree = [];
            newTree.push(['mul', first_term[1][1]]);
            newTree = newTree.concat(tree_1);
            const newOperand = [];
            newOperand.push('mulchain');
            for (const n of newTree) {
                newOperand.push(n);
            }
            return [operator, newOperand];
        }
        return tree;
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(mulToNega(v));
    }
    return [operator].concat(newOperand);
}
