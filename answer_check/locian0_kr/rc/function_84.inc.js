export function intervalSetNot(tree, vari = ['variable', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'interval') {
            operator = 'inequality';
            newOperand = [
                tree_1[2],
                tree_1[3] == ')' ? 'gt' : 'ge',
                vari,
                tree_1[0] == '(' ? 'gt' : 'ge',
                tree_1[1]
            ];
        } else if (operator === 'tuple') { // jhshin
            operator = 'inequality';
            newOperand = [
                tree_1[1],
                'gt',
                vari,
                'gt',
                tree_1[0]
            ];
        } else if (operator === 'setname') {
            if (tree_1[0] === 'real') {
                operator = 'inequality';
                newOperand = [
                    ['infinity'],
                    'gt',
                    vari,
                    'gt',
                    ['negative', ['infinity']]
                ];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(intervalSetNot(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

