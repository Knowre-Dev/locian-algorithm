import {fracSimpVar} from '../rc/function_77.inc.js';
import {sub_deter, sub_mulCommutative} from '../rc/function_126.inc.js';
import _ from 'lodash';


export function addFactoredFormVar(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let deter = sub_deter(tree);
    
    if (!deter) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    let vars = [];
    if (operator === 'addchain') {
        for (let t of tree_1) {
            
            if (t[1][0] === 'power') {
                if (t[1][1][0] === 'variable' && t[1][2][0] === 'natural') {
                    let mul_term = [];
                    let max = parseInt(t[1][2][1])
                    for (let i = 0; i < max; i++){
                        mul_term.push(['mul', t[1][1]]);
                    }
                    t = [t[0], ['mulchain'].concat(mul_term)];
                }                    
            }
            if (t[1][0] === 'variable') {
                vars.push(t[1][1]);
            } else if (t[1][0] === 'mulchain') {
                let var_mul = [];
                let nt1 = t[1].slice(1);
                for (let t1 of nt1) {
                    if (t1[1][0] === 'variable') {
                        var_mul.push(t1[1][1]);
                    } else if (t1[1][0] === 'power' && t1[1][1][0] === 'variable' && t1[1][2][0] === 'natural'){
                        let max = parseInt(t1[1][2][1]);
                        for (let i = 0; i < max; i++) {
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
            let first = vars.shift();
            
            if (!Array.isArray(first)) {
                first = [first];
            }
            let unique = [...new Set(first)];
            
            for (let v of vars) {
                if (!Array.isArray(v)) {
                    v = [v];
                }
                
                
                for (let vu of unique) {
                    let key1 = [];
                    let first_entries = first.entries();
                    for (let [k1, v1] of first_entries) {
                        if (v1 === vu) {
                            key1.push(k1);
                        }
                    }
                    let key2 = [];
                    let v_entries = v.entries();
                    for (let [k2, v2] of v_entries) {
                        if (v2 === vu) {
                            key2.push(k2);
                        }
                    }  
                    
                    if (key2.length === 0) {
                        for (let vk of key1) {
                            delete first[vk];
                        }
                    } else if (key1.length > key2.length) {
                        for (let i = 0; i < key1.length - key2.length; i++) {
                            delete first[key1[i]];
                        }
                    } else {
                    
                    }
                    first = first.filter(x => typeof x !== 'undefined');
                }
            }   
            first = first.filter(x => typeof x !== 'undefined');       
            if (first.length === 0) {
                newOperand = tree_1;
            } else if (first.length === 1) {
                
                operator = 'mulchain';
                let div = [['variable', first[0]]];
                let div_1 = [];
                for (let t of tree_1) {
                    let frac = fracSimpVar(['fraction', t[1], ['variable', first[0]]]);
                    
                    
                    div_1.push([t[0], frac]);
                }
                div.push(['addchain'].concat(div_1));
                for (let d of div) {
                    newOperand.push(['mul', d]);
                }                  
                        
            } else {
                
                operator = 'mulchain';
                let div = [];
                for (let vu of unique) {
                    let find_keys = [];
                    let first_entries = first.entries();
                    for (let [k1, v1] of first_entries) {
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
                
                
                let div_1 = [];
                for (let t of tree_1) {
                    let frac = t[1];
                    for (let d of div){
                        frac = fracSimpVar(['fraction', frac, d]);
                    }
                    div_1.push([t[0], frac]);
                }   
                div.push(['addchain'].concat(div_1));
                for (let d of div) {
                    newOperand.push(['mul', d]);
                }  
            }
        }
        
    } else if (operator === 'mulchain') {
        
        for (let v of tree_1) {
            if (v[1][0] === 'addchain') {
                newOperand.push(addFactoredFormVar(v));
            } else {
                newOperand.push(v);
            }
            
        }
        
    } else {
        for (let v of tree_1) {
            newOperand.push(addFactoredFormVar(v));
        }
    } 
    return sub_mulCommutative([operator].concat(newOperand));
    
    
    
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'xy^2+x(y+z)';
let latex_2 = '1';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = addFactoredFormVar(tree_1);
let tree_21 = addFactoredFormVar(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/



