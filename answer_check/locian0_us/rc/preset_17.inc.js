
/*
    160918 jhshin - expanding a new type of tree : anything
*/
import {Laco} from '../libs/common.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {posiSign} from '../rc/function_8.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {fracIdentity} from '../rc/function_15.inc.js';
import {ineqIdentity} from '../rc/function_23.inc.js';
import {allAssociative, allCommutative} from '../rc/function_24.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {intervalSetNot} from '../rc/function_41.inc.js';
import {ineqSetNot} from '../rc/function_42.inc.js';
import {decIdentity} from '../rc/function_43.inc.js';
import {fracPlusMinus} from '../rc/function_129.inc.js';

export function set_bounds(tree = null, variable = ['variable', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(decIdentity);
    laco.apply(ineqIdentity);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracNegative);
    laco.apply(fracPlusMinus);
    laco.apply(fracIdentity);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(allCommutative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(ineqSetNot, variable);
    laco.apply(intervalSetNot, variable);
    laco.apply(ineqIdentity);
    tree_1 = laco.finalize();
    
    
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = set_bounds;
var latex1 = '[-2,\\text{ }1)';
var latex2 = '\\left[-2,1\\right)';
var tree1 = LatexToTree(latex1);
console.log('+++++++++++++');
console.log(JSON.stringify(tree1, null, 4));
console.log('+++++++++++++');
var tree2 = LatexToTree(latex2);
console.log(JSON.stringify(tree2, null, 4));
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree11, null, 4));
console.log('>>>>>>>>>>>>>>');
console.log(JSON.stringify(tree21, null, 4));
*/