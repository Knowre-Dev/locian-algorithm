import _ from 'lodash';

export function solParenthesis(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();   
        
    let newOperand = [];
    if (operator === 'mulchain') {
        let mul = true;
        let addchain = [];
        let mono = [];
        for (let v of tree_1) {
            if (v[0] === 'mul') {
                if (v[1][0] === 'addchain') {
                    addchain.push(v[1]);
                } else if (v[1][0] === 'mulchain') {
                    let expand = solParenthesis(v[1]);
                    if (expand[0] === 'addchain') {
                        addchain.push(expand);
                    } else {
                        mono.push(v);                           
                    }
                } else if (v[1][0] === 'power') { 
                    let expand = solParenthesis(v[1]);
                    if (expand[0] === 'addchain') {
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

        if (mul === false) {
            return [operator].concat(tree_1);
        } else {                
            if (addchain.length === 0) {
                newOperand = tree_1;
            } else if (addchain.length === 1) {                    
                operator = 'addchain';
                for (let term of addchain[0]) {
                    if (Array.isArray(term)) {
                        let merge = mono.concat([['mul', term[1]]]);
                        let mul = ['mulchain'].concat(merge);
                        newOperand.push([term[0], mul]);
                    }                                               
                }
            } else {
                operator = 'addchain';
                let first = addchain.shift();

                if (mono.length !== 0) {
                    let merge = ['mulchain', ['mul', first]];
                    for (let m of mono){
                        merge.push(m);
                    }
                    first = solParenthesis(merge);
                }
                
                
                for (let a1 of addchain) {    
                    a1.shift();
                    let term = [];
                    for (let a of a1) {    
                        let merge = [];                       
                        for (let f of first) {
                            merge = ['mulchain'];
                            if (Array.isArray(f) && Array.isArray(a)) {
                                let flag1;
                                if (JSON.stringify(f[0]) === JSON.stringify(a[0])) {
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
    } else if (operator === 'power') {
        if (tree_1[0][0] === 'addchain' && tree_1[1][0] === 'natural') {
            let int = parseInt(tree_1[1][1]);
            let arr = [];
            for (let i = 0; i < int; i++) {
                arr.push(['mul', tree_1[0]]);
            }
            
            tree_1 = ['mulchain'].concat(arr);
            newOperand = solParenthesis(tree_1);
            return newOperand;
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(solParenthesis(v));
        }
        tree_1 = [operator].concat(newOperand);
    }
    return [operator].concat(newOperand);
    
    
    
}

/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = 'x\\div 3 + 1';
let tree_1 = LatexToTree(latex_1);
let tree_11 = solParenthesis(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(JSON.stringify(tree_11, null, 4));
*/