import {EuclidAlg} from '../rc/function_33.inc.js';


export function fracDecimal(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'decimal') {
            var val = tree_1[0].split('.');
            if (val[0].substr(0, 1) == '0' && val[0].length > 1) {
                newOperand = tree_1;
            } else {
                var num = parseInt(val[0] + val[1]);
                var den = Math.pow(10, val[1].length);
            
                var gcf = EuclidAlg(num, den);
                var newNum = num / gcf;
                var newDen = den / gcf;
                
                if (newDen == 1) {
                    operator = 'natural';
                    newOperand.push(newNum.toString());
                } else {
                    operator = 'fraction';
                    newOperand.push(['natural', newNum.toString()]);
                    newOperand.push(['natural', newDen.toString()]);
                }
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(fracDecimal(v));
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*

export function fracDecimal(tree)
{
    if (gettype(tree) === 'array') {
        operator = tree[0];
        operand = array_slice(tree,1);

        newOperand = array();
        if (operator === 'decimal') {
            val = explode('.',operand[0]);
            num = (int) (val[0].val[1]);
            denum = (int) (pow(10,strlen(val[1])));

            //find gcf
            max = max(num,denum);
            min = min(num,denum);
            while((rest = max % min) !== 0) {
                max = min;
                min = rest;
            }
            gcf = min;
            num = (int) (num/gcf);
            denum = (int) (denum/gcf);
            //cancle
            return array(
                    'fraction',
                    array(
                        'natural',
                        num.''
                        ),
                    array(
                        'natural',
                        denum.''
                        )
                    );
        } else {
            foreach (operand as v) {
                newOperand[] = fracDecimal(v);
            }
            return array_merge(array(operator),newOperand);
        }
    }
    return tree;
}
*/

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracDecimal;
var latex1 = '\\frac{6}{5}';
var latex2 = '1.2';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/