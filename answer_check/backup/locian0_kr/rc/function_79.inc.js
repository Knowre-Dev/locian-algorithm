export function decElimZero(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'decimal') {
            var decArr = tree_1[0].split('');
            
            while (decArr[decArr.length-1] == '0') {
                decArr.splice(-1);
            }
            
            if (decArr[decArr.length-1] == '.') {
                operator = 'natural';
                decArr.splice(-1);
            }
            var dec = decArr.join('');
            newOperand.push(dec);
        } else {
            for (var v of tree_1) {
                newOperand.push(decElimZero(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

