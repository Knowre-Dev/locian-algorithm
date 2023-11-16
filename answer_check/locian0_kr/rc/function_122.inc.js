import _ from 'lodash';

export function powerFrac(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    
    if (operator === 'power') {
        if (tree_1[0][0] === 'fraction') {
            operator = 'fraction';
            for (let t1 of tree_1[0]){
                if (Array.isArray(t1)) {
                    newOperand.push(['power', t1, tree_1[1]]);
                }                    
            }
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(powerFrac(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

