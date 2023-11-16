import {rearrangeTree} from '../rc/function_18.inc.js';

export function mulCommutative(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        tree_1 = rearrangeTree(tree_1, ['mulchain']);
    }
    return tree_1;
}

/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = mulCommutative;
var latex1 = '\\frac{a}{3}a(z-y)(-10)2';
var latex2 = '(-10)(2)(z-y)(a)\\frac{a}{3}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/