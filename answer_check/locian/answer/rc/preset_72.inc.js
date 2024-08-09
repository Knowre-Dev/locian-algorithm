import { Laco } from '../libs/common.inc.js';

import { addCommutative } from '../rc/function_47.inc.js';
import { fracExpress } from '../rc/function_48.inc.js';
import { fracDecimal } from '../rc/function_49.inc.js';
import { negParenthesis } from '../rc/function_50.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { eqIdentity } from '../rc/function_65.inc.js';
import { ineqIdentity } from '../rc/function_66.inc.js';
import { allAssociative } from '../rc/function_67.inc.js';
import { addFactoredForm } from '../rc/function_70.inc.js';
import { decElimZero } from '../rc/function_79.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';
import { addFactoredFormVar } from '../rc/function_117.inc.js';
import { sub_mulCommutative } from '../rc/function_126.inc.js';
import { sub_addFactorNegative } from '../rc/function_130.inc.js';
import { sub_addFactored } from '../rc/function_162.inc.js';
import { expToFrac } from '../rc/function_187.inc.js';
import { rootToExp } from '../rc/function_188.inc.js';
import { nthrootToSquareroot } from '../rc/function_191.inc.js';

export function 식간단히_지수유리수(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(nthrootToSquareroot);
    laco.apply(ineqIdentity);
    laco.apply(eqIdentity);
    laco.apply(expToFrac);
    laco.apply(rootToExp);
    laco.apply(fracDecimal);
    laco.apply(fracExpress);
    laco.apply(addCommutative);
    laco.apply(sub_addFactored);
    laco.apply(fracNegative);
    laco.apply(fracSeparation);
    laco.apply(addCommutative);
    laco.apply(fracMfrac);
    laco.apply(fracExpress);
    laco.apply(negParenthesis);
    laco.apply(addAdjacentSigns);
    laco.apply(posiSign);
    laco.apply(decElimZero);
    laco.apply(addFactoredFormVar);
    laco.apply(allAssociative);
    laco.apply(sub_mulCommutative);
    laco.apply(sub_addFactored);
    laco.apply(sub_addFactorNegative);
    laco.apply(fracNegative);
    laco.apply(addFactoredFormVar);
    laco.apply(addFactoredForm);
    laco.apply(sub_mulCommutative);
    return laco.finalize();
}
/*
import { LatexToTree } from '../checkmath.js';
const latex_1 = '\\frac{1}{3\\times \\nthroot{3}{(x-2)^2}}';
const latex_2 = '\\frac{1}{3\\nthroot{3}{(x-2)^2}}';
const tree_1 = LatexToTree(latex_1);
const tree_2 = LatexToTree(latex_2);
const tree_11 = 식간단히_지수유리수(tree_1);
const tree_21 = 식간단히_지수유리수(tree_2);

const result_1 = JSON.stringify(tree_11, null, 4);
const result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/
