import {fracSimp} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';

export function fracSeparation(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'fraction' && tree_1[0][0] === 'addchain') {
            var top = addFactoredForm(tree_1[0]);
            var base = addFactoredForm(tree_1[1]);
            
            var merge = ['fraction'].concat([top, base]);
            var simple1 = fracSimp(merge);
            var simple2 = fracSimpVar(merge);
            var simple;
            if (JSON.stringify(simple1) === JSON.stringify(merge) && JSON.stringify(simple2) === JSON.stringify(merge)) {
                simple = true;
            } else {
                simple = false;
            }
            operator = 'addchain';
            var den = fracSeparation(tree_1[1]);
            var term_0 = tree_1[0].slice(1);
            for (var [k, term] of term_0.entries()) {   
                var sign;      
                var nden;       
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
                //newOperand[] = [sign, fracSimp(['fraction', fracSeparation(term[1]), nden])];              
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(fracSeparation(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}




