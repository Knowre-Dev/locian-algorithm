import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function addCommutative(tree) {
                      
    if (!Array.isArray(tree)) {
        return tree;
    }
    return rearrangeTree(tree, ['addchain']);

}


