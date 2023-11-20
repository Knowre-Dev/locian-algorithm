import _ from 'lodash';


export function addIdentity(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'addchain') {
        for (let v of tree_1) {
            if (!(v[1][0] === 'natural' && v[1][1] === '0')) {
                newOperand.push(v);
            }
        }
        if (newOperand.length === 0) {
            operator = 'natural';
            newOperand = ['0'];
        } else if (newOperand.length === 1) {
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
        for (let v of tree_1) {
            newOperand.push(addIdentity(v));
        }
    }
    return [operator].concat(newOperand);
    
}

