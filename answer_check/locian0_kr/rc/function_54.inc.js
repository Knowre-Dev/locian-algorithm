import {fracSimp} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import _ from 'lodash';

export function fracSeparation(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'fraction' && tree_1[0][0] === 'addchain') {
        let top = addFactoredForm(tree_1[0]);
        let base = addFactoredForm(tree_1[1]);
        
        let merge = ['fraction'].concat([top, base]);
        let simple1 = fracSimp(merge);
        let simple2 = fracSimpVar(merge);
        let simple;
        if (JSON.stringify(simple1) === JSON.stringify(merge) && JSON.stringify(simple2) === JSON.stringify(merge)) {
            simple = true;
        } else {
            simple = false;
        }
        operator = 'addchain';
        let den = fracSeparation(tree_1[1]);
        let term_0 = tree_1[0].slice(1);
        for (let term of term_0) {   
            let sign;      
            let nden;       
            if (den[0] === 'negative') {
                if (term[0] === 'add') {
                    sign = 'sub';
                } else if (term[0] === 'sub') {
                    sign = 'add';
                } else {
                    sign = term[0];
                }
                nden = den[1];
            } else if (den[0] === 'pm' || term[0] === 'addsub') {
                sign = 'addsub';
                nden = den[0] === 'pm' ? den[1] : den;
            } else if (den[0] === 'mp' || term[0] === 'subadd') {
                sign = 'subadd';
                nden = den[0] === 'mp' ? den[1] : den;
            } else {
                sign = term[0];
                nden = den;
            }
            
            if(simple){
                newOperand.push([sign, fracSimp(['fraction', fracSeparation(term[1]), nden])]);
            }else{
                newOperand.push([sign, ['fraction', fracSeparation(term[1]), nden]]);
            }
                     
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(fracSeparation(v));
        }
    }
    return [operator].concat(newOperand);
    
    
}




