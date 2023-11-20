import _ from 'lodash';

export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'mulchain') {
        
        let nterm = [];
        let varterm = [];
        
        for (let t of tree_1){
            if (t[1][0] === 'power') {
                if (t[1][1][0] === 'natural' && t[1][2][0] === 'natural') {
                    let base = t[1][1][1];
                    let top = t[1][2][1];
                    for (let i = 1; i < top; i++){
                        base = base * base;
                    }                        
                    nterm.push([t[0], ['natural', base.toString()]]);
                } else {
                    varterm.push(t);
                }
            } else if (t[1][0] === 'natural'){
                nterm.push(t);
            } else {
                varterm.push(t);
            }
        }
                        
        if (nterm.length !== 0) {
            let first = nterm.shift();
            let value = first[1][1];
            for (let nt of nterm){
                if (nt[0] === 'mul') {
                    value = value * nt[1][1];
                }else if (nt[0] === 'div') {
                    value = value / nt[1][1];
                }
            }
            value = value.toString();
            let valueArr = ['mul', ['natural', value]];
            
            if (varterm.length === 0) {
                operator = 'natural';
                newOperand = [value];
            } else {
                newOperand = [valueArr].concat(varterm);
            }               
        } else {
            newOperand = tree_1;
        }           
        
    } else {
        for (let v of tree_1) {
            newOperand.push(mulConstCal(v));
        }
    }        
    return [operator].concat(newOperand);    
    
    
    
}

