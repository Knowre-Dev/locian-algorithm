
/*
Simplifies any numerical constant expression inside the given tree

Author: epark
*/
import {addAssociative} from '../rc/function_45.inc.js';
import {fracMfrac} from '../rc/function_52.inc.js';
import {fracNegative} from '../rc/function_53.inc.js';
import {addIdentity} from '../rc/function_55.inc.js';
import {mulIdentity} from '../rc/function_56.inc.js';
import {powIdentity} from '../rc/function_59.inc.js';
import {fracComplex} from '../rc/function_69.inc.js';
import {addNegative} from '../rc/function_71.inc.js';
import {fracSimpInt} from '../rc/function_76.inc.js';
import {fracSimpVar} from '../rc/function_77.inc.js';
import {mulZero} from '../rc/function_82.inc.js';
import {array2ChainTree, findGCF, isNumeric} from '../rc/function_152.inc.js';
import {mulAssociative} from '../rc/function_157.inc.js';
import {divFrac} from '../rc/function_161.inc.js';            
import _ from 'lodash';
            
            
            
            
            
            
            

export function exprSimpConst(tree = null) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }
    if (tree.length === 0) {
        return tree;
    }
    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    let newOperand = [];
    switch (operator) {
        case 'infinity': // fin
        case 'natural': // fin
        case 'variable': // fin
            newOperand = tree_1;
            break;
        case 'decimal': // fin
            // Possible output type: fraction
            var oldtree = [operator].concat(tree_1);
            return fracDecimal(oldtree);
        case 'rdecimal': // fin
            // Possible output type: fraction
            var oldtree = [operator].concat(tree_1);
            return rdecToFrac(oldtree);        
        case 'mfraction':
            var oldtree = [operator].concat(tree_1);
            return fracMfrac(oldtree);
        case 'negative': // fin
            // Possible output type: ANYTHING
            
            var subresult = exprSimpConst(tree_1[0]);
            if (subresult[0] === 'negative') {
                return subresult[1];
            }
            newOperand.push(subresult);
            break;
        
        case 'absolute': // fin
            // Possible output types:
            // absolute,
            // natural, fraction (numerical), decimal, rdecimal, power (numerical)
            var subresult = exprSimpConst(tree_1[0]);
            if (subresult[0] === 'negative') {
                subresult = subresult[1];
            }
            if (isNumeric(subresult, true)) {
                return subresult;
            }
            newOperand.push(subresult);
            break;
        case 'fraction': // fin
            // Possible output types: ANYTHING
            if (tree_1[0][0] === 'power' &&
                tree_1[1][0] === 'power' && 
                tree_1[0][2] === tree_1[1][2]) {
                var newtree = [
                    'power',
                    ['fraction', tree_1[0][1], tree_1[1][1]],
                    tree_1[0][2]
                ];
                newtree = exprSimpConst(newtree);
                return newtree;
            }
            let numer = exprSimpConst(tree_1[0]);
            let denom = exprSimpConst(tree_1[1]);
            tree_1 = [operator, numer, denom];
            tree_1 = fracComplex(tree_1);
            tree_1 = fracNegative(tree_1);
            tree_1 = fracSimpInt(tree_1);
            tree_1 = fracSimpVar(tree_1);
            return tree_1;
        case 'nthroot':
        case 'squareroot':
            // rootN is the n in nth root (e.g., 2 for square root, 3 for a cubic root)
            let rootN;
            let radicand;
            if (operator === 'squareroot') {
                rootN = ['natural', '2'];
                radicand = exprSimpConst(tree_1[0]);
            } else {
                rootN = exprSimpConst(tree_1[0]);
                radicand = exprSimpConst(tree_1[1]);
            }
            var expotree = ['fraction', ['natural', '1'], rootN];
            expotree = fracComplex(expotree);
            var newtree = ['power', radicand, expotree];
            newtree = exprSimpConst(newtree);
            return newtree;
        case 'addchain': // fin
        
            tree_1 = array2ChainTree(tree_1);
            
            tree_1 = addIdentity(tree_1);
            
            tree_1 = addAssociative(tree_1);
            
            tree_1 = addNegative(tree_1);
            
            
            if (tree_1[0] !== 'addchain') {
                return tree_1;
            }

            tree_1 = tree_1.slice(1);
            var termArr = [];
        
            for (let term of tree_1) {
                let op = term[0];
                let subtree = exprSimpConst(term[1]);
                if (subtree[0] === 'negative') {
                    if (op === 'add') {
                        op = 'sub';
                        subtree = subtree[1];
                    } else if (op === 'sub') {
                        op = 'add';
                        subtree = subtree[1];
                    }
                }
                termArr.push([op, subtree]);
            }
            var newtree = array2ChainTree(termArr, true);
            
            return newtree;
        case 'mulchain': // fin
        
            tree_1 = array2ChainTree(tree_1);
            tree_1 = mulAssociative(tree_1);
            tree_1 = tree_1.slice(1);
            var termArr = [];
            let sign = 1;
            for (let term of tree_1) {
                let op = term[0];
                let subtree = exprSimpConst(term[1]);
                // Take all negative signs out to the front
                if (Array.isArray(subtree)) {
                    if (subtree[0] === 'negative') {
                        sign = -sign;
                        subtree = subtree[1];
                    }
                }
                termArr.push([op, subtree]);
            }
            var newtree = array2ChainTree(termArr, true);
            newtree = mulZero(newtree);
            newtree = mulIdentity(newtree);
            newtree = mulAssociative(newtree);
            if (sign < 0) {
                newtree = ['negative', newtree];
            }
            return newtree;
        case 'power':
            // Possible output types:
            // negative, fraction, squareroot, power
            let basetree = exprSimpConst(tree_1[0]);
            var expotree = exprSimpConst(tree_1[1]);
            
            
            // If the original expotree is a fraction with even denominator,
            // the result must work with the absolute value of the original base
            // So make a flag variable to store that info
            let evenRootFlag = false;
            if (expotree[0] === 'fraction') {
                let gcfArr = findGCF(expotree[2], ['natural', '2']);
                evenRootFlag = JSON.stringify(gcfArr['const']) === JSON.stringify(['natural', '2']);
            }
            
            // Simplify (a^b)^c to a^(bc)
            if (basetree[0] === 'power') {
                expotree = ['mulchain', ['mul', basetree[2]], ['mul', expotree]];
                expotree = mulAssociative(expotree);
                expotree = exprSimpConst(expotree);
                basetree = basetree[1];
            }
            // Remember, ((x^(2k-1))^2)^(1/2) === |x|^(2k-1), not x
            // Reflect this by modifying basetree as applicable
            let cons = findGCF(expotree, ['natural', '2'])['const'];
           
            let oddExpoFlag = JSON.stringify(cons) === JSON.stringify(['natural', '1']);
            if (expotree[0] === 'natural' && oddExpoFlag && evenRootFlag)
                basetree = ['absolute', basetree];
            
            let mtermArr = [];
            // Convert fraction to division just to make coding easier
            // 
            // The if statement below is omitted out (epark 20180830)
            // because this causes NAN output for inputs like ((103/100)^t),
            // where changing this to (103^t)/(100^t) for large t
            // causes float values to become NAN at evaluateEx_new
            /*//
            if (basetree[0] === 'fraction')
                basetree = ['mulchain', ['mul', basetree[1]], ['div', basetree[2]]];
            //*/
            if (basetree[0] === 'mulchain') {
                let basetree_1 = basetree.slice(1);
                for (let term of basetree_1) {
                    let subtree = exprSimpConst(['power', term[1], expotree]);
                    mtermArr.push([term[0], subtree]);
                }
            } else {
                mtermArr.push(['mul', ['power', basetree, expotree]]);
            }
            
            var newtree = array2ChainTree(mtermArr, true);
            
            
            newtree = divFrac(newtree);
            // Remove any power of 1 before returning
            newtree = powIdentity(newtree);
            //newtree = mulIdentity(newtree);
            return newtree;
        default:
            for (let v of tree_1) {
                newOperand.push(exprSimpConst(v));
            }
    }

    return [operator].concat(newOperand);
    
    
}


/*
import {LatexToTree} from '../checkmath.js';
let latex_1 = '(-3)^2';
let tree_1 = LatexToTree(latex_1);

let tree_11 = exprSimpConst(tree_1);
let result_1 = JSON.stringify(tree_11, null, 4);
console.log(result_1);
*/