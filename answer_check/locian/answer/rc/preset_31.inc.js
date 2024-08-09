import { Laco } from '../libs/common.inc.js';

import { fracExpress } from '../rc/function_48.inc.js';
import { fracDecimal } from '../rc/function_49.inc.js';
import { negParenthesis } from '../rc/function_50.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { varReverse } from '../rc/function_64.inc.js';
import { allAssociative, allCommutative, allIdentity } from '../rc/function_67.inc.js';
import { powDecomposition } from '../rc/function_68.inc.js';
import { eqMulNeg } from '../rc/function_73.inc.js';
import { eqMulProp } from '../rc/function_75.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';

export function equiv_equations(tree = null) {
    const laco = new Laco();
    laco.initialize(tree);
    laco.apply(allIdentity);
    laco.apply(varReverse, ['angle']);
    laco.apply(varReverse, ['mangle']);
    laco.apply(varReverse, ['arc']);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
    laco.apply(fracDecimal);
    laco.apply(addAdjacentSigns);
    laco.apply(fracNegative);
    laco.apply(fracExpress);
    laco.apply(fracSeparation);
    laco.apply(posiSign);
    laco.apply(eqMulNeg);
    laco.apply(eqMulProp);
    laco.apply(negParenthesis);
    laco.apply(fracExpress);
    laco.apply(powDecomposition);
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(allAssociative);
    laco.apply(allCommutative);
    return laco.finalize();
}
