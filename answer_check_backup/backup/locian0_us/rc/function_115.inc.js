

export function divFrac(tree) {
    var tree_1 = JSON.parse(JSON.stringify(tree));
     if (Array.isArray(tree_1)) {
        var operator = tree_1.shift();
        var newOperand = [];
        if (operator === 'mulchain') {
            for (var k = 0; k < tree_1.length; k++ ) {
                if (k === 0) {
                    newOperand.push(tree_1[k]);
                } else if (tree_1[k][0] === 'div' && newOperand[newOperand.length -1 ][0] === 'mul') {
                    var num = divFrac(newOperand.pop()[1]);
                    var denum = divFrac(tree_1[k][1]);
                    if (tree_1.length == 2 ) {
                        operator = 'fraction';
                        newOperand.push(num);
                        newOperand.push(denum);
                    } else {
                        var tempArr = ['fraction'].concat([num,denum]);
                        newOperand.push(['mul'].concat([tempArr]));
                    }
                } else {
                    newOperand.push(divFrac(tree_1[k]));
                }
            }
            if (newOperand.length === 1) {
                operator = newOperand[0][1].shift();
                newOperand = newOperand.shift()[1];
            }
        } else {
            for (var [k, arr] of tree_1.entries()) {
                newOperand.push(divFrac(arr));
                /*
                if ( is_array(arr) && gettype(arr[1]) === 'array' && !in_array(arr[1][0], ['variable', 'fraction', 'natural'])) {
                    newOperand[] = divFrac(arr);
                } else {
                    newOperand[] = arr;
                }
                */
            }
        }
        tree_1 = [operator].concat(newOperand);
    }
    return tree_1;
}
    /*
    if ( gettype(tree) === 'array' ) {
        operator = array_shift(tree);
        newOperand = [];
        if ( operator === 'mulchain' ) {
            for ( k=0; k < sizeof(tree); k++ ) {
                if ( tree[k][0] === 'mul' && (isset(tree[k+1][0]) && tree[k+1][0] === 'div' )) {
                    num = divFrac(tree[k][1]);
                    denum = divFrac(tree[k+1][1]);
                    if ( sizeof(tree) == 2 ) {
                        operator = 'fraction';
                        newOperand[] = num;
                        newOperand[] = denum;
                    } else {
                        tempArr = array_merge(['fraction'],[num,denum]);
                        newOperand[] = array_merge(['mul'], [tempArr]);
                    }
                    k++;
                } else {
                    newOperand[] = divFrac(tree[k]);
                }
            }
        } else {
            foreach ( tree as k => arr ) {
                if ( is_array(arr) && gettype(arr[1]) === 'array' && !in_array(arr[1][0], ['variable', 'fraction', 'natural'])) {
                    newOperand[] = divFrac(arr);
                } else {
                    
                    newOperand[] = arr;
                }
            }
        }
    }
    
    tree = array_merge([operator], newOperand);
    echo "<pre>";
    print_r(tree);
    return tree;
}*/
    
    /*
    if ( gettype(tree) === 'array' ) {
        operator = array_shift(tree);
        newOperand = [];
        if ( sizeof(tree) < 3 ) {
            if ( operator === 'mulchain' ) {
                if ( tree[0][0] == 'mul' && (tree[1][0] != null && tree[1][0] == 'div') ) {
                    operator = 'fraction';
                    num = tree[0][1];
                    denum = tree[1][1];
                 
                    newOperand[] = divFrac(num);
                    newOperand[] = divFrac(denum);
                } else {
                    foreach (tree as v) {
                        newOperand[] = divFrac(v);
                    }
                }
            } else {
                foreach ( tree as val ) {
                    
                    if ( val[0] !== 'fraction' && sizeof(val[1]) > 2 ) {
                        newOperand[] = array_merge([val[0]], [divFrac(val[1])]);
                        
                    } else {
                        newOperand[] = val;
                    }
                }
            }
        } else {
            skip = false;
            for ( k = 0; k < sizeof(tree); k++ ) {
                if ( skip === true ) { skip = false; continue; }
                if ( tree[k][0] === 'mul' && (isset(tree[k+1][0]) && tree[k+1][0] === 'div' )) {
                    num = tree[k][1];
                    denum = tree[k+1][1];
                 
                    newArr = [];
                    newArr[] = 'fraction';
                    newArr[] = num;
                    newArr[] = denum;
                    
                    newOperand[] = array_merge(['mul'], [newArr]);

                    skip = true;
                    
                    /* I think this is most concise -jjee
                    newOperand[] = ['mul', ['fraction', num, denum]];
                     k++; instead of using "skip" - jjee
                 
                } else {
                    newOperand[] = tree[k];
                    skip = false; // this is unneeded
                }
                
            }
        }
    }

    tree = array_merge([operator], newOperand);

    return tree;
}
*/
/*
import {LatexToTree, is_equal_tree} from '../checkmath.js';
var func = divFrac;
var latex1 = '3=150\\div 50';
var latex2 = '3=\\frac{150}{50}';
var tree1 = LatexToTree(latex1);
var tree2 = LatexToTree(latex2);
var tree11 = func(tree1);
var tree21 = func(tree2);
console.log(is_equal_tree(tree11, tree21));
console.log(JSON.stringify(tree11, null, 4));
console.log(JSON.stringify(tree21, null, 4));
*/