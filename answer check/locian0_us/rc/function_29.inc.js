import {addCommutative} from '../rc/function_4.inc.js';
import {EuclidAlg, fracSimpInt} from '../rc/function_33.inc.js';


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
                    for (var multerm of addterm_1) {
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
                } else if (addterm[1][0] === 'fraction') {
                    if (addterm[1][1][0] === 'mulchain') {
                        var con = ['natural', '1'];
                        var syms = [];  
                        var addterm_1 = addterm[1][1].slice(1);                  
                        for (var multerm of addterm_1) {
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
                        lcm = lcm * parseInt(term[1][1]) / EuclidAlg(lcm, parseInt(term[1][1]));
                    }
                    con = ['natural', lcm.toString()];
                }
                
                var newAdd = ['addchain'];
                for (var addterm of tree_1) {                
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
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = addFactor;
var latex1 = '\\frac{1}{2}(2x-1)';
var latex2 = '(x-\\frac{1}{2})';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/