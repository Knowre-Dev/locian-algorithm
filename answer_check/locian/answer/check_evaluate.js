import { is_numeric, match_all, _replacementInMathTree } from './functions.js'

export function evaluateEx(tree) {
    let newTree = [];
    switch (tree[0]) {
        // 180220 larwein - inequality patch
        case 'inequality': {
            if (tree[2] === 'gt' || tree[2] === 'ge') {
                newTree = [
                    'inequality',
                    evaluateEx(['addchain',
                        ['add', tree[1]],
                        ['sub', tree[3]]
                    ]),
                    tree[2],
                    ['natural', 0]
                ];
            } else {
                newTree = [
                    ['inequality',
                        evaluateEx(['addchain',
                            ['add', tree[3]],
                            ['sub', tree[1]]
                        ]),
                    tree[2] === 'lt' ? 'gt' : 'ge',
                    ['natural', 0]
                ]];
            }
            break;
        }
        default: {
            newTree = ['eval',
                _evaluateExWithSeed(tree, -2),
                _evaluateExWithSeed(tree, -1),
                _evaluateExWithSeed(tree, 1),
                _evaluateExWithSeed(tree, 2),
                _evaluateExWithSeed(tree, 3)
            ]
        }
    }

    return newTree;
}

function _evaluateExWithSeed(A, seed = 1) {
    if (!Array.isArray(A)) {
        return A;
    }
    const [operator, ...operandTree] = A;
    if (operator === 'summation') {
        return _evaluateOperation(operator, operandTree, seed);
    }
    const operand = [];
    for (const each of operandTree) {
        operand.push(_evaluateExWithSeed(each, seed));
    }
    switch (operator) {
        case 'variable': {
            if (operand.length === 1) {
                return _evaluateVariable(operand[0], seed);
            } else {
                return _evaluateVariable(operand, seed);
            }
        }
        case 'overline':
        case 'overleftarrow':
        case 'overrightarrow':
        case 'overleftrightarrow':
        case 'arc':
        case 'mangle':
        case 'angle':
        case 'sine':
        case 'cosine':
        case 'tangent': {
            return operand[0];
        }
        case 'equation':
        case 'neq':
        case 'ratio':
        case 'inequality':
        case 'orchain': {
            return [operator, ...operand];
        }
        default: {
            return _evaluateOperation(operator, operand);
        }
    }
}

function _evaluateVariable(variable, seed) {
    // variable with several alphabets. e.g. ABC
    if (Array.isArray(variable)) {
        let re = 0;
        let im = 0;
        const entries_v = variable.entries();
        for (const [k, v] of entries_v) {
            if (k > 2) {
                break;
            }
            const val = _evaluateVariable(v, seed);
            re = re + ((-2.2 + k) * val[0]);
            im = im + ((1.3 - k) * val[1]);
        }
        return [re, im];
    } else if (variable === 'i') { // imaginary unit 'i'
        return [0, 1];
    } else { // single (english, korean, and greek) alphabet
        const primes = [
            2, 3, 5, 7, 11, 13, 17, 19, 23, 29,
            31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
            73, 79, 83, 89, 97, 101, 103, 107, 109, 113,
            127, 131, 137, 139, 149, 151, 157, 163, 167, 173,
            179, 181, 191, 193, 197, 199, 211, 223, 227, 229,
            233, 239, 241, 251, 257, 263, 269, 271, 277, 281,
            283, 293, 307, 311, 313, 317, 331, 337, 347, 349,
            353, 359, 367, 373, 379, 383, 389, 397, 401, 409,
            419, 421, 431, 433, 439, 443, 449, 457, 461, 463,
            467, 479, 487, 491, 499, 503, 509, 521, 523, 541,
            547, 557, 563, 569, 571, 577, 587, 593, 599, 601,
            607, 613, 617, 619, 631, 641, 643, 647, 653, 659,
            661, 673, 677, 683, 691, 701, 709, 719, 727, 733,
            739, 743, 751, 757, 761, 769, 773, 787, 797, 809,
            811, 821, 823, 827, 829, 839, 853, 857, 859, 863,
            877, 881, 883, 887, 907, 911, 919, 929, 937, 941,
            947, 953, 967, 971, 977, 983, 991, 997
        ];
        const regex = "/^([ㄱ-ㅎ가-힣]|[a-zA-Z]*)([']*)/u";
        switch (variable) {
            case 'pi': {
                variable = "ㄱ'";
                break;
            }
            case 'theta': {
                variable = "ㄴ'";
                break;
            }
            case 'alpha': {
                variable = "ㄷ'";
                break;
            }
            case 'beta': {
                variable = "ㄹ'";
                break;
            }
            case 'gamma': {
                variable = "ㅁ'";
                break;
            }
        }
        const matches = match_all(regex, variable);
        variable = matches[1][0];
        const shoulder = matches[2][0].length;

        const ord = variable.charCodeAt(0);
        let num
        if (ord < 128) {
            num = ord - 64;
        } else {
            num = utf8_ord(variable);
            switch (num) {
                case 952: {
                    num = 70;
                    break;
                }
                case 960: {
                    num = 71;
                    break;
                }
                default : {
                    num = num - 12493;
                }
            }
        }
        if (seed === 2 || seed === -2) {
            num = primes.length - num;
        }
        if (num < 0) {
            num *= -1;
        }
        if (num > primes.length) {
            num = num % primes.length;
        }
        let result = num + Math.sqrt(2 * primes[num]);

        if (seed < 0) {
            result = -result;
        }
        if (seed === 3 || seed === -3) {
            result = 1 / result;
        }
        if (shoulder > 0) {
            return [result / shoulder, result - primes[shoulder]];
        } else {
            return [result, result / num];
        }
    }
}

