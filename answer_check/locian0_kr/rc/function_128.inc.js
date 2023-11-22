
import {addCommutative} from '../rc/function_47.inc.js';
import {fracSimp} from '../rc/function_67.inc.js';
import {fracSimpInt, EuclidAlg} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import _ from 'lodash';





export function addFactor_1(tree = null) {
   
    let simple1 = fracSimp(tree);
    let simple2 = fracSimpVar(tree);
    
    //약분되는 경우는 안묶고 그냥 return (어차피 틀림)
    if (JSON.stringify(tree) !== JSON.stringify(simple1) || JSON.stringify(tree) !== JSON.stringify(simple2)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    
    let power = false;
    if (operator === 'addchain') {
        let consArr = [];
        let con = [];
        let syms = [];
        for (let addterm of tree_1) {
            if (addterm[1][0] === 'mulchain') {
                con = ['natural', '1'];
                syms = [];
                let addterm_1 = addterm[1].slice(1);
                let addterm_1_entries = addterm_1.entries();
                for (let [km, multerm] of addterm_1_entries) {
                    if (multerm[0] === 'mul') {
                        if (multerm[1][0] === 'variable') {
                            syms.push(multerm);
                        } else if (multerm[1][0] === 'squareroot') {
                            syms.push(multerm);
                        } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0' && km === 0) {
                            con = multerm;
                        } else if (multerm[1][0] === 'power' && multerm[1][1][0] === 'variable'){
                            syms.push(multerm);
                        }
                    }
                }
                if (syms.length > 0 && con[1] !== '1') {
                    consArr.push(con);
                }
            } else if (addterm[1][0] === 'fraction') {
                if (addterm[1][1][0] === 'mulchain') {
                    con = ['natural', '1'];
                    syms = [];
                    let addterm_11 = addterm[1][1].slice(1);     
                    for (let multerm of addterm_11) {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'squareroot') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0') {
                                con = multerm;
                            }
                        }
                    }
                } else if (addterm[1][1][0] === 'natural' && addterm[1][1][1] !== '1') {
                    //con = addterm[1][1][1];
                    con = addterm[1];
                   
                }
                
                if (syms.length > 0 && con[1] !== '1') {
                    consArr.push(con);
                }
            } else if (addterm[1][0] === 'natural' && addterm[1][1] !== '1'){
                con = addterm;
                consArr.push(con);
                
            } else if (addterm[1][0] === 'power'){
                power = true;
            }
        }
       
        
        if (consArr.length !== 0) {
            if (consArr.length === 1) {
                con = ['natural', '1'];
            } else {
                if (power === true) {
                    con = ['natural', '1'];
                } else {
                    let gcd = parseInt(consArr[0][1][1]);
                    for (let term of consArr){
                        gcd = EuclidAlg(gcd, parseInt(term[1][1]));
                    }
                    con = ['natural', gcd.toString()];
                }  
            }
            if (con[1] === '1') {
                newOperand = tree_1;
            } else {
                let newAdd = ['addchain'];
                for (let addterm of tree_1) {                
                    if (addterm[1][0] === 'fraction') {
                        if (addterm[1][2][0] !== 'mulchain') {
                            addterm[1][2] = ['mulchain', ['mul', addterm[1][2]]];
                        }
                        
                        let den = addterm[1][2].concat([['mul', con]]);
                        let frac = ['fraction', addterm[1][1], den];
                        newAdd.push([addterm[0], fracSimpInt(frac)]);
                    } else {
                        newAdd.push([addterm[0], fracSimpInt(['fraction', addterm[1], con])]);
                        
                    }
                }
                
                operator = 'mulchain';
                newOperand = [['mul', con], ['mul', newAdd]];
            }
            
        } else {
            newOperand = tree_1;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(v);
        }
    }
    return addCommutative([operator].concat(newOperand));
    
}

