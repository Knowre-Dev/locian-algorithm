import _ from 'lodash';

export function powerOne(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    
    if (operator === 'power') {
        if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1'){
            operator = 'natural';
            newOperand.push('1');
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1){
            newOperand.push(powerOne(v));
        }
    }
    return [operator].concat(newOperand);
    
    
    
}

