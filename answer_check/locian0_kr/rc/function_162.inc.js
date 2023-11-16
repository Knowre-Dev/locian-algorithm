import {fracSimp} from '../rc/function_67.inc.js';
import {addFactoredForm} from '../rc/function_70.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import {addFactoredFormVar} from '../rc/function_117.inc.js';
import _ from 'lodash';
/*
function sub_addFactored(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var simple1 = fracSimp(tree_1);
        var simple2 = fracSimpVar(tree_1);
        
        //약분되는 경우는 안묶고 그냥 return (어차피 틀림)
        if (JSON.stringify(tree_1) !== JSON.stringify(simple1) || JSON.stringify(tree_1) !== JSON.stringify(simple2)) {
            return tree_1;
        }
       
        var operator = tree_1.shift();
        var newOperand = [];
        
        if (operator === 'addchain') {
            var add_term = [];
            
            for (var t of tree_1) {
                if (t[0] === 'add') {
                    if (t[1][0] === 'addchain') {
                        for (var [k, t11] of t[1].entries()) {
                            if (k !== 0) {
                                add_term.push(t11);                        
                            }                            
                        }
                    } else {
                        if (t[1][0] === 'mulchain') {       
                            var addchain = false;
                            for (var [k, t1] of t[1].entries()) {
                                if (k !== 0 && t1[1][0] === 'addchain') {
                                    addchain = t;                                     
                                }                            
                            }
                            

                            if (addchain !== false) {               
                                var trans1 = addFactoredFormVar(addchain);
                                var trans2 = addFactoredForm(trans1);   
                                newOperand.push(trans2);
                            } else {
                                add_term.push(t);
                            }                           
                        } else {                           
                            add_term.push(t);                            
                        }     
                    }
                } else {
                    if (t[1][0] === 'addchain') {
                        for (var [k, t11] of t[1].entries()) {
                            if (k !== 0) {
                                if (t11[0] === 'add'){
                                    add_term.push(['sub', t11[1]]);
                                } else {
                                    add_term.push(['add', t11[1]]);
                                }                              
                            }                            
                        }
                    } else {
                        if (t[1][0] === 'mulchain') {       
                            var addchain = false;
                            for (var [k, t1] of t[1].entries()) {
                                if (k !== 0 && t1[1][0] === 'addchain') {
                                    addchain = t;                         
                                }                            
                            }
                            if (addchain !== false) {
                                var trans1 = addFactoredFormVar(addchain);
                                var trans2 = addFactoredForm(trans1);             
                                newOperand.push(trans2);
                            } else {
                                add_term.push(t);
                            }                           
                        } else {                           
                            add_term.push(t);                            
                        } 
                    }
                }               
            }
            if (add_term.length !== 0) {

                
                var add_tree = ['addchain'].concat(add_term);
                var add_trans1 = addFactoredFormVar(add_tree);
                var add_trans2 = addFactoredForm(add_trans1);
                
                if (newOperand.length === 0) {
                    var operator = add_trans2.shift();
                    newOperand = add_trans2;
                } else {
                    newOperand.push(['add', add_trans2]);  
                }      

                         
            }
        } else if (operator === 'mulchain') {
            for (var t of tree_1) {
                newOperand.push(sub_addFactored(t));
            }
        } else {
            newOperand = tree_1;
            
            //foreach(tree as t){
            //    newOperand[] = sub_addFactored(t);
            //}
        }
        tree_1 = [operator].concat(newOperand);
    }
    
    return tree_1;
}*/

export function sub_addFactored(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    var simple1 = fracSimp(tree);
    var simple2 = fracSimpVar(tree);
    //약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (JSON.stringify(tree) !== JSON.stringify(simple1) || JSON.stringify(tree) !== JSON.stringify(simple2)) {
        return tree;
    }
    var tree_1 = _.cloneDeep(tree);
    var operator = tree_1.shift();
    var newOperand = [];
        
    if (operator === 'addchain') {
        var add_term = [];
        for (var t of tree_1) {
            if (t[0] === 'add') {
                if (t[1][0] === 'addchain') {
                    for (var [k, t11] of t[1].entries()) {
                        if (k !== 0) {
                            add_term.push(t11);                        
                        }                            
                    }
                } else {
                    if (t[1][0] === 'mulchain') {       
                        var addchain = false;
                        for (var [k, t1] of t[1].entries()) {
                            if (k !== 0 && t1[1][0] === 'addchain'){
                                addchain = t;                                       
                            }                            
                        }
                        if (addchain !== false) {   
                            var trans1 = addFactoredFormVar(addchain);
                            var trans2 = addFactoredForm(trans1);             
                            add_term.push(trans2);
                        } else {
                            add_term.push(t);
                        }                           
                    } else {                           
                        add_term.push(t);                            
                    }     
                }
            } else {
                if (t[1][0] === 'addchain') {
                    for (var [k, t11] of t[1].entries()) {                            
                        if (k !== 0) {
                            if (t11[0] === 'add') {
                                add_term.push(['sub', t11[1]]);
                            }else{
                                add_term.push(['add', t11[1]]);
                            }                              
                        }                            
                    }
                } else {
                    if (t[1][0] === 'mulchain') {       
                        var addchain = false;
                        for (var [k, t1] of t[1].entries()) {
                            if (k !== 0 && t1[1][0] === 'addchain') {
                                addchain = t;        
                                break;
                            }                            
                        }

                        if (addchain !== false) {
                            var trans1 = addFactoredFormVar(addchain);
                            var trans2 = addFactoredForm(trans1);             
                            add_term.push(trans2);
                        } else {

                            add_term.push(t);
                        }                           
                    } else {                           
                        add_term.push(t);                            
                    } 
                }
            }               
        }
        
        if (add_term.length !== 0){
            var add_tree = ['addchain'].concat(add_term);
            var add_trans1 = addFactoredFormVar(add_tree);
            return add_trans1;
            
        }
        
        
    } else if (operator === 'mulchain') {
        for (var t of tree_1){
            newOperand.push(sub_addFactored(t));
        }
        
    } else {
        newOperand = tree_1;
       
    }
    tree_1 = [operator].concat(newOperand);
    
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = '(2-12a)+(3a+6)\\sqrt{2}';
latex_1 = '(3a+6)\\sqrt{2}+(2-12a)';
var tree_1 = LatexToTree(latex_1);
var tree_11 = sub_addFactored(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/

