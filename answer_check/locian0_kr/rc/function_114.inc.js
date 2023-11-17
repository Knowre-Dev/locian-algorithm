import _ from 'lodash';

export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();

    let newOperand = [];
    let newTree = [];
    if (operator === 'mulchain') {
        if(tree_1[0][1][0] === 'negative' && tree_1[0][1][1][0] === 'natural' && tree_1[0][1][1][1] !== '1'){
            let first_term = tree_1.shift();
            operator = 'negative';
            let newFirst = ['mul', first_term[1][1]];     

            newTree.push(newFirst);
            for (let t of tree_1) {
                newTree.push(t);
            }

            newOperand.push('mulchain');
            for (let n of newTree) {
                newOperand.push(n);
            }
            
            newOperand = [newOperand];
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(mulToNega(v));
        }
    }
    return [operator].concat(newOperand);    
    
    
}

