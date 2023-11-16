import _ from 'lodash';

export function fracExpress(tree) {
    
    if (!Array.isArray(tree)) {
        return tree;
    }  

    let tree_1 = _.cloneDeep(tree);
    let operator = tree_1.shift();
    
    let newOperand = [];
    let nega;
    if (operator === 'mulchain' && tree_1[0][1][0] === 'fraction') {
        let num = [];
        let den = [];
        
        nega = false;
        for (let term of tree_1) {
            if (term[1][0] === 'fraction') {
                if (term[1][1][0] === 'mulchain') {     
                    num = num.concat(term[1][1].slice(1));
                } else if (term[1][1][0] === 'negative'){
                    
                    if (term[1][1][1][1] === '1'){
                        nega = true;
                    } else {
                        num.push([term[0], term[1][1]]);
                    }
                } else if (term[1][1][1] !== '1') {    
                    num.push([term[0], term[1][1]]);
                }
                if (term[1][2][0] === 'mulchain') {
                    den = den.concat(term[1][2].slice(1));
                } else if (term[1][2][1] !== '1') {
                    den.push([term[0], term[1][2]]);
                }
            } else {
                if (term[1][0] === 'mulchain') {
                    num = num.concat(term[1].slice(1));
                } else {
                    num.push([term[0], term[1]]);
                }
            }
        }
        if (num.length === 1) {
            num = num[0][1];                
        } else if (num.length === 0) {
            num = ['natural', '1'];
        } else {               
            num.unshift('mulchain');
        }
        if (den.length === 1) {
            den = den[0][1];
        } else {
            den.unshift('mulchain');
        }
        
        if (den.length > 1) {
            operator = 'fraction';
            newOperand.push(num);
            newOperand.push(den);
        } else {
            operator = num.shift();
            newOperand = num;
        }
    } else {
        for (let v of tree_1) {
            newOperand.push(fracExpress(v));
        }
    }
    
    
    tree_1 = [operator].concat(newOperand);
    
    if (nega) {
        tree_1 = ['negative'].concat([tree_1]);
    }
    return tree_1;
}


