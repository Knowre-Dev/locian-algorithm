import _ from 'lodash';

export function decIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'decimal') {
        (tree_1[0].substr(0, 1) === '.') ? newOperand.push('0' + tree_1[0])
        : newOperand = tree_1           
    } else if (operator === 'rdecimal') {
        if (tree_1[0] === '') {
            newOperand.push('0');
            newOperand.push(tree_1[1]);
            newOperand.push(tree_1[2]);
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(decIdentity(v));
        }
    }
    return [operator].concat(newOperand);

   
}

