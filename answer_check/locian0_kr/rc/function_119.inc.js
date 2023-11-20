import _ from 'lodash';


export function natElimZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    
    let newOperand = [];
    
    if (operator === 'natural') {
        newOperand.push(tree_1[0].replaceAll(new RegExp('^0+(?!$)', 'g'), ''));
        
        
    } else {
        for (let v of tree_1) {
            newOperand.push(natElimZero(v));
        }
    }
    return [operator].concat(newOperand);
    

    
}



