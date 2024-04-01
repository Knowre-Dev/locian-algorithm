// import { addNegative } from '../rc/function_71.inc.js';
import { sign_change } from '../rc/sub_functions.js';
export function addFactorNegative(tree) {
    if (!Array.isArray(tree)) {
        return tree;
    }

    const [operator, ...operand] = tree;
    switch (operator) {
        case 'negative': {
            const newOperand = [addFactorNegative(operand[0])];
            return newOperand[0][0] === 'negative'
                ? newOperand[0][1]
                : [operator, ...newOperand];
        }
        case 'mulchain': {
            let sign = 1;
            let termArr = [];
            let factArr = [];
            operand.forEach(term => {
                if (term[0] === 'mul' && term[1][0] === 'addchain') {
                    let [, addchain] = term;
                    if (addchain[1][0] === 'sub') {
                        addchain = sign_change(addchain);
                        sign *= -1;
                    }
                    factArr = [...factArr, ['mul', addchain]];
                } else {
                    termArr = [...termArr, term];
                }
            });
           const newOperand = [...termArr, ...factArr];
            return sign === -1
                ? ['negative', [operator, ...newOperand]]
                : [operator, ...newOperand];
        }
        case 'addchain': {
            const addchain = ['addchain', ...operand];
            return addchain[1][0] === 'sub'
                ? ['negative', sign_change(addchain)]
                : addchain;
        }
        default: {
            return [operator, ...operand.map(term => addFactorNegative(term))];
        }
    }
}
