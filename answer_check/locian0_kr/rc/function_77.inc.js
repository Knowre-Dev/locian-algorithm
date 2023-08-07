import {mulCommutative} from '../rc/function_46.inc.js';
import {sub_mulCommutative} from '../rc/function_126.inc.js';

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
            var num_key = 0;
            if (num[0] === 'variable') {                
                varNum.push(['power', num, ['natural', '1']]);
            } else if (num[0] === 'power' && num[1][0] === 'variable') {
                varNum.push(num);
            } else if (num[0] === 'mulchain') {
                var vars = [];
                var num_1 = num.slice(1);
                for (var [k, term] of num_1.entries()) {
                    if (term[0] === 'mul') {
                        if (term[1][0] === 'variable') {
                            if (!vars.includes(term[1][1])) {
                                vars[k] = term[1][1];
                                varNum[k] = ['power', term[1], ['natural', '1']];
                            } else {
                               //var search = vars.indexOf();
                                var search;
                                for (var [k, v] of vars.entries()) {
                                    if (JSON.stringify(v) == JSON.stringify(term[1][1])) {
                                        search = k;
                                        break;
                                    }
                                }
                                varNum[search] = ['power', term[1], ['natural', (parseInt(varNum[search][2][1])+1).toString()]];
                            }                           
                            
                        } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                            varNum[k] = term[1];
                        } else {
                            num_key = k;
                            narrNum.push(term);
                        }
                    } else {
                        num_key = k;
                        narrNum.push(term);
                    }
                }
                varNum = Object.values(varNum);
            }
            // get the variables in the denominator
            var varDen = [];
            var narrDen = [];
            var den_key = 0;
            if (den[0] === 'variable') {
                varDen.push(['power', den, ['natural', '1']]);
            } else if (den[0] === 'power' && den[1][0] === 'variable') {
                varDen.push(den);
            } else if (den[0] === 'mulchain') {
                var vars = [];
                var den_1 = den.slice(1);
                for (var [k, term] of den_1.entries()) {
                    if (term[0] === 'mul') {
                        if (term[1][0] === 'variable') {                           
                            if(!vars.includes(term[1][1])){
                                vars[k] = term[1][1];
                                varDen[k] = ['power', term[1], ['natural', '1']];
                            } else {
                                
                                //var search = vars.indexOf(term[1][1]);
                                var search;
                                for (var [k, v] of vars.entries()) {
                                    if (JSON.stringify(v) == JSON.stringify(term[1][1])) {
                                        search = k;
                                        break;
                                    }
                                }
                                varDen[search][2][1] = (parseInt(varDen[search][2][1])+1).toString();
                            }
                        } else if (term[1][0] === 'power' && term[1][1][0] === 'variable') {
                            varDen[k] = term[1];
                        } else {
                            den_key = k;
                            narrDen.push(term);
                        }
                    } else {
                        den_key = k;
                        narrDen.push(term);
                    }
                }
                //print_r(vars);
            }
            varDen = Object.values(varDen);
            
            var newVarNum = [];
            for (var vn of varNum){
                if(!varDen.includes(vn)){
                    newVarNum.push(vn);
                }
            }
            var newVarDen = [];
            for (var vd of varDen) {
                if(!varNum.includes(vd)){
                    newVarDen.push(vd);
                }
            }
            // get new numerator and denominator variables
            newVarNum.sort();//added
            newVarDen.sort();//added
            if (newVarNum.length !== 0 && newVarDen.length !== 0) {
                var numk = 0;
                var deni = 0;
                var newNum = [];
                var newDen = [];
                
                for (var k = numk; k < newVarNum.length; k++) {    
                    for (var i = deni; i < newVarDen.length; i++) {
                        if (newVarNum[k][1][1] < newVarDen[i][1][1]) {
                            if (newVarNum[k][2][1] == '1') {
                                newNum.push(newVarNum[k][1]);
                            } else {
                                newNum.push(newVarNum[k]);
                            }
                            numk++;
                            if (numk === newVarNum.length) {
                                for (var j = deni; j < newVarDen.length; j++) {
                                    if (newVarDen[j][2][1] == '1') {
                                        newDen.push(newVarDen[j][1]);
                                    } else {
                                        newDen.push(newVarDen[j]);
                                    }
                                }
                            }
                            
                            break;
                        } else if (newVarNum[k][1][1] === newVarDen[i][1][1]) {
                            var expo = parseInt(newVarNum[k][2][1]) - parseInt(newVarDen[i][2][1]);
                            if (expo > 0) {
                                if (expo === 1) {
                                    newNum.push(['variable', newVarNum[k][1][1]]);
                                } else {
                                    newNum.push(['power', ['variable', newVarNum[k][1][1]], ['natural', expo.toString()]]);
                                }
                            } else if (expo < 0) {
                                if (expo === -1) {
                                    newDen.push(['variable', newVarDen[i][1][1]]);
                                } else {
                                    newDen.push(['power', ['variable', newVarDen[i][1][1]], ['natural', (Math.abs(expo)).toString()]]);
                                }
                            }
                            numk++;
                            deni++;
                            if (numk === newVarNum.length) {
                                for (var j = deni; j < newVarDen.length; j++) {
                                    if (newVarDen[j][2][1] == '1') {
                                        newDen.push(newVarDen[j][1]);
                                    } else {
                                        newDen.push(newVarDen[j]);
                                    }
                                }
                            }
                            if (deni === newVarDen.length) {
                                for (var j = numk; j < newVarNum.length; j++) {
                                    if (newVarNum[j][2][1] == '1') {
                                        newNum.push(newVarNum[j][1]);
                                    } else {
                                        newNum.push(newVarNum[j]);
                                    }
                                }
                            }
                            break;
                        } else if (newVarNum[k][1][1] > newVarDen[i][1][1]) {
                            if (newVarDen[i][2][1] == '1') {
                                newDen.push(newVarDen[i][1]);
                            } else {
                                newDen.push(newVarDen[i]);
                            }
                            deni++;
                            if (deni === newVarDen.length) {
                                for (var j = numk; j < newVarNum.length; j++) {
                                    if (newVarNum[j][2][1] == '1') {
                                        newNum.push(newVarNum[j][1]);
                                    } else {
                                        newNum.push(newVarNum[j]);
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

                arrNum.sort();//added
                if (arrNum.length === 0) {
                    newOperand.push(['natural', '1']);
                } else if (arrNum.length === 1) {
                    newOperand.push(arrNum[0][1]);                    
                } else {
                    arrNum.unshift('mulchain');
                    if (num_key === 0) {
                        newOperand.push(mulCommutative(arrNum));
                    } else {
                        newOperand.push(sub_mulCommutative(arrNum));
                    }
                    
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
                arrDen.sort();//added
            
                if (arrDen.length === 0) {
                    operator = newOperand[0].shift();
                    newOperand = newOperand[0];
                } else if (arrDen.length === 1) {
                    newOperand.push(arrDen[0][1]);
                } else {
                    arrDen.unshift('mulchain');
                    
                    if (den_key === 0) {
                        //newOperand.push(sub_mulCommutative(arrDen));
                        newOperand.push(mulCommutative(arrDen));
                    } else {
                        newOperand.push(sub_mulCommutative(arrDen));
                    }
                }

                
                
            } else {
                
                if (varDen.length === newVarDen.length && varNum.length === newVarNum.length) {
                    newOperand.push(num);
                    newOperand.push(den);
                } else {
                    var newNum = [];
                    for (var nn of newVarNum){
                        if (nn[2][1] == '1') {
                            newNum.push(nn[1]);
                        }else{
                            newNum.push(nn);
                        }
                    }
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
                    
                    var newDen = [];
                    for (var nn of newVarDen){
                        if (nn[2][1] == '1') {
                            newDen.push(nn[1]);
                        }else{
                            newDen.push(nn);
                        }
                    }
                    var arrDen = [];
                    if (newDen.length > 0) {
                        for (var term of newDen) {
                            arrDen.push(['mul', term]);                        
                        }
                    } 
                    if (narrDen.length > 0) {
                        for (var term of n) {
                            arrDen.push(term);
                        }
                    }
                    
                    if (arrDen.length === 0) {
                        operator = newOperand[0].shift();
                        newOperand = newOperand[0];
                    } else if (arrDen.length === 1) {
                        newOperand.push([0][1]);
                    } else {
                        arrDen.unshift('mulchain');
                        newOperand.push(mulCommutative(arrDen));
                    }
                }
                
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
import {LatexToTree} from '../checkmath.js';
var latex_1 = '\\frac{c^2}{ac+bc}';
var tree_1 = LatexToTree(latex_1);
var tree_11 = fracSimpVar(tree_1);
var result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/

