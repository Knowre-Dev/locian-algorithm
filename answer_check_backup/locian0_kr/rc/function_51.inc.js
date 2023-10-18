export function posiSign(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'positive') {
            var operator = tree_1[0].shift();
            var newOperand = tree_1[0];
        } else {
            for (var v of tree_1) {
                newOperand.push(posiSign(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

