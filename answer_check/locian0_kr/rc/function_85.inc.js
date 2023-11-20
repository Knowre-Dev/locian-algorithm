import _ from 'lodash';


export function ineqSetNot(tree, vari = ['anything', 'x']) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);       
    let newOperand = [];
    if (operator === 'inequality') {
        if (tree_1.length === 3) {
            if ((tree_1[0][0] === vari[0] && tree_1[0][1] === vari[1]) || tree_1[0][0] === 'variable') {
                newOperand.push(['infinity']);
                newOperand.push('gt');
                newOperand = newOperand.concat(tree_1);
            } else {
                newOperand = tree_1;
                newOperand.push('gt');
                newOperand.push(['negative', ['infinity']]);
            }
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(ineqSetNot(v));
        }
    }
    return [operator].concat(newOperand);

    
}

