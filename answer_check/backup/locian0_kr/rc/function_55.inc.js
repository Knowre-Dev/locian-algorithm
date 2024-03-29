export function addIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'addchain') {
            for (var v of tree_1) {
                if (!(v[1][0] === 'natural' && v[1][1] === '0')) {
                    newOperand.push(v);
                }
            }
            if (newOperand.length == 0) {
                operator = 'natural';
                newOperand = ['0'];
            } else if (newOperand.length == 1) {
                if (newOperand[0][0] === 'add') {
                    operator = newOperand[0][1].shift();
                    newOperand = newOperand[0][1];
                } else if (newOperand[0][0] === 'sub') {
                    operator = 'negative';
                    newOperand = [newOperand[0][1]];
                } else if (newOperand[0][0] === 'addsub') {
                    operator = 'pm';
                    newOperand = [newOperand[0][1]];
                } else if (newOperand[0][0] === 'subadd') {
                    operator = 'mp';
                    newOperand = [newOperand[0][1]];
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addIdentity(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

