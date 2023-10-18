export function addAssociative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        var newOperand = [];
        for (var [k, v] of tree_1.entries()) {
            var term = addAssociative(v);
            if (operator === 'addchain' && 
                term[0] === 'add' && 
                term[1][0] === 'addchain') {
                for (var [tk, tv] of term[1].entries()) {
                    if (tk !== 0) {
                        newOperand.push(tv);
                    }
                }
            } else {
                newOperand.push(term);
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

