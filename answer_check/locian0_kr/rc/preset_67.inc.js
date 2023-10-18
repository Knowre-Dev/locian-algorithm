import {Laco} from '../libs/common.inc.js';

import {fracExpress} from '../rc/function_48.inc.js';
import {negParenthesis} from '../rc/function_50.inc.js';
import {posiSign} from '../rc/function_51.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {fracSeparation} from '../rc/function_54.inc.js';
import {allAssociative, allCommutative} from '../rc/function_67.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import {addFactorNegative} from '../rc/function_81.inc.js';
import {addAdjacentSigns} from '../rc/function_83.inc.js';

export function 가분수만_가능(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var laco = new Laco();
    laco.initialize(tree_1)
    //laco.apply(allIdentity);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(fracSimpVar);
    laco.apply(fracSimpInt);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    tree_1 = laco.finalize();
       

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var latex_1 = '\\frac{5}{3}';
var latex_2 = '\\frac{10}{6}';
var tree_1 = LatexToTree(latex_1);
var tree_2 = LatexToTree(latex_2);
var tree_11 = 가분수만_가능(tree_1);
var tree_21 = 가분수만_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
var result_1 = JSON.stringify(tree_11, null, 4);
var result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/