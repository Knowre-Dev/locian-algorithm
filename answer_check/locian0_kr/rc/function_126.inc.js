import {mulCommutative} from '../rc/function_46.inc.js';
import _ from 'lodash';


export function sub_mulCommutative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
    if (operator === 'mulchain') {
        var array = sort_array(tree_1);
        if (!array.includes('natural') && !array.includes('decimal')) {//문자만 있는 경우
            newOperand = mulCommutative([operator].concat(tree_1));      
            newOperand.shift();
        } else {//숫자가 있는 경우
            if (!array.includes('variable')) {//숫자만 있는 경우
                newOperand = mulCommutative([operator].concat(tree_1));      
                newOperand.shift();
            } else {//숫자, 문자 섞여있는 경우
                if (!array.includes('addchain')) {//단항식
                    
                    var merge = [operator].concat(tree_1);
                    var deter = sub_deter(merge);
                    if (deter === false) {
                        newOperand = tree_1;
                    } else {
                        newOperand = mulCommutative(merge);
                        newOperand.shift();
                    }
                } else { 
                    var merge = [operator].concat(tree_1); 
                    var deter = sub_deter(merge);
                    
                    if (deter === true) {
                        var deter2 = true;
                        for (var t of tree_1) {
                            if (t[1][0] === 'addchain') {
                                if (t[1][1][1][0] === 'mulchain') {
                                    var deter2 = sub_deter(t[1][1][1]);                                    
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
        for (var t of tree_1){
            newOperand.push(sub_mulCommutative(t));
        }           
    }
    
    tree_1 = [operator].concat(newOperand);
   
    
    
    return tree_1;
}

export function sort_array(A) {
    var A_1 = _.cloneDeep(A);
    var arr = [];
    for (var v of A_1){
        if (!Array.isArray(v)) {
            arr.push(v);
        } else {
            arr = arr.concat(sort_array(v));
        }
    }
    return arr;
}

export function sub_deter(tree = null) {// 결과가 true면 정렬함, false면 정렬 안함
    
    var result = true;
    if (Array.isArray(tree)) {
        var tree_1 = _.cloneDeep(tree);
        var operator = tree_1.shift();
        if (operator === 'mulchain') {
            tree_1.shift();
            for (var t of tree_1) {
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
            for (var t of tree_1) {
                var deter = sub_deter(t);
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
/*
function sub_deter1(tree=null)
{
    if(gettype(tree) === 'array'){//return이 true면 문자 존재
        operator = array_shift(tree);
        
        if(operator === 'mulchain'){
            return = false;
            foreach(tree as t){
                if(t[1][0] === 'variable'){//
                    return = true;
                    break;
                }else if(t[1][0] === 'addchain'){
                    foreach(t[1][1] as t11){
                        if(t11[1][0] === 'mulchain'){
                            return = sub_deter1(t11[1]);
                            if(return === true){
                                break;
                            }
                        }  
                    }
                    
                }
            }
        }else{
            return = false;
            foreach(tree as t){
                return = sub_deter1(t);
                if(return === true){
                    return = true;
                    break;
                }
            }
        }
    }
    return return;
}



function sub_deter(tree=null)// 결과가 true면 정렬함, false면 정렬 안함
{
    if (gettype(tree) === 'array'){
        operator = array_shift(tree);
        
        if(operator === 'mulchain'){
            array_shift(tree);
            
            return = true;
            foreach(tree as t){
                if(t[0] !== 'mul'){
                    return = false;
                    break;
                }else{                    
                    if(t[1][0] === 'natural'){
                        return = false; 
                        break;
                    }else if(t[1][0] === 'decimal'){
                        return = false; 
                        break;
                    }else if(t[1][0] === 'fraction'){
                        return = false; 
                        break;
                    }else if(t[1][0] === 'negative'){
                        return = false; 
                        break;
                    }else if(t[1][0] === 'addchain'){
                        foreach(t[1][1] as k=>t11){
                            if(is_array(t11)){
                                deter = sub_deter(t11[1]);
                                if(deter === false){
                                    return = false; 
                                    break 2;
                                }
                            }
                        }
                        
                    }
                }
            }
        }else{
            return = true;
            foreach(tree as t){
                deter = sub_deter(t);
                if(deter === false){
                    return = false;
                    break;
                }
            }
        }
    }else{
        return = false;
    }   
    return return;
}
*/

