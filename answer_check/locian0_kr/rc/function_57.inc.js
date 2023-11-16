import _ from 'lodash';

export function divIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'mulchain') {
        for (var v of tree_1) {
            if (v[0] !== 'div' || v[1][0] !== 'natural' || v[1][1] !== '1') {
                newOperand.push(v);
            }
        }
        
        if (newOperand.length === 1) {
            operator = newOperand[0][1].shift();
            newOperand = newOperand[0][1];
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(divIdentity(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    return tree_1;
}

