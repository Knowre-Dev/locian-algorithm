import {Laco} from '../libs/common.inc.js';

export function test_eugene(tree = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));

    return tree_1;
}