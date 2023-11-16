import _ from 'lodash';

export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    
    if (operator === 'inequality') {          
        if (tree_1[0][0] === 'negative') {
            var temp = [];
            var tree_2 = tree_1.reverse();
            for (var v of tree_2) {
                if (Array.isArray(v)) {
                    if (v[0] === 'negative') {
                        temp.push(v[1]);
                    } else {
                        temp.push(['negative', v]);
                    }
                } else {
                    temp.push(v);
                }
            }
            newOperand = temp;
        } else {
            newOperand = tree_1;
        }
        
    } else {
        newOperand = tree_1;
    }
    tree_1 = [operator].concat(newOperand); 
    
    
    return tree_1;
}

