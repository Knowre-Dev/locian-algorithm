import {Laco} from '../libs/common.inc.js';
import {mulAssociative} from '../rc/function_1.inc.js';
import {addAssociative} from '../rc/function_2.inc.js';
import {fracExpress} from '../rc/function_5.inc.js';
import {fracDecimal} from '../rc/function_6.inc.js';
import {fracMfrac} from '../rc/function_9.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracSeparation} from '../rc/function_11.inc.js';
import {eqIdentity} from '../rc/function_22.inc.js';
import {ineqIdentity} from '../rc/function_23.inc.js';
import {allCommutative, allIdentity, fracSimp} from '../rc/function_24.inc.js';
import {fracComplex} from '../rc/function_26.inc.js';
import {addNegative} from '../rc/function_28.inc.js';
import {eqMulNeg} from '../rc/function_30.inc.js';
import {eqMulProp} from '../rc/function_32.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';
import {addFactorNegative} from '../rc/function_38.inc.js';
import {intervalSetNot} from '../rc/function_41.inc.js';
import {ineqSetNot} from '../rc/function_42.inc.js';
import {divFrac} from '../rc/function_115.inc.js';
import {fracPlusMinus} from '../rc/function_129.inc.js';
import {makeOneSideOfEqIneqZero} from '../rc/function_131.inc.js';
import {groupLikeVariableTerms} from '../rc/function_132.inc.js';
import {exprSimpConst} from '../rc/function_133.inc.js';
import {mulAllSidesByCommonDenom} from '../rc/function_134.inc.js';
import {fracCombine} from '../rc/function_136.inc.js';
import {mulNegative} from '../rc/function_137.inc.js';
import {ineqMulNeg} from '../rc/function_138.inc.js';
import {evaluateEx_new} from '../rc/function_140.inc.js';

export function equivalent(tree = null, variable = ['anything', 'x']) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    //tree = tree ? : Laco::parse('ba+3xy+\overline{SCEAG});;
    var laco = new Laco();
    laco.initialize(tree_1);
    
        // Step 0. Rewrite any and every set notation to inequality
        //            (will deal with infinity later)
    laco.apply(intervalSetNot, variable);
        // Step 1. Simplify all rational expressions present in the input
        //            This step includes converting all rational expressions into fractional form
        //            The last export function in this step converts all nthroot and squareroot
        //            to equivalent fractional exponent forms
    laco.apply(divFrac);
    
    laco.apply(fracDecimal);
    
    laco.apply(rdecToFrac);
    laco.apply(fracMfrac);
        // epark 2019-07-04: call fracCombine BEFORE fracExpress, not after
        //     RATIONALE: fracCombine combines addchain terms into a fraction,
        //                        and fracExpress combines mulchain terms into a fraction
        //                        so the current order's output is not necessarily fraction,
        //                        which makes fracComplex not as fully effective
    laco.apply(fracCombine);
    
    laco.apply(fracExpress);
    laco.apply(fracComplex);
    //console.log(JSON.stringify(laco.finalize(), null, 4));
    
    laco.apply(exprSimpConst);
    
        // Step 2. Subtract terms from one of the sides of
        //            a sequence of equalities and/or inequalities
        //            from all sides in the sequence (i.e., make one side zero)
        //            and then cleanup (distribute minus signs)
        //            NOTE: Location of the new 0 will be standardized later
    laco.apply(eqIdentity);
    laco.apply(ineqIdentity);
    laco.apply(makeOneSideOfEqIneqZero);
    
    laco.apply(addNegative);
        // Step 3. First, remove any negative denominators and resolve plusminus signs
        //            to ensure correct direction for any inequality(ies)
        //            Afterward, remove fractions in the tree by
        //            multiplying everything by the common denominator,
        //            and then cleanup (i.e., remove mulchain-within-mulchain, simplify fractions)
    laco.apply(fracNegative);
    laco.apply(fracPlusMinus);
    laco.apply(mulAllSidesByCommonDenom);
    laco.apply(mulAssociative);
    laco.apply(fracSimp);
    
    laco.apply(exprSimpConst);
    
        // Step 4. Group terms with the same variable together,
        //             and then clean up by simplifying any numerical expressions
        // Without this step, inputs like x+2x-3x
        // somehow generates PHP error inside checkmath.php
        // although technically this step is not needed, since evaluateEx_new will be sufficient
        // for any alternate forms that this step standardizes
       // console.log(JSON.stringify(laco.finalize(), null, 4));
       
    laco.apply(groupLikeVariableTerms);
    
    laco.apply(exprSimpConst);
    
        // Step 5. Divide all sides by the greatest integer common factor
        //            and then cleanup 
        //            (i.e., separate fraction with addchains, standardize any fractions present)
    laco.apply(eqMulProp);
    laco.apply(mulNegative);
    laco.apply(fracSeparation);
    
    laco.apply(addAssociative);
    laco.apply(addNegative);
    laco.apply(fracComplex);
    laco.apply(fracNegative);
    laco.apply(fracSimp);
        // Step 6. Sort all remaining terms in a predefined order (incl. sides in eqns/ineqs)
        //             and resolve any inconsistencies that fails to consider
        //             x=0 == -x=0 or |x| == |-x|
    laco.apply(allCommutative);
    laco.apply(addFactorNegative);
    laco.apply(eqIdentity); // Somehow eqMulNeg must come after this to work properly
    laco.apply(eqMulNeg);
    laco.apply(ineqMulNeg);
    laco.apply(allIdentity);
        // Step 7. Add infinity notations to any inequality
        //            This must be the last transformation step
        //            to ensure that infinity notations are placed where expected
    laco.apply(ineqSetNot, variable);
        // BY THIS POINT, ALL INCONSISTENCIES THAT CANNOT BE RESOLVED BY
        // SUBSTITUTING RANDOM VALUES INTO VARIABLES
        // MUST HAVE BEEN RESOLVED.
        // 
        // Step 8. Substitute a randomly generated complex number to each variable
        //            and then compare the output values one-on-one to establish equivalence
        
    
    laco.apply(evaluateEx_new);
    
    tree_1 = laco.finalize();
    
    return tree_1;
    
    /*
    tree = tree ?: Laco::parse('ba+3xy+\overline{SCEAG});;
    
    tree = Laco::initialize(tree)
    laco.apply(evaluateEx);
    laco.finalize()
        ;
    
    return tree;
    */
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = equivalent;
var latex1 = '0<\\sin\\frac{1}{2}(x+1)';
var latex2 = '3400000.00';
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





/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = equivalent;
var latex1 = '2x^{2}+2x+3+\\frac{6}{x-1}';

var tree1 = LatexToTree(latex1);

//console.log(JSON.stringify(tree1, null, 4));
var tree11 = func(tree1);

console.log(JSON.stringify(tree11, null, 4));
*/
