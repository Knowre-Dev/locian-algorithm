/* eslint-disable no-useless-escape */
export function forregex(c) {
    const special = [
        '\\', '/', '^', '', '.', '[', ']',
        '|', '(', ')', '?', '*', '+', '{',
        '}', '-', ','
    ];
    const nc = c.split('');
    let result = '';
    nc.forEach(value => {
        special.includes(value) ? result += '\\' + value
        : result += value
    });
    return result;
}

/*
convert latex to tree
*/

export function LatexToTree(A, node = null, node_idx = null) {
    let node_1 = node;
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

    if (node_1 === null) {
        node_1 = [];
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
    regex = new RegExp(
        '([_\^])([0-9])',
        'g');
    replace =
        '$1' +
        signParenthesisLeft +
        '$2' +
        signParenthesisRight;
    newA = newA.replaceAll(regex, replace);

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
    // change cmd to special_cmd...
    replace = new Map([
        ['\\logbase', 'logbase'],
        ['\\log', 'log'],
        ['\\ln', 'ln']
    ]);
    replace.forEach((value, key) => {
        newA = newA.replaceAll(key, value);
    });
    let match = [];
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
    match = match_all(newA, regex);

    if (match.length !== 0) {
        match[0].sort().reverse();
        const match_0 = match[0];
        match_0.forEach((value, key) => {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            node_1[node_idx] = ['rdecimal', match[1][key], match[2][key], match[3][key]];
            node_idx++;
        });
    }

    // decimal
    regex = new RegExp(
        '[0-9]*' +
        forregex(signDecimaldot) +
        '[0-9]+',
        'g');
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        const match_0 = match[0];
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR
            );
            node_1[node_idx] = ['decimal', value];
            node_idx++;
        });
    }

    // natural

    regex = new RegExp(
        '[0-9]+(?!' +
        forregex(partL) +
        ')',
        'g');

    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        const match_0 = match[0];
        match_0.forEach(value => {
            newA = newA.replaceAll(
                new RegExp(
                    '(?<![0-9]+)' +
                    value +
                    '(?![0-9]*' +
                    forregex(partR) +
                    ')',
                    'g'
                ),
                partL + node_idx + partR
            );
            node_1[node_idx] = ['natural', value];
            node_idx++;
        });
    }

    // get cmd
    cmd.forEach((value, key) => {
        newA = newA.replaceAll(delimeter + key, partL + '0' + value + partR);
    });

    // get cmd_special
    cmd_special.forEach((value, key) => {
        newA = newA.replaceAll(key, partL + '00' + value + partR);
    });
    // get variable
    // korean
    regex = new RegExp('([ㄱ-ㅎ|가-힣])', 'g');
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        const match_0 = match[0];
        match_0.forEach(value => {
            newA = newA.replaceAll(
                    new RegExp(forregex(value), 'g'),
                    partL + node_idx + partR
                );
            node_1[node_idx] = ['variable', value];
            node_idx++;
        });
    }
    // greek
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
    match = match_all(newA, regex);
    if (match.length !== 0) {
        const match_0_entries = match[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = newA.replaceAll(
                new RegExp(forregex(value), 'g'),
                partL + node_idx + partR);
            switch (match[1][key]) {
                case cmd.get('pi').toString(): {
                    node_1[node_idx] = ['variable', 'pi'];
                    break;
                }
                case cmd.get('theta').toString(): {
                    node_1[node_idx] = ['variable', 'theta'];
                    break;
                }
                case cmd.get('alpha').toString(): {
                    node_1[node_idx] = ['variable', 'alpha'];
                    break;
                }
                case cmd.get('beta').toString(): {
                    node_1[node_idx] = ['variable', 'beta'];
                    break;
                }
                case cmd.get('gamma').toString(): {
                    node_1[node_idx] = ['variable', 'gamma'];
                    break;
                }
            }
            node_idx++;
        }
    }

    // english
    regex = new RegExp("[a-zA-Z][']*", 'g');
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        const match_0 = match[0];
        match_0.forEach(value => {
            newA = newA.replaceAll(value, partL + node_idx + partR);
            node_1[node_idx] = ['variable', value];
            node_idx++;
        });
    }

    // get single command (command that has no argument)
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
    match = match_all(newA, regex);

    if (match.length !== 0) {
        const match_0_entries = match[0].entries();
        for (const [key, value] of match_0_entries) {
            newA = newA.replaceAll(
                    new RegExp(forregex(value), 'g'),
                    partL + node_idx + partR);
            switch (match[1][key]) {
                case cmd.get('R').toString(): {
                    node_1[node_idx] = ['setname', 'real'];
                    break;
                }
                case cmd.get('varnothing').toString(): {
                    node_1[node_idx] = ['setname', 'empty'];
                    break;
                }
                case cmd.get('infty').toString(): {
                    node_1[node_idx] = ['infinity'];
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
        match = match_all(newA, regex);

        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                let tempTree = LatexToTree(
                    match[2][key],
                    node_1,
                    node_idx
                );
                if (match[1][key] === '(' && match[3][key] === ')' && tempTree[0] === 'array') {
                    tempTree[0] = 'tuple';
                } else if (tempTree.length === 3 && tempTree[0] === 'array') {
                    tempTree = [
                        'interval',
                        match[1][key],
                        tempTree[1],
                        tempTree[2],
                        match[3][key]
                    ];
                }
                node_1[node_idx] = tempTree;
                node_idx++;
            });
        }

        // get binary operation (super,subscription)
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
        match = match_all(newA, regex);

        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[2][key] === '^' ? 'power' : 'subscript',
                    node_1[match[1][key]],
                    node_1[match[3][key]]
                ];
                node_idx++;
            });
        }

        // get command no arg

        // get command 1 arg
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
        match = match_all(newA, regex);

        if (match.length !== 0) {
            const match_0_entries = match[0].entries();
            for (const [key, value] of match_0_entries) {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                let typeName;
                switch (match[1][key]) {
                    case cmd.get('sqrt').toString(): {
                        typeName = 'squareroot';
                        break;
                    }
                    case cmd.get('abs').toString(): {
                        typeName = 'absolute';
                        break;
                    }
                    case cmd.get('overline').toString(): {
                        typeName = 'overline';
                        break;
                    }
                    case cmd.get('overrightarrow').toString(): {
                        typeName = 'overrightarrow';
                        break;
                    }
                    case cmd.get('overleftarrow').toString(): {
                        typeName = 'overleftarrow';
                        break;
                    }
                    case cmd.get('overleftrightarrow').toString(): {
                        typeName = 'overleftrightarrow';
                        break;
                    }
                    case cmd.get('angle').toString(): {
                        typeName = 'angle';
                        break;
                    }
                    case cmd.get('mangle').toString(): {
                        typeName = 'mangle';
                        break;
                    }
                    case cmd.get('arc').toString(): {
                        typeName = 'arc';
                        break;
                    }
                    case cmd.get('sin').toString(): { // added
                        typeName = 'sin';
                        break;
                    }
                    case cmd.get('cos').toString(): { // added
                        typeName = 'cos';
                        break;
                    }
                    case cmd.get('tan').toString(): { // added
                        typeName = 'tan';
                        break;
                    }
                }
                node_1[node_idx] = [
                        typeName,
                        node_1[match[2][key]]
                ];
                node_idx++;
            }
        }

        // get command 2 arg
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
        match = match_all(newA, regex);
        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[1][key] === cmd.get('frac').toString() ? 'fraction' : 'nthroot',
                    node_1[match[2][key]],
                    node_1[match[3][key]]
                ];
                node_idx++;
            });
        }
        // get command 3 arg
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
        match = match_all(newA, regex);
        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    'mfraction',
                    node_1[match[2][key]],
                    node_1[match[3][key]],
                    node_1[match[4][key]]
                ];
                node_idx++;
            });
        }

        // get function
    }

    oldA = '';
    while (oldA !== newA) {
        oldA = newA;
        // get special lv1 command 2 arg
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
        match = match_all(newA, regex);

        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    'log',
                    sub_LatexToTree(match[3][key], node_1, node_idx),
                    node_1[match[2][key]]
                ];
                node_idx++;
            });
        }
        // get special lv1 command 1 arg
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
        match = match_all(newA, regex);
        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[1][key] === cmd_special.get('log').toString() ? 'log' : 'ln',
                    sub_LatexToTree(match[2][key], node_1, node_idx)
                ];
                node_idx++;
            });
        }
    }
    oldA = '';
    while (oldA !== newA) {
        oldA = newA;
        // get special lv2 command 3 arg
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
        match = match_all(newA, regex);
        if (match.length !== 0) {
            const match_0 = match[0];
            match_0.forEach((value, key) => {
                newA = newA.replaceAll(value, partL + node_idx + partR);
                node_1[node_idx] = [
                    'summation',
                    node_1[match[2][key]],
                    node_1[match[3][key]],
                    sub_LatexToTree(match[4][key], node_1, node_idx)
                ];
                node_idx++;
            });
        }
    }
    // construct tree

    const result = sub_LatexToTree(newA, node_1, node_idx);
    return result;
}

