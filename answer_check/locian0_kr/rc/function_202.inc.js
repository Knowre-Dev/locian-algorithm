import _ from 'lodash';

export function eqIneqDivPi(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();  
    let newOperand = [];
    if (operator === 'equation') {
        let check1 = checkPi(tree_1[0]);
        let check2 = checkPi(tree_1[1]);
        if (check1 && check2) {               
            for (let v of tree_1) {
                newOperand.push(sub_divPi(v, ['variable', 'pi']));
            }
        } else {
            return [operator].concat(tree_1);
        }
        
    } else if (operator === 'inequality') {
        let check = true;
        for (let i = 0; i < tree_1.length; i++) {
            if (i % 2 === 0) {
                check = checkPi(tree_1[i]);
                if (check === false) {
                    break;
                }                       
            }
        }
        if (check) {
            for (let i = 0; i < tree_1.length; i++) {
                if (i % 2 === 0) {
                    newOperand.push(sub_divPi(tree_1[i], ['variable', 'pi']));
                } else {
                    newOperand.push(tree_1[i]);
                }
            }
        } else {                
            return [operator].concat(tree_1);
        }            
    } else {
        newOperand = tree_1;
    }     
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '2\\pi x=0';
let latex_2 = '2x=0';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = eqIneqDivPi(tree_1);
let tree_21 = eqIneqDivPi(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/


import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';

export function sub_divPi(tree, div) {
    
    if (tree[0] === 'natural' && tree[1] === '0') {
        return tree;    
    } 
    let tree_1 =  _.cloneDeep(tree);
    let div_1 =  _.cloneDeep(div);
    let frac1 = ['fraction', tree_1, div_1];
    let frac2 = fracNegative(frac1);
    let separation = fracSeparation(frac2);
    let simp = fracSimpVar(separation);
    return simp;

    
}



export function checkPi(tree) {
    
    if (Array.isArray(tree)) {
        let tree_1 = _.cloneDeep(tree);
        let operator = tree_1.shift();
        if (operator === 'variable') {
            if (tree_1[0] === 'pi') {
                return true;
            }
        } else if (operator === 'mulchain'){        
            for (let t of tree_1) {
                if (t[0] === 'mul' && checkPi(t[1])) {
                    return true;
                }
            }            
        } else if (operator === 'addchain') {
            let check = true;
            for (let t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }           
            return check;
        } else if (operator === 'negative') {
            let check = true;
            for (let t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }           
            return check;
        } else if (operator == 'power'){
            let check = true;
            for (let t of tree_1) {
                check = checkPi(t);
                if (check === false) {
                    break;
                }
            }           
            return check;
        } else if (operator == 'natural') {
            if (tree_1[0] === '0') { //0 이어도 pi 나누기 가능해서 추가
                return true;
            } else {
                return false;
            }
        } else {
            let check = true;
            for (let t of tree_1) {
                check = checkPi(t);
                //if (check === false) {
                if (check === true) {
                    break;
                }
            }           
            return check;
        }
    }
    return false;
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '125\\pi \\le \\frac{25}{3}\\pi x\\le 200\\pi ';
let latex_2 = '125\\le \\frac{25}3{x}\\le 200';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = checkPi(tree_1);
let tree_21 = checkPi(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(JSON.stringify(tree_11, null, 4));
console.log(JSON.stringify(tree_21, null, 4));
*/
