import {addCommutative} from '../rc/function_47.inc.js';
import _ from 'lodash';

export function powBaseSort(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    
    if (operator === 'power') {
        let base = addCommutative(tree_1[0]);
        let expo = tree_1[1];
        
        if (base[0] === 'addchain' && expo[1]%2 === 0) {
            if (base[1][0] === 'sub') {
                base.shift();
                
                let newBaseTerm = [];
                for (let b of base){
                    if (b[0] === 'sub') {
                        newBaseTerm.push(['add', b[1]]);
                    } else {
                        newBaseTerm.push(['sub', b[1]]);
                    }
                }
                let newBase = ['addchain'].concat(newBaseTerm);
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
        for (let v of tree_1) {
            newOperand.push(powBaseSort(v));
        }
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

