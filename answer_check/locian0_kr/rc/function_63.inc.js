export function varReverseShift(tree, types = [null], parent = null) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();

        for (var [k, v] of tree_1.entries()) {
            tree_1[k] = varReverseShift(v, types, operator);
        }

        if (operator === 'mulchain' && types.includes(parent)) {
            var vars = [];

            for (var v of tree_1) {
                if (v[0] === 'mul' && v[1][0] === 'variable' && v.length === 2) {
                    vars.push(v[1][1]);
                } else {
                    return [operator].concat(tree_1);
                }
            }
            var vars_1 = JSON.parse(JSON.stringify(vars));
            vars_1.sort();
            var min = vars_1[0];
            var k = Object.keys(vars).find(key => vars[key] === min);
            var result = [];

            if (((typeof vars[k-1] !== 'undefined') ? vars[k-1] : vars[vars.length-1]) 
                < ((typeof vars[k+1] !== 'undefined') ? vars[k+1] : vars[0])) {
                k = vars.length - 1 - k;
                vars = vars.reverse();
            }

            for (var [k, v] of [[k, vars.length], [0, k]].entries()) {
                for (var i = v[0]; i < v[1]; i++) {
                    result.push(['mul', ['variable', vars[i]]]);
                }
            }

            tree_1 = result;
            operator += '_fixed';
        }
        
        tree_1 = [operator].concat(tree_1);
    }
    return tree_1;
}



