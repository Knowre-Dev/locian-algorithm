/* eslint-disable no-unused-vars */
/* eslint-disable no-eval */
import { Laco } from './libs/common.inc.js';
/*
import { 곱셈결합법칙 } from './rc/function_44.inc.js';
import { addAssociative } from './rc/function_45.inc.js';
import { mulCommutative } from './rc/function_46.inc.js';
import { addCommutative } from './rc/function_47.inc.js';
import { fracExpress } from './rc/function_48.inc.js';
import { fracDecimal } from './rc/function_49.inc.js';
import { negParenthesis } from './rc/function_50.inc.js';
import { posiSign } from './rc/function_51.inc.js';
import { fracMfrac } from './rc/function_52.inc.js';
import { fracNegative } from './rc/function_53.inc.js';
import { fracSeparation } from './rc/function_54.inc.js';
import { addIdentity } from './rc/function_55.inc.js';
import { mulIdentity } from './rc/function_56.inc.js';
import { divIdentity } from './rc/function_57.inc.js';
import { fracIdentity } from './rc/function_58.inc.js';
import { powIdentity } from './rc/function_59.inc.js';
import { varReverseShift } from './rc/function_63.inc.js';
import { varReverse } from './rc/function_64.inc.js';
import { eqIdentity } from './rc/function_65.inc.js';
import { ineqIdentity } from './rc/function_66.inc.js';
import { allIdentity, allAssociative, allCommutative, fracSimp } from './rc/function_67.inc.js';
import { powDecomposition } from './rc/function_68.inc.js';
import { fracComplex } from './rc/function_69.inc.js';
import { addFactoredForm } from './rc/function_70.inc.js';
import { addNegative } from './rc/function_71.inc.js';
import { eqMulNeg } from './rc/function_73.inc.js';
import { eqMulProp, eqMulPropUS } from './rc/function_75.inc.js';
import { fracSimpInt } from './rc/function_76.inc.js';
import { fracSimpVar } from './rc/function_77.inc.js';
import { rdecToFrac } from './rc/function_78.inc.js';
import { decElimZero } from './rc/function_79.inc.js';
import { addPolyZero } from './rc/function_80.inc.js';
import { addFactorNegative } from './rc/function_81.inc.js';
import { mulZero } from './rc/function_82.inc.js';
import { addAdjacentSigns } from './rc/function_83.inc.js';
import { intervalSetNot } from './rc/function_84.inc.js';
import { ineqSetNot } from './rc/function_85.inc.js';
import { decIdentity } from './rc/function_86.inc.js';
import { mfracEquiv } from './rc/function_110.inc.js';
import { powBaseSort } from './rc/function_111.inc.js';
import { powAddFactoredForm } from './rc/function_112.inc.js';
import { mulConstCal } from './rc/function_113.inc.js';
import { mulToNega } from './rc/function_114.inc.js';
import { rootSimpInt } from './rc/function_116.inc.js';
import { addFactoredFormVar } from './rc/function_117.inc.js';
import { natElimZero } from './rc/function_119.inc.js';
import { powerOne } from './rc/function_120.inc.js';
import { mulPowSeparation } from './rc/function_121.inc.js';
import { powerFrac } from './rc/function_122.inc.js';
import { mulFracSeparation } from './rc/function_123.inc.js';
import { ineqMulNeg, ineqMulNegUS } from './rc/function_124.inc.js';
import { eqIneqMulProp } from './rc/function_125.inc.js';
import { sub_mulCommutative } from './rc/function_126.inc.js';
import { sub_addFactorNegative } from './rc/function_130.inc.js';
import { evaluateEx_new } from './rc/function_152.inc.js';
import { fracCombine } from './rc/function_153.inc.js';
import { exprSimpConst } from './rc/function_154.inc.js';
import { makeOneSideOfEqIneqZero } from './rc/function_155.inc.js';
import { groupLikeVariableTerms } from './rc/function_156.inc.js';
import { mulAssociative } from './rc/function_157.inc.js';
import { fracPlusMinus } from './rc/function_158.inc.js';
import { mulAllSidesByCommonDenom } from './rc/function_159.inc.js';
import { mulNegative } from './rc/function_160.inc.js';
import { sub_addFactored } from './rc/function_162.inc.js';
import { solParenthesis } from './rc/function_163.inc.js';
import { setAssociative } from './rc/function_166.inc.js';
import { setCommutative } from './rc/function_167.inc.js';
import { expToFrac } from './rc/function_187.inc.js';
import { rootToExp } from './rc/function_188.inc.js';
import { nthrootToSquareroot } from './rc/function_191.inc.js';
import { eqIneqDivPi } from './rc/function_202.inc.js';
import { addNegaToSub } from './rc/function_204.inc.js';
*/
/*
var functions = [];
functions['곱셈결합법칙'] = 곱셈결합법칙;
functions['addAssociative'] = addAssociative ;
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
functions['eqMulPropUS'] = eqMulPropUS;
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
functions['mfracEquiv'] = mfracEquiv;
functions['powBaseSort'] = powBaseSort;
functions['powAddFactoredForm'] = powAddFactoredForm;
functions['mulConstCal'] = mulConstCal;
functions['mulToNega'] = mulToNega;
functions['rootSimpInt'] = rootSimpInt;
functions['addFactoredFormVar'] = addFactoredFormVar;
functions['natElimZero'] = natElimZero;
functions['powerOne'] = powerOne;
functions['mulPowSeparation'] = mulPowSeparation;
functions['powerFrac'] = powerFrac;
functions['mulFracSeparation'] = mulFracSeparation;
functions['ineqMulNeg'] = ineqMulNeg;
functions['ineqMulNegUS'] = ineqMulNegUS;
functions['eqIneqMulProp'] = eqIneqMulProp;
functions['sub_mulCommutative'] = sub_mulCommutative;
functions['sub_addFactorNegative'] = sub_addFactorNegative;
functions['evaluateEx_new'] = evaluateEx_new;
functions['fracCombine'] = fracCombine;
functions['exprSimpConst'] = exprSimpConst;
functions['makeOneSideOfEqIneqZero'] = makeOneSideOfEqIneqZero;
functions['groupLikeVariableTerms'] = groupLikeVariableTerms;
functions['mulAssociative'] = mulAssociative;
functions['fracPlusMinus'] = mulAllSidesByCommonDenom;
functions['mulAllSidesByCommonDenom'] = mulAllSidesByCommonDenom;
functions['mulNegative'] = mulNegative;
functions['sub_addFactored'] = sub_addFactored;
functions['solParenthesis'] = solParenthesis;
functions['setAssociative'] = setAssociative;
functions['setCommutative'] = setCommutative;
functions['expToFrac'] = expToFrac;
functions['rootToExp'] = rootToExp;
functions['nthrootToSquareroot'] = nthrootToSquareroot;
functions['eqIneqDivPi'] = eqIneqDivPi;
functions['addNegaToSub'] = addNegaToSub;

function string_to_function(str) {
    return functions[str];
}
*/

