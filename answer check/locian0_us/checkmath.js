/*
function pr(o) { 
    echo '<pre>' + print_r(o, true) + '</pre>'; 
}
*/
export function forregex(c) {
    var special = [
        '\\', '/', '^', '', '.' , '[' ,']',
        '|', '(' , ')', '?', '*', '+', '{',
        '}', '-', ','
    ];
    var nc = c.split('');
    var result = '';
    for (var v of nc) {
        if (special.includes(v)) {
            result += '\\' + v;
        } else {
            result += v;
        }
    }
    return result;
}


function latextotree_user_exp(A) {
    
    var replace = new Map([
        ['\\left(', '괄호열기'], 
        ['\\right)', '괄호닫기']
    ]);
    for (var [k, v] of replace.entries()) {
        A = A.replaceAll(k, v);
    }
    replace = new Map([
        ['(', '괄호열기'],
        [')', '괄호닫기']
    ]);
    for (var [k, v] of replace.entries()) {
        A = A.replaceAll(k, v);
    }
    
    
   
    
   
    
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*x', 'g'),
        '$1{x}');
        
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*([0-9\.]+)괄호열기(.*)괄호닫기', 'g'),
        '$1{$2괄호열기$3괄호닫기}');
    
        
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*([0-9\.]+\\theta[ ]*)', 'g'),
        '$1{$2}');
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*([0-9\.]+\\pi[ ]*)', 'g'),
        '$1{$2}');
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*([0-9\.]+x)', 'g'),
        '$1{$2}');
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)[ ]*([0-9\.]+)', 'g'),
        '$1{$2}');
    

    
    A = A.replaceAll(
        /(sin|cos|tan)[ ]*\\frac{([0-9]+)}{([0-9]+)}+괄호열기(.*)괄호닫기/g,            
        '$1{\\frac{$2}{$3}괄호열기$4괄호닫기}');
    
    A = A.replaceAll(
        /(sin|cos|tan)[ ]*\\frac{([0-9]+)}{([0-9]+)}\\theta[ ]*/g,
        '$1{\\frac{$2}{$3}\\theta}');
        
    A = A.replaceAll(
        /(sin|cos|tan)[ ]*\\frac{([0-9]+)}{([0-9]+)}\\pi[ ]*/g,
        '$1{\\frac{$2}{$3}x}');
            
    A = A.replaceAll(
        /(sin|cos|tan)[ ]*\\frac{([0-9]+)}{([0-9]+)}x/g,
        '$1{\\frac{$2}{$3}x}');
        
    A = A.replaceAll(
        /(sin|cos|tan)[ ]*\\frac{([0-9]+)}{([0-9]+)}/g,
        '$1{\\frac{$2}{$3}}');
    

    A = A.replaceAll(
        /(\\sin|\\cos|\\tan)\^2\\theta[ ]*/g,
        '{\\$1{\\theta}}^{2}');
    /*
    A = A.replaceAll(
        new RegExp('(sin|cos|tan)\^\{2\}{\\theta[ ]*}', 'g'),
        '{$1{\\theta}}^{2}');
    */
     
    A = A.replaceAll(
        /'(\\sin|\\cos|\\tan)\^{2}{\\theta[ ]*}/g,
        '{\\$1{\\theta}}^{2}');
    
    replace = new Map([
        ['괄호열기', '\\left('], 
        ['괄호닫기', '\\right)']
    ])
    for (var [k, v] of replace.entries()) {
        A = A.replaceAll(k, v);
    }
    // var_dump($A);
    
    return A;
}

/*
var latex = '\\tan\\frac{1}{2}(x+1)';
latex = '\\sin\\frac{1}{2}x';
latex = '\\sin\\frac{1}{2}';


console.log(JSON.stringify(latextotree_user_exp(latex), null, 4));
*/

