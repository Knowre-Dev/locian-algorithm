import _ from 'lodash';

export function mulConstCal(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'mulchain') {
        
        var nterm = [];
        var varterm = [];
        
        for (var t of tree_1){
            if (t[1][0] === 'power') {
                if (t[1][1][0] === 'natural' && t[1][2][0] === 'natural') {
                    var base = t[1][1][1];
                    var top = t[1][2][1];
                    for (var i = 1; i < top; i++){
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
            var first = nterm.shift();
            var value = first[1][1];
            for (var nt of nterm){
                if (nt[0] === 'mul') {
                    value = value * nt[1][1];
                }else if (nt[0] === 'div') {
                    value = value / nt[1][1];
                }
            }
            value = value.toString();
            var valueArr = ['mul', ['natural', value]];
            
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
        for (var v of tree_1) {
            newOperand.push(mulConstCal(v));
        }
    }        
    tree_1 = [operator].concat(newOperand);    
    
    
    return tree_1;
}

