export function powDecomposition(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'power') {
            var base = powDecomposition(tree_1[0]);
            var expo = powDecomposition(tree_1[1]);
            if (base[0] === 'addchain' && expo[0] === 'natural') {
                operator = 'mulchain';
                var expo_int = parseInt(expo[1]);
                for (var i = 0; i < expo_int; i++) {                    
                    newOperand.push(['mul', base]);    
                }                   
            } else {
                newOperand = [base, expo];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(powDecomposition(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

