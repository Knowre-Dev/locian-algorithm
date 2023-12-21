import { addCommutative } from '../rc/function_47.inc.js';
import { addFactorNegative } from '../rc/function_81.inc.js';
import { addAdjacentSigns } from '../rc/function_83.inc.js';

export function sub_addFactorNegative(tree = null) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator] = tree;
    switch (operator) {
        case 'addchain': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                newOperand.push(addFactorNegative(addCommutative(term)));
            }
            return addFactorNegative(addAdjacentSigns(['addchain', ...newOperand]));
        }
        case 'equation': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                newOperand.push(sub_addFactorNegative(term));
            }
            return ['equation', ...newOperand];
        }
        case 'inequality': {
            const [, ...operand] = tree;
            const newOperand = [];
            for (const term of operand) {
                newOperand.push(sub_addFactorNegative(term));
            }
            return ['inequality', ...newOperand];
        }
        default: {
            return addFactorNegative(tree);
        }
    }
}
