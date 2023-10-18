export function addAdjacentSigns(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var sign = 1;
        var newOperand = [];
        /*
        if (operator === 'negative') {
            newOperand[] = addAdjacentSigns(tree_1[0]);
            if (newOperand[0][0] === 'negative') {
                operator = array_shift(newOperand[0][1]);
                newOperand = newOperand[0][1];
            }
        } else
        */ 
        if (operator === 'addchain') {
            for (var term of tree_1) {             
                var nterm = addAdjacentSigns(term[1]);
                if (nterm[0] === 'negative') {
                    if (term[0] === 'add') {
                        newOperand.push(['sub', nterm[1]]);
                    } else if (term[0] === 'sub') {
                        newOperand.push(['add', nterm[1]]);
                    } else {
                        newOperand.push([term[0], nterm[1]]);
                    }
                } else {
                    newOperand.push([term[0], nterm]);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addAdjacentSigns(v));
            }
        }
        if (sign === -1) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'negative';
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

