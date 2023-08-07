export function divFrac(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'mulchain') {
            for (var k = 0; k < tree_1.length; k++) {
                if (k === 0) {
                    newOperand.push(tree_1[k]);
                } else if (tree_1[k][0] === 'div' && (newOperand[newOperand.length - 1])[0] === 'mul') {
                    var num = divFrac(newOperand.pop()[1]);
                    var denum = divFrac(tree_1[k][1]);
                    if (tree_1.length == 2) {
                        operator = 'fraction';
                        newOperand.push(num);
                        newOperand.push(denum);
                    } else {
                        var tempArr = ['fraction'].concat([num, denum]);
                        newOperand.push(['mul'].concat([tempArr]));
                    }
                } else {
                    newOperand.push(divFrac(tree_1[k]));
                }
            }
            if (newOperand.length === 1) {
                operator = newOperand[0][1].shift();
                newOperand = newOperand.shift()[1];
            }
        } else {
            for (var [k, arr] of tree_1.entries()) {
                newOperand.push(divFrac(arr));
                /*
                if ( is_array(arr) && gettype(arr[1]) === 'array' && !in_array(arr[1][0], ['variable', 'fraction', 'natural'])) {
                    newOperand[] = divFrac(arr);
                } else {
                    newOperand[] = arr;
                }
                */
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


