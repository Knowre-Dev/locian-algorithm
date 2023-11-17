import {mulCommutative} from '../rc/function_46.inc.js';
import _ from 'lodash';


export function sub_mulCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'mulchain') {
        let array = sort_array(tree_1);
        if (!array.includes('natural') && !array.includes('decimal')) {//문자만 있는 경우
            newOperand = mulCommutative([operator].concat(tree_1));      
            newOperand.shift();
        } else {//숫자가 있는 경우
            if (!array.includes('variable')) {//숫자만 있는 경우
                newOperand = mulCommutative([operator].concat(tree_1));      
                newOperand.shift();
            } else {//숫자, 문자 섞여있는 경우
                if (!array.includes('addchain')) {//단항식
                    
                    let merge = [operator].concat(tree_1);
                    let deter = sub_deter(merge);
                    if (deter === false) {
                        newOperand = tree_1;
                    } else {
                        newOperand = mulCommutative(merge);
                        newOperand.shift();
                    }
                } else { 
                    let merge = [operator].concat(tree_1); 
                    let deter = sub_deter(merge);
                    
                    if (deter === true) {
                        let deter2 = true;
                        for (let t of tree_1) {
                            if (t[1][0] === 'addchain') {
                                if (t[1][1][1][0] === 'mulchain') {
                                    deter2 = sub_deter(t[1][1][1]);                                    
                                }
                                if (deter2 === false) {
                                    break;
                                }
                            }
                        }
                        
                        
                        if (deter2 === false) {
                            newOperand = tree_1;
                        } else {
                            newOperand = mulCommutative(merge);
                            newOperand.shift();
                        }
                    } else {
                        newOperand = tree_1;
                    }                       
                }
            }
        }
    } else {
        for (let t of tree_1){
            newOperand.push(sub_mulCommutative(t));
        }           
    }
    
    return [operator].concat(newOperand);
   
    
    
    
}

export function sort_array(A) {
    let A_1 = _.cloneDeep(A);
    let arr = [];
    for (let v of A_1){
        if (!Array.isArray(v)) {
            arr.push(v);
        } else {
            arr = arr.concat(sort_array(v));
        }
    }
    return arr;
}

export function sub_deter(tree = null) {// 결과가 true면 정렬함, false면 정렬 안함
    
    let result = true;
    if (Array.isArray(tree)) {
        let tree_1 = _.cloneDeep(tree);
        let operator = tree_1.shift();
        if (operator === 'mulchain') {
            tree_1.shift();
            for (let t of tree_1) {
                if (t[0] !== 'mul') {
                    result = false;
                    break;
                } else {                    
                    if (t[1][0] === 'natural') {
                        result = false; 
                        break;
                    } else if (t[1][0] === 'decimal') {
                        result = false; 
                        break;
                    } else if (t[1][0] === 'fraction') {
                        result = false; 
                        break;
                    } else if (t[1][0] === 'negative') {
                        result = false; 
                        break;
                    }
                }
            }
        } else {
            for (let t of tree_1) {
                let deter = sub_deter(t);
                if (deter === false) {
                    result = false;
                    break;
                }
            }
        }
    } else {
        result = true;
    }   
    return result;
}

