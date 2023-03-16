import {rearrangeTree} from '../rc/function_18.inc.js';

export function ineqIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['inequality']);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = ineqIdentity;
var latex1 = 'x>4';
var latex2 = '4<x';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/