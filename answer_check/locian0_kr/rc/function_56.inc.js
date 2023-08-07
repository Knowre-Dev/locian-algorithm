export function mulIdentity(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
    if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var sign = 1;
        var newOperand = [];
        if (operator === 'negative') {
            newOperand.push(mulIdentity(tree_1[0]));
            if (newOperand[0][0] === 'negative') {
                operator = newOperand[0][1].shift();
                newOperand = newOperand[0][1];
            }
        } else if (operator === 'mulchain') {
            for (var v of tree_1) {
                if (v[1][0] === 'natural' && v[1][1] === '1') {
                } else if (v[1][0] === 'negative' && v[1][1][0] === 'natural' && v[1][1][1] === '1')  {
                    sign = -1;
                } else {
                    newOperand.push(mulIdentity(v));
                }
            }
            if (newOperand.length === 1) {
                operator = newOperand[0][1].shift();                
                newOperand = newOperand[0][1];
            }
        } else {
            for (var v of tree_1) {
                newOperand.push(mulIdentity(v));
            }
        }
        if (sign === -1) {
            newOperand = [[operator].concat(newOperand)];
            operator = 'negative';
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}

/*
        foreach (operand as v) {
            newOperand[] = mulIdentity(v);
        }
        if (operator === 'mulchain')
        {
            newnewOperand = array();
            foreach (newOperand as v)
            {
                if (v[0] === 'mul' && v[1][0] === 'natural' && v[1][1] === '1');
                else newnewOperand[] = v;
            }
            switch(sizeof(newnewOperand))
            {
                case 0:
                    return array('natural','1');

                case 1:
                    return newnewOperand[0][1];

                default:
                    return array_merge(array(operator),newnewOperand);
            }
        }
        else
        {
            return array_merge(array(operator),newOperand);
        }
        */

        