function latextotree_user_sin(A) {
    if (!['sin', 'cos', 'tan'].includes(n)) {
        return A; 
    }
    
    A = A.replaceAll(
        /'(sin|cos|tan)[ ]*/g,
        '$1');
    var n = A;
    for (var t of ['sin', 'cos', 'tan']) {
        
        if (A.indexOf("\\" + t) != -1 && A.indexOf("\\" + t + '{')) {
            var p = 0; // parenthesis
            var s = false; // sin, cos, tan
            n = '';
            
            var power = false;

            if (A.indexOf(t + '^2') != -1) {
                power = true;
                A = A.replaceAll(t + '^2', t);
            }

            if (A.indexOf(t + '^{2}') != -1) {
                power = true;
                A = A.replaceAll(t + '^{2}', t);
            }


            for (var i = 0; i < A.length; i++) {

                if (A.substr(i, 5) === "\\" + t + '-') {
                    s = true;
                    
                    if (power) {
                        n += '{';
                    }
                    
                    n += "\\" + t + '{-';
                    i += 4;
                    
                    continue;



                } else if (A.substr(i, 4) === "\\" + t) {
                    s = true;
                    
                    if (power) {
                        n += '{';
                    }
                    
                    n += "\\" + t + '{';
                    i += 3;
                    
                    
                                        
                    continue;
                } else if (A.substr(i, 6) === '\\left(') {
                    p++;
                } else if (A.substr(i, 7) === '\\right)') {
                    p--;
                }
                
                if (!s) {
                    n += A[i];
                } else {
                    if (i == A.length - 1) {
                        n += A[i] + '}';
                        
                        if (power) {
                            n += '}^{2}';
                            power = false;
                        }

                        continue;
                    }
                    
                    
                    if (p <= 0 && ['+', '-', '^'].includes(A[i])) {
                        
                        n += '}'
                       
                        if (power) {
                            n += '}^{2}';
                            power = false;
                        }
                        
                        n += A[i];
                        s = false;
                        
                    } else {
                        
                        n += A[i];
                        
                    }
                }
            }
            
            A = n;
        }
        
    }
    
    //added
   //
    
    do {
        var is_empty = false;
        var length = n.length;
        for (var i = 0; i < length; i++) {
            if (n[i] == '{' && n[i+1] == '}') {
                n = n.slice(0, i) + n.slice(i + 2);
                is_empty = true;
                break;
            }
            
        }
    } while (is_empty)
    //
    return n;
}
/*
var latex = '\\tan\\frac{1}{2}(x+1)';
//latex = '\\sinx+\\cosx'
console.log(JSON.stringify(latextotree_user_sin(latex), null, 4));
*/


