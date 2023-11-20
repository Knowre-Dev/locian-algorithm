import {addCommutative} from '../rc/function_47.inc.js';
import {fracSimpInt, EuclidAlg} from '../rc/function_76.inc.js';
import _ from 'lodash';

export function addFactor(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    let operator = tree[0];
    let tree_1 = tree.slice(1);
    let newOperand = [];
    if (operator === 'addchain') {
        // extract all constant coefficents (not in denominator)
        let consArr = [];
        for (let addterm of tree_1) {
            if (addterm[1][0] === 'mulchain') {
                let con = ['natural', '1'];
                let syms = [];
                let addterm_1 = addterm[1].slice(1);
                for (let [km, multerm] of addterm_1.entries()) {
                    if (multerm[0] === 'mul') {
                        if (multerm[1][0] === 'variable') {
                            syms.push(multerm);
                        } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0' && km === 0) {
                            con = multerm;
                        }
                    }
                }
                if (syms.length > 0 && con[1] !== '1') {
                    consArr.push(con);
                }
            } else if (addterm[1][0] === 'fraction') {
                if (addterm[1][1][0] === 'mulchain') {
                    let con = ['natural', '1'];
                    let syms = [];      
                    let addterm_11 = addterm[1][1].slice(1);
                    for (let multerm of addterm_11) {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'natural' && multerm[1][1] !== '0') {
                                con = multerm;
                            }
                        }
                    }
                    if (syms.length > 0 && con[1] !== '1') {
                        consArr.push(con);
                    }
                }
            }
        }
        
        // divide each term by the constant coefficients
        if (consArr.length !== 0) {
            let con;
            if (consArr.length === 1) {
                con = consArr[0][1];
            } else {
                let lcm = parseInt(consArr[0][1][1]);
                for (let term of consArr) {
                    lcm = (lcm * parseInt(term[1][1]))/EuclidAlg(lcm, parseInt(term[1][1]));
                }
                con = ['natural', lcm.toString()];
            }
            
            let newAdd = ['addchain'];
            for (let addterm of tree_1) {                
                if (addterm[1][0] === 'fraction') {
                    if (addterm[1][2][0] !== 'mulchain') {
                        addterm[1][2] = ['mulchain', ['mul', addterm[1][2]]];
                    }
                    let den = addterm[1][2].concat(consArr);
                    let frac = ['fraction', addterm[1][1], den];
                    newAdd.push([addterm[0], fracSimpInt(frac)]);
                } else {
                    newAdd.push([addterm[0], fracSimpInt(['fraction', addterm[1], con])]);
                }
            }
            
            operator = 'mulchain';
            newOperand = [['mul', con], ['mul', newAdd]];
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


