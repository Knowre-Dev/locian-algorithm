import {Laco} from './libs/common.inc.js';
import {mulAssociative} from './rc/function_1.inc.js';
import {addAssociative} from './rc/function_2.inc.js';
import {mulCommutative} from './rc/function_3.inc.js';
import {addCommutative} from './rc/function_4.inc.js';
import {fracExpress} from './rc/function_5.inc.js';
import {fracDecimal} from './rc/function_6.inc.js';
import {negParenthesis} from './rc/function_7.inc.js';
import {posiSign} from './rc/function_8.inc.js';
import {fracMfrac} from './rc/function_9.inc.js';
import {fracNegative} from './rc/function_10.inc.js';
import {fracSeparation} from './rc/function_11.inc.js';
import {addIdentity} from './rc/function_12.inc.js';
import {mulIdentity} from './rc/function_13.inc.js';
import {divIdentity} from './rc/function_14.inc.js';
import {fracIdentity} from './rc/function_15.inc.js';
import {powIdentity} from './rc/function_16.inc.js';
import {varReverseShift} from './rc/function_20.inc.js';
import {varReverse} from './rc/function_21.inc.js';
import {eqIdentity} from './rc/function_22.inc.js';
import {ineqIdentity} from './rc/function_23.inc.js';
import {allIdentity, allAssociative, allCommutative, fracSimp} from './rc/function_24.inc.js';
import {powDecomposition} from './rc/function_25.inc.js';
import {fracComplex} from './rc/function_26.inc.js';
import {addFactoredForm } from './rc/function_27.inc.js';
import {addNegative} from './rc/function_28.inc.js';
import {eqMulNeg} from './rc/function_30.inc.js';
import {eqMulProp} from './rc/function_32.inc.js';
import {fracSimpInt} from './rc/function_33.inc.js';
import {fracSimpVar} from './rc/function_34.inc.js';
import {rdecToFrac} from './rc/function_35.inc.js';
import {decElimZero} from './rc/function_36.inc.js';
import {addPolyZero} from './rc/function_37.inc.js';
import {addFactorNegative} from './rc/function_38.inc.js';
import {mulZero} from './rc/function_39.inc.js';
import {addAdjacentSigns} from './rc/function_40.inc.js';
import {intervalSetNot} from './rc/function_41.inc.js';
import {ineqSetNot} from './rc/function_42.inc.js';
import {decIdentity} from './rc/function_43.inc.js';
import {rootSimpInt} from './rc/function_107.inc.js';
import {mfracEquiv} from './rc/function_109.inc.js';
import {divFrac} from './rc/function_115.inc.js';
import {fracPlusMinus} from './rc/function_129.inc.js';
import {makeOneSideOfEqIneqZero} from './rc/function_131.inc.js';
import {groupLikeVariableTerms} from './rc/function_132.inc.js';
import {exprSimpConst} from './rc/function_133.inc.js';
import {mulAllSidesByCommonDenom} from './rc/function_134.inc.js';
import {fracCombine} from './rc/function_136.inc.js';
import {mulNegative} from './rc/function_137.inc.js';
import {ineqMulNeg} from './rc/function_138.inc.js';
import {absIdentity} from './rc/function_139.inc.js';
import {evaluateEx_new} from './rc/function_140.inc.js';
import {reWrtLogWithBase} from './rc/function_192.inc.js';
















