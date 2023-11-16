import {EuclidAlg} from '../rc/function_76.inc.js';
import _ from 'lodash';


export function eqIneqMulProp(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();  
    let newOperand = [];
    if (operator === 'equation') {
        let con1 = sub_getConstant(tree_1[0]);
        let con2 = sub_getConstant(tree_1[1]);
        let con = con1.concat(con2);
        con = Array.from(new Set(con));
        if (con.includes(1)) {
            return [operator].concat(tree_1);
        }
        if (con.length === 2) {
            let div = EuclidAlg(con[0], con[1]);
            if (div === 1) {
                newOperand = tree_1;
            } else {
                let deno = ['natural', div.toString()];
                let simp1 = sub_div(tree_1[0], deno);
                let simp2 = sub_div(tree_1[1], deno);                  
                newOperand = [simp1, simp2];
            }
        } else if (con.length > 2){
            let div = EuclidAlg(parseInt(con[0]), parseInt(con[1]));
            for(let i = 2; i < con.length; i++){
                div = EuclidAlg(div, parseInt(con[i]));
            }
            if (div === 1) {
                newOperand = tree_1;
            }else{
                let deno = ['natural', div.toString()];
                let simp1 = sub_div(tree_1[0], deno);
                let simp2 = sub_div(tree_1[1], deno);
                newOperand = [simp1, simp2];
            }             
        } else if (con.length === 1){               
            if (JSON.stringify(tree_1[0]) === JSON.stringify(['natural', '0'])) {
                let deno = ['natural', con[0]];
                let simp1 = sub_div(tree_1[0], deno);
                let simp2 = sub_div(tree_1[1], deno);
                newOperand = [simp1, simp2]; 
            } else if (JSON.stringify(tree_1[1]) === JSON.stringify(['natural', '0'])) {
                let deno = ['natural', con[0]];
                let simp1 = sub_div(tree_1[0], deno);
                let simp2 = sub_div(tree_1[1], deno);
                newOperand = [simp1, simp2];
            } else {
                newOperand = tree_1;
            }
        } else {
            newOperand = tree_1;
        }
    } else if (operator === 'inequality') {
        let con = [];
        for (let i = 0; i < tree_1.length; i++){
            if (i % 2 === 0) {
                con = con.concat(sub_getConstant(tree_1[i]));
            }
        }
        
        con = [...new Set(con)];
        
        if (con.includes(1)) {
            return [operator].concat(tree_1);
        }
        
        if (con.length === 2) {
            let div = EuclidAlg(con[0], con[1]);
            if (div === 1) {
                newOperand = tree_1;
            } else {
                let deno = ['natural', div.toString()];
                /*simp1 = sub_div(tree_1[0], deno);
                simp2 = sub_div(tree_1[1], deno);                  
                newOperand = [simp1, simp2];*/
                
                for (let i = 0; i < tree_1.length; i++){
                    if (i % 2 === 0) {
                        newOperand.push(sub_div(tree_1[i], deno));
                    } else {
                        newOperand.push(tree_1[i]);
                    }
                }
            }
        } else if (con.length > 2) {
            let div = EuclidAlg(parseInt(con[0]), parseInt(con[1]));
            for (let i = 2; i < con.length; i++) {
                div = EuclidAlg(div, parseInt(con[i]));
            }
            if (div === 1) {
                newOperand = tree_1;
            } else {
                let deno = ['natural', div.toString()];
                for (let i = 0; i < tree_1.length; i++){
                    if (i % 2 === 0) {
                        newOperand.push(sub_div(tree_1[i], deno));
                    } else {
                        newOperand.push(tree_1[i]);
                    }
                }
            }             
        } else if (con.length === 1) {     
            let is_included = false;
            for (let term of tree_1) {
                if (JSON.stringify(term) === JSON.stringify(['natural', '0'])) {
                    is_included = true
                }
            }   
            if (is_included) {
                let deno = ['natural', con[0]];
                for (let i = 0; i < tree_1.length; i++) {
                    if (i % 2 === 0) {
                        newOperand.push(sub_div(tree_1[i], deno));
                    } else {
                        newOperand.push(tree_1[i]);
                    }
                }
            } else {
                newOperand = tree_1;
            }
        } else {
            newOperand = tree_1;
        }
    } else {
        newOperand = tree_1;
    }     
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '2\\pi x=4\\pi  ';
let latex_2 = '2x=4';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = eqIneqMulProp(tree_1);
let tree_21 = eqIneqMulProp(tree_2);
let result1 = JSON.stringify(tree_11, null, 4);
let result2 = JSON.stringify(tree_21, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
export function sub_getConstant(tree) {
    let con = [];
    if (!Array.isArray(tree)) {
        return con;
    }
    let tree_1 = _.cloneDeep(tree);
   
    let operator = tree_1.shift();
    if (operator === 'natural') {
        if (tree_1[0] !== '0') {
            con.push(parseInt(tree_1[0]));
        }
    } else if (operator === 'mulchain') {        
        for (let t of tree_1) {
            if (t[0] === 'mul') {
                con = con.concat(sub_getConstant(t[1]));
            }
        }
        
        con = Array.from(new Set(con));
        if (con.includes(1)){
                if (con.length !== 1) {
                let con1 = [];
                    for (let c of con){
                    if (c !== 1) {
                        con1.push(c);                            
                    }
                }            
                    con = con1;
            }
        }
    } else if (operator === 'addchain') {
        for(let t of tree_1) {
            con = con.concat(sub_getConstant(t[1]));
        }           
    } else if (operator === 'negative') {
        for (let t of tree_1) {
            con = con.concat(sub_getConstant(t));
        }
    } else if (operator === 'power') {
        con.push(1);
    } else if (operator === 'variable'){
        con.push(1);
    } else {
        
    }

    return con;
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '2+b+3a';
let latex_2 = '2a+3x^2';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = sub_getConstant(tree_1);
let tree_21 = sub_getConstant(tree_2);
let result1 = JSON.stringify(tree_11, null, 4);
let result2 = JSON.stringify(tree_21, null, 4);
console.log(result1 === result2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/

import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';

export function sub_div(tree, deno) {
    let tree_1 = _.cloneDeep(tree);
    let deno_1 = _.cloneDeep(deno);
    let frac1 = ['fraction', tree_1, deno_1];
    let frac2 = fracNegative(frac1);
    let separation = fracSeparation(frac2);
    let simp = fracSimpInt(separation);
    
    /*print_r(frac1);
print_r(separation);
print_r(simp);   */ 
    return simp;
    
}



//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//