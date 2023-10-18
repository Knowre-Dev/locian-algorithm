import {mulCommutative} from '../rc/function_3.inc.js';

export function fracSimpVar(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        
        var newOperand = [];
        if (operator === 'fraction') {
            var num = fracSimpVar(tree_1[0]);
            var den = fracSimpVar(tree_1[1]);
            
            // get the variables in the numerator
            var varNum = [];
            var narrNum = [];
            if (num[0] === 'variable') {
                varNum.push(['power', num, ['natural', 1]]);
            } else if (num[0] === 'power' && num[1][0] === 'variable') {
                varNum.push(num);
            } else if (num[0] === 'mulchain') {
                var num_1 = num.slice(1);
                for (var term of num_1) {
                    if (term[0] === 'mul') {
                        if (term[1][0] === 'variable') {
                            varNum.push(['power', term[1], ['natural', 1]]);
                        } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                            varNum.push(term[1]);
                        } else {
                            narrNum.push(term);
                        }
                    } else {
                        narrNum.push(term);
                    }
                }
            }
            
            // get the variables in the denominator
            var varDen = [];
            var narrDen = [];
            if (den[0] === 'variable') {
                varDen.push(['power', den, ['natural', 1]]);
            } else if (den[0] === 'power' && den[1][0] === 'variable') {
                varDen.push(den);
            } else if (den[0] === 'mulchain') {
                var den_1 = den.slice(1);
                for (var term of den.slice(1)) {
                    if (term[0] === 'mul') {
                        if (term[1][0] === 'variable') {
                            varDen.push(['power', term[1], ['natural', 1]]);
                        } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                            varDen.push(term[1]);
                        } else {
                            narrDen.push(term);
                        }
                    } else {
                        narrDen.push(term);
                    }
                }
            }

            // get new numerator and denominator variables
            if (varNum.length !== 0 && varDen.length !== 0) {
                var numk = 0;
                var deni = 0;
                var newNum = [];
                var newDen = [];
                for (var k = numk; k < varNum.length; k++) {
                    for (var i = deni; i < varDen.length; i++) {
                        if (varNum[k][1][1] < varDen[i][1][1]) {
                            if (varNum[k][2][1] == '1') {
                                newNum.push(varNum[k][1]);
                            } else {
                                newNum.push(varNum[k]);
                            }
                            numk++;
                            if (numk === varNum.length) {
                                for (var j = deni; j < varDen.length; j++) {
                                    if (varDen[j][2][1] == '1') {
                                        newDen.push(varDen[j][1]);
                                    } else {
                                        newDen.push(varDen[j]);
                                    }
                                }
                            }
                            break;
                        } else if (varNum[k][1][1] === varDen[i][1][1]) {
                            var expo = parseInt(varNum[k][2][1]) - parseInt(varDen[i][2][1]);
                            if (expo > 0) {
                                if (expo === 1) {
                                    newNum.push(['variable', varNum[k][1][1]]);
                                } else {
                                    newNum.push(['power', ['variable', varNum[k][1][1]], ['natural', expo.toString()]]);
                                }
                            } else if (expo < 0) {
                                if (expo === -1) {
                                    newDen.push(['variable', varDen[i][1][1]]);
                                } else {
                                    newDen.push(['power', ['variable', varDen[i][1][1]], ['natural', Math.abs(expo).toString()]]);
                                }
                            }
                            numk++;
                            deni++;
                            if (numk === varNum.length) {
                                for (var j = deni; j < varDen.length; j++) {
                                    if (varDen[j][2][1] == '1') {
                                        newDen.push(varDen[j][1]);
                                    } else {
                                        newDen.push(varDen[j]);
                                    }
                                }
                            }
                            if (deni === varDen.length) {
                                for (var j = numk; j < varNum.length; j++) {
                                    if (varNum[j][2][1] == '1') {
                                        newNum.push(varNum[j][1]);
                                    } else {
                                        newNum.push(varNum[j]);
                                    }
                                }
                            }
                            break;
                        } else if (varNum[k][1][1] > varDen[i][1][1]) {
                            if (varDen[i][2][1] == '1') {
                                newDen.push(varDen[i][1]);
                            } else {
                                newDen.push(varDen[i]);
                            }
                            deni++;
                            if (deni === varDen.length) {
                                for (var j = numk; j < varNum.length; j++) {
                                    if (varNum[j][2][1] == '1') {
                                        newNum.push(varNum[j][1]);
                                    } else {
                                        newNum.push(varNum[j]);
                                    }
                                }
                            }
                        }
                    }
                }

                // put the new variables back into the numerator and denominator
                var arrNum = [];
                if (newNum.length > 0) {
                    for (var term of newNum) {
                        arrNum.push(['mul', term]);                        
                    }
                } 
                if (narrNum.length > 0) {
                    for (var term of narrNum) {
                        arrNum.push(term);
                    }
                }
                if (arrNum.length === 0) {
                    newOperand.push(['natural', '1']);
                } else if (arrNum.length === 1) {
                    newOperand.push(arrNum[0][1]);                    
                } else {
                    arrNum.unshift('mulchain');
                    newOperand.push(mulCommutative(arrNum));
                }
                
                var arrDen = [];
                if (newDen.length > 0) {
                    for (var term of newDen) {
                        arrDen.push(['mul', term]);                        
                    }
                } 
                if (narrDen.length > 0) {
                    for (var term of narrDen) {
                        arrDen.push(term);
                    }
                }

                if (arrDen.length === 0) {
                    operator = newOperand[0].shift();
                    newOperand = newOperand[0];
                } else if (arrDen.length === 1) {
                    newOperand.push(arrDen[0][1]);
                } else {
                    arrDen.unshift('mulchain');
                    newOperand.push(mulCommutative(arrDen));
                }
            } else {
                newOperand.push(num);
                newOperand.push(den);
            }            
        } else {
            for (var v of tree_1) {
                newOperand.push(fracSimpVar(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracSimpVar;
var latex1 = '\\frac{x^4y^4}{xy}';

var tree1 = LatexToTree(latex1);

var tree11 = func(tree1);


console.log(JSON.stringify(tree11, null, 4));
*/
