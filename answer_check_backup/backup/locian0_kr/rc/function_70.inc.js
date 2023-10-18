//
import {addNegative} from '../rc/function_71.inc.js';
import {addFactor_1} from '../rc/function_128.inc.js';

export function addFactoredForm(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var sign = 1; 
        var newOperand = [];
        if (operator === 'negative') {
            newOperand.push(addFactoredForm(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
        } else if (operator === 'mulchain') {
            var termArr = [];
            var consArr = [];
            var factArr = [];
            var add = false;
            for (var [kt, term] of tree_1.entries()) {
                if (term[0] === 'mul') {
                    if (term[1][0] === 'addchain') {
                        var fact = addFactor_1(term[1]);
                        var addchain;
                        if (fact[0] === 'mulchain') {
                            consArr.push(fact[1]);
                            addchain = fact[2][1];
                        } else if (fact[0] === 'addchain') {
                            addchain = fact;
                        }
                        if (addchain[1][0] === 'sub') {
                            addchain = addNegative(['negative', addchain]);
                            sign = -1*sign;
                        }
                        factArr.push(['mul', addchain]);
                        add = true;
                    } else if (term[1][0] === 'natural' && kt === 0) {
                        consArr.push(term);
                    } else {
                        termArr.push(term);
                    }
                } else {
                    termArr.push(term);
                }
            }

            if (add == false) {
                newOperand = tree_1;
                tree_1 = [operator].concat(newOperand);
            } else {
                var val = 1;
                for (var term of consArr) {
                    val = val * parseInt(term[1][1]);
                }
                var con = ['mul', ['natural', val.toString()]];
                
                if (val !== 1) {
                    newOperand.push(con);
                }
                for (var term of termArr) {
                    newOperand.push(term);
                }
                for (var term of factArr) {
                    newOperand.push(term);
                }
            }  
        } else if (operator === 'addchain') {
            var fact = addFactor_1(['addchain'].concat(tree_1));
            var con;
            var addchain;
            if (fact[0] === 'mulchain') {
                con = fact[1];
                addchain = fact[2][1];
            } else {
                addchain = fact;
            }
            if (addchain[1][0] === 'sub') {
                addchain = addNegative(['negative', addchain]);
                sign = -1 * sign;
            }
            if (fact[0] === 'mulchain') {
                operator = 'mulchain';
                newOperand.push(con);
                newOperand.push(['mul', addchain]);
            } else {
                newOperand = addchain.slice(1);
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(addFactoredForm(v));
            }
        }
        
        if (sign === -1) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'negative';
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}