function utf8_ord(ch) {
    const len = ch.length;
    if (len <= 0) {
        return false;
    }
    const h = ch.charCodeAt(0);// ord(ch.charAt(0));
    if (h <= 0x7F) {
        return h;
    }
    if (h < 0xC2) {
        return false;
    }
    if (h <= 0xDF && len > 1) {
        return (h & 0x1F) << 6 | (ch.charCodeAt(1) & 0x3F);
    }
    if (h <= 0xEF && len > 2) {
        return (h & 0x0F) << 12 | (ch.charCodeAt(1) & 0x3F) << 6 | (ch.charCodeAt(2) & 0x3F);
    }
    if (h <= 0xF4 && len > 3) {
        return (h & 0x0F) << 18 | (ch.charCodeAt(1) & 0x3F) << 12 | (ch.charCodeAt(2) & 0x3F) << 6 | (ch.charCodeAt(3) & 0x3F);
    }
    return false;
}

function _evaluateOperation(operator, operand, seed = null) {
    switch (operator) {
        case 'natural':
        case 'decimal': {
            return [operand[0], 0];
        }
        case 'positive':
        case 'add':
        case 'mul': {
            return operand[0];
        }
        case 'pm':
        case 'addsub': {
            return [0.8 * operand[0][0], 1.2 * operand[0][1]];
        }
        case 'negative':
        case 'sub': {
            if (Array.isArray(operand[0][0]) || Array.isArray(operand[0][1])) {
                return [0, 0];
            }
            return [-operand[0][0], -operand[0][1]];
        }
        case 'addchain': {
            const sum = [0, 0];
            for (const term of operand) {
                sum[0] += is_numeric(term[0])
                    ? term[0]
                    : 0;
                sum[1] += is_numeric(term[1])
                    ? term[1]
                    : 0;
            }
            return sum;
        }
        case 'div': {
            if (!is_numeric(operand[0][0]) || !is_numeric(operand[0][1])) {
                return [1, 1];
            }
            return [
                operand[0][0] / (operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1]),
                -operand[0][1] / (operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1])
            ];
        }
        case 'mulchain': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }

            const prod = [1, 0];
            for (const factor of operand) {
                const temp = prod;
                prod[0] = temp[0] * factor[0] - temp[1] * factor[1];
                prod[1] = temp[0] * factor[1] + temp[1] * factor[0];
            }
            return prod;
        }
        case 'fraction': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                operand[1][0] === 0 ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1234, 5678];
            }
            return [
                (operand[0][0] * operand[1][0] + operand[0][1] * operand[1][1]) / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1]),
                (operand[0][1] * operand[1][0] - operand[0][0] * operand[1][1]) / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1])
            ];
        }
        case 'mfraction': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[2][0]) ||
                operand[2][0] === 0) {
                return [5678, 1234];
            }
            return [operand[0][0] + operand[1][0] / operand[2][0], 0];
        }
        case 'power': {
            return pow_complex(operand[0], operand[1]);
        }
        case 'squareroot': {
            return pow_complex(operand[0], [0.5, 0]);
        }
        case 'nthroot': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }
            return pow_complex(
                operand[0],
                [
                    operand[1][0] / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1]),
                    -operand[1][1] / (operand[1][0] * operand[1][0] + operand[1][1] * operand[1][1])
                ]
            );
        }
        case 'absolute': {
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1])) {
                return [1, 1];
            }
            return [Math.sqrt(operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1]), 0];
        }
        case 'rdecimal': {
            const intg = operand[0];
            const num = operand[1] + operand[2] - operand[1];
            let denum = '';
            for (let i = 0; i < operand[2].length; i++) {
                denum += '9';
            }
            for (let i = 0; i < operand[1].length; i++) {
                denum += '0';
            }
            return [intg + (num / denum), 0];
        }
        case 'subscript':{
            if (!is_numeric(operand[0][0]) ||
                !is_numeric(operand[0][1]) ||
                !is_numeric(operand[1][0]) ||
                !is_numeric(operand[1][1])) {
                return [1, 1];
            }
            return [operand[0][0] + 2 * operand[1][1], operand[0][1] + 2 * operand[1][0]];
        }
        case 'ln': {
            return [Math.log(Math.sqrt(operand[0][0] * operand[0][0] + operand[0][1] * operand[0][1])), 0];
        }
        case 'log': {
            if (typeof operand[1] !== 'undefined') {
                return _evaluateOperation('fraction', [_evaluateOperation('ln', [operand[0]]), _evaluateOperation('ln', [operand[1]])]);
            } else {
                return _evaluateOperation('fraction', [_evaluateOperation('ln', [operand[0]]), _evaluateOperation('ln', [[10, 0]])]);
            }
        }
        case 'summation': {
            if (operand[0][0] === 'equation' &&
                operand[0][1][0] === 'variable' &&
                operand[0][2][0] === 'natural' &&
                operand[1][0] === 'natural') {
                let sum = [0, 0];
                const [[, variable, [, min]], [, max]] = operand;

                // const variable = operand[0][1];
                // const min = operand[0][2][1];
                // const max = operand[1][1];
                for (let i = min; i <= max; i++) {
                    let newEx = _replacementInMathTree(operand[2], variable, ['natural', i]);
                    newEx = _evaluateExWithSeed(newEx, seed);
                    sum = _evaluateOperation('addchain', [sum, newEx]);
                }
                return sum;
            } else {
                return null;
            }
        }
    }
}

