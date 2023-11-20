import _ from 'lodash';

export function mulFracSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    
    if (operator === 'fraction') {
        if (tree_1[1][0] === 'mulchain') {
            if (tree_1[0][0] === 'natural' && tree_1[0][1] === '1') {
                operator = 'mulchain';
                for (let t1 of tree_1[1]) {
                    if (Array.isArray(t1)) {
                        newOperand.push([
                            t1[0], 
                            ['fraction', tree_1[0], t1[1]]
                        ]);
                    }
                }
            } else {
                newOperand = tree_1;
            }
        } else {
            newOperand = tree_1;
        }
    } else {
        for(let v of tree_1) {
            newOperand.push(mulFracSeparation(v));
        }
    }
    return [operator].concat(newOperand);
    

    
}

