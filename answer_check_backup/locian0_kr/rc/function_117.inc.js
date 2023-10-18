import {fracSimpVar} from '../rc/function_77.inc.js';
import {sub_deter, sub_mulCommutative} from '../rc/function_126.inc.js';

export function addFactoredFormVar(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var deter = sub_deter(tree_1);
        
        if (!deter) {
            return tree_1;
        }
        var operator = tree_1.shift();
        
        var newOperand = [];
        var vars = [];
        if (operator === 'addchain') {
            //var tree_2 = JSON.parse(JSON.stringify(tree_1));
            for (var t of tree_1) {
                
                if (t[1][0] == 'power') {
                    if (t[1][1][0] == 'variable' && t[1][2][0] == 'natural') {
                        var mul_term = [];
                        var max = parseInt(t[1][2][1])
                        for (var i = 0; i < max; i++){
                            mul_term.push(['mul', t[1][1]]);
                        }
                        t = [t[0], ['mulchain'].concat(mul_term)];
                    }                    
                }
                if (t[1][0] === 'variable') {
                    vars.push(t[1][1]);
                } else if (t[1][0] === 'mulchain') {
                    var var_mul = [];
                    var nt1 = JSON.parse(JSON.stringify(t[1]));
                    nt1.shift();
                    for (var t1 of nt1) {
                        if (t1[1][0] == 'variable') {
                            var_mul.push(t1[1][1]);
                        } else if (t1[1][0] == 'power' && t1[1][1][0] == 'variable' && t1[1][2][0] == 'natural'){
                            var max = parseInt(t1[1][2][1]);
                            for (var i = 0; i < max; i++) {
                                var_mul.push(t1[1][1][1]);
                            }
                        }
                    }
                    vars.push(var_mul);
                } else {
                    vars.push('1');
                }
                
            }
            
            if (vars.includes('1')) {
                newOperand = tree_1;
                
            } else {
                var first = vars.shift();
                
                if (!Array.isArray(first)) {
                    first = [first];
                }
                var unique = [...new Set(first)];
                
                for (var v of vars) {
                    if (!Array.isArray(v)) {
                        v = [v];
                    }
                    
                    //var unique = [...new Set(first)];
                    for (var vu of unique) {
                        var key1 = [];
                        for (var [k1, v1] of first.entries()) {
                            if (v1 === vu) {
                                key1.push(k1);
                            }
                        }
                        var key2 = [];
                        for (var [k2, v2] of v.entries()) {
                            if (v2 === vu) {
                                key2.push(k2);
                            }
                        }  
                        
                        if (key2.length == 0) {
                            for (var vk of key1) {
                                delete first[vk];
                            }
                        } else if (key1.length > key2.length) {
                            for (var i = 0; i < key1.length - key2.length; i++) {
                                delete first[key1[i]];
                            }
                        } else {
                        
                        }
                        first = first.filter(x => typeof x !== 'undefined');
                    }
                }   
                first = first.filter(x => typeof x !== 'undefined');       
                if (first.length == 0) {
                    newOperand = tree_1;
                } else if (first.length == 1) {
                    
                    operator = 'mulchain';
                    var div = [['variable', first[0]]];
                    var div_1 = [];
                    for (var t of tree_1) {
                        var frac = fracSimpVar(['fraction', t[1], ['variable', first[0]]]);
                        
                        
                        div_1.push([t[0], frac]);
                    }
                    div.push(['addchain'].concat(div_1));
                    for (var d of div) {
                        newOperand.push(['mul', d]);
                    }                  
                           
                } else {
                    //var unique = [...new Set(first)];
                    operator = 'mulchain';
                    var div = [];
                    for (var vu of unique) {
                        var find_keys = [];
                        for (var [k1, v1] of first.entries()) {
                            if (v1 === vu) {
                                find_keys.push(k1);
                            }
                        }
                        if (find_keys.length > 1) {
                            div.push(['power', ['variable', vu], ['natural', find_keys.length.toString()]]);
                        } else {
                            div.push(['variable', vu]);
                        }
                    }
                    
                    /*div = [];
                    foreach(first as f){
                        div[] = ['variable', f];
                    }*/
                    var div_1 = [];
                    //var tree_2 = JSON.parse(JSON.stringify(tree_1));
                    for (var t of tree_1) {
                        var frac = t[1];
                        for (var d of div){
                            frac = fracSimpVar(['fraction', frac, d]);
                        }
                        div_1.push([t[0], frac]);
                    }   
                    div.push(['addchain'].concat(div_1));
                    for (var d of div) {
                        newOperand.push(['mul', d]);
                    }  
                }
            }
           
        } else if (operator == 'mulchain') {
            
            //var tree_2 = JSON.parse(JSON.stringify(tree_1));
            for (var v of tree_1) {
                if (v[1][0] == 'addchain') {
                    newOperand.push(addFactoredFormVar(v));
                } else {
                    newOperand.push(v);
                }
                
            }
            
        } else {
            //var tree_2 = JSON.parse(JSON.stringify(tree_1));
            for (var v of tree_1) {
                newOperand.push(addFactoredFormVar(v));
            }
        } 
        tree_1 = sub_mulCommutative([operator].concat(newOperand));
    }
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'xy^2+x(y+z)';
var latex_2 = '1';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = addFactoredFormVar(tree_1);
var tree_21 = addFactoredFormVar(tree_2);
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 == result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
/*
function addFactoredFormVar(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var deter = sub_deter(tree_1);
        if (!deter) {
            return tree_1;
        }
        
        var operator = tree_1.shift();
        var newOperand = [];
        var vari = [];
        if (operator === 'addchain') {
            for (var [k, t] of tree_1.entries()) {
                if (t[1][0] === 'variable') {
                    vari.push(t[1][1]);
                } else if (t[1][0] === 'mulchain') {
                    var var_mul = [];
                    var nt1 = t[1];
                    nt1.shift();
                    for (var t1 of nt1) {
                        if (t1[1][0] == 'variable') {
                            var_mul.push(t1[1][1]);
                        }
                    }
                    vari.push(var_mul);
                } else {
                    vari.push('1');
                }
            }
            if (vari.includes('1')) {
                newOperand = tree_1;
            } else {
                var first = vari.shift();
                if (!Array.isArray(first)) {
                    first = [first];
                }
                for (var v of vari){
                    if (!Array.isArray(v)) {
                        v = [v];
                    }
                    first = first.filter(x => v.includes(x));
                }
               
                first = first.values();
                if (first.length == 0) {
                    newOperand = tree_1;
                } else if (first.length == 1) {
                    operator = 'mulchain';
                    var div = [['variable', first[0]]];
                    var div_1 = [];
                    for (var t of tree_1){
                        var frac = fracSimpVar(['fraction', t[1], ['variable', first[0]]]);
                        div_1.push([t[0], frac]);
                    }
                    div.push(['addchain'].concat(div_1));
                    for (var d of div) {
                        newOperand.push(['mul', d]);
                    }                                
                } else {
                    operator = 'mulchain';
                    var div = [];
                    for (var f of first) {
                        div.push(['variable', f]);
                    }
                    var div_1 = [];
                    for (var t of tree_1){
                        var frac = t[1];
                        for (var d of div) {
                            frac = fracSimpVar(['fraction', frac, d]);
                        }
                        div_1.push([t[0], frac]);
                    }
                    div.push(['addchain'].concat(div_1));
                    for (var d of div){
                        newOperand.push(['mul', d]);
                    }  
                }
            }
            
        } else if (operator == 'mulchain') {
            for (var v of tree_1){
                if (v[1][0] == 'addchain') {
                    newOperand.push(addFactoredFormVar(v));
                } else {
                    newOperand.push(v);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addFactoredFormVar(v));
            }
        }
        tree_1 = sub_mulCommutative([operator].concat(newOperand));
    }

    return tree_1;
}
*/


