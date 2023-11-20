import _ from 'lodash';

export function ineqRearrange(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    
    if (operator === 'inequality') {          
        if (tree_1[0][0] === 'negative') {
            let temp = [];
            let tree_2 = tree_1.reverse();
            for (let v of tree_2) {
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
    return [operator].concat(newOperand); 
    
    
    
}

