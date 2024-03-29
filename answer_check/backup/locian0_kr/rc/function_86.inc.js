export function decIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'decimal') {
            if (tree_1[0].substr(0, 1) === '.') {
                newOperand.push('0' + tree_1[0]);
            } else {
                newOperand = tree_1;
            }            
        } else if (operator === 'rdecimal') {
            if (tree_1[0] == '') {
                newOperand.push('0');
                newOperand.push(tree_1[1]);
                newOperand.push(tree_1[2]);
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(decIdentity(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

