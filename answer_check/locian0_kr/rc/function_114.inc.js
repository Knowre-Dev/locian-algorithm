import _ from 'lodash';

export function mulToNega(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();

    var newOperand = [];
    var newTree = [];
    if (operator === 'mulchain') {
        if(tree_1[0][1][0] === 'negative' && tree_1[0][1][1][0] === 'natural' && tree_1[0][1][1][1] !== '1'){
            var first_term = tree_1.shift();
            operator = 'negative';
            var newFirst = ['mul', first_term[1][1]];     

            newTree.push(newFirst);
            for (var t of tree_1) {
                newTree.push(t);
            }

            newOperand.push('mulchain');
            for (var n of newTree) {
                newOperand.push(n);
            }
            
            newOperand = [newOperand];
        } else {
            newOperand = tree_1;
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(mulToNega(v));
        }
    }
    tree_1 = [operator].concat(newOperand);    
    
    return tree_1;
}

