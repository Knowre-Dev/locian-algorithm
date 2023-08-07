

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Contents:
array2ChainTree
chainTree2Array
combine2ChainTree
evalNumericValues
  - evalNumericValues_addchain
  - evalNumericValues_mulchain
  - evalNumericValues_power
findDenominators
findGCF
findVars
flipOp
hasType
isNumeric
multFactor
termExists
validMathTree
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Converts an array of two or more arithmetic terms into an addchain or mulchain
If there is only one term in the array, just return that term (without subtype)

Parameter:
arr: An array of arithmetic terms
(each element must have 'add', 'sub', 'addsub', 'subadd', 'mul', 'div' as its 0th element)
evalNumeric: An optional boolean -
                      if TRUE, evaluate all numerical terms into a single term before returning

Returns:
An addchain or mulchain

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function array2ChainTree(arr, evalNumeric = false) {
    var arr_1 = JSON.parse(JSON.stringify(arr));
    // For any invalid input, just return the input back
    if (!Array.isArray(arr_1) || arr_1.length == 0 || arr_1[0].length < 1) {
        return arr_1;
    }
    var operator;
    if (['add', 'sub', 'addsub', 'subadd'].includes(arr_1[0][0])) {
        operator = 'addchain';
    } else if (['mul', 'div'].includes(arr_1[0][0])) {
        operator = 'mulchain';
    } else {
        // Can only handle addchain or mulchain; return the input array otherwise
        return arr_1;
    }
    
    // Optional: Evaluate all numerical terms into a single term
    if (evalNumeric) {
        var numericArr = [];
        var nonnumericArr = [];
        for (var term of arr_1) {
            var subtree = term[1];
            if (isNumeric(subtree, false, false)) {
                numericArr.push([term[0], subtree]);
            } else {
                nonnumericArr.push([term[0], subtree]);
            }
        }
        var numRes = array2ChainTree(numericArr);
        
        arr_1 = nonnumericArr;
        if (numRes.length > 0) {
            numRes = evalNumericValues(numRes);
            if (operator == 'addchain') {
                if (arr_1.length == 0 || JSON.stringify(numRes) != JSON.stringify(['natural', '0'])) {
                    if (numRes[0] == 'negative') {
                        arr_1.unshift(['sub', numRes[1]]);
                    } else {
                        arr_1.unshift(['add', numRes]);
                    }
                }
            } else {
                arr_1.unshift(['mul', numRes]);
            }
        }
    }
    
    // If there is only one operand, just return that operand
    if (arr_1.length == 1) {
        if (['addsub', 'subadd'].includes(arr_1[0][0])) {
            return ['pm', arr_1[0][1]];
        }
        if (arr_1[0][0] == 'sub') {
            return ['negative', arr_1[0][1]];
        }
        if (arr_1[0][0] == 'div') {
            return ['fraction', ['natural', '1'], arr_1[0][1]];
        }
        return arr_1[0][1];
    }
    
    // Construct the tree
    var tree_1 = [operator].concat(arr_1);
    return tree_1;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = array2ChainTree;
var latex1 = '\\frac{x+2}{5}+\\frac{x+4}{5}-\\frac{x+3}{5}=\\frac{2x+6}{10}';
var tree1 = LatexToTree(latex1);
var tree11 = func(tree1);
console.log(JSON.stringify(tree11, null, 4));
*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Converts a MathTree into array of term(s) of given subtype
(add, sub, mul, div, etc. - defaults to mul)
If the tree is either addchain or mulchain and its terms agree in type with the 2nd input,
then ignores the 2nd input and just returns the array of terms in the tree (with subtype)

This export function, roughly speaking, is the inverse of array2ChainTree.

Parameters:
tree: A MathTree
subtype: A string (e.g., 'add', 'sub', 'addsub', 'subadd', 'mul', 'div') - defaults to 'mul'

Returns:
An array of array(s)

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function chainTree2Array(tree, subtype = 'mul') {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1) || tree_1.length < 1) {
        return tree_1;
    }
    
    // Make sure to return array of array(s) as the final output
    if (tree_1[0] == 'addchain') {
        if (['add', 'sub', 'addsub', 'subadd'].includes(subtype)) {
            return tree_1.slice(1);
        }
    } else if (tree_1[0] == 'mulchain') {
        if (['mul', 'div'].includes(subtype)) {
            return tree_1.slice(1);
        }
    }
    return [[subtype, tree_1]];
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Combines two trees into one tree of type either addchain or mulchain

