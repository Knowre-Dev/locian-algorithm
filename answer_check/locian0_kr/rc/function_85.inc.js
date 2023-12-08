export function ineqSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const operator = tree[0];
    if (operator === 'inequality') {
        const tree_1 = tree.slice(1);
        let newOperand = [];
        if (tree_1.length === 3) {
            if ((tree_1[0][0] === vari[0] && tree_1[0][1] === vari[1]) || tree_1[0][0] === 'variable') {
                newOperand.push(['infinity']);
                newOperand.push('gt');
                newOperand = newOperand.concat(tree_1);
            } else {
                newOperand = tree_1;
                newOperand.push('gt');
                newOperand.push(['negative', ['infinity']]);
            }
        } else {
            newOperand = tree_1;
        }
        return [operator].concat(newOperand);
    }
    const tree_1 = tree.slice(1);
    const newOperand = [];
    for (const v of tree_1) {
        newOperand.push(ineqSetNot(v));
    }
    return [operator].concat(newOperand);
}