function pow_complex(A, B) {
    if (!is_numeric(A[0]) ||
        !is_numeric(A[1]) ||
        !is_numeric(B[0]) ||
        !is_numeric(B[1])) {
        return [1, 1];
    }
    const r = Math.sqrt(A[0] * A[0] + A[1] * A[1]);
    let theta;
    if (A[1] === 0 && A[0] === 0) {
        return [0, 0];
    }
    if (A[1] === 0 && A[0] > 0) {
        theta = 0;
    } else if (A[1] === 0 && A[0] < 0) {
        theta = Math.PI;
    } else if (A[1] > 0) {
        theta = Math.acos(A[0] / r);
    } else {
        theta = 2 * Math.PI - Math.acos(A[0] / r);
    }
    const [c, d] = B;
    const newR = Math.pow(r, c) / Math.exp(d * theta);
    const newTheta = d * Math.log(r) + c * theta;
    return [
        newR * Math.cos(newTheta),
        newR * Math.sin(newTheta)
    ];
}

/*
function evaluateYValue(A, x) {
    if (!Array.isArray(A)) {
        A = LatexToTree(A);
    }
    if (Array.isArray(A) && A[0] === 'equation') {
    } else {
        return false;
    }

    const y = _evaluateExWithValue(A[2], {'x' : x});

    return y[0];
}

/*
function identifyEqWithValue(A,valueArr) {}
{
    if (gettype(A) !== 'array')
        A = LatexToTree(A);

    if (gettype(A) === 'array'
            && in_array(A[0],array('equation','inequality')));
    else
        return false;

    evaluatedEq = _evaluateExWithValue(A,valueArr);

    if (evaluatedEq[0] === 'equation')
    {
        return compareMathTree(evaluatedEq[1],evaluatedEq[2]);
    }
    else if(A[0] === 'inequality')
    {
        return false;
    }
}
*/

