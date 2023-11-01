export function solParenthesis(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();   
            
        var newOperand = [];
        if (operator == 'mulchain') {
            var mul = true;
            var addchain = [];
            var mono = [];
            for (var v of tree_1) {
                if (v[0] == 'mul') {
                    if (v[1][0] == 'addchain') {
                        addchain.push(v[1]);
                    } else if (v[1][0] == 'mulchain') {
                        var expand = solParenthesis(v[1]);
                        if (expand[0] == 'addchain') {
                            addchain.push(expand);
                        } else {
                            mono.push(v);                           
                        }
                    } else if (v[1][0] == 'power') { 
                        var expand = solParenthesis(v[1]);
                        if (expand[0] == 'addchain') {
                            addchain.push(expand);
                        } else {
                            mono.push(v);                           
                        }
                    } else {
                        mono.push(v);                        
                    }                   
                } else {
                    mul = false;
                }                
            }

            if (mul == false) {
                return [operator].concat(tree_1);
            } else {                
                if (addchain.length == 0) {
                    newOperand = tree_1;
                } else if (addchain.length == 1) {                    
                    var operator = 'addchain';
                    for (var term of addchain[0]) {
                        if (Array.isArray(term)) {
                            var merge = mono.concat([['mul', term[1]]]);
                            var mul = ['mulchain'].concat(merge);
                            newOperand.push([term[0], mul]);
                        }                                               
                    }
                } else {
                    var operator = 'addchain';
                    var first = addchain.shift();

                    if (mono.length != 0) {
                        var merge = ['mulchain', ['mul', first]];
                        for (var m of mono){
                            merge.push(m);
                        }
                        first = solParenthesis(merge);
                    }
                    
                    
                    for (var a1 of addchain) {    
                        a1.shift();
                        var term = [];
                        for (var a of a1) {    
                            var merge = [];                       
                            for (var f of first) {
                                merge = ['mulchain'];
                                if (Array.isArray(f) && Array.isArray(a)) {
                                    var flag1;
                                    if (JSON.stringify(f[0]) == JSON.stringify(a[0])) {
                                        flag1 = 'add';
                                    } else {
                                        flag1 = 'sub';
                                    }
                                    
                                    merge.push(['mul', f[f.length-1]]);
                                    merge.push(['mul', a[a.length-1]]);
                                    term.push([flag1, merge]);
                                }
                            }
                            merge = [];
                            
                        }
                        first = ['addchain'].concat(term);
                    }  
                    first.shift();
                    newOperand = first;
                }
            }
        } else if (operator == 'power') {
            if (tree_1[0][0] == 'addchain' && tree_1[1][0] == 'natural') {
                var int = parseInt(tree_1[1][1]);
                var arr = [];
                for(var i = 0; i < int; i++){
                    arr.push(['mul', tree_1[0]]);
                }
                
                var tree_1 = ['mulchain'].concat(arr);
                newOperand = solParenthesis(tree_1);
                return newOperand;
            } else {
                newOperand = tree_1;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(solParenthesis(v));
            }
            tree_1 = [operator].concat(newOperand);
        }
        tree_1 = [operator].concat(newOperand);
    }
    
    return tree_1;
}

/*
import {LatexToTree} from '../checkmath.js';
var latex_1 = 'x\\div 3 + 1';
var tree_1 = LatexToTree(latex_1);
var tree_11 = solParenthesis(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/