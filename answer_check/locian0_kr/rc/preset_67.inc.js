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
import _ from 'lodash';

export function 가분수만_가능(tree = null) {
    //let tree_1 = _.cloneDeep(tree);
    let laco = new Laco();
    laco.initialize(tree)
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
    let tree_1 = laco.finalize();
       

    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
let latex_1 = '\\frac{5}{3}';
let latex_2 = '\\frac{10}{6}';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 가분수만_가능(tree_1);
let tree_21 = 가분수만_가능(tree_2);
console.log(is_equal_tree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/