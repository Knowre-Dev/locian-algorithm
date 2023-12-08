import { Laco } from '../libs/common.inc.js';

import { addAssociative } from '../rc/function_45.inc.js';
import { fracExpress } from '../rc/function_48.inc.js';
import { fracDecimal } from '../rc/function_49.inc.js';
import { posiSign } from '../rc/function_51.inc.js';
import { fracMfrac } from '../rc/function_52.inc.js';
import { fracNegative } from '../rc/function_53.inc.js';
import { fracSeparation } from '../rc/function_54.inc.js';
import { eqIdentity } from '../rc/function_65.inc.js';
import { ineqIdentity } from '../rc/function_66.inc.js';
import { allCommutative, allIdentity, fracSimp } from '../rc/function_67.inc.js';
import { fracComplex } from '../rc/function_69.inc.js';
import { addNegative } from '../rc/function_71.inc.js';
import { eqMulNeg } from '../rc/function_73.inc.js';
import { eqMulProp, eqMulPropUS } from '../rc/function_75.inc.js';
import { rdecToFrac } from '../rc/function_78.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { intervalSetNot } from '../rc/function_84.inc.js';
import { ineqSetNot } from '../rc/function_85.inc.js';
import { ineqMulNeg, ineqMulNegUS } from '../rc/function_124.inc.js';
import { eqIneqMulProp } from '../rc/function_125.inc.js';
import { evaluateEx_new } from '../rc/function_152.inc.js';
import { fracCombine } from '../rc/function_153.inc.js';
import { exprSimpConst } from '../rc/function_154.inc.js';
import { makeOneSideOfEqIneqZero } from '../rc/function_155.inc.js';
import { fracPlusMinus } from '../rc/function_158.inc.js';
import { groupLikeVariableTerms } from '../rc/function_156.inc.js';
import { mulAssociative } from '../rc/function_157.inc.js';
import { mulAllSidesByCommonDenom } from '../rc/function_159.inc.js';
import { mulNegative } from '../rc/function_160.inc.js';
import { solParenthesis } from '../rc/function_163.inc.js';
import { expToFrac } from '../rc/function_187.inc.js';
import { eqIneqDivPi } from '../rc/function_202.inc.js';

export function 모두가능(tree = null, variable = ['anything', 'x']) {
    const laco = new Laco();
    // tree_1 = $tree ? : laco.parse('ba+3xy+\overline{SCEAG});;

    laco.initialize(tree);
    // Step 0. Rewrite any and every set notation to inequality
    //            (will deal with infinity later)
    laco.apply(intervalSetNot, variable);

    // Step 1. Simplify all rational expressions present in the input
    //            This step includes converting all rational expressions into fractional form
    //            The last function in this step converts all nthroot and squareroot
    //            to equivalent fractional exponent forms
    laco.apply(posiSign);

    laco.apply(expToFrac);

    laco.apply(fracDecimal);

    laco.apply(rdecToFrac);

    laco.apply(fracMfrac);
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    laco.apply(solParenthesis);
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    laco.apply(fracExpress);
    laco.apply(fracSimp);

    laco.apply(fracCombine);

    laco.apply(fracComplex);

    laco.apply(solParenthesis);

    laco.apply(exprSimpConst);

    // Step 2. Subtract terms from one of the sides of
    //            a sequence of equalities and/or inequalities
    //            from all sides in the sequence (i.e., make one side zero)
    //            and then cleanup (distribute minus signs)
    //            NOTE: Location of the new 0 will be standardized later

    laco.apply(ineqIdentity);

    laco.apply(makeOneSideOfEqIneqZero);

    laco.apply(addNegative);

    // Step 3. Group terms with the same variable together,
    //             and then clean up by simplifying any numerical expressions
    // Without this step, inputs like x+2x-3x
    // somehow generates PHP error inside checkmath.php
    // although technically this step is not needed, since evaluateEx_new will be sufficient
    // for any alternate forms that this step standardizes
    laco.apply(groupLikeVariableTerms);

    laco.apply(exprSimpConst);
    // Step 4. First, remove any negative denominators and resolve plusminus signs
    //            to ensure correct direction for any inequality(ies)
    //            Afterward, remove fractions in equations by
    //            multiplying everything by the common denominator,
    //            and then cleanup (i.e., remove mulchain-within-mulchain, simplify fractions)
    laco.apply(fracNegative);
    laco.apply(fracPlusMinus);

    laco.apply(eqMulNeg);

    laco.apply(ineqMulNeg);

    laco.apply(mulAllSidesByCommonDenom);

    laco.apply(solParenthesis);

    laco.apply(exprSimpConst);

    laco.apply(mulAssociative);
    laco.apply(fracSimp);

    laco.apply(exprSimpConst);
    // Step 5. Divide all sides by the greatest integer common factor
    //            and then cleanup
    //            (i.e., separate fraction with addchains, standardize any fractions present)

    laco.apply(eqMulPropUS);

    laco.apply(mulNegative);

    laco.apply(fracSeparation);

    laco.apply(addAssociative);
    laco.apply(exprSimpConst);
    laco.apply(addNegative);

    laco.apply(fracComplex);

    laco.apply(fracNegative);

    laco.apply(fracSimp);

    // Step 6. Sort all remaining terms in a predefined order (incl. sides in eqns/ineqs)
    //             and resolve any inconsistencies that fails to consider
    //             x=0 === -x=0 or |x| === |-x|
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(eqIdentity); // Somehow eqMulNeg must come after this to work properly
    laco.apply(eqMulNeg);
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    laco.apply(eqIneqMulProp);
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    laco.apply(eqIneqDivPi);

    laco.apply(eqMulProp);

    laco.apply(ineqMulNegUS);

    laco.apply(allIdentity);

    // Step 7. Add infinity notations to any inequality
    //            This must be the last transformation step
    //            to ensure that infinity notations are placed where expected

    laco.apply(ineqSetNot, variable);
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    // console.log(JSON.stringify(laco.finalize(), null, 4));
    // BY THIS POINT, ALL INCONSISTENCIES THAT CANNOT BE RESOLVED BY
    // SUBSTITUTING RANDOM VALUES INTO VARIABLES
    // MUST HAVE BEEN RESOLVED.
    //
    // Step 8. Substitute a randomly generated complex number to each variable
    //            and then compare the output values one-on-one to establish equivalence
    laco.apply(evaluateEx_new);
    return laco.finalize();
}

/*
function 모두가능(tree_1 = null) {
    tree_1 = laco.initialize(tree_1);
        laco.apply(evaluateEx);
        laco.finalize();

    return tree_1;
}
*/
/*
import {LatexToTree, compareMathTree} from '../checkmath.js';
let latex_1 = ' 2\\left(5\\right)+2x\\geq 10';
let latex_2 = 'x\\geq 0';
let tree_1 = LatexToTree(latex_1);
let tree_2 = LatexToTree(latex_2);
let tree_11 = 모두가능(tree_1);
let tree_21 = 모두가능(tree_2);
console.log(compareMathTree(tree_11, tree_21));
let result_1 = JSON.stringify(tree_11, null, 4);
let result_2 = JSON.stringify(tree_21, null, 4);
console.log(result_1);
console.log(result_2);
*/
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
let latex_1 = 'x\\geq 0';
let tree_1 = LatexToTree(latex_1);
let tree_11 = 모두가능(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