/*
function old_evaluateOperation(operator, operand) {
    switch(operator) {
        case 'natural':
        case 'decimal':
        case 'positive':
        case 'add':
        case 'mul': {
            return operand[0];
        }
        case 'negative':
        case 'sub': {
            return -operand[0];
        }
        case 'addchain': {
            const sum = 0;
            for (let term of operand) {
                sum += term;
            }
            return sum;
        }
        case 'div': {
            return 1 / operand[0];
        }

        case 'division': {
            return 1 / operand[0];
        }
        case 'mulchain': {
            const prod = 1;
            for (let factor of operand) {
                prod *= factor;
            }
            return prod;
        }
        case 'fraction': {
            return operand[0] / operand[1];
        }
        case 'mfraction': {
            return operand[0] + operand[1] / operand[2];
        }
        case 'power': {
            return Math.pow(operand[0], operand[1]);
        }
        case 'squareroot': {
            return Math.sqrt(operand[0]);
        }
        case 'nthroot': {
            return Math.pow(operand[0], 1 / operand[1]);
        }
        case 'absolute': {
            return Math.abs(operand[0]);
        }
        case 'rdecimal': {
            const intg = operand[0];
            const num = operand[1] . operand[2] - operand[1];
            const denum = '';
            for(let i = 0; i < operand[2].length; i++) {
                denum += '9';
            }
            for (let i = 0; i < operand[1].length; i++) {
                denum += '0';
            }
            return intg + (num / denum);
        }

    }
}
*/
/*
function makeEqWithPoints(type,points) {
    if (Array.isArray(points)) {

    } else {
        return false;
    }
    let result;
    switch(type) {
        case 'lineCurve': {
            if (points.length === 2) {
            } else {
                return false;
            }
            const xDiff = points[0][0] - points[1][0];
            if (xDiff == 0) {
                result = 'x=' + points[0][0];
                break;
            } else {
                const yDiff = points[0][1] - points[1][1];
                if (yDiff == 0) {
                    result = 'y=' + points[0][1];
                    break;
                } else {
                    let slope;
                    if (xDiff === 1) {
                        slope = yDiff;
                    } else if (xDiff === -1) {
                        slope = -yDiff;
                    } else {
                        slope = '\\frac{' + yDiff + '}{' + xDiff + '}';
                    }
                    result = 'y=' + slope + '(x-(' + points[0][0] + '))+(' + points[0][1] + ')';
                }
            }
            break;
        }
        case 'quadCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const squareXDiff = xDiff * xDiff;
                if (squareXDiff === 1) {
                    slope = yDiff;
                } else {
                    slope = '\\frac{' + yDiff + '}{' + squareXDiff + '}';
                }
                result = 'y=' + slope + '(x-(' + points[0][0] + '))^2+(' + points[0][1] + ')';
            }
            break;
        }
        case 'absCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const absXDiff = Math.abs(xDiff);
                let slope;
                if (xDiff == 1) {
                    slope = yDiff;
                } else {
                    slope = '\\frac{' + yDiff + '}{' + absXDiff + '}';
                }
                result = 'y=' + slope + '\\left|x-(' + points[0][0] + ')\\right|+(' + points[0][1] + ')';
            }
            break;
        }
        case 'expoCurve': {
            if (points.length === 3) {
            } else {
                return false;
            }

            const q = points[0][1];
            const yDiff1 = points[1][1] - q;
            const yDiff2 = points[2][1] - q;

            const xDiff = points[2][0] - points[1][0];

            if (xDiff == 0 || yDiff1 == 0 || yDiff2 == 0) {
                return false;
            } else {
                let a = '\frac{(' + yDiff1 + ')^(\frac{' + points[2][0] + '}{' + xDiff + '})}{(' + yDiff2 + ')^(\frac{' + points[1][0] + '}{' + xDiff + '})}';
                let b = '(\frac{' + yDiff2 + '}{' + yDiff1 + '})^(\frac{1}{' + xDiff + '})';
                result = 'y=(' + a + ')*(' + b + ')^x+(' + q + ')';
            }
            break;
        }
        case 'logCurve': {
            if (points.length === 3) {
            } else {
                false;
            }

            const q = points[0][0];
            const xDiff1 = points[1][0] - q;
            const xDiff2 = points[2][0] - q;
            const yDiff = points[2][1] - points[1][1];

            if (yDiff == 0 || xDiff1 == 0 || xDiff2 == 0) {
                return false;
            } else {
                const a = '\frac{(' + xDiff1 + ')^(\frac{' + points[2][1] + '}{' + yDiff + '})}{(' + xDiff2 + ')^(\frac{' + points[1][1] + '}{' + yDiff + '})}';
                const b = '(\frac{' + xDiff2 + '}{' + xDiff1 + '})^(\frac{1}{' + yDiff + '})';
                result = 'y=log_{' + b + + '}{\frac{x-' + q + '}{' + a + '}}';
            }
            break;
        }
        case 'sqrtCurve': {
            if (points.length === 2) {
            } else {
                return false;
            }
            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                if (yDiff > 0) {
                    sign = '';
                } else {
                    sign = '-';
                }
                const squareYDiff = yDiff * yDiff;
                let slope;
                if (xDiff == 1) {
                    slope = squareYDiff;
                } else if (xDiff == -1) {
                    slope = -squareYDiff;
                } else {
                    slope = '\\frac{'.squareYDiff + '}{' + xDiff + '}';
                }
                result = 'y=' + sign + '\\sqrt{' + slope + '(x-(' + points[0][0] + '))}+(' + points[0][1] + ')';
            }
            break;
        }
        case 'reciCurve': {
            if (sizeof(points) === 3) {
            } else {
                return false;
            }
            const xDiff = points[1][0] - points[0][0];
            const yDiff = points[1][1] - points[0][1];
            if (xDiff == 0 || yDiff == 0) {
                return false;
            } else {
                const slope = xDiff * yDiff;
                result = 'y=\\frac{' + slope + '}{x-(' + points[0][0] + ')}+(' + points[0][1] + ')';
            }
            break;
        }
        case 'sinCurve':
        case 'tanCurve': {
            return false;
        }
    }
    return result;
}
*/
/*
function splitAbsCurve(tree, bounds, endPoints) {
    if (bounds === null) {
        bounds = [-INF,INF];
        endPoints = [true,true];
    }
    if (!Array.isArray(tree)) {
        tree = LatexToTree(tree);
    }
    if (tree[0] !== 'equation') {
        return false;
    }
    let absTree = _searchTypeInMathtree(tree, 'absolute');
    if (absTree.length !== 1) {
        return false;
    } else {
        absTree = absTree[0];
    }
    let absEx = absTree[1];

    switch(absEx[0]) {
        case 'addchain': {
            if (absEx.length !== 3) {
                return false;
            }
            let varSize_firstTerm = _searchTypeInMathtree(absEx[1],'variable').length;
            let varSize_secondTerm = _searchTypeInMathtree(absEx[2],'variable').length;
            if (varSize_firstTerm === 1 && varSize_secondTerm === 0) {
                if (absEx[1][0] === 'add') {
                    variableTerm = absEx[1][1];
                } else {
                    variableTerm = ['negative', absEx[1][1]];
                }
                if (absEx[2][0] === 'add') {
                    constant = absEx[2][1];
                } else {
                    constant = ['negative', absEx[2][1]];
                }
            } else if (varSize_firstTerm === 0 && varSize_secondTerm === 1) {
                if (absEx[2][0] === 'add') {
                    variableTerm = absEx[2][1];
                } else {
                    variableTerm = ['negative', absEx[2][1]];
                }
                if (absEx[1][0] === 'add') {
                    constant = absEx[1][1];
                } else {
                    constant = ['negative', absEx[1][1]];
                }
            } else {
                return false;
            }
            break;
        }
        default: {
            variableTerm = absTree[1];
            constant = ['natural', 0];
        }
    }
    let sign;
    if (variableTerm[0] === 'negative') {
        sign = -1;
        variableTerm = variableTerm[1];
    } else {
        sign = 1;
    }

    switch(variableTerm[0]) {
        case 'variable': {
            variable = variableTerm;
            lineCoef = ['natural', 1];
            break;
        }
        case 'mulchain': {
            const varFactor = [];
            const coefFactor = [];
            const entries_v = variableTerm.entries();
            for (let [k, factor] of entries_v) {
                if (k === 0) {
                    continue;
                }
                if (factor[0] === 'mul') {
                    factor = factor[1];
                } else {
                    return false;
                }
                if (factor[0] === 'variable') {
                    varFactor.push(factor);
                } else {
                    coefFactor.push(factor);
                }
            }

            if (varFactor.length === 1) {
                variable = varFactor[0];
            } else {
                return false;
            }

            if (coefFactor.length === 0) {
                return false;
            } else if (coefFactor.length === 1) {
                lineCoef = coefFactor[0];
            } else {
                lineCoef = ['mulchain', ...coefFactor];
            }
            break;
        }
        //return false;
    }

    if (variable[1] !== 'x') {
        return false;
    }
    let lineCoef = _evaluateExWithValue(lineCoef, [])[0];
    let constant = _evaluateEXWithValue(constant, [])[0];
    if (sign === -1) {
        lineCoef = -lineCoef;
    }

    const mid = - constant / lineCoef;

    if (bounds[0] < mid && bounds[1] > mid) {
        newBounds1 = [bounds[0], mid];
        newBounds2 = [mid, bounds[1]];
        newEndPoints1 = [endPoints[0], true];
        newEndPoints2 = [false, endPoints[1]];
        if (lineCoef > 0) {
            return [
                [
                    _replacementInMathtree(tree, absTree, ['negative', absTree[1]]),
                    newBounds1,
                    newEndPoints1
                ],
                [
                    _replacementInMathtree(tree,absTree, absTree[1]),
                    newBounds2,
                    newEndPoints2
                ]
            ];
        } else {
            return [
                [
                    _replacementInMathtree(tree,absTree, absTree[1]),
                    newBounds1,
                    newEndPoints1
                ],
                [
                    _replacementInMathtree(tree,absTree,array('negative', absTree[1])),
                    newBounds2,
                    newEndPoints2
                ]
            ];
        }
    } else if (mid >= bounds[1]) {
        if (lineCoef > 0) {
            newEq = _replacementInMathtree(tree,absTree, ['negative', absTree[1]]);
        } else {
            newEq = _replacementInMathtree(tree,absTree, absTree[1]);
        }
        return [[newEq,bounds, endPoints]];
    } else {
        if (lineCoef > 0) {
            newEq = _replacementInMathtree(tree,absTree, absTree[1]);
        } else {
            newEq = _replacementInMathtree(tree,absTree, ['negative', absTree[1]]);
        }

        return [[newEq,bounds, endPoints]];
    }
}
*/

