import {rearrangeTree} from '../rc/function_61.inc.js';
import _ from 'lodash';

export function eqIdentity(tree) {
    return Array.isArray(tree) ? rearrangeTree(tree, ['equation']) 
        : tree
}