/*
var functions = [];
functions['mulAssociative'] = mulAssociative;
functions['addAssociative'] = addAssociative;
functions['mulCommutative'] = mulCommutative;
functions['addCommutative'] = addCommutative;
functions['fracExpress'] = fracExpress;
functions['fracDecimal'] = fracDecimal;
functions['negParenthesis'] = negParenthesis;
functions['posiSign'] = posiSign;
functions['fracMfrac'] = fracMfrac;
functions['fracNegative'] = fracNegative;
functions['fracSeparation'] = fracSeparation;
functions['addIdentity'] = addIdentity;
functions['mulIdentity'] = mulIdentity;
functions['divIdentity'] = divIdentity;
functions['fracIdentity'] = fracIdentity;
functions['powIdentity'] = powIdentity;
functions['varReverseShift'] = varReverseShift;
functions['varReverse'] = varReverse;
functions['eqIdentity'] = eqIdentity;
functions['ineqIdentity'] = ineqIdentity;
functions['allIdentity'] = allIdentity;
functions['allCommutative'] = allCommutative;
functions['allAssociative'] = allAssociative;
functions['fracSimp'] = fracSimp;
functions['powDecomposition'] = powDecomposition;
functions['fracComplex'] = fracComplex;
functions['addFactoredForm'] = addFactoredForm ;
functions['addNegative'] = addNegative;
functions['eqMulNeg'] = eqMulNeg;
functions['eqMulProp'] = eqMulProp;
functions['fracSimpInt'] = fracSimpInt;
functions['fracSimpVar'] = fracSimpVar;
functions['rdecToFrac'] = rdecToFrac;
functions['decElimZero'] = decElimZero;
functions['addPolyZero'] = addPolyZero;
functions['addFactorNegative'] = addFactorNegative;
functions['mulZero'] = mulZero;
functions['addAdjacentSigns'] = addAdjacentSigns;
functions['intervalSetNot'] = intervalSetNot;
functions['ineqSetNot'] = ineqSetNot;
functions['decIdentity'] = decIdentity;
functions['rootSimpInt'] = rootSimpInt;
functions['mfracEquiv'] = mfracEquiv;
functions['divFrac'] = divFrac;
functions['fracPlusMinus'] = mulAllSidesByCommonDenom;
functions['makeOneSideOfEqIneqZero'] = makeOneSideOfEqIneqZero;
functions['groupLikeVariableTerms'] = groupLikeVariableTerms;
functions['exprSimpConst'] = exprSimpConst
functions['mulAllSidesByCommonDenom'] = mulAllSidesByCommonDenom;
functions['fracCombine'] = fracCombine;
functions['mulNegative'] = mulNegative;
functions['ineqMulNeg'] = ineqMulNeg;
functions['evaluateEx_new'] = evaluateEx_new;
functions['reWrtLogWithBase'] = reWrtLogWithBase;

function string_to_function(str) {
    return functions[str];
}
*/
/*
1. Outline: convert input data to preset function
2. Input
  funcs: [function name, function option, apply] array ([string, string, boolean])
        functions which compries preset and their corresponding function optioins
  tree: math tree
3. Output: tree
*/

function preset_html(funcs, tree = '') {
    var laco  = new Laco();
    var tree_1 = JSON.parse(JSON.stringify(tree));
    laco.initialize(tree_1);
    for (var v of funcs) {
        if (v[2] == true) {
            var func = eval(v[0]);
        
            if (v[1] == '') {
                laco.apply(func);
            } else {
                laco.apply(func, eval(v[1]));
            }
        }
    }
    tree_1 = laco.finalize();
    return tree_1;

}


var preset_simplified = [
        ['reWrtLogWithBase', '', true],
        ['allCommutative', '', true],
        ['allIdentity', '', true],
        ['varReverse', '["angle", "mangle", "arc"]', true],
        ['allAssociative', '', true],
        ['allCommutative', '', true],
        ['divFrac', '', true],  
        ['rdecToFrac', '', true],
        ['fracMfrac', '', true],
        ['fracDecimal', '', true],
        ['addAdjacentSigns', '', true],
        ['fracNegative', '', true],
        ['fracExpress', '', true],
        ['fracNegative', '', true],
        ['fracIdentity', '', true],
        ['fracSeparation', '', true],
        ['posiSign', '', true],
        ['allCommutative', '', true],
        ['eqMulNeg', '', true],
        ['negParenthesis', '', true],
        ['fracExpress', '', true],
        ['powDecomposition', '', true],
        ['mulAssociative', '', true],
        ['allCommutative', '', true],
        ['addFactorNegative', '', true],
        ['fracNegative', '', true],
        ['fracPlusMinus', '', true],
        ['allAssociative', '', true],
        ['allCommutative', '', true],
];