Parameters:
tree1: The first tree
tree2: The second tree
subtype: String for subtype of the terms in the output tree
      This arg, if not provided, is set to agree with tree1
      (or tree2 if tree1 is neither an addchain nor a mulchain)
      If neither tree is either an addchain or a mulchain,
      then subtype defaults to 'mul'.
      However, it is recommended to always provide this arg
      so that the export function works as intended

Returns:
A new tree of type either addchain or mulchain

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function combine2ChainTree(tree_1, tree_2, subtype = null) {
    var tree_11 = JSON.parse(JSON.stringify(tree_1));
    var tree_21 = JSON.parse(JSON.stringify(tree_2));
    if (!Array.isArray(tree_11) || tree_11.length < 1 || 
        !Array.isArray(tree_21) || tree_21.length < 1) {
        return false;
        }
    
    // Set subtype if not provided (see the note above)
    if (subtype == null) {
        if (['addchain', 'mulchain'].includes(tree_11[0])) {
            subtype = tree_11[0] == 'addchain' ? 'add' : 'mul';
        } else {
            subtype = tree_21[0] == 'addchain' ? 'add' : 'mul';
        }
    }
    
    var t1Arr = chainTree2Array(tree_11, subtype);
    var t2Arr = chainTree2Array(tree_21, subtype);
    
    var tArr = t1Arr.concat(t2Arr);
    return array2ChainTree(tArr);
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Evaluates the given tree of purely numerical terms
Note: NOT term-by-term recursive

Precondition:
1. tree must contain SIMPLE (i.e., not compound) numerical terms 
    with no plusminus (not even addsub/subadd)

Parameters:
tree: A MathTree (assumed to contain only numerical terms)

Returns:
A new MathTree (either natural or fraction with natural subtrees)

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
import {fracDecimal} from '../rc/function_6.inc.js';
import {fracNegative} from '../rc/function_10.inc.js';
import {fracComplex} from '../rc/function_26.inc.js';
import {fracSimpInt} from '../rc/function_33.inc.js';
import {rdecToFrac} from '../rc/function_35.inc.js';

export function evalNumericValues(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    
    var operator = tree_1.shift();
    var operand = tree_1;
    switch (operator) {
        case 'natural':
            tree_1 = [operator, operand[0]];
            return tree_1;
        
        
        case 'decimal':
            tree_1 = [operator, operand[0]];
            return evalNumericValues(fracDecimal(tree_1));
        
        
        case 'rdecimal':
            tree_1 = [operator, operand[0]];
            return evalNumericValues(rdecToFrac(tree_1));
            
        
        case 'negative':
            var subtree = evalNumericValues(operand[0]);
            if (subtree[0] == 'negative') {
                return subtree[1];
            }
            tree_1 = [operator, subtree];
            return tree_1;
            
        
        case 'absolute':
            tree_1 = evalNumericValues(operand[0]);
            if (tree_1[0] == 'negative') {
                tree_1 = tree_1[1];
            }
            return tree_1;
        
        case 'fraction':
            tree_1 = [operator].concat(operand);
            tree_1 = fracComplex(tree_1);
            tree_1 = fracNegative(tree_1);
            tree_1 = fracSimpInt(tree_1);
            return tree_1;
        
        
        case 'addchain':
            tree_1 = evalNumericValues_addchain(operand);
            return tree_1;
            
        
        case 'mulchain':
            tree_1 = evalNumericValues_mulchain(operand);
            return tree_1;
            
        
        case 'power':
            tree_1 = evalNumericValues_power(operand);
            return tree_1;
            
        
        default:
            tree_1 = [operator].concat(operand);
            
    }
    
    return tree_1;
}

/*
Helper export function for evalNumericValues(tree) for addchain tree
Author: epark
*/
import {EuclidAlg} from '../rc/function_33.inc.js';

export function evalNumericValues_addchain(operand) {
    var operand_1 = JSON.parse(JSON.stringify(operand));
    var operator = 'addchain';
    
    var numer = 0;
    var denom = 1;
    for (var term of operand_1) {
        var op = term[0];
        var subtree = term[1];
        
        // Account for any negative and/or subtraction
        var sign = 1;
        if (subtree[0] == 'negative') {
            sign = -sign;
            subtree = subtree[1];
        }
        if (op == 'sub') {
            sign = -sign;
        }
        var nVal;
        var dVal;
        if (subtree[0] == 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        } else {
            nVal = parseInt(subtree[1]);
            dVal = 1;
        }
        // Update denom to the LCD of all terms considered so far
        var updateFactor = dVal / EuclidAlg(denom, dVal);
        denom *= updateFactor;
        // Update numer also to reflect the new LCD, and then add the current term
        numer *= updateFactor;
        numer += sign * nVal * (denom / dVal);
    }
    
    // Construct the output tree as a fraction, and then simplify before returning
    var tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    if (numer < 0) {
        tree = ['negative', tree];
    }
    tree = fracSimpInt(tree);
    return tree;
}

/*
Helper export function for evalNumericValues(tree) for mulchain tree
Author: epark
*/
export function evalNumericValues_mulchain(operand) {
    var operand_1 = JSON.parse(JSON.stringify(operand));
    var operator = 'mulchain';
    
    var numer = 1;
    var denom = 1;
    for (var term of operand_1) {
        // Return early if numer == 0 (for efficiency's sake)
        if (numer == 0) {
            return ['natural', '0'];
        }
        var op = term[0];
        var subtree = term[1];
        
        // Account for any negative
        var sign = 1;
        if (subtree[0] == 'negative') {
            sign = -1;
            subtree = subtree[1];
        }
        var nVal;
        var dVal;
        if (subtree[0] == 'fraction') {
            nVal = parseInt(subtree[1][1]);
            dVal = parseInt(subtree[2][1]);
        } else {
            nVal = parseInt(subtree[1]);
            dVal = 1;
        }
        
        // Update the current numerator and denominator
        if (op == 'div') {
            var temp = nVal;
            nVal = dVal;
            dVal = temp;
        }
        numer *= (sign * nVal);
        denom *= dVal;
    }
    // Construct the output tree as a fraction, and then simplify before returning
    var tree = ['fraction', ['natural', Math.abs(numer).toString()], ['natural', denom.toString()]];
    if (numer < 0) {
        tree = ['negative', tree];
    }
    tree = fracSimpInt(tree);
    return tree;
}

/*
Helper export function for evalNumericValues(tree) for power tree
Author: epark
*/
export function evalNumericValues_power(operand) {
    var operand_1 = JSON.parse(JSON.stringify(operand));
    var operator = 'power';
    
    // By precondition, the input is simple numeric,
    // which means the base is guaranteed to be natural, or a negative thereof
    var basetree = operand_1[0];
    var sign = 1;
    if (basetree[0] == 'negative') {
        sign = -1;
        basetree = basetree[1];
    }
    
    var expFrac = [operand_1[1], ['natural', '1']];
    if (operand_1[1][0] == 'fraction') {
        expFrac = operand[1].slice(1);
    }
    // Create a flag to store info on whether the exponent is negative
    // so that we can take reciprocal at the end if appropriate
    var reciprocFlag = false;
    for (var [k, obj] of expFrac.entries()) {
        if (obj[0] == 'negative') {
            reciprocFlag = !reciprocFlag;
            expFrac[k] = obj[1];
        }
    }
    
    // Evaluation
    var mtermArr = []; // construct as a mulchain, and then simplify later
    
    // work with absolute value of base for now, will see why later
    var bVal = parseInt(basetree[1]);
    
    var xNval = parseInt(expFrac[0][1]);
    var xDval = parseInt(expFrac[1][1]);
    // Watch out for any imaginary number case
    var imaginaryFlag = sign == -1 && xNval % 2 == 1 && xDval % 2 == 0;
    
    // Factor out any integer result possible
    var xVal = Math.floor(xNval / xDval);
    if (Math.log(Number.MAX_SAFE_INTEGER, bVal) < xVal) {
        return ['power'].concat(operand);
    }
    var intRes = Math.pow(bVal, xVal);
    var rtRes = Math.pow(bVal, (xNval % xDval) / xDval);
    // Here, pow() quietly returns FALSE for inputs like pow(-1, 1 / 2)
    // that was why we work with the absolute value
    // and deal with the sign last
    // so that we can put imaginary unit i properly
    
    // Add the mul terms to mtermArr
    if (rtRes == Math.floor(rtRes)) {
        intRes *= rtRes;
        mtermArr.push(['mul', ['natural', intRes.toString()]]);
    } else {
        if (intRes != 1) {
            mtermArr.push(['mul', ['natural', intRes.toString()]]);
        }
        var subtree = [
            'power',
            ['natural', bVal.toString()],
            ['fraction', ['natural', (xNval % xDval).toString()], ['natural', xDval.toString()]]
        ];
        mtermArr.push(['mul', subtree]);
    }
    
    // Deal with imaginary number case and negative result case here
    var resSign;
    if (imaginaryFlag) {
        mtermArr.push(['mul', ['variable', 'i']]);
        var intSign = Math.floor(xNval / xDval) % 2 == 0 ? 1 : sign;
        var rtSign = (xNval % xDval) % 2 == 0 ? 1 : sign;
        resSign = intSign * rtSign;
    } else {
        resSign = xNval % 2 == 0 ? 1 : sign;
    }
    var tree = array2ChainTree(mtermArr);
    if (reciprocFlag)
        tree = ['fraction', ['natural', '1'], tree];
    if (resSign < 0)
        tree = ['negative', tree];
    
    //tree = mulIdentity(tree);
    return tree;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns an array of denominators of all fractions present in the given tree

Parameters:
tree: A Laco tree
unique: An option to have each element in the output array unique
              By default, duplicates are allowed (i.e., unique = false)
positive: An option to output absolute values of any negative denominators
              By default set to FALSE (i.e., simply gives any denominator as is)

Returns:
An array of Laco data object (e.g., ['natural', '5'], ['variable', 'q'])

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function findDenominators(tree, unique = false, positive = false) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var denomArr = [];
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        switch (operator) {
            case 'fraction':
                var denom = tree_1[1];
                if (positive && denom[0] == 'negative') {
                    denom = denom[1];
                }
                denomArr.push(denom);
                break;
            
            default:
                for (var subtree of tree_1) {
                    var subDenArr = findDenominators(subtree, unique);
                    for (var dtree of subDenArr) {
                        if (!unique || !denomArr.includes(dtree)) {
                            denomArr.push(dtree);
                        }
                    }
                }
        }
    }
    return denomArr;
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = findDenominators;
var latex1 = '\\frac{x+2}{5}+\\frac{x+4}{5}-\\frac{x+3}{5}=\\frac{2x+6}{10}';
var tree1 = LatexToTree(latex1);
var tree11 = func(tree1);
console.log(JSON.stringify(tree11, null, 4));
*/

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns array of factors for the greatest common factor
of all sides of equalities/inequalities
The greatest constant common factors are indexed with 'const'
Array of all variable common factors are indexed with 'sym'

Parameters:
tree: A Laco tree

Returns:
An associative array of:
1) one integer common factor, indexed by 'const'
2) and an array of variables common to all sides, indexed by 'sym'

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//


