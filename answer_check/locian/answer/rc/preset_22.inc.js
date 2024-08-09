import { Laco } from '../libs/common.inc.js';

import { fracExpress } from '../rc/function_48.inc.js';
import { negParenthesis } from '../rc/function_50.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { varReverse } from '../rc/function_64.inc.js';
import { allIdentity, allAssociative, allCommutative } from '../rc/function_67.inc.js';
import { powDecomposition } from '../rc/function_68.inc.js';
import { eqMulNeg } from '../rc/function_73.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';

export function no_decimal(tree = null) {
    const laco = new Laco()

    laco.initialize(tree);
    laco.apply(allIdentity);
    laco.apply(varReverse, ['angle']);
    laco.apply(varReverse, ['mangle']);
    laco.apply(varReverse, ['arc']);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(fracMfrac);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(eqMulNeg);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(powDecomposition);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    return laco.finalize();
}
/*
import {LatexToTree, match_all} from '../checkmath.js';
let latex_1 = '3x';
let latex_2 = '-\\frac{-3x}{1}';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = no_decimal(tree_1);
let tree_21 = no_decimal(tree_2);
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1 === result_2);
console.log(result_1);
console.log(result_2);
*/
