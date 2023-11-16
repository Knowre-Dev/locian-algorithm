import _ from 'lodash';


export function natElimZero(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    
    if (operator === 'natural') {
        
        
        
        newOperand.push(tree_1[0].replaceAll(new RegExp('^0+(?!$)', 'g'), ''));
        
        
    } else {
        for (var v of tree_1) {
            newOperand.push(natElimZero(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    

    return tree_1;
}



