export function mulAssociative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        for (var [k, v] of tree_1.entries()) {
            var term = mulAssociative(v);
            if (operator === 'mulchain' && 
                term[0] === 'mul' && 
                term[1][0] === 'mulchain') {
                
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


