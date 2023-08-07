import {Laco} from '../libs/common.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {negParenthesis} from '../rc/function_7.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracIdentity} from '../rc/function_15.inc.js';
import {powIdentity} from '../rc/function_16.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {addPolyZero} from '../rc/function_37.inc.js';
import {addAdjacentSigns} from '../rc/function_40.inc.js';
import {decIdentity} from '../rc/function_43.inc.js';
import {fracPlusMinus} from '../rc/function_129.inc.js';

export function poly_division(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1);
    laco.apply(fracIdentity);
    laco.apply(powIdentity);
    laco.apply(decIdentity);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracPlusMinus);
    laco.apply(fracExpress);
    laco.apply(negParenthesis);
    laco.apply(addPolyZero);
    tree_1 = laco.finalize();
    
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = poly_division;
var latex1 = '2x+3';
var latex2 = '2x+3';
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