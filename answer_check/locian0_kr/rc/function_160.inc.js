import _ from 'lodash';

export function mulNegative(tree) {
    
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var operand = tree_1;
    var newOperand = [];
    var sign = 1;
    if (operator === 'negative') {
        var newsubtree = mulNegative(operand[0]);
        if (newsubtree[0] === 'negative')
            return newsubtree[1];
        return [operator, newsubtree];
    }
    if (operator === 'mulchain') {
        for (var mterm of operand) {
            if (mterm[1][0] === 'negative') {
                sign = -1 * sign;
                mterm[1] = mterm[1][1];
            }
            newOperand.push(mterm);
        }
    } else {
        for (var subtree of operand) {
            var newsubtree = mulNegative(subtree);
            if (operator === 'fraction' && newsubtree[0] === 'negative') {
                sign = -1 * sign;
                newsubtree = newsubtree[1];
            }
            newOperand.push(newsubtree);
        }
    }
    
    tree_1 = [operator].concat(newOperand);
    if (sign === -1) {
        tree_1 = ['negative', tree_1];
    }
    return tree_1;
    
}

