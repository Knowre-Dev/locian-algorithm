import _ from 'lodash';

export function powerOne(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    
    if (operator === 'power') {
        if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1'){
            operator = 'natural';
            newOperand.push('1');
        } else {
            newOperand = tree_1;
        }
    } else {
        for (var v of tree_1){
            newOperand.push(powerOne(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    
    return tree_1;
}