/*
function _evaluateEx_preProcess(A) {
    return _evaluateEx_preProcess_separatePlusMinus(A);
}
*/
/*
function _evaluateEx_preProcess_separatePlusMinus(A) {
    if (!Array.isArray(A)) {
        return A;
    }
    const [operator, ...operandTree] = A;
    const operand = [[], []];
    let flag_separate = false;
    for (const each of operandTree) {
        const temp = _evaluateEx_preProcess_separatePlusMinus(each);
        if (Array.isArray(temp) && temp[0] === 'orchain') {
            flag_separate = true;
            operand[0].push(temp[1]);
            operand[1].push(temp[2]);
        } else {
            operand[0].push(temp);
            operand[1].push(temp);
        }
    }

    const newOperator = [];
    switch (operator) {
        case 'addsub': {
            newOperator[0] = 'add';
            newOperator[1] = 'sub';
            flag_separate = true;
            break;
        }
        case 'subadd': {
            newOperator[0] = 'sub';
            newOperator[1] = 'add';
            flag_separate = true;
            break;
        }
        case 'pm': {
            newOperator[0] = null;
            newOperator[1] = 'negative';
            flag_separate = true;
            break;
        }
        case 'mp': {
            newOperator[0] = 'negative';
            newOperator[1] = null;
            flag_separate = true;
            break;
        }
        default: {
            newOperator[0] = operator;
            newOperator[1] = operator;
            break;
        }
    }

    let result;
    if (flag_separate) {
        result = [
            'orchain',
            [newOperator[0], ...operand[0]],
            [newOperator[1], ...operand[1]]];
    } else {
        result = [newOperator[0], ...operand[0]];
    }
    return result;
}
*/
