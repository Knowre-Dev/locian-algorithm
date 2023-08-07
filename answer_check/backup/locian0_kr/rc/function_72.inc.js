import {addCommutative} from '../rc/function_47.inc.js';
import {fracSimpInt, EuclidAlg} from '../rc/function_76.inc.js';

export function addFactor(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'addchain') {
            // extract all constant coefficents (not in denominator)
            var consArr = [];
            for (var addterm of tree_1) {
                if (addterm[1][0] === 'mulchain') {
                    var con = ['natural', '1'];
                    var syms = [];
                    var addterm_1 = addterm[1].slice(1);
                    for (var [km, multerm] of addterm_1.entries()) {
                        if (multerm[0] === 'mul') {
                            if (multerm[1][0] === 'variable') {
                                syms.push(multerm);
                            } else if (multerm[1][0] === 'natural' && multerm[1][1] != '0' && km === 0) {
                                con = multerm;
                            }
                        }
                    }
                    if (syms.length > 0 && con[1] !== '1') {
                        consArr.push(con);
                    }
                } else if (addterm[1][0] === 'fraction') {
                    if (addterm[1][1][0] === 'mulchain') {
                        var con = ['natural', '1'];
                        var syms = [];      
                        var addterm_11 = addterm[1][1].slice(1);
                        for (var multerm of addterm_11) {
                            if (multerm[0] === 'mul') {
                                if (multerm[1][0] === 'variable') {
                                    syms.push(multerm);
                                } else if (multerm[1][0] === 'natural' && multerm[1][1] != '0') {
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
                var con;
                if (consArr.length === 1) {
                    con = consArr[0][1];
                } else {
                    var lcm = parseInt(consArr[0][1][1]);
                    for (var term of consArr) {
                        lcm = (lcm * parseInt(term[1][1]))/EuclidAlg(lcm, parseInt(term[1][1]));
                    }
                    con = ['natural', lcm.toString()];
                }
                
                var newAdd = ['addchain'];
                for (var [k, addterm] of tree_1.entries()) {                
                    if (addterm[1][0] === 'fraction') {
                        if (addterm[1][2][0] !== 'mulchain') {
                            addterm[1][2] = ['mulchain', ['mul', addterm[1][2]]];
                        }
                        var den = addterm[1][2].concat(consArr);
                        var frac = ['fraction', addterm[1][1], den];
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
            for (var v of tree_1) {
                // newOperand[] = addFactor(v);
                newOperand.push(v);
            }
        }
        tree_1 = addCommutative([operator].concat(newOperand));
    }
    return tree_1;
}


