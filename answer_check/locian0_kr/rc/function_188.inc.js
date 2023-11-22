import _ from 'lodash';

export function rootToExp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    if (operator === 'nthroot') {
        let newPower = tree_1[0];
        if (tree_1[1][0] === 'mulchain') { // 루트 안이 곱셈식일 경우
            let newOperand = [];
            operator = 'mulchain';
            let tree_1_1 = tree_1[1];
            for (let v of tree_1_1) {
                if (Array.isArray(v)) {
                    let term = ['nthroot', newPower, v[1]];
                    newOperand.push([v[0], rootToExp(term)]);
                } else {
                    newOperand.push(v);
                }                    
            }
            return newOperand;                
        } else if (tree_1[1][0] === 'power') { // 루트 안이 거듭제곱일 경우
            newPower = ['fraction', tree_1[1][2], newPower];                  
            let newOperand = ['power', tree_1[1][1], newPower];
            
            return newOperand;               
        } else {
            newPower = ['fraction', ['natural', '1'], newPower];
            let newOperand = ['power', tree_1[1], newPower];
            
            return newOperand;
        }
    } else if (operator === 'squareroot') {
        let newOperand = [['natural', '2']].concat(tree_1);
        tree_1 = ['nthroot'].concat(newOperand);
        return rootToExp(tree_1);
    } else {
        let newOperand = [];
        for (let v of tree_1) {
            newOperand.push(rootToExp(v));
        }            
        tree_1 = [operator].concat(newOperand);
    }
    
    
    return tree_1;
}


