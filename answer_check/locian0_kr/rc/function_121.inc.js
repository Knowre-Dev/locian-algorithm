import _ from 'lodash';

export function mulPowSeparation(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    
    if (operator === 'power') {
        if (tree_1[0][0] === 'mulchain') {
            operator = 'mulchain';
            for (var t1 of tree_1[0]){
                if (Array.isArray(t1)){
                    newOperand.push([t1[0], ['power', t1[1], tree_1[1]]]);
                }                    
            }
        } else {
            newOperand = tree_1;
        }
    } else {
        for (var v of tree_1) {
            newOperand.push(mulPowSeparation(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    

    return tree_1;
}


