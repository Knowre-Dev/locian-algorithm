import {hasType} from '../rc/function_135.inc.js';


export function fracExpress(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'mulchain' && 
            // epark 2019-07-04: Fraction can now be anywhere in the mulchain
            /* tree[0][1][0] === 'fraction' */ 
            hasType('fraction', tree_1)) {
            var num = [];
            var den = [];
            var numsign = 1;
            var densign = 1;
            for (var term of tree_1) {
                
                if (term[1][0] === 'fraction') {
                    if (term[1][1][0] === 'mulchain') {
                        num = num.concat(term[1][1].slice(1));
                    } else if (term[1][1][0] === 'negative') {
                        if (term[1][1][1][1] !== '1') {
                            num.push([term[0], term[1][1][1]]);
                        }
                        numsign *= -1;
                    } else if (term[1][1][1] !== '1') {
                        num.push([term[0], term[1][1]]);
                    }
                    if (term[1][2][0] === 'mulchain') {
                        den = den.concat(term[1][2].silce(1));
                    } else if (term[1][2][0] === 'negative') {
                        if (term[1][2][1][1] !== '1') {
                            den.push([term[0], term[1][2][1]]);
                        }
                        numsign *= -1;
                    } else if (term[1][2][1] !== '1') {
                        den.push([term[0], term[1][2]]);
                    }
                } else {
                    if (term[1][0] === 'mulchain') {
                        num = num.concat(term[1].slice(1));
                    } else {
                        num.push([term[0], term[1]]);
                    }
                }
            }
            /*
            if (num.length == 1) {
                num = num[0][1];
            } else {
                num.unshift('mulchain');
            }
            */
            if (num.length == 0) {//fixed
                num.push(['natural', '1']);
            } else if (num.length == 1) {
                num = num[0][1];
            } else {
                num.unshift('mulchain');
            }
            if (numsign === -1) {
                num = ['negative', num];
            }
            
            if (den.length == 1) {
                den = den[0][1];
            } else {
                den.unshift('mulchain');
            }
            if (densign === -1) {
                den = ['negative', den];
            }
            
            if (den.length > 1) {
                operator = 'fraction';
                newOperand.push(num);
                newOperand.push(den);
            } else {
                operator = num.shift();
                newOperand = num;
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(fracExpress(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracExpress;
var latex1 = '-\\frac{1}{5}*\\frac{1}{3}';
var latex2 = '\\frac{ab}{-c}d';
var tree1 = LatexToTree(latex1);

var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
//var tree21 = func(tree2);
//console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
//console.log(JSON.stringify(tree21, null, 4));
*/
