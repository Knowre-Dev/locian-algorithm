import _ from 'lodash';

export function 대분수가분수변환_안씀(tree = null) {
    if (!Array.isArray(tree)) {
        console.log(tree);
    }
    let tree_1 = _.cloneDeep(tree);
    return tree_1;
}
