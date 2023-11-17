import _ from 'lodash';

export function mulIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let sign = 1;
    let newOperand = [];
    if (operator === 'negative') {
        newOperand.push(mulIdentity(tree_1[0]));
        if (newOperand[0][0] === 'negative') {
            operator = newOperand[0][1].shift();
            newOperand = newOperand[0][1];
        }
    } else if (operator === 'mulchain') {
        for (let v of tree_1) {
            if (v[1][0] === 'natural' && v[1][1] === '1') {
            } else if (v[1][0] === 'negative' && v[1][1][0] === 'natural' && v[1][1][1] === '1')  {
                sign = -1;
            } else {
                newOperand.push(mulIdentity(v));
            }
        }
        if (newOperand.length === 1) {
            operator = newOperand[0][1].shift();                
            newOperand = newOperand[0][1];
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(mulIdentity(v));
        }
    }
    if (sign === -1) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'negative';
    }
    return [operator].concat(newOperand);
    
    
}


        