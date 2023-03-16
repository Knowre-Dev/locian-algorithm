import {array2ChainTree, findGCF, multFactor} from '../rc/function_135.inc.js';
import {mulNegative} from '../rc/function_137.inc.js';

export function eqMulProp(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (!Array.isArray(tree_1)) {
        return tree_1;
    }
    
    if (!['equation', 'inequality'].includes(tree_1[0])) {
        return tree_1;
    }
    // Input now guaranteed to be a tree array representing equation or inequality
    
    // Find the common factors for all sides
    var gcfArr = findGCF(tree_1);
    // Here, elements in gcfArr are guaranteed to be positive,
    // so as to guarantee correct inequality directions
    var factor = [];
    factor.push(['mul', gcfArr['const']]);
    for (var sym of gcfArr['sym']) {
        factor.push(['mul', sym]);
    }
    factor = array2ChainTree(factor);
    var newtree = [];
    if (JSON.stringify(factor) == JSON.stringify(['natural', '1'])) {
        newtree = tree_1; // No need to divide by 1
    } else {
        newtree = [tree_1[0]];
        var tree_11 = tree_1.slice(1);
        for (var subtree of tree_11) {
            if (!Array.isArray(subtree)) {
                // this block executes for inequality signs (e.g., 'le', 'ge')
                newtree.push(subtree);
                continue;
            }
            var newsubtree = multFactor(subtree, ['div', factor], true);
            newtree.push(newsubtree);
        }
    }
    newtree = mulNegative(newtree);
    return newtree;
    
    // NOTE: This export function does not support division by negative common factor
    //     Use this export function in conjunction with eqMulNeg() and ineqMulNeg()
    //     to handle such cases
    
    /*//
    if (gettype(tree) === 'array') {
        operator = array_shift(tree);

        newOperand = [];
        if (operator === 'equation') {
            if (tree[0][0] === 'fraction') {
                newOperand[] = tree[0][1][0];
                // multiply tree[0][1][1] to tree[1];
            } elseif (tree[0][0] === 'addchain' && tree[0][1][0][0] === 'fraction') {
                
            } else {
                newOperand = tree;
            }
        } else {
            newOperand = tree;
        }
        tree = array_merge([operator], newOperand);
    }
    return tree;
    //*/
    
}
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = eqMulProp;
var latex1 = '\\frac{9}{2}x^{2}+6x-2=0';
var latex2 = '9x^{2}+12x-4=0';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/