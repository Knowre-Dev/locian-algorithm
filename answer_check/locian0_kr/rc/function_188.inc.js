import _ from 'lodash';

export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    if (operator === 'nthroot') {
        var newPower = tree_1[0];
        if (tree_1[1][0] === 'mulchain') { // 루트 안이 곱셈식일 경우
            var newOperand = [];
            operator = 'mulchain';
            for (var v of tree_1[1]) {
                if (Array.isArray(v)) {
                    var term = ['nthroot', newPower, v[1]];
                    newOperand.push([v[0], rootToExp(term)]);
                } else {
                    newOperand.push(v);
                }                    
            }
            return newOperand;                
        } else if (tree_1[1][0] === 'power') { // 루트 안이 거듭제곱일 경우
            operator = 'power';
            var newPower = ['fraction', tree_1[1][2], newPower];                  
            var newOperand = ['power', tree_1[1][1], newPower];
            
            return newOperand;               
        } else {
            var operator = 'power';
            var newPower = ['fraction', ['natural', '1'], newPower];
            var newOperand = ['power', tree_1[1], newPower];
            
            return newOperand;
        }
    } else if (operator === 'squareroot') {
        var newOperand = [['natural', '2']].concat(tree_1);
        tree_1 = ['nthroot'].concat(newOperand);
        return rootToExp(tree_1);
    } else {
        var newOperand = [];
        for (var v of tree_1) {
            newOperand.push(rootToExp(v));
        }            
        tree_1 = [operator].concat(newOperand);
    }
    
    
    return tree_1;
}


