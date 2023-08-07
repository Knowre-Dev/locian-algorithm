export function powerFrac(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'power') {
            if (tree_1[0][0] === 'fraction') {
                operator = 'fraction';
                for (var t1 of tree_1[0]){
                    if (Array.isArray(t1)) {
                        newOperand.push(['power', t1, tree_1[1]]);
                    }                    
                }
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(powerFrac(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