export function LatexToTree(A, node = null, node_idx = null) {
    var node_1 = JSON.parse(JSON.stringify(node));
    var partL = '@';
    var partR = '#';

    A = A.replace(/\s+/g, '');//added
    
    A = A.replaceAll(
        /\\angle[ ]*([a-zA-Z]+)/g,
        '\\angle{$1}');
    A = A.replaceAll(
        /'m[ ]*\\angle/g,
        '\\mangle');
    
    // 210720 larwein - sin + cos + tan
    if (A.indexOf('sin') != -1 || 
        A.indexOf('cos') != -1 || 
        A.indexOf('tan') != -1) {
        A = latextotree_user_exp(A);
        
        A = latextotree_user_sin(A);
        
    }
    
    // 210602 larwein - log + ln
    if (A.indexOf('log') != -1) {
        var B = A.replaceAll(
            /log ([0-9]+)/g, 
            "log$1");
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }

        B = A.replaceAll(
            /log ([a-zA-Z]+)/g, 
            'log{$1}');
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }

        B = A.replaceAll(
            /"log_([0-9a-zA-Z]+)\\frac/g,
            'log_{$1}\\frac');
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }
    }

    if (A.indexOf('ln') != -1) {
        var B = A.replaceAll(
            /ln ([0-9]+)/g,
            "ln$1");
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }

        B = A.replaceAll(
            /ln ([a-zA-Z]+)/g,
            'ln{$1}');
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }

        B = A.replaceAll(
            /ln_([0-9a-zA-Z]+)\\frac/g,
            'ln_{$1}\\frac');
        if (A != B) {
            // pr([$A, $B]);
            A = B;
        }
    }

    var delimeter = '\\';
    var cmdWhitespace = ':';

    var cmdLeft = 'left';
    var cmdRight = 'right';

    var cmd = new Map([
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
    var cmd_special = new Map([
        ['logbase', 1],
        ['log', 2],
        ['ln', 3]
    ]);

    var signParenthesisLeft = '('; 
    var signParenthesisRight = ')';
    var signBracketLeft = '['; 
    var signBracketRight = ']';
    var signBraceLeft = '{'; 
    var signBraceRight = '}';
    var signBar = '|';

    var signDecimaldot = '.';
    var signExponent = '^';
    var signSubscript = '_';
    
    if (node_1 === null) {
        node_1 = [];
    }
    if (node_idx === null) {
        node_idx = 1;
    }
    var newA = A;
    
    newA = newA.replace(/\s+/g, '');//added
    
    
    //pre-process
    var replace = new Map();
    //remove whitespace(\:)
    replace = new Map([
        [delimeter + cmdWhitespace, '']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }     
    
    //change absolute sign
    replace = new Map([
                [delimeter + cmdLeft + signBar, delimeter + 'abs' + signBraceLeft],
                [delimeter + cmdRight + signBar, signBraceRight]
                ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    
    //change all grouping sign to parenthesis
    replace = new Map([
                [signBraceLeft, signParenthesisLeft],
                [signBraceRight, signParenthesisRight]
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    //remove cmd 'left' and 'right' and 'text'
    replace = new Map([
                [delimeter + cmdLeft, ''],
                [delimeter + cmdRight, ''],
                [delimeter + 'text', '']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    
    //change < or > to \lt or \gt
    replace = new Map([
                ['> ', '\\gt '],
                ['< ', '\\lt '],
                ['>', '\\gt '],
                ['<', '\\lt '],
                ['\\leq', '\\le'],
                ['\\geq', '\\ge']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    
    var regex = new RegExp();
    
    //change mfrac form to mfrac command
``
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
    
    
    //change log_ to logbase
    replace = new Map([
        ['log_', 'logbase']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v);
    }
    
    //change cmd to special_cmd...
    replace = new Map([
        ['\\logbase', 'logbase'],
        ['\\log', 'log'],
        ['\\ln',  'ln']
    ]);
    for (var [k, v] of replace.entries()) {
        newA = newA.replaceAll(k, v)
    }
    
    var match = [];
    //get number
    //repeating decimal
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
        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                new RegExp(forregex(v), 'g'),
                partL + node_idx + partR,
            ); 
            
            node_1[node_idx] = ['rdecimal', match[1][k], match[2][k], match[3][k]];
            node_idx++;
        }
    }
    
   
    //decimal
    regex = new RegExp(
        '[0-9]*' + 
        forregex(signDecimaldot) + 
        '[0-9]+', 
        'g');
    match = match_all(newA, regex);
    if (match.length !== 0) { 
        match[0].sort().reverse();

        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                    new RegExp(forregex(v), 'g'),
                    partL + node_idx + partR,
            );
            node_1[node_idx] = ['decimal', v];
            node_idx++;
        }
    }
    
    // 160727 larwein - commanatural
    regex = new RegExp(
        "[0-9]+(,[0-9]{3})+(?!" + 
        forregex(partL) + 
        ")",
        'g');

    //regex = new RegExp(
    //    "[0-9]+(,[0-9]{3})*(?!" + 
    //    forregex(partL) + 
    //    ")",
    //    'g');
    match = match_all(newA, regex);
    if (match.length !== 0) { 
        match[0].sort().reverse();

        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                new RegExp(
                    v + '(?![0-9]*' + 
                    forregex(partR) + 
                    ")",
                    'g'),
                partL + node_idx + partR,
            );
            
            node_1[node_idx] = ['natural', v.replaceAll(',', '')];
            node_idx++;
        }
    }


    //natural
    
    regex = new RegExp(
        '[0-9]+(?!' + 
        forregex(partL) + 
        ')', 
        'g');
    
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        for (var [k, v] of match[0].entries()) {
            /*
            newA = newA.replaceAll(
                new RegExp(
                    v + 
                    '(?![0-9]*' +
                    forregex(partR) + 
                    ')', 
                    'g'),
                    partL + node_idx + partR,
            );
            */
            newA = newA.replaceAll(
                new RegExp(
                    '(?<![0-9]+)' +
                    v + 
                    '(?![0-9]*' +
                    forregex(partR) + 
                    ')', 
                    'g'),
                    partL + node_idx + partR,
            );      
            node_1[node_idx] = ['natural', v];
            node_idx++;
        }
    }
    
    //get cmd
    for (var [k, v] of cmd.entries()) {
        newA = newA.replaceAll(delimeter + k, partL + '0' + v + partR);
        
    }
    
    //get cmd_special
    for (var [k, v] of cmd_special.entries()) {
        newA = newA.replaceAll(k, partL + '00' + v + partR);
    }
    
    //get variable
    //korean
    regex = new RegExp('([ㄱ-ㅎ|가-힣])', 'g');
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();

        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                    new RegExp(forregex(v), 'g'),
                    partL + node_idx + partR);
            node_1[node_idx] = ['variable', v];
            node_idx++;
        }
    }
    //greek
    regex = new RegExp(
        forregex(partL) + 
        '0(' + 
        cmd.get('pi') + 
        '|' + 
        cmd.get('theta') + 
        '|'+ 
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
        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                new RegExp(forregex(v), 'g'),
                partL + node_idx + partR);
            switch (match[1][k]) {
                case cmd.get('pi').toString():
                    node_1[node_idx] = ['variable', 'pi'];
                    break;
                case cmd.get('theta').toString():
                    node_1[node_idx] = ['variable', 'theta'];
                    break;
                case cmd.get('alpha').toString():
                    node_1[node_idx] = ['variable', 'alpha'];
                    break;
                case cmd.get('beta').toString():
                    node_1[node_idx] = ['variable', 'beta'];
                    break;
                case cmd.get('gamma').toString():
                    node_1[node_idx] = ['variable', 'gamma'];
                    break;
            }
            node_idx++;
        }
    }
    
    //english
    regex = new RegExp("[a-zA-Z][']*", 'g');
    match = match_all(newA, regex);
    if (match.length !== 0) {
        match[0].sort().reverse();
        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(v, partL + node_idx + partR);
            node_1[node_idx] = ['variable', v];
            node_idx++;
        }
    }
 
    //get single command (command that has no argument)
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
        for (var [k, v] of match[0].entries()) {
            newA = newA.replaceAll(
                    new RegExp(forregex(v), 'g'),
                    partL + node_idx + partR);
            switch (match[1][k]) {
                case cmd.get('R').toString():
                    node_1[node_idx] = ['setname', 'real'];
                    break;
                case cmd.get('varnothing').toString():
                    node_1[node_idx] = ['setname', 'empty'];
                    break;
                case cmd.get('infty').toString():
                    node_1[node_idx] = ['infinity'];
                    break;
            }
            node_idx++;
        }
        
    }
    
    
    //get grouping
    var oldA = '';
    while (newA != oldA) {
        
        oldA = newA;
        //get parenthesis
        /*
        regex = new RegExp(
            '([' + 
            forregex(signBracketLeft) + 
            forregex(signParenthesisLeft) + 
            '])' + 
            '([^' + 
            forregex(signParenthesisLeft) +
            forregex(signParenthesisRight) +
            ']*)' +
            '([' +
            forregex(signBracketRight) +
            forregex(signParenthesisRight) +
            '])',
            'g');
            */
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                
                var tempTree = LatexToTree(
                    match[2][k],
                    node_1,
                    node_idx
                );
                if (match[1][k] === '('
                    && match[3][k] === ')'
                    && tempTree[0] === "array") {
                    tempTree[0] = 'tuple';
                } else if (tempTree.length === 3
                    && tempTree[0] === "array") {
                    tempTree = [
                        'interval',
                        match[1][k],
                        tempTree[1],
                        tempTree[2],
                        match[3][k]
                    ];
                }
                node_1[node_idx] = tempTree;
                node_idx++;
            }
        }
        
        //get binary operation (super,subscription)
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[2][k] === '^' ? 'power' : 'subscript',
                    node_1[match[1][k]],
                    node_1[match[3][k]]
                ];
                node_idx++;
            }
        }
        
        
        //get command no arg

        //get command 1 arg
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
            cmd.get('sin') + //added
            '|' +
            cmd.get('cos') + //added
            '|' +
            cmd.get('tan') + //added
            '|' +
            cmd.get('angle') + //added
            '|' +
            cmd.get('mangle') + //added
            ')' +
            forregex(partR) + 
            forregex(partL) +
            '([1-9][0-9]*)' +
            forregex(partR),
            'g');
        match = match_all(newA, regex);
        
        if (match.length !== 0) {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                var typeName;
                switch (match[1][k]) {
                    case cmd.get('sqrt').toString():
                        typeName = 'squareroot';
                        break;
                    case cmd.get('abs').toString():
                        typeName = 'absolute';
                        break;
                    case cmd.get('overline').toString():
                        typeName = 'overline';
                        break;
                    case cmd.get('overrightarrow').toString():
                        typeName = 'overrightarrow';
                        break;
                    case cmd.get('overleftarrow').toString():
                        typeName = 'overleftarrow';
                        break;
                    case cmd.get('overleftrightarrow').toString():
                        typeName = 'overleftrightarrow';
                        break;
                    case cmd.get('angle').toString():
                        typeName = 'angle';
                        break;
                    case cmd.get('mangle').toString():
                        typeName = 'mangle';
                        break;
                    //case cmd.get('square').toString():
                    //    typeName = 'square';
                    //    break;
                    //case cmd.get('triangle').toString():
                    //    typeName = 'triangle';
                    //    break;
                    case cmd.get('arc').toString():
                        typeName = 'arc';
                        break;
                    case cmd.get('sin').toString()://added
                        typeName = 'sin';
                        break;
                    case cmd.get('cos').toString()://added
                        typeName = 'cos';
                        break;
                    case cmd.get('tan').toString()://added
                        typeName = 'tan';
                        break;
                }
                node_1[node_idx] = [
                        typeName,
                        node_1[match[2][k]]
                ];
                node_idx++;
            }
        }
        
        
        //get command 2 arg
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[1][k] === cmd.get('frac').toString() ? 'fraction' : 'nthroot',
                    node_1[match[2][k]],
                    node_1[match[3][k]]
                ];
                node_idx++;
            }
        }
        //get command 3 arg
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    'mfraction',
                    node_1[match[2][k]],
                    node_1[match[3][k]],
                    node_1[match[4][k]]
                ];
                node_idx++;
            }

        }
        
        //get function

    }
    
    
    
    oldA = '';
    while (oldA != newA) {
        oldA = newA;
        //get special lv1 command 2 arg
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
            'g');
        match = match_all(newA, regex);
        
        if (match.length !== 0) {
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    'log',
                    sub_LatexToTree(match[3][k], node_1, node_idx),
                    node_1[match[2][k]]
                ]
                node_idx++;
            }
        }
        //get special lv1 command 1 arg
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    match[1][k] === cmd_special.get('log').toString() ? 'log' : 'ln',
                    sub_LatexToTree(match[2][k], node_1, node_idx)
                ];
                node_idx++;
            }
        }
    }
    oldA = '';
    while (oldA != newA) {
        oldA = newA;
        //get special lv2 command 3 arg
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
            for (var [k, v] of match[0].entries()) {
                newA = newA.replaceAll(v, partL + node_idx + partR);
                node_1[node_idx] = [
                    'summation',
                    node_1[match[2][k]],
                    node_1[match[3][k]],
                    sub_LatexToTree(match[4][k], node_1, node_idx)
                ];
                node_idx++;
            }
        }
    }
    //construct tree
    
    var result = sub_LatexToTree(newA, node_1, node_idx);
    return result;


}
/*
var latex = '\\tan\\frac{1}{2}(1+x)';
console.log(JSON.stringify(LatexToTree(latex), null, 4));
*/