/*
1. Outline: convert input data to preset function
2. Input
  funcs: [function name, function option, apply] array ([string, string, boolean])
        functions which compries preset and their corresponding function options
  tree: math tree
3. Output: tree
*/

function preset_html(funcs, tree = '') {
    const laco = new Laco();
    let tree_1 = JSON.parse(JSON.stringify(tree));
    laco.initialize(tree_1);
    for (const v of funcs) {
        if (v[2] === true) {
            const func = eval(v[0]);

            if (v[1] === '') {
                laco.apply(func);
            } else {
                laco.apply(func, eval(v[1]));
            }
        }
    }
    tree_1 = laco.finalize();
    return tree_1;
}

/*
1. Outline: compare two math expression with given function
2. Input
  function_name: function to compare
  answer: answer
  input: input
3. Output: boolean
*/

import { LatexToTree, compareMathTree } from './checkmath.js';
// eslint-disable-next-line no-unused-vars
function test_result(function_name, answer, input) {
    let tree_answer = LatexToTree(answer);
    tree_answer = function_name(tree_answer);
    let tree_input = LatexToTree(input);
    tree_input = function_name(tree_input);
    return compareMathTree(tree_answer, tree_input);
}

// prest function array

const preset_기본 = [
    ['allIdentity', '', true],
    ['varReverse', '["angle"]'],
    ['varReverse', '["mangle"]'],
    ['varReverse', '["arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const preset_no_simp_frac = [
    ['addIdentity', '', true],
    ['mulIdentity', '', true],
    ['divIdentity', '', true],
    ['fracIdentity', '', true],
    ['powIdentity', '', true],
    ['decIdentity', '', true],
    ['mulCommutative', '', true],
    ['addCommutative', '', true],
    ['fracSeparation', '', true],
    ['fracMfrac', '', true],
    ['posiSign', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['mulAssociative', '', true],
    ['addAssociative', '', true],
    ['mulCommutative', '', true],
    ['addCommutative', '', true],
    ['fracDecimal', '', true],
    ['fracExpress', '', true],
    ['fracSimpInt', '', true]
];

const preset_no_identities = [
    ['decIdentity', '', true],
    ['eqIdentity', '', true],
    ['ineqIdentity', '', true],
    ['varReverse', '["angle"]'],
    ['varReverse', '["mangle"]'],
    ['varReverse', '["arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const preset_no_decimal = [
    ['allIdentity', '', true],
    ['varReverse', '["angle"]'],
    ['varReverse', '["mangle"]'],
    ['varReverse', '["arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['fracMfrac', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const preset_same = [];

const preset_equivalent = [
    ['evaluateEx_new', '', true]
];

const preset_standard_form = [
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
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true]
];

const preset_simp_distribute = [
    ['allIdentity', '', true],
    ['varReverse', '["angle"]'],
    ['varReverse', '["mangle"]'],
    ['varReverse', '["arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['negParenthesis', '', true],
    ['powDecomposition', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allCommutative', '', true],
    ['addFactoredForm', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const prest_poly_division = [
    ['fracIdentity', '', true],
    ['powIdentity', '', true],
    ['decIdentity', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['negParenthesis', '', true],
    ['addPolyZero', '', true]
];

const preset_equiv_equations = [
    ['allIdentity', '', true],
    ['varReverse', '["angle"]'],
    ['varReverse', '["mangle"]'],
    ['varReverse', '["arc"]'],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['eqMulNeg', '', true],
    ['eqMulProp', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['powDecomposition', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const preset_geometry_polygon = [
    ['varReverseShift', '', true]
];

const preset_geometry_angle = [
    ['varReverse', '', true]
];

const prset_set_bounds = [
    ['decIdentity', '', true],
    ['ineqIdentity', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracDecimal', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['allCommutative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['ineqSetNot', '["anything", "x"]', '', true],
    ['intervalSetNot', '["anything", "x"]', '', true],
    ['ineqIdentity', '', true]
];

const prest_분수와소수 = [
        ['allAssociative', '', true],
        ['allCommutative', '', true],
        ['fracDecimal', '', true],
        ['fracMfrac', '', true],
        ['fracSimpVar', '', true],
        ['fracSimpInt', '', true],
        ['addAdjacentSigns', '', true],
        ['fracNegative', '', true],
        ['fracExpress', '', true],
        ['fracSeparation', '', true],
        ['posiSign', '', true],
        ['negParenthesis', '', true],
        ['fracExpress', '', true],
        ['allCommutative', '', true],
        ['addFactorNegative', '', true],
        ['allAssociative', '', true],
        ['allCommutative', '', true]
];

const preset_소수만가능 = [
    ['posiSign', '', true],
    ['negParenthesis', '', true],
    ['decElimZero', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const prest_고정 = [
    ['addNegaToSub', '', true]
];

const prest_식_간단히 = [
    ['ineqIdentity', '', true],
    ['eqIdentity', '', true],
    ['nthrootToSquareroot', '', true],
    ['fracDecimal', '', true],
    ['fracExpress', '', true],
    ['sub_mulCommutative', '', true],
    ['addCommutative', '', true],
    ['sub_addFactored', '', true],
    ['fracNegative', '', true],
    ['fracSeparation', '', true],
    ['addCommutative', '', true],
    ['fracMfrac', '', true],
    ['fracExpress', '', true],
    ['negParenthesis', '', true],
    ['addAdjacentSigns', '', true],
    ['posiSign', '', true],
    ['decElimZero', '', true],
    ['addFactoredFormVar', '', true],
    ['allAssociative', '', true],
    ['sub_mulCommutative', '', true],
    ['sub_addFactorNegative', '', true],
    ['sub_addFactored', '', true],
    ['sub_addFactorNegative', '', true],
    ['fracNegative', '', true],
    ['addFactoredFormVar', '', true],
    ['addFactoredForm', '', true],
    ['sub_mulCommutative', '', true],
    ['ineqIdentity', '', true],
    ['eqIdentity', '', true]
]

const preset_기약분수만_가능 = [
    ['negParenthesis', '', true],
    ['posiSign', '', true],
    ['addAdjacentSigns', '', true],
    ['fracMfrac', '', true],
    ['fracSeparation', '', true],
    ['fracNegative', '', true],
    ['addFactoredForm', '', true],
    ['addFactorNegative', '', true],
    ['addFactoredFormVar', '', true],
    ['allCommutative', '', true],
    ['allAssociative', '', true]
];

const preset_기약분수_소수_가능 = [
    ['nthrootToSquareroot', '', true],
    ['decElimZero', '', true],
    ['fracDecimal', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['fracNegative', '', true],
    ['fracMfrac', '', true],
    ['fracExpress', '', true],
    ['negParenthesis', '', true],
    ['posiSign', '', true],
    ['addFactoredFormVar', '', true],
    ['decElimZero', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['addCommutative', '', true],
    ['sub_mulCommutative', '', true],
    ['addFactoredForm', '', true]
];

const preset_역순가능 = [
    ['varReverse', '', true]
];

const preset_역순밀림_가능 = [
    ['varReverseShift', '', true]
];

const preset_대분수_가능 = [
    ['mfracEquiv', '', true]
];

const preset_인수분해꼴 = [
    ['fracExpress', '', true],
    ['addCommutative', '', true],
    ['mulToNega', '', true],
    ['powBaseSort', '', true],
    ['allAssociative', '', true],
    ['sub_mulCommutative', '', true],
    ['addCommutative', '', true],
    ['sub_mulCommutative', '', true],
    ['addFactorNegative', '', true],
    ['mulConstCal', '', true]
];

const preset_등식_좌우변경가능 = [
    ['negParenthesis', '', true],
    ['decElimZero', '', true],
    ['fracDecimal', '', true],
    ['fracSeparation', '', true],
    ['fracMfrac', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['addAdjacentSigns', '', true],
    ['eqIdentity', '', true],
    ['ineqIdentity', '', true],
    ['allCommutative', '', true],
    ['allAssociative', '', true],
    ['sub_addFactorNegative', '', true]
];

const preset_모두가능 = [
    ['intervalSetNot', '["anything", "x"]'],
    ['posiSign', '', true],
    ['expToFrac', '', true],
    ['fracDecimal', '', true],
    ['rdecToFrac', '', true],
    ['fracMfrac', '', true],
    ['fracExpress', '', true],
    ['fracSimp', '', true],
    ['fracCombine', '', true],
    ['fracComplex', '', true],
    ['solParenthesis', '', true],
    ['exprSimpConst', '', true],
    ['ineqIdentity', '', true],
    ['makeOneSideOfEqIneqZero', '', true],
    ['addNegative', '', true],
    ['groupLikeVariableTerms', '', true],
    ['exprSimpConst', '', true],
    ['fracNegative', '', true],
    ['fracPlusMinus', '', true],
    ['eqMulNeg', '', true],
    ['ineqMulNeg', '', true],
    ['mulAllSidesByCommonDenom', '', true],
    ['solParenthesis', '', true],
    ['exprSimpConst', '', true],
    ['mulAssociative', '', true],
    ['fracSimp', '', true],
    ['exprSimpConst', '', true],
    ['eqMulPropUS', '', true],
    ['mulNegative', '', true],
    ['fracSeparation', '', true],
    ['addAssociative', '', true],
    ['exprSimpConst', '', true],
    ['addNegative', '', true],
    ['fracComplex', '', true],
    ['fracNegative', '', true],
    ['fracSimp', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['eqIdentity', '', true],
    ['eqMulNeg', '', true],
    ['eqIneqMulProp', '', true],
    ['eqIneqDivPi', '', true],
    ['eqMulProp', '', true],
    ['ineqMulNegUS', '', true],
    ['allIdentity', '', true],
    ['ineqSetNot', '["anything", "x"]'],
    ['evaluateEx_new', '', true]
];

const preset_자연수만_가능 = [
    ['natElimZero', '', true]
];

const preset_거듭제곱꼴만_가능 = [
        ['powerFrac', '', true],
        ['powerOne', '', true],
        ['mulPowSeparation', '', true],
        ['mulFracSeparation', '', true],
        ['allAssociative', '', true],
        ['addCommutative', '', true],
        ['sub_mulCommutative', '', true]
];

const preset_가분수만_가능 = [
    ['allAssociative', '', true],
    ['allCommutative', '', true],
    ['fracSimpVar', '', true],
    ['fracSimpInt', '', true],
    ['addAdjacentSigns', '', true],
    ['fracNegative', '', true],
    ['fracExpress', '', true],
    ['fracSeparation', '', true],
    ['posiSign', '', true],
    ['negParenthesis', '', true],
    ['fracExpress', '', true],
    ['allCommutative', '', true],
    ['addFactorNegative', '', true],
    ['allAssociative', '', true],
    ['allCommutative', '', true]
];

const preset_집합연산_가능 = [
    ['setAssociative', '', true],
    ['setCommutative', '', true]
];

const preset_식간단히_지수유리수 = [
        ['nthrootToSquareroot', '', true],
        ['ineqIdentity', '', true],
        ['eqIdentity', '', true],
        ['expToFrac', '', true],
        ['rootToExp', '', true],
        ['fracDecimal', '', true],
        ['fracExpress', '', true],
        ['addCommutative', '', true],
        ['sub_addFactored', '', true],
        ['fracNegative', '', true],
        ['fracSeparation', '', true],
        ['addCommutative', '', true],
        ['fracMfrac', '', true],
        ['fracExpress', '', true],
        ['negParenthesis', '', true],
        ['addAdjacentSigns', '', true],
        ['posiSign', '', true],
        ['decElimZero', '', true],
        ['addFactoredFormVar', '', true],
        ['allAssociative', '', true],
        ['sub_mulCommutative', '', true],
        ['sub_addFactored', '', true],
        ['sub_addFactorNegative', '', true],
        ['fracNegative', '', true],
        ['addFactoredFormVar', '', true],
        ['addFactoredForm', '', true],
        ['sub_mulCommutative', '', true]
];

const preset_곱셈_교환법칙 = [
    ['mulCommutative', '', true]
];

/*
import {LatexToTree, match_all} from './checkmath.js';
var latex_1 = 'A\\cup B\\cup C';
var tree_1 = LatexToTree(latex_1);
var tree_11 = preset_html(preset_모두가능, tree_1);
var result_1 = JSON.stringify(tree_11, '', 4);
console.log(result_1);
*/
