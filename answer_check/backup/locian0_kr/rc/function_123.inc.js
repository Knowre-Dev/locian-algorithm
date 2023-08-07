export function mulFracSeparation(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'fraction') {
            if (tree_1[1][0] == 'mulchain') {
                if (tree_1[0][0] == 'natural' && tree_1[0][1] == '1') {
                    operator = 'mulchain';
                    for (var t1 of tree_1[1]) {
                        if (Array.isArray(t1)) {
                            newOperand.push([
                                t1[0], 
                                ['fraction', tree_1[0], t1[1]]
                            ]);
                        }
                    }
                } else {
                    newOperand = tree_1;
                }
            } else {
                newOperand = tree_1;
            }
        } else {
            for(var v of tree_1) {
                newOperand.push(mulFracSeparation(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }

    return tree_1;
}

