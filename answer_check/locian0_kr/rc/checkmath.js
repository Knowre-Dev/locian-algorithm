/* eslint-disable no-useless-escape */

export function forregex(c) {
    const specials = [
        '\\', '/', '^', '', '.', '[', ']',
        '|', '(', ')', '?', '*', '+', '{',
        '}', '-', ','
    ];
    const nc = c.split('');
    let result = '';
    nc.forEach(value => {
        result += specials.includes(value)
            ? '\\' + value
            : value;
    });
    return result;
}

/*
convert latex to tree
*/

export function LatexToTree(A, node = null, node_idx = null) {
    const partL = '@';
    const partR = '#';

    const delimeter = '\\';
    const cmdWhitespace = ':';

    const cmdLeft = 'left';
    const cmdRight = 'right';

    const cmd = new Map([
        ['pi', 1],
        ['theta', 2],
        ['overline', 3],
        ['mfrac', 4],
        ['frac', 5],
        ['sqrt', 6],
        ['nthroot', 7],
        ['abs', 8],
        ['times', 9],
        ['cdot', 10],
        ['div', 11],
        ['neq', 12],
        ['ne', 12],
        ['gt', 13],
        ['ge', 14],
        ['lt', 15],
        ['le', 16],
        ['summ', 17],
        ['overrightarrow', 18],
        ['overleftarrow', 19],
        ['overleftrightarrow', 20],
        ['arc', 21],
        ['cap', 41],
        ['cup', 42],
        ['mangle', 30],
        ['angle', 31],
        ['sin', 32],
        ['cos', 33],
        ['tan', 34],
        ['varnothing', 22],
        ['infty', 23],
        ['pm', 24],
        ['mp', 60],
        ['circ', 25],
        ['R', 26],
        ['mathbb(R)', 26],
        ['text', 27],
        ['alpha', 51],
        ['beta', 52],
        ['gamma', 53]
    ]);
    const cmd_special = new Map([
        ['logbase', 1],
        ['log', 2],
        ['ln', 3]
    ]);

    const signParenthesisLeft = '(';
    const signParenthesisRight = ')';
    const signBracketLeft = '[';
    const signBracketRight = ']';
    const signBraceLeft = '{';
    const signBraceRight = '}';
    const signBar = '|';

    const signDecimaldot = '.';
    const signExponent = '^';
    const signSubscript = '_';

    if (node === null) {
        node = [];
    }
    if (node_idx === null) {
        node_idx = 1;
    }
    let newA = A;

    newA = newA.replace(/\s+/g, '');// added

    // pre-process
    let replace = new Map();
    // remove whitespace(\:)
    replace = new Map([
        [delimeter + cmdWhitespace, '']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change absolute sign
    replace = new Map([
        [delimeter + cmdLeft + signBar, delimeter + 'abs' + signBraceLeft],
        [delimeter + cmdRight + signBar, signBraceRight]
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change all grouping sign to parenthesis
    replace = new Map([
        [signBraceLeft, signParenthesisLeft],
        [signBraceRight, signParenthesisRight]
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // remove cmd 'left' and 'right' and 'text'
    replace = new Map([
        [delimeter + cmdLeft, ''],
        [delimeter + cmdRight, ''],
        [delimeter + 'text', '']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change < or > to \lt or \gt
    replace = new Map([
                ['> ', '\\gt '],
                ['< ', '\\lt '],
                ['>', '\\gt '],
                ['<', '\\lt '],
                ['\\leq', '\\le'],
                ['\\geq', '\\ge']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    let regex = new RegExp();
    // change mfrac form to mfrac command
    regex = new RegExp(
        '([0-9]+)' +
        forregex(delimeter) +
        'frac' +
        forregex(signParenthesisLeft) +
        '([0-9]+)' +
        forregex(signParenthesisRight) +
        forregex(signParenthesisLeft) +
        '([0-9]+)' +
        forregex(signParenthesisRight),
        'g');
    replace = delimeter +
        'mfrac' +
        signParenthesisLeft +
        '$1' +
        signParenthesisRight +
        signParenthesisLeft +
        '$2' +
        signParenthesisRight +
        signParenthesisLeft +
        '$3' +
        signParenthesisRight;
    newA = newA.replaceAll(regex, replace);

    // _a, ^a
    regex = new RegExp(
        '([_\^])([0-9])',
        'g');
    replace =
        '$1' +
        signParenthesisLeft +
        '$2' +
        signParenthesisRight;
    newA = newA.replaceAll(regex, replace);

    // sqrt
    regex = new RegExp(
        /sqrt\[([1-9]+[0-9]*)\]/,
        'g');
    replace = 'nthroot($1)';
    newA = newA.replaceAll(regex, replace);

    // change log_ to logbase
    replace = new Map([
        ['log_', 'logbase']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    // change cmd to cmd_special...
    replace = new Map([
        ['\\logbase', 'logbase'],
        ['\\log', 'log'],
        ['\\ln', 'ln']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });

    let matches = [];
    // get number
    // repeating decimal
    regex = new RegExp(
        '([0-9]*)' +
        forregex(signDecimaldot) +
        '([0-9]*)' +
        forregex(delimeter) +
        'overline' +
        '\\(([0-9]+)\\)',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        matches.forEach(match => match.sort().reverse());
        const [match_0] = matches;
        match_0.forEach((value, key) => {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            node[node_idx] = ['rdecimal', matches[1][key], matches[2][key], matches[3][key]];
            node_idx++;
        });
    }

    // decimal
    regex = new RegExp(
        '[0-9]*' +
        forregex(signDecimaldot) +
        '[0-9]+',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            node[node_idx] = ['decimal', value];
            node_idx++;
        });
    }

    // natural
    regex = new RegExp(
        '[0-9]+(?!' +
        forregex(partL) +
        ')',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(
                    '(?<![0-9]+)' + // lookbehind (negative)  - added
                    value +
                    '(?![0-9]*' + // lookahead (negative)
                    forregex(partR) +
                    ')',
                    'g'
                ),
                partL + node_idx + partR
            );
            node[node_idx] = ['natural', value];
            node_idx++;
        });
    }

    // get cmd (one 0)
    cmd.forEach((value, key) => {
        newA = newA.replaceAll(delimeter + key, partL + '0' + value + partR);
    });

    // get cmd_special (two 0s)
    cmd_special.forEach((value, key) => {
        newA = newA.replaceAll(key, partL + '00' + value + partR);
    });

    // get variable
    // korean (variable)
    regex = new RegExp('([ㄱ-ㅎ|가-힣])', 'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            node[node_idx] = ['variable', value];
            node_idx++;
        });
    }

    // greek (variable)
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('pi') +
        '|' +
        cmd.get('theta') +
        '|' +
        cmd.get('alpha') +
        '|' +
        cmd.get('beta') +
        '|' +
        cmd.get('gamma') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const match_0_entries = matches[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            switch (matches[1][key]) {
                case cmd.get('pi').toString(): {
                    node[node_idx] = ['variable', 'pi'];
                    break;
                }
                case cmd.get('theta').toString(): {
                    node[node_idx] = ['variable', 'theta'];
                    break;
                }
                case cmd.get('alpha').toString(): {
                    node[node_idx] = ['variable', 'alpha'];
                    break;
                }
                case cmd.get('beta').toString(): {
                    node[node_idx] = ['variable', 'beta'];
                    break;
                }
                case cmd.get('gamma').toString(): {
                    node[node_idx] = ['variable', 'gamma'];
                    break;
                }
            }
            node_idx++;
        }
    }

    // english (variable)
    regex = new RegExp("[a-zA-Z][']*", 'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const [match_0] = matches;
        match_0.sort().reverse();
        match_0.forEach(value => {
            newA = newA.replaceAll(value, partL + node_idx + partR);
            node[node_idx] = ['variable', value];
            node_idx++;
        });
    }

    // get single command (command with no arg)
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('R') +
        '|' +
        cmd.get('varnothing') +
        '|' +
        cmd.get('infty') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        const match_0_entries = matches[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = newA.replaceAll(
                    new RegExp(forregex(value), 'g'),
                    partL + node_idx + partR
                );
            switch (matches[1][key]) {
                case cmd.get('R').toString(): {
                    node[node_idx] = ['setname', 'real'];
                    break;
                }
                case cmd.get('varnothing').toString(): {
                    node[node_idx] = ['setname', 'empty'];
                    break;
                }
                case cmd.get('infty').toString(): {
                    node[node_idx] = ['infinity'];
                    break;
                }
            }
            node_idx++;
        }
    }

    // get grouping
    let oldA = '';
    while (newA !== oldA) {
        oldA = newA;
        // get parenthesis
        regex = new RegExp(
            '([' +
            forregex(signBracketLeft) +
            forregex(signParenthesisLeft) +
            '])' +
            '([^' +
            forregex(signParenthesisLeft) +
            forregex(signParenthesisRight) +
            forregex(signBracketLeft) +
            forregex(signBracketRight) +
            ']*)' +
            '([' +
            forregex(signBracketRight) +
            forregex(signParenthesisRight) +
            '])',
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                let tempTree = LatexToTree(
                    matches[2][key],
                    node,
                    node_idx
                );
                if (tempTree[0] === 'array') {
                    if (matches[1][key] === '(' && matches[3][key] === ')') {
                        tempTree[0] = 'tuple';
                    } else if (tempTree.length === 3) {
                        tempTree = [
                            'interval',
                            matches[1][key],
                            tempTree[1],
                            tempTree[2],
                            matches[3][key]
                        ];
                    }
                }
                node[node_idx] = tempTree;
                node_idx++;
            });
        }

        // get binary operation (super, subscription)
        regex = new RegExp(
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '([' +
            forregex(signExponent) +
            forregex(signSubscript) +
            '])' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    matches[2][key] === '^' ? 'power' : 'subscript',
                    node[matches[1][key]],
                    node[matches[3][key]]
                ];
                node_idx++;
            });
        }

        // get command with no arg
        // get command with 1 arg
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('overline') +
            '|' +
            cmd.get('overrightarrow') +
            '|' +
            cmd.get('overleftarrow') +
            '|' +
            cmd.get('overleftrightarrow') +
            '|' +
            cmd.get('arc') +
            '|' +
            cmd.get('sqrt') +
            '|' +
            cmd.get('abs') +
            '|' +
            cmd.get('sin') + // added
            '|' +
            cmd.get('cos') + // added
            '|' +
            cmd.get('tan') + // added
            '|' +
            cmd.get('angle') + // added
            '|' +
            cmd.get('mangle') + // added
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const match_0_entries = matches[0].entries();
            for (const [key, value] of match_0_entries) {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                let operator;
                switch (matches[1][key]) {
                    case cmd.get('sqrt').toString(): {
                        operator = 'squareroot';
                        break;
                    }
                    case cmd.get('abs').toString(): {
                        operator = 'absolute';
                        break;
                    }
                    case cmd.get('overline').toString(): {
                        operator = 'overline';
                        break;
                    }
                    case cmd.get('overrightarrow').toString(): {
                        operator = 'overrightarrow';
                        break;
                    }
                    case cmd.get('overleftarrow').toString(): {
                        operator = 'overleftarrow';
                        break;
                    }
                    case cmd.get('overleftrightarrow').toString(): {
                        operator = 'overleftrightarrow';
                        break;
                    }
                    case cmd.get('angle').toString(): {
                        operator = 'angle';
                        break;
                    }
                    case cmd.get('mangle').toString(): {
                        operator = 'mangle';
                        break;
                    }
                    case cmd.get('arc').toString(): {
                        operator = 'arc';
                        break;
                    }
                    case cmd.get('sin').toString(): { // added
                        operator = 'sin';
                        break;
                    }
                    case cmd.get('cos').toString(): { // added
                        operator = 'cos';
                        break;
                    }
                    case cmd.get('tan').toString(): { // added
                        operator = 'tan';
                        break;
                    }
                }
                node[node_idx] = [
                    operator,
                    node[matches[2][key]]
                ];
                node_idx++;
            }
        }

        // get command with 2 args
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('frac') +
            '|' +
            cmd.get('nthroot') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    matches[1][key] === cmd.get('frac').toString() ? 'fraction' : 'nthroot',
                    node[matches[2][key]],
                    node[matches[3][key]]
                ];
                node_idx++;
            });
        }

        // get command with 3 args
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('mfrac') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'mfraction',
                    node[matches[2][key]],
                    node[matches[3][key]],
                    node[matches[4][key]]
                ];
                node_idx++;
            });
        }

        // get function
    }

    oldA = '';
    while (oldA !== newA) {
        oldA = newA;
        // get special lv1 command with 2 args
        regex = new RegExp(
            forregex(partL) +
            '00' +
            '(' +
            cmd_special.get('logbase') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g'
        );
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'log',
                    sub_LatexToTree(matches[3][key], node, node_idx),
                    node[matches[2][key]]
                ];
                node_idx++;
            });
        }

        // get special lv1 command with 1 arg
        regex = new RegExp(
            forregex(partL) +
            '00' +
            '(' +
            cmd_special.get('log') +
            '|' +
            cmd_special.get('ln') +
            ')' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    matches[1][key] === cmd_special.get('log').toString() ? 'log' : 'ln',
                    sub_LatexToTree(matches[2][key], node, node_idx)
                ];
                node_idx++;
            });
        }
    }

    oldA = '';
    while (oldA !== newA) {
        oldA = newA;
        // get special lv2 command with 3 args
        regex = new RegExp(
            forregex(partL) +
            '0' +
            '(' +
            cmd.get('summ') +
            ')' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            '((' +
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR) +
            ')*)',
            'g');
        matches = match_all(newA, regex);
        if (matches.length !== 0) {
            const [match_0] = matches;
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(
                    value,
                    partL + node_idx + partR
                );
                node[node_idx] = [
                    'summation',
                    node[matches[2][key]],
                    node[matches[3][key]],
                    sub_LatexToTree(matches[4][key], node, node_idx)
                ];
                node_idx++;
            });
        }
    }

    return sub_LatexToTree(newA, node, node_idx);
}