function sub_LatexToTree(newA, node, node_idx) {
    var node_1 = JSON.parse(JSON.stringify(node));
    var partL = '@';
    var partR = '#';
    var delimeter = '\\';
    
    var cmd = new Map([
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
    var signComma = ',';

    var signPlus = '+';
    var signMinus = '-';
    var signEquation = '=';
    var signGreaterthan = '>';
    var signLessthan = '<';
    var signRatio = ':';

    var match = [];
    var regex = new RegExp();
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
    
    var result = [];
    // array
    var arr = newA.split(new RegExp(signComma, 'g'));
    if (arr.length > 1) {
        result = ['array'];
        for (var v of arr) {
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
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
        for (var [k, v] of arr.entries()) {
            if (k % 2 === 0) {
                result.push(sub_LatexToTree(v, node_1, node_idx));
            } else {
                switch (parseInt(v)) {
                    case cmd.get('gt') :
                        result.push('gt');
                        break;
                    case cmd.get('ge') :
                        result.push('ge');
                        break;
                    case cmd.get('lt') :
                        result.push('lt');
                        break;
                    case cmd.get('le') :
                        result.push('le');
                        break;
                    default:
                        result.push(ERROR);
                }
            }
        }
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
        result = ['neq'];
        for (var v of arr) {
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }

    arr = newA.split(new RegExp(signEquation, 'g'));
    
    
    if (arr.length !== 1) {
        result = ['equation'];
        for (var v of arr) {
            
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }

    arr = newA.split(signRatio);
    
    if (arr.length !== 1) {
        result = ['ratio'];
        for (var v of arr)
            result.push(sub_LatexToTree(v, node_1, node_idx));
        return result;
    }    
    
    /*
    regex = new RegExp(
        '(' +
        forregex(partL) +
        '0' +
        cmd.get('circ') +
        forregex(partR) +
        ' ?' +
        ')',
        'g');
    */
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('circ') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        result = ['composition'];
        for (var [k, v] of arr.entries()) {
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }
    
    
    //addchain
    /*
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
        ' ?' +
        ')',
        'g');
    */

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
        for (var i = 0; i < arr.length; i += 2) {
            if (i === 0 && arr[i] === '') {

            } else if (i === 0) {
                result.push(['add', sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else if (arr[i-1] === signPlus) {
                result.push(['add', sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else if (arr[i-1] === signMinus) {
                result.push(['sub', sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else if (arr[i-1] === partL + '0' + cmd.get('pm') + partR) {
                result.push(['addsub',sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else if (arr[i-1] === partL + '0' + cmd.get('mp') + partR) {
                result.push(['subadd',sub_LatexToTree(arr[i], node_1, node_idx)]);
            }
            /*
            } else {
                result.push(['addsub',sub_LatexToTree(arr[i],node_1, node_idx)]);
            }
            */
        }
        if (result.length === 1) {
            if (result[0][0] === 'add') {
                result = ['positive', result[0][1]];
            } else if (result[0][0] === 'sub') {
                result = ['negative', result[0][1]];
            } else if (result[0][0] === 'addsub') {
                result = ['pm', result[0][1]];
            } else if (result[0][0] === 'subadd') {
                result = ['mp', result[0][1]];
            }

            /*
            } else {
                result = ['pm', result[0][1]];
            }
            */
        } else { 
            result = ['addchain'].concat(result);
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
        result = ['mulchain'];
        for (var i = 0; i < arr.length; i += 2) {
            if (i === 0) {
                result.push(['mul', sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else if (arr[i-1] === cmd.get('times').toString()) {
                result.push(['mul', sub_LatexToTree(arr[i], node_1, node_idx)]);
            } else {
                result.push(['div', sub_LatexToTree(arr[i], node_1, node_idx)]);
            }
        } 
        return result;
    }
    
    /*
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('cap') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    */
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cap') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    
    if (arr.length !== 1) {
        result = ['cap'];
        for (var [k, v] of arr.entries()) {
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }
    
    /*
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('cup') +
        ')' +
        forregex(partR) +
        ' ?',
        'g'); 
    */
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cup') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    if (arr.length !== 1) {
        result = ['cup'];
        for (var [k, v] of arr.entries()) {
            result.push(sub_LatexToTree(v, node_1, node_idx));
        }
        return result;
    }
    
    /*
    regex = new RegExp(
        forregex(partL) +
        '0(' +
        cmd.get('cdot') +
        ')' +
        forregex(partR) +
        ' ?',
        'g');
    */
    regex = new RegExp(
        forregex(partL) +
        '0' +
        cmd.get('cdot') +
        forregex(partR) +
        ' ?',
        'g');
    arr = newA.split(regex);
    
    if (arr.length !== 1) {
        result = ['mulchain'];
        for (var [k, v] of arr.entries()) {
            result.push(['mul', sub_LatexToTree(v, node_1, node_idx)]);
        }
        return result;
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
        
        /*
        for (var [k, v] of match[1].entries()) {
            result.push(['mul', node_1[v]]);
        }
        */
        result.push(['mul', node_1[match[1][0]]]);
        var length = match[0].length;
        var index = match[0][1].length;
        var op = '';
        for (var i = 1; i < length; i++) {
            if (newA.charAt(index) == '\/') {
                op = 'div';
                index += 1;
            } else if (newA.charAt(index) == '*') {
                op = 'mul';
                index += 1;
            } else {
                op = 'mul';
            }
            result.push([op, node_1[match[1][i]]]);
            index += match[0][i].length;  
            
        }

    }
    return result;
}


export function match_all(string, regexp) {
    var matches = Array.from(string.matchAll(regexp));
    var result  = [];
    var index = 0;
    for (var match of matches) {
        if (index == 0) {
            for (var i = 0; i < match.length; i++) {
                result.push([]);
            }  
        }
        ++index;
        for (var [k, v] of match.entries()) {
            result[k].push(v);
        }
    }
    return result;
}






export function is_equal_tree(tree_1, tree_2) {
    
    var tree_11 = JSON.parse(JSON.stringify(tree_1));
    var tree_21 = JSON.parse(JSON.stringify(tree_2));
    var type_1 = typeof tree_11;
    var type_2 = typeof tree_21;
    if (type_1 != type_2) {
        return false;
    }
    if (type_1 == 'string') {
        return tree_11 == tree_21;
    }

    if (type_1 == 'number') {
        var d = Math.pow(0.1, 5);
        return Math.abs(tree_11 - tree_21) < d;
    }

    if (!Array.isArray(tree_11) || !Array.isArray(tree_21)) {
        return false;
    }

    if (JSON.stringify(tree_11) == JSON.stringify(tree_21)) {
        return true;
    }

    var length_1 = tree_11.length;
    var length_2 = tree_21.length;
    if (length_1 != length_2) {
        return false;
    }
    for (var i = 0; i < length_1; i++) {
        if (!is_equal_tree(tree_11[i], tree_21[i])) {
            return false;
        }
    }
    return true
}
