export function mulIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var sign = 1;
        var newOperand = [];
        if (operator === 'negative') {
            newOperand.push(mulIdentity(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
        } else if (operator === 'mulchain') {
            var contains_one = false;
            
            for (var [k, v] of tree_1.entries()) {   
                if (JSON.stringify(v[1]) == JSON.stringify(['natural', '1'])) {
                    contains_one = true;
                } else if (v[1][0] === 'negative' && v[1][1][0] === 'natural' && v[1][1][1] === '1')  {
                    sign = -1;
                } else {
                    newOperand.push(mulIdentity(v));
                }
            }
            if (newOperand.length == 0) {
                if (contains_one) {
                    operator = 'natural';
                    newOperand = '1';
                }
            } else if (newOperand.length === 1) {
                operator = newOperand[0][1].shift();                
                newOperand = newOperand[0][1];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(mulIdentity(v));
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

/*
        foreach (operand as v) {
            newOperand[] = mulIdentity(v);
        }
        if (operator === 'mulchain')
        {
            newnewOperand = array();
            foreach (newOperand as v)
            {
                if (v[0] === 'mul' && v[1][0] === 'natural' && v[1][1] === '1');
                else newnewOperand[] = v;
            }
            switch(sizeof(newnewOperand))
            {
                case 0:
                    return array('natural','1');

                case 1:
                    return newnewOperand[0][1];

                default:
                    return array_merge(array(operator),newnewOperand);
            }
        }
        else
        {
            return array_merge(array(operator),newOperand);
        }
        */

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulIdentity;
var latex1 = '1x';
//var latex2 = '(-1)*(-1)*(-1)*(x)';
var tree1 = LatexToTree(latex1);
//var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
//var tree21 = func(tree2);
//console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
//console.log(JSON.stringify(tree21, null, 4));
*/