function sub_LatexToTree(newA, node, node_idx) {
    // const node_1 = node;
    const partL = '@';
    const partR = '#';
    // const delimeter = '\\';

    const cmd = new Map([
            ['pi', 1],
            ['theta', 2],
            ['overline', 3],
            ['mfrac', 4],
            ['frac', 5],
            ['sqrt', 6],
            ['nthroot', 7],
            ['abs', 8],
            ['times', 9],
            ['cdot', 10],
            ['div', 11],
            ['neq', 12],
            ['ne', 12],
            ['gt', 13],
            ['ge', 14],
            ['lt', 15],
            ['le', 16],
            ['summ', 17],
            ['overrightarrow', 18],
            ['overleftarrow', 19],
            ['overleftrightarrow', 20],
            ['arc', 21],
            ['cap', 41],
            ['cup', 42],
            ['mangle', 30],
            ['angle', 31],
            ['sin', 32],
            ['cos', 33],
            ['tan', 34],
            ['varnothing', 22],
            ['infty', 23],
            ['pm', 24],
            ['mp', 60],
            ['circ', 25],
            ['R', 26],
            ['alpha', 51],
            ['beta', 52],
            ['gamma', 53]
    ]);
    const signComma = ',';

    const signPlus = '+';
    const signMinus = '-';
    const signEquation = '=';
    const signRatio = ':';

    let matches = [];
    let regex = new RegExp();
    regex = new RegExp(
        '^' +
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR) +
        '$',
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        if (matches[1].length === 1) {
            return node[matches[1][0]];
        }
    }

    // array
    let arr = newA.split(new RegExp(signComma, 'g'));
    if (arr.length > 1) {
        return ['array', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    let result = [];
    // inequality
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('gt') +
        '|' +
        cmd.get('ge') +
        '|' +
        cmd.get('lt') +
        '|' +
        cmd.get('le') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    let arr_length = arr.length;
    if (arr_length !== 1) {
        result = ['inequality'];
        const max = Math.floor(arr_length / 2);
        for (let i = 0; i < max; i++) {
            const j = 2 * i + 1
            result[j] = sub_LatexToTree(arr[2 * i], node, node_idx);
            switch (parseInt(arr[2 * i + 1])) {
                case cmd.get('gt') : {
                    result[j + 1] = 'gt';
                    break;
                }
                case cmd.get('ge') : {
                    result[j + 1] = 'ge';
                    break;
                }
                case cmd.get('lt') : {
                    result[j + 1] = 'lt';
                    break;
                }
                case cmd.get('le') : {
                    result[j + 1] = 'le';
                    break;
                }
                default: {
                    result[j + 1] = 'ERROR';
                }
            }
        }
        result[2 * max + 1] = sub_LatexToTree(arr[2 * max], node, node_idx);
        return result;
    }

    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('neq') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['neq', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    arr = newA.split(new RegExp(signEquation, 'g'));
    if (arr.length !== 1) {
        return ['equation', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    arr = newA.split(signRatio);
    if (arr.length !== 1) {
        return ['ratio', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('circ') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['composition', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    // addchain
    regex = new RegExp(
        '(' +
        forregex(signPlus) +
        '|' +
        forregex(signMinus) +
        '|' +
        forregex(partL) +
        '0' +
        cmd.get('pm') +
        forregex(partR) +
        '|' +
        forregex(partL) +
        '0' +
        cmd.get('mp') +
        forregex(partR) +
        ' ?' +
        ')',
        'g');
    arr = newA.split(regex);
    arr_length = arr.length;
    if (arr_length !== 1) {
        result = [];
        const max = Math.floor(arr_length / 2);
        if (arr[0] !== '') {
            result = [...result, ['add', sub_LatexToTree(arr[0], node, node_idx)]];
        }
        for (let i = 1; i <= max; i++) {
            let term_add = [];
            switch (arr[2 * i - 1]) {
                case signPlus: {
                    term_add = ['add', sub_LatexToTree(arr[2 * i], node, node_idx)];
                    break;
                }
                case signMinus: {
                    term_add = ['sub', sub_LatexToTree(arr[2 * i], node, node_idx)];
                    break;
                }
                case partL + '0' + cmd.get('pm') + partR: {
                    term_add = ['addsub', sub_LatexToTree(arr[2 * i], node, node_idx)];
                    break;
                }
                case partL + '0' + cmd.get('mp') + partR: {
                    term_add = ['subadd', sub_LatexToTree(arr[2 * i], node, node_idx)]
                    break;
                }
            }
            if (term_add.length !== 0) {
                result = [...result, term_add]
            }
        }
        if (result.length === 1) {
            switch (result[0][0]) {
                case 'add': {
                    result = ['positive', result[0][1]];
                    break;
                }
                case 'sub': {
                    result = ['negative', result[0][1]];
                    break;
                }
                case 'addsub': {
                    result = ['pm', result[0][1]];
                    break;
                }
                case 'subadd': {
                    result = ['mp', result[0][1]];
                    break;
                }
            }
        } else {
            result = ['addchain', ...result];
        }
        return result;
    }

    // times, div => mulchain
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('times') +
        '|' +
        cmd.get('div') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    arr_length = arr.length;
    if (arr_length !== 1) {
        const max = Math.floor(arr_length / 2);
        result = ['mulchain', ['mul', sub_LatexToTree(arr[0], node, node_idx)]];
        for (let i = 1; i <= max; i++) {
            const op = arr[2 * i - 1] === cmd.get('times').toString()
                ? 'mul'
                : 'div';
            result = [...result, [op, sub_LatexToTree(arr[2 * i], node, node_idx)]]
        }
        return result;
    }

    // cap
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cap') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['cap', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    // cup
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cup') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['cup', ...arr.map(value => sub_LatexToTree(value, node, node_idx))];
    }

    // cdot
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cdot') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['mulchain', ...arr.map(value => ['mul', sub_LatexToTree(value, node, node_idx)])];
    }

    // 항들이 나열된 경우
    regex = new RegExp(
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR),
        'g');
    matches = match_all(newA, regex);
    if (matches.length !== 0) {
        if (matches[0].length <= 1) {
            return false;
        }
        result = ['mulchain', ['mul', node[matches[1][0]]]];
        const length = matches[0].length;
        let index = matches[0][1].length;
        let op = '';
        for (let i = 1; i < length; i++) {
            switch (newA.charAt(index)) {
                case '\/': {
                    op = 'div';
                    index += 1;
                    break;
                }
                case '*': {
                    op = 'mul';
                    index += 1;
                    break;
                }
                default: {
                    op = 'mul';
                    break;
                }
            }
            result = [...result, [op, node[matches[1][i]]]];
            index += matches[0][i].length;
        }
    }
    return result;
}

/*
javascript version preg_match_all
*/
export function match_all(string, regexp) {
    const matches = [...string.matchAll(regexp)];
    let result = [];
    if (matches.length === 0) {
        return result;
    }
    const match_0_length = matches[0].length;
    for (let i = 0; i < match_0_length; i++) {
        result = [...result, []];
    }
    matches.forEach(match => {
        match.forEach((value, key) => {
            result[key] = [...result[key], value];
        });
    });
    return result;
}
/*
const latex_0 = 'x2';
console.log(JSON.stringify(LatexToTree(latex_0), null, 4));
*/
/*
function: compare two trees
input: treeA - tree, treeB - tree
ouput: true, false
*/
export function compareMathTree(tree_A, tree_B) {
    if (typeof tree_A !== typeof tree_B) {
        return false;
    }
    if (!Array.isArray(tree_A)) {
        return (JSON.stringify(tree_A) === JSON.stringify(tree_B));
    }
    if (tree_A[0] === 'anything') {
        tree_A = tree_B;
    } else if (tree_B[0] === 'anything') {
        tree_B = tree_A;
    }
    if (tree_A.length === 1) {
        return true;
    }
    const [operator_A, ...operand_A] = tree_A;
    const [operator_B, ...operand_B] = tree_B;
    if (operator_A !== operator_B || tree_A.length !== tree_B.length) {
        return false;
    }
    if (operator_A !== 'eval') {
        return operand_A.every((term_A, key) => compareMathTree(term_A, operand_B[key]));
    }
    let num_null = 0;
    const operand_A_entries = operand_A.entries();
    for (const [key, term_A] of operand_A_entries) {
        const term_B = operand_B[key];
        if (term_A === null && term_B === null) {
            num_null++;
            if (num_null === 4) {
                return false;
            }
            continue;
        }
        let re_A;
        let re_B;
        let im_A;
        let im_B;
        if (term_A[0] === 'equation') {
            // 160818 larwein - equation patch : 계산값의 차를 구해서 비교 + 이항 부호 다르면 바꿔서 비교
            const [, [re_l_A, im_l_A], [re_r_A, im_r_A]] = term_A;
            re_A = (parseFloat(re_l_A) - parseFloat(re_r_A)).toExponential(4);
            im_A = (parseFloat(im_l_A) - parseFloat(im_r_A)).toExponential(4);

            const [, [re_l_B, im_l_B], [re_r_B, im_r_B]] = term_B;
            re_B = (parseFloat(re_l_B) - parseFloat(re_r_B)).toExponential(4);
            im_B = (parseFloat(im_l_B) - parseFloat(im_r_B)).toExponential(4);

            if (re_A === -1 * re_B && im_A === -1 * im_B) {
                continue;
                // re_B = re_A;
                // im_B = im_A;
            }
        } else {
            // 150818 larwein - 유효숫자 범위 줄임
            [re_A, im_A] = term_A;
            re_A = parseFloat(re_A).toExponential(4);
            im_A = parseFloat(im_A).toExponential(4);

            [re_B, im_B] = term_B;
            re_B = parseFloat(re_B).toExponential(4);
            im_B = parseFloat(im_B).toExponential(4);
        }
        if (re_A !== re_B || im_A !== im_B) {
            return false;
        }
    }
    return true;
}

/*
function: compare two trees
input: treeA - tree, treeB - tree
ouput: true, false
*/

export function is_equal_tree(tree_1, tree_2) {
    const tree_11 = tree_1;
    const tree_21 = tree_2;
    const type_1 = typeof tree_11;
    const type_2 = typeof tree_21;
    if (type_1 !== type_2) {
        return false;
    }
    if (type_1 === 'string') {
        return tree_11 === tree_21;
    }

    if (type_1 === 'number') {
        const d = Math.pow(0.1, 5);
        return Math.abs(tree_11 - tree_21) < d;
    }

    if (!Array.isArray(tree_11) || !Array.isArray(tree_21)) {
        return false;
    }

    if (JSON.stringify(tree_11) === JSON.stringify(tree_21)) {
        return true;
    }

    const length_1 = tree_11.length;
    const length_2 = tree_21.length;
    if (length_1 !== length_2) {
        return false;
    }
    for (let i = 0; i < length_1; i++) {
        if (!is_equal_tree(tree_11[i], tree_21[i])) {
            return false;
        }
    }
    return true
}
