import _ from 'lodash';

export function divFrac(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'mulchain') {
        for (let k = 0; k < tree_1.length; k++) {
            if (k === 0) {
                newOperand.push(tree_1[k]);
            } else if (tree_1[k][0] === 'div' && (newOperand[newOperand.length - 1])[0] === 'mul') {
                let num = divFrac(newOperand.pop()[1]);
                let denum = divFrac(tree_1[k][1]);
                if (tree_1.length === 2) {
                    operator = 'fraction';
                    newOperand.push(num);
                    newOperand.push(denum);
                } else {
                    let tempArr = ['fraction'].concat([num, denum]);
                    newOperand.push(['mul'].concat([tempArr]));
                }
            } else {
                newOperand.push(divFrac(tree_1[k]));
            }
        }
        if (newOperand.length === 1) {
            operator = newOperand[0][1].shift();
            newOperand = newOperand.shift()[1];
        }
    } else {
        for (let arr of tree_1) {
            newOperand.push(divFrac(arr));
        }
    }
    return [operator].concat(newOperand);
    
    
}


