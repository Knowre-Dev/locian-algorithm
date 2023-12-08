import { Laco } from '../libs/common.inc.js';

import { varReverseShift } from '../rc/function_63.inc.js';

export function test_sunny(tree = null) {
    const laco = new Laco();
    // tree_1 = tree_1 ? tree_1 : laco.parse('\\angle{BCAEDF}');

    laco.initialize(tree);
    laco.apply(varReverseShift, [null, 'angle']);
    return laco.finalize();
}