function sub_LatexToTree(newA, node, node_idx) {
    const node_1 = node;
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

    let match = [];
    let regex = new RegExp();
    regex = new RegExp(
        '^' +
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR) +
        '$',
        'g');

    match = match_all(newA, regex);
    if (match.length !== 0) {
        if (match[1].length === 1) {
            return node_1[match[1][0]];
        }
    }

    let result = [];
    // array
    let arr = newA.split(new RegExp(signComma, 'g'));
    if (arr.length > 1) {
        return ['array', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
    }
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
    if (arr.length !== 1) {
        result = ['inequality'];
        const max = Math.floor(arr.length / 2);
        for (let i = 0; i < max; i++) {
            const j = 2 * i + 1
            result[j] = sub_LatexToTree(arr[2 * i], node_1, node_idx);
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
        result[2 * max + 1] = sub_LatexToTree(arr[2 * max], node_1, node_idx);
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
        return ['neq', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
    }

    arr = newA.split(new RegExp(signEquation, 'g'));

    if (arr.length !== 1) {
        return ['equation', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
    }

    arr = newA.split(signRatio);

    if (arr.length !== 1) {
        return ['ratio', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
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
        return ['composition', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
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
    if (arr.length !== 1) {
        result = [];
        const max = Math.floor(arr.length / 2);
        if (arr[0] !== '') {
            result = [...result, ['add', sub_LatexToTree(arr[0], node_1, node_idx)]];
        }
        for (let i = 1; i <= max; i++) {
            if (arr[2 * i - 1] === signPlus) {
                result = [...result, ['add', sub_LatexToTree(arr[2 * i], node_1, node_idx)]];
            } else if (arr[2 * i - 1] === signMinus) {
                result = [...result, ['sub', sub_LatexToTree(arr[2 * i], node_1, node_idx)]];
            } else if (arr[2 * i - 1] === partL + '0' + cmd.get('pm') + partR) {
                result = [...result, ['addsub', sub_LatexToTree(arr[2 * i], node_1, node_idx)]];
            } else if (arr[2 * i - 1] === partL + '0' + cmd.get('mp') + partR) {
                result = [...result, ['subadd', sub_LatexToTree(arr[2 * i], node_1, node_idx)]];
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

    if (arr.length !== 1) {
        const arr_length = arr.length;
        const max = Math.floor(arr_length / 2);
        result = ['mulchain', ['mul', sub_LatexToTree(arr[0], node_1, node_idx)]];
        for (let i = 1; i <= max; i++) {
            result = arr[2 * i - 1] === cmd.get('times').toString() ? [...result, ['mul', sub_LatexToTree(arr[2 * i], node_1, node_idx)]]
                : [...result, ['div', sub_LatexToTree(arr[2 * i], node_1, node_idx)]];
        }
        return result;
    }

    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cap') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);

    if (arr.length !== 1) {
        return ['cap', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
    }

    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cup') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['cup', ...arr.map(value => sub_LatexToTree(value, node_1, node_idx))];
    }

    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cdot') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        return ['mulchain', ...arr.map(value => ['mul', sub_LatexToTree(value, node_1, node_idx)])];
    }

    regex = new RegExp(
        forregex(partL) +
        '([1-9][0-9]*)' +
        forregex(partR),
        'g');

    match = match_all(newA, regex);
    if (match.length !== 0) {
        if (match[0].length > 1) {
            result = ['mulchain'];
        } else {
            return false;
        }

        result = [...result, ['mul', node_1[match[1][0]]]];
        const length = match[0].length;
        let index = match[0][1].length;
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
            result = [...result, [op, node_1[match[1][i]]]];
            index += match[0][i].length;
        }
    }
    return result;
}

/*
javascript version preg_match_all
*/
export function match_all(string, regexp) {
    const matches = Array.from(string.matchAll(regexp));
    let result = [];
    let index = 0;
    matches.forEach(match => {
        if (index === 0) {
            const match_length = match.length;
            for (let i = 0; i < match_length; i++) {
                result = [...result, []];
            }
        }
        ++index;
        match.forEach((value, key) => {
            result[key] = [...result[key], value];
        });
    });
    return result;
}
/*
const latex = '1\\pm 2';
//latex = 'B\\cupA';
latex = '3+13';
console.log(JSON.stringify(LatexToTree(latex), null, 4));
*/

/*
function: compare two trees
input: treeA - tree, treeB - tree
ouput: true, false
*/
export function compareMathTree(treeA, treeB) {
    if (typeof treeA !== typeof treeB) {
        return false;
    }
    if (!Array.isArray(treeA)) {
        return (JSON.stringify(treeA) === JSON.stringify(treeB));
    }
    if (treeA[0] === 'anything') {
        treeA = treeB;
    } else if (treeB[0] === 'anything') {
        treeB = treeA;
    }
    if (treeA.length === 1) {
        return true;
    }
    if (treeA[0] === treeB[0] && treeA.length === treeB.length) {
        if (treeA[0] === 'eval') {
            let result = true;
            let num_nullResult = 0;
            const [, ...operandA] = treeA;
            const [, ...operandB] = treeB;
            const operandA_entries = operandA.entries();
            for (const [key, value] of operandA_entries) {
                if (value === null && operandB[key] === null) {
                    num_nullResult++;
                    if (num_nullResult === 4) {
                        return false;
                    }
                    continue;
                }

                // 160818 larwein - equation patch : 계산값의 차를 구해서 비교 + 이항 부호 다르면 바꿔서 비교
                let AReSci;
                let BReSci;
                let AImSci;
                let BImSci;
                if (value[0] === 'equation') {
                    AReSci = (parseFloat(value[1][0]) - parseFloat(value[2][0])).toExponential(4);
                    BReSci = (parseFloat(operandB[key][1][0]) - parseFloat(operandB[key][2][0])).toExponential(4);

                    AImSci = (parseFloat(value[1][1]) - parseFloat(value[2][1])).toExponential(4);
                    BImSci = (parseFloat(operandB[key][1][1]) - parseFloat(operandB[key][2][1])).toExponential(4);

                    if (AReSci === -1 * BReSci && AImSci === -1 * BImSci) {
                        BReSci = AReSci;
                        BImSci = AImSci;
                    }
                } else {
                    // 150818 larwein - 유효숫자 범위 줄임
                    AReSci = parseFloat(value[0]).toExponential(4);
                    BReSci = parseFloat(operandB[key][0]).toExponential(4);

                    AImSci = parseFloat(value[1]).toExponential(4);
                    BImSci = parseFloat(operandB[key][1]).toExponential(4);
                }
                if (AReSci !== BReSci || AImSci !== BImSci) {
                    result = false;
                }
            }
            return result;
        }
        const [, ...operandA] = treeA;
        const [, ...operandB] = treeB;
        return operandA.every((value, key) => compareMathTree(value, operandB[key]));
    }
    return false;
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
