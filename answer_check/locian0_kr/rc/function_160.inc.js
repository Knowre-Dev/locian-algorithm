import _ from 'lodash';

export function mulNegative(tree) {
    
    if (!Array.isArray(tree) || tree.length < 1) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let operand = tree_1;
    let newOperand = [];
    let sign = 1;
    if (operator === 'negative') {
        let newsubtree = mulNegative(operand[0]);
        if (newsubtree[0] === 'negative') {
            return newsubtree[1];
        }
        return [operator, newsubtree];
    }
    if (operator === 'mulchain') {
        for (let mterm of operand) {
            if (mterm[1][0] === 'negative') {
                sign = -1 * sign;
                mterm[1] = mterm[1][1];
            }
            newOperand.push(mterm);
        }
    } else {
        for (let subtree of operand) {
            let newsubtree = mulNegative(subtree);
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