var preset_no_simp_frac = [
    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['fracSimp', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['allCommutative', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
]

var preset_no_identities = [
    ['allCommutative', '', true],
    ['eqIdentity', '', true],
    ['ineqIdentity', '', true],
    ['decIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['divFrac', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],        
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['negParenthesis', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
];


var preset_no_decimal = [

    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],        
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['fracMfrac', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

var preset_same = [
    ['divFrac', '', true]
];


var preset_equivalent = [
    ['intervalSetNot', '["anything", "x"]'],
    ['divFrac', '', true],
    ['fracDecimal', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracCombine', '', true],
    ['fracExpress', '', true],
    ['fracComplex', '', true],
    ['exprSimpConst', '', true],
    ['eqIdentity', '', true],
    ['ineqIdentity', '', true],
    ['makeOneSideOfEqIneqZero', '', true],
    ['addNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['mulAllSidesByCommonDenom', '', true],
    ['mulAssociative', '', true],
    ['fracSimp', '', true],
    ['exprSimpConst', '', true],
    ['groupLikeVariableTerms', '', true],
    ['exprSimpConst', '', true],
    ['eqMulProp', '', true],
    ['mulNegative', '', true],
    ['fracSeparation', '', true],
    ['addAssociative', '', true],
    ['addNegative', '', true],
    ['fracComplex', '', true],
    ['fracNegative', '', true],
    ['fracSimp', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['eqIdentity', '', true],
    ['eqMulNeg', '', true],
    ['ineqMulNeg', '', true],
    ['allIdentity', '', true],

    ['ineqSetNot', '["anything", "x"]'],
    ['evaluateEx_new', '', true]
];


var preset_standard_form = [
    ['mulCommutative', '', true],
    ['eqIdentity', '', true],
    ['ineqIdentity', '', true],
    ['mulZero', '', true],
    ['addIdentity', '', true],
    ['mulIdentity', '', true],
    ['fracIdentity', '', true],
    ['powIdentity', '', true],
    ['decIdentity', '', true],
    ['mulCommutative', '', true],
    ['eqMulNeg', '', true],
    ['eqMulProp', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['mulAllSidesByCommonDenom', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true]
];

var preset_simp_distribute  = [
    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allCommutative', '', true],
    ['addFactoredForm', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

var preset_poly_division = [
    ['fracIdentity', '', true],
    ['powIdentity', '', true],
    ['decIdentity', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['fracExpress', '', true],
    ['negParenthesis', '', true],
    ['addPolyZero', '', true]
];

var preset_equiv_equations = [
    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['divFrac', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['eqMulProp', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

var preset_geometry_polygon = [
    ['varReverseShift', '[null, "overline", "segment"]']
];

var preset_geometry_angle = [
    ['varReverse', '[null, "overline", "angle", "mangle", "arc"]']
];

var preset_set_bounds = [
    ['decIdentity', '', true],
    ['ineqIdentity', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['allCommutative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['ineqSetNot', '["anything", "x"]'],
    ['intervalSetNot', '["anything", "x"]'],
    ['ineqIdentity', '', true]
];

var preset_root_simp = [    
    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['rootSimpInt', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

var  preset_mixed_frac = [    
    ['mfracEquiv', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];


var preset_no_mixed_frac = [
    ['allCommutative', '', true],
    ['allIdentity', '', true],
    ['varReverse', '["angle", "mangle", "arc"]'],        
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracNegative', '', true],
    ['fracIdentity', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['mulAssociative', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

var preset_equivalent_backup = [
    ['intervalSetNot', '["anything", "x"]'],
    ['fracDecimal', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracExpress', '', true],
    ['fracCombine', '', true],
    ['fracComplex', '', true],
    ['exprSimpConst', '', true],
    ['makeOneSideOfEqIneqZero', '', true],
    ['addNegative', '', true],
    ['groupLikeVariableTerms', '', true],
    ['exprSimpConst', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['mulAllSidesByCommonDenom', '', true],
    ['mulAssociative', '', true],
    ['fracSimp', '', true],
    ['eqMulProp', '', true],
    ['mulNegative', '', true],
    ['fracSeparation', '', true],
    ['addAssociative', '', true],
    ['addNegative', '', true],
    ['fracComplex', '', true],
    ['fracNegative', '', true],
    ['fracSimp', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['eqIdentity', '', true], 
    ['eqMulNeg', '', true],
    ['ineqMulNeg', '', true],
    ['allIdentity', '', true],
    ['ineqSetNot', '["anything", "x"]'],
    ['evaluateEx_new', '', true],
]




/*
import {LatexToTree, match_all} from './checkmath.js';
var latex_1 = 'A\\cup B\\cup C';
var tree_1 = LatexToTree(latex_1);
var tree_11 = preset_html(preset_equivalent_backup, tree_1);
var result_1 = JSON.stringify(tree_11, '', 4);
console.log(result_1);
*/






