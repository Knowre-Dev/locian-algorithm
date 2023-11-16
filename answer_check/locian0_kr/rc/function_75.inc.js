import _ from 'lodash';

export function eqMulProp(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);

    let operator = tree_1.shift();
    let newOperand = [];
    if (operator === 'equation') {
        if (tree_1[0][0] === 'fraction') {
            newOperand.push(tree_1[0][1][0]);
            // multiply tree[0][1][1] to tree[1];
        } else if (tree_1[0][0] === 'addchain' && tree_1[0][1][0][0] === 'fraction') {

        } else {
            newOperand = tree_1;
        }
    } else {
        newOperand = tree_1;
    }
    tree_1 = [operator].concat(newOperand);
    
    return tree_1;
}

import {array2ChainTree, findGCF, multFactor} from '../rc/function_152.inc.js';
import {mulNegative} from '../rc/function_160.inc.js';


export function eqMulPropUS(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    
    if (!['equation', 'inequality'].includes(tree[0])) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    // Input now guaranteed to be a tree array representing equation or inequality
    
    // Find the common factors for all sides
    let gcfArr = findGCF(tree_1);
    // Here, elements in gcfArr are guaranteed to be positive,
    // so as to guarantee correct inequality directions
    let factor = [];
    factor.push(['mul', gcfArr['const']]);
    for (let sym of gcfArr['sym']) {
        factor.push(['mul', sym]);
    }
    factor = array2ChainTree(factor);
    let newtree;
    
    if (JSON.stringify(factor) === JSON.stringify(['natural', '1']) || 
        JSON.stringify(factor) === JSON.stringify(['natural', '0'])) {
        newtree = tree_1; // No need to divide by 1
    } else {
        newtree = [tree_1[0]];
        let tree_2 = tree_1.slice(1);
        for (let subtree of tree_2) {
            if (!Array.isArray(subtree)) {
                // this block executes for inequality signs (e.g., 'le', 'ge')
                newtree.push(subtree);
                continue;
            }
            let newsubtree = multFactor(subtree, ['div', factor], true);
            newtree.push(newsubtree);
        }
    }
    newtree = mulNegative(newtree);
    return newtree;
    
    // NOTE: This function does not support division by negative common factor
    //     Use this function in conjunction with eqMulNeg() and ineqMulNeg()
    //     to handle such cases
    
    
    
}
/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '0=0';
let tree_1 = LatexToTree(latex_1);
let tree_11 = eqMulPropUS(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/
