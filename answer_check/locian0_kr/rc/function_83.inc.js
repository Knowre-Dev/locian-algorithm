import _ from 'lodash';

export function addAdjacentSigns(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let sign = 1;
    let newOperand = [];
    
    if (operator === 'addchain') {
        for (let term of tree_1) {             
            let nterm = addAdjacentSigns(term[1]);
            if (nterm[0] === 'negative') {
                if (term[0] === 'add') {
                    newOperand.push(['sub', nterm[1]]);
                } else if (term[0] === 'sub') {
                    newOperand.push(['add', nterm[1]]);
                } else {
                    newOperand.push([term[0], nterm[1]]);
                }
            } else {
                newOperand.push([term[0], nterm]);
            }
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(addAdjacentSigns(v));
        }
    }
    if (sign === -1) {
        newOperand = [[operator].concat(newOperand)];
        operator = 'negative';
    }
    return [operator].concat(newOperand);
    
    
}

