export function negParenthesis(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        if (operator === 'addchain') {
            if (tree_1[0][0] === 'add' && tree_1[0][1][0] === 'negative') {
                tree_1[0] = ['sub', tree_1[0][1][1]];
            }
            newOperand = tree_1;
        } else {
            for (var v of tree_1) {
                newOperand.push(negParenthesis(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


