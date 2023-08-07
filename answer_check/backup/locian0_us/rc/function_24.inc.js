import {Laco} from '../libs/common.inc.js';

import {addIdentity} from '../rc/function_12.inc.js';
import {mulIdentity} from '../rc/function_13.inc.js';
import {divIdentity} from '../rc/function_14.inc.js';
import {fracIdentity} from '../rc/function_15.inc.js';
import {powIdentity} from '../rc/function_16.inc.js';
import {eqIdentity} from '../rc/function_22.inc.js';
import {ineqIdentity} from '../rc/function_23.inc.js';
import {mulZero} from '../rc/function_39.inc.js';
import {decIdentity} from '../rc/function_43.inc.js';
import {absIdentity} from '../rc/function_139.inc.js';

export function allIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.getInstance();
    laco.setTree(tree_1);
    laco.apply(mulZero);
    
    laco.apply(absIdentity);
    laco.apply(fracIdentity);
    
    laco.apply(addIdentity);
    
    laco.apply(mulIdentity);
    
    laco.apply(divIdentity);
    laco.apply(powIdentity);
    laco.apply(decIdentity);
    laco.apply(ineqIdentity);
    laco.apply(eqIdentity);
    return laco.getTree();
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = allIdentity;
var latex1 = '1/(x-1)';
var tree1 = LatexToTree(latex1);
var tree11 = func(tree1);
console.log(JSON.stringify(tree11, null, 4));
*/

import {mulCommutative} from '../rc/function_3.inc.js';
import {addCommutative} from '../rc/function_4.inc.js';

export function allCommutative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.getInstance();
    laco.setTree(tree_1);
    laco.apply(addCommutative);
    laco.apply(mulCommutative);
    return laco.getTree();
}

import {mulAssociative} from '../rc/function_1.inc.js';
import {addAssociative} from '../rc/function_2.inc.js';

export function allAssociative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.getInstance();
    laco.setTree(tree_1);
    laco.apply(addAssociative);
    laco.apply(mulAssociative);
    return laco.getTree();
}

import {fracSimpInt} from '../rc/function_33.inc.js';
import {fracSimpVar} from '../rc/function_34.inc.js';

export function fracSimp(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.getInstance();
    laco.setTree(tree_1);
    laco.apply(fracSimpInt);
    laco.apply(fracSimpVar);
    return laco.getTree();
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = fracSimp;
var latex1 = '\\frac{3}{3}';
var latex2 = '0.1\\overline{2}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/
