import {addCommutative} from '../rc/function_47.inc.js';

export function powBaseSort(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'power') {
            var base = addCommutative(tree_1[0]);
            var expo = tree_1[1];
            
            if (base[0] === 'addchain' && expo[1]%2 === 0) {
                if (base[1][0] === 'sub') {
                    base.shift();
                    
                    var newBaseTerm = [];
                    for (var b of base){
                        if (b[0] === 'sub') {
                            newBaseTerm.push(['add', b[1]]);
                        } else {
                            newBaseTerm.push(['sub', b[1]]);
                        }
                    }
                    var newBase = ['addchain'].concat(newBaseTerm);
                    newOperand = [newBase, expo];   
                } else {
                    newOperand = [base, expo];
                }              
            } else if (base[0] === 'negative' && expo[1]%2 === 0){
                base.shift();
                newOperand = powBaseSort([base[0], expo]);
            } else {
                newOperand = [base, expo];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(powBaseSort(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

