export function ineqSetNot(tree, vari = ['anything', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();        
        var newOperand = [];
        if (operator === 'inequality') {
            if (tree_1.length == 3) {
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
        } else {
            for (var v of tree_1) {
                newOperand.push(ineqSetNot(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