export function findGCF(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var commonFactorArr = {
        'const': ['natural', '1'], 
        'sym': []
    };
    
    var operator = tree_1.shift();
    switch (operator) {
        case 'negative':
            // common factor assumed to be positive
            return findGCF(tree_1[0]);
        
        case 'fraction':
            // only consider the numerator
            return findGCF(tree_1[0]);
        
        case 'decimal':
            // only consider the numerator
            return findGCF(fracDecimal([operator].concat(tree_1)));
        
        case 'rdecimal':
            // only consider the numerator
            return findGCF(rdecToFrac([operator].concat(tree_1)));
        
        case 'natural':
            commonFactorArr['const'] = [operator].concat(tree_1);
            break;
        
        case 'variable':
            commonFactorArr['sym'].push([operator].concat(tree_1));
            break;
        
        case 'mulchain':
            var constF = 1;
            var symFArr = [];
            for (var multerm of tree_1) {
                // only consider multiplications (divisions would end up in denominators)
                if (multerm[0] == 'mul') {
                    var subtree = multerm[1];
                    var subCFArr = findGCF(subtree);
                    if (JSON.stringify(subCFArr['const']) != JSON.stringify([])) {
                        constF *= parseInt(subCFArr['const'][1]);
                    }
                    for (var symb of subCFArr['sym']) {
                        var is_included = false;
                        for (var v of symFArr) {
                            if (JSON.stringify(v) == JSON.stringify(symb)) {
                                is_included = true;
                            }
                        }
                        if (!is_included) {
                            symFArr.push(symb);
                        }
                    }
                }
            }
            commonFactorArr['const'] = ['natural', constF.toString()];
            commonFactorArr['sym'] = symFArr;
            break;
        
        case 'addchain':
        case 'equation':
        case 'inequality':
            for (var [k, term] of tree_1.entries()) {
                // this is the case for inequality signs (e.g., 'le', 'ge')
                if (!Array.isArray(term)) {
                    continue;
                }
                
                var subtree = operator === 'addchain' ? term[1] : term;
                var subCFArr = findGCF(subtree);
                if (k == 0) {
                    // If this is the first term, just copy to commonFactorArr
                    commonFactorArr = subCFArr;
                } else {
                    // For numerical constants, update the array with GCF
                    var gcf = EuclidAlg(
                        parseInt(commonFactorArr['const'][1]),
                        parseInt(subCFArr['const'][1])
                    );
                    commonFactorArr['const'] = ['natural', gcf.toString()];
                    // For variables,
                    // only count the vars already in commonFactorArr['sym']
                    var symFArr = [];
                    for (var symb of subCFArr['sym']) {
                        var is_included = false;
                        for (var v of commonFactorArr['sym']) {
                            if (JSON.stringify(v) == JSON.stringify(symb)) {
                                is_included = true;
                                break;
                            }
                        }
                        if (is_included) {
                                symFArr.push(symb);
                        }
                    }
                    commonFactorArr['sym'] = symFArr;
                }
            }
            break;
        
        default:
        break;
    }
    
    return commonFactorArr;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns an array of objects representing all variables in the given tree
NOTE: Any product of variables are also included in addition to individual variables

Parameters:
tree: A Laco tree
option:
An optional boolean argument
When set to TRUE, the routine does a DFS of the whole tree
  and outputs an array of individual variables, with no mulchain of variables
By default, the argument is set to FALSE, in which case
  the routine considers as one separate variable
  an addchain within a mulchain,
  provided that it contains at least one variable term


Returns:
An array of variable objects

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function findVars(tree, option = false) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var varList = [];
    if (Array.isArray(tree_1)) {
        if (option == true) {
            if (isNumeric(tree_1)) {
                return varList;
            }
            if (tree_1[0] == 'variable') {
                varList.push(tree_1);
                return varList;
            }
            var tree_11 = tree_1.slice(1);
            for (var term of tree_11) {
                var subtree = ['addchain', 'mulchain'].includes(tree_1[0]) ? term[1] : term;
                var subVarList = findVars(subtree, option);
                for (var variable of subVarList) {
                    var is_included = false;
                    for (var v of varList) {
                        if (JSON.stringify(v) == JSON.stringify(variable)) {
                            is_included = true;
                        }
                    }
                    if (!is_included)
                        varList.push(variable);
                }
            }
            return varList;
        }
        
        var operator = tree_1.shift();
        switch (operator) {
            case 'natural':
                break;
            
            case 'variable':
                varList.push([operator].concat(tree_1));
                break;
            
            case 'power':
                if (findVars(tree_1[0], option).length > 0) {
                    varList.push([operator].concat(tree_1));
                }
                break;
            
            case 'negative':
                return findVars(tree_1[0], option);
            
            case 'mulchain':
                var varTerm = [];
                for (var term of tree_1) {
                    var mulOp = term[0];
                    var subtree = term[1];
                    if (subtree[0] == 'negative') {
                        subtree = subtree[1];
                    }
                    if (findVars(subtree, option).length > 0) {
                        varTerm.push([mulOp, subtree]);
                        // This way, same variable multiplied twice (e.g., ['variable', 'x'])
                        // will be parsed as a mulchain
                        // (e.g., ['mulchain', ['mul', ['variable', 'x']], ['mul', ['variable', 'x']]])
                        // rather than just as one variable (e.g., ['variable', 'x'])
                    }
                }
                varTerm = array2ChainTree(varTerm);
                if (varTerm.length > 0) {
                    /*//
                    if (count(varTerm) == 1) {
                        varTerm = varTerm[0][1];
                    } else {
                        varTerm = array_merge(['mulchain'], varTerm);
                    }
                    //*/
                    varList.push(varTerm);
                }
                break;
                
            case 'addchain':
                for (var term of tree_1) {
                    subtree = term[1];
                    if (subtree[0] == 'negative') {
                        subtree = subtree[1];
                    }
                    var subVarList = findVars(subtree, option);
                    for (var subtree of subVarList) {
                        var is_included = false;
                        for (var v of varList) {
                            if (JSON.stringify(v) == JSON.stringify(subtree)) {
                                is_included = true;
                            }
                        }
                        if (!is_included) {
                            varList.push(subtree);
                        }
                    }
                }
                break;
            
            default:
            break;
        }
    }
    
    return varList;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Takes a single chain (addchain or mulchain) term as input
Returns a term for the same chain type
with its operator flipped to its inverse
(NOTE: does NOT flip 'addsub' or 'subadd')
Returns the input as is for all other input cases

Parameter:
term: An arithmetic term

Returns:
An arithmetic term

Added 2019-07-04
Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function flipOp(term) {
    var term_1 = JSON.parse(JSON.stringify(term));
    if (!Array.isArray(term_1) || term_1.length != 2) {
        return term_1;
    }
    
    if (term_1[0] === 'add') {
        return ['sub', term_1[1]];
    }
    if (term_1[0] === 'sub') {
        return ['add', term_1[1]];
    }
    if (term_1[0] === 'mul') {
        return ['div', term_1[1]];
    }
    if (term_1[0] === 'div') {
        return ['mul', term_1[1]];
    }
    
    return term_1;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns TRUE if arr has a valid Laco tree of type typestring,
FALSE otherwise

Parameters:
typestring: a string
arr: an array (arithmetic term array is acceptable)

Returns:
A boolean value

Added 2019-07-04
Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function hasType(typestring, arr) {
    var arr_1 = JSON.parse(JSON.stringify(arr));
    if (!Array.isArray(arr)) {
        return false;
    }
    for (var elem of arr_1) {
        if (validMathTree(elem) && elem[0] === typestring)
            return true;
        if (Array.isArray(elem) && elem.length == 2 &&
            ['add', 'sub', 'addsub', 'subadd', 'mul', 'div'].includes(elem[0])) {
            // See the term
            if (validMathTree(elem[1]) && elem[1][0] === typestring)
                return true;
        }
    }
    return false;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns TRUE if the given tree is a numeric constant
(i.e., with no variable term present)
and FALSE otherwise

Parameter:
tree: A Laco tree
excNegative: An optional boolean argument to only consider nonnegative numeric
                     by setting it to TRUE
recursive: If set to TRUE, recursively checks every subtree
                     By default, the export function only considers the top level of subtrees
                     and hence returns FALSE for 
                     fractions with non-integer numerator/denominator
                     or for powers with non-integer base or non-simple-numerical exponent

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function isNumeric(tree, excNegative = false, recursive = false) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return false;
    }
    if (JSON.stringify(tree))

    if (tree_1[0] == 'absolute') {
        return isNumeric(tree_1[1]);
    }
    if (tree_1[0] == 'negative') {
        return !excNegative && isNumeric(tree_1[1]);
    }
    var fracIsNumeric = tree_1[0] == 'fraction';
    var powIsNumeric = tree_1[0] == 'power';
    if (recursive) {
        // The second term in logical AND evaluates only if tree is a fraction
        fracIsNumeric = fracIsNumeric && isNumeric(tree_1[1], excNegative, recursive);
        fracIsNumeric = fracIsNumeric && isNumeric(tree_1[2], excNegative, recursive);
        // The second term in logical AND evaluates only if tree is a power
        powIsNumeric = powIsNumeric && isNumeric(tree_1[1], excNegative, recursive);
        powIsNumeric = powIsNumeric && isNumeric(tree_1[2], excNegative, recursive);
    } else {
        fracIsNumeric = fracIsNumeric && tree_1[1][0] == 'natural' && tree_1[2][0] == 'natural';
        powIsNumeric = powIsNumeric && tree_1[1][0] == 'natural' && tree_1[2][0] == 'natural';
        /*//
        // The following change has been undone as of 20180823
        // RATIONALE: If we consider fractional exponents as simple numerical expression
        // then there is no way for us to differentiate, for example,
        // 313^(1/2) (must NOT simplify) and 81^(1/2) (must simplify)
        // without actually carrying out the calculation
        
        // For power, however,
        // allow fractional exponent to return TRUE even with recursive == FALSE
        // as long as the fraction is simple numeric, in addition to
        // the base being simple numeric
        // Therefore, split the evaluation of boolean powIsNumeric into multiple steps
        powIsNumeric = powIsNumeric && tree[1][0] == 'natural';
        expoIsNat = powIsNumeric && tree[2][0] == 'natural';
        expoIsSimpFrac = powIsNumeric && tree[2][0] == 'fraction' && isNumeric(tree[2]);
        expoIsNumeric = expoIsNat || expoIsSimpFrac;
        powIsNumeric = powIsNumeric && expoIsNumeric;
        //*/
    }
    
    return ['natural', 'decimal', 'rdecimal'].includes(tree_1[0]) || fracIsNumeric || powIsNumeric;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Applies multiplicative term factor to each term in tree, and then returns the new tree.

Parameters:
tree: A Laco tree
factor: A Laco data object (e.g., ['natural', '5'], ['variable', 'x'])
simplifyFrac: An option to remove from the denominator (if present)
            rather than appending to the numerator
            (applicable only for fraction tree)
            Option set to FALSE by default

Returns:
A new Laco tree

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
import {fracSimpVar} from '../rc/function_34.inc.js';
import {addAdjacentSigns} from '../rc/function_40.inc.js';
import {mulNegative} from '../rc/function_137.inc.js';

export function multFactor(tree, fterm, simplifyFrac = false) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    var fterm_1 = JSON.parse(JSON.stringify(fterm));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    if (!Array.isArray(fterm_1) || 
        fterm_1.length == 0 || 
        !['mul', 'div'].includes(fterm_1[0])) {
        return tree_1;
    }
    
    if (tree_1[0] == 'fraction') {
        var idx = fterm_1[0] == 'div' ? 2 : 1;
        if (simplifyFrac && 
            JSON.stringify(fterm_1[1]) == JSON.stringify(tree_1[3 - idx])) {
            tree_1[3 - idx] = ['natural', '1'];
        } else {
            tree_1[idx] = combine2ChainTree(fterm_1[1], tree_1[idx], 'mul');
        }
        tree_1 = fracNegative(tree_1);
        tree_1 = fracSimpInt(tree_1);
        tree_1 = fracSimpVar(tree_1);
        
    } else if (tree_1[0] == 'addchain') {
        var newtree = ['addchain'];
        var tree_11 = tree_1.slice(1);
        for (var aterm of tree_11) {
            aterm[1] = multFactor(aterm[1], fterm_1, simplifyFrac);
            newtree.push(aterm);
        }
        tree_1 = addAdjacentSigns(newtree);
        
    } else {
        if (fterm_1[0] == 'mul') {
            tree_1 = combine2ChainTree(fterm_1[1], tree_1, 'mul');
            tree_1 = array2ChainTree(chainTree2Array(tree_1), true);
        } else {
            tree_1 = ['fraction', tree_1, fterm_1[1]];
        }
    }
    
    tree_1 = mulNegative(tree_1);
    if (simplifyFrac) {
        tree_1 = fracNegative(tree_1);
        tree_1 = fracSimpInt(tree_1);
        tree_1 = fracSimpVar(tree_1);
    }
    
    return tree_1;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
Returns TRUE if the given term exists in the given tree, FALSE otherwise

Parameters:
term: Any subtree in Laco format (e.g., ['variable', 'x'], ['natural', '10'])
tree: A Laco tree
recursive: An optional boolean that activates recursive call (to search ALL subtrees)
                 (defaults to TRUE)
excPolyTerm: An optional boolean that excludes power terms from consideration
                      For example, if term == ['variable', 'x']
                      and tree == ['power', ['variable', 'x'], ['natural', '2']],
                      then this routine returns TRUE unless excPolyTerm is set to TRUE,
                      in which case the routine returns FALSE
                      Same applies for when tree == ['power', ['natural', '2'], ['variable', 'x']]

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function termExists(term, tree, recursive = true, excPolyTerm = false) {
    var term_1 = JSON.parse(JSON.stringify(term));
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (JSON.stringify(term_1) == JSON.stringify(tree_1)) {
        return true;
    }
    if (Array.isArray(tree_1)) {
        if (recursive == false) {
            var tree_11 = tree_1.slice(1);
            for (var subterm of tree_11) {
                if (['addchain', 'mulchain'].includes(tree_1[0])) {
                    subtree = subterm[1];
                } else {
                    subtree = subterm;
                }
                if (JSON.stringify(term_1) == JSON.stringify(subtree)) {
                    if (tree_1[0] == 'power' && excPolyTerm) {
                        return false;
                    }
                    return true;
                }
            }
            return false;
        }
        for (var subtree of tree_1) {
            if (termExists(term_1, subtree, recursive, excPolyTerm)) {
                var tree_11 = tree_1.slice(1);
                var is_included = false;
                for (var v of tree_1) {
                    if (JSON.stringify(v) == JSON.stringify(term_1)) {
                        is_included = true;
                        break;
                    }
                }
                if (subtree[0] == 'power' && 
                    excPolyTerm &&
                    is_included) {
                    return false;
                }
                return true;
            }
        }
    }
    return false;
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
/*
TRUE if the given input is a valid instance of Laco MathTree; FALSE otherwise

Parameters:
tree: Could be any PHP object

Returns:
A boolean value

Author: epark
*/
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
export function validMathTree(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1) || tree_1.length == 0) {
        return false;
    }
    var numbers = [];
    for (var i = 0; i <= 9; i++) {
        numbers.push(i.toString());
    }
    switch (tree_1[0]) {
        case 'setname':
            return true; // debug this later
        
        case 'infinity':
            return tree_1.length == 1;
        
        case 'absolute':
        case 'negative':
        case 'pm':
        case 'mp':
        case 'squareroot':
        case 'angle':
        case 'mangle':
        case 'arc':
        case 'overline':
        case 'sin':
        case 'cos':
        case 'tan':
            return tree_1.length == 2 && validMathTree(tree_1[1]);
        
        case 'fraction':
        case 'power':
        case 'nthroot':
            return tree_1.length == 3 && validMathTree(tree_1[1]) && validMathTree(tree_1[2]);
        
        case 'subscript':
            if (tree_1.length != 3 || tree_1[1][0] != 'variable') {
                return false;
            }
            return validMathTree(tree_1[1]) && validMathTree(tree_1[2]);
        
        case 'mfraction':
            return (
                tree_1.length == 4 &&
                validMathTree(tree_1[1]) && validMathTree(tree_1[2]) && validMathTree(tree_1[3])
            );
        
        case 'natural':
            if (tree_1.length != 2) {
                return false;
            }
            
            var tree_11 = tree_1[1].split('');
            for (var c of tree_11) {
                if (!numbers.includes(c)) {
                    return false;
                }
            }
            break;
        
        case 'decimal':
            if (tree_1.length != 2) {
                return false;
            }
            if (tree_1[1].indexOf('.') === -1) {
                return false;
            }
            var tree_11 = tree_1[1].split('');
            for (var c of tree_11) {
                if (!numbers.includes(c) && c !== '.') {
                    return false;
                }
            }
            break;
        
        case 'rdecimal':
            if (![3, 4].includes(tree_1.length)) {
                return false;
            }

            for (var k = 1; k <= tree_1.length - 1; k++) {
                if (!validMathTree(['natural', tree_1[k]])) {
                    return false;
                }
            }
            break;
        
        case 'anything':
        case 'variable':
            var tree_11 = tree_1.slice(1);
            for (var v of tree_11) {
                var v_1 = v.charCodeAt(0);
                if ('0'.charCodeAt(0) <= v_1 && v_1 <= '9'.charCodeAt(0)) {
                    return false;
                }
            }
            break;
        
        case 'addchain':
            if (tree_1.length == 1) {
                return false;
            }
            var tree_11 = tree_1.slice(1);
            for (var term of tree_11) {
                if (term.length != 2 ||
                    !['add', 'sub', 'addsub', 'subadd'].includes(term[0]) || 
                    !validMathTree(term[1]))
                    return false;
            }
            break;
        
        case 'mulchain':
            if (tree_1.length == 1) {
                return false;
            }
            var tree_11 = tree_1.slice(1);
            for (var term of tree_11) {
                if (term.length != 2 ||
                    !['mul', 'div'].includes(term[0]) || 
                    !validMathTree(term[1])) {
                    return false;
                }
            }
            break;
        
        case 'equation':
            var tree_11 = tree_1.slice(1);
            for (var subtree of tree_11) {
                if (!validMathTree(subtree)) {
                    return false;
                }
            }
            break;
        
        case 'inequality':
            var tree_11 = tree_1.slice(1);
            for (var subtree of tree_11) {
                if (!validMathTree(subtree) && !['lt', 'gt', 'le', 'ge'].includes(subtree)) {
                    return false;
                }
            }
            break;
        
        case 'interval':
            if (tree_1.length != 5) {
                return false;
            }
            if (!['[', '('].includes(tree_1[1]) || ![']', ')'].includes(tree[4])) {
                return false;
            }
            return validMathTree(tree_1[2]) && validMathTree(tree_1[3]);
        
        case 'log':   // added by ahjin
            var ntree = tree_1.slice(1)
            if ([1,2].includes(ntree.length)) {
                for (var subtree of ntree) {
                    if (!validMathTree(subtree)) {
                        return false;
                    }
                }
            } else {
                return false;
            } 
            break;
        
        case 'ln':  // added by ahjin
            if (tree_1.length !== 2) { 
                return false;
            }
            return validMathTree(tree_1[1]);
        
        default:
            return false;
    }
    
    return true;
}
