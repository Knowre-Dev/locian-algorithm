import _ from 'lodash';

export function fracIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'fraction') {
        if (tree_1[1][0] === 'natural' && tree_1[1][1] === '1') {
            operator = tree_1[0].shift();
            newOperand = tree_1[0];
        } else {
            newOperand = tree_1;
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(fracIdentity(v));
        }
    }
    tree_1 = [operator].concat(newOperand);

    return tree_1;
}

