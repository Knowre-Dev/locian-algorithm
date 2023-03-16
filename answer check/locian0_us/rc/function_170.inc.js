

export function compareStack(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Stack' && input_1['type'] === 'Stack') {
        //fb(right_1, 'right_Stack_ahjin');
        //fb(input_1, 'user_Stack_ahjin');
        
        // Stack with pattern
        if (typeof right_1['pattern'] != 'undefined') {
            var rightArr = getIndexFromPattern_Stack(right_1);
            var inputArr = getIndexFromPattern_Stack(input_1, true);
            //fb(rightArr, 'right_Stack_pattern_ahjin');
            //fb(inputArr, 'user_Stack_pattern_ahjin');
            
            var willAllow = right_1['willAllow'];
            if (!Array.isArray(right_1['willAllow']))
                willAllow = [willAllow];
            
            // compare user's input with right answer
            var result = false;
            if (rightArr.length === inputArr.length) {
                result = rightArr.join('') === inputArr.join('');
            }
            
            // compare user's input with will_allow
            if (!result) {
                for (var w of willAllow) {
                    if (Array.isArray(w) && w.length === inputArr.length) {
                        check = w.join('') === inputArr.join('');
                        if (check) {
                            result = true;
                            break;
                        } else
                            continue;
                    } else
                        continue;
                }
            }
            
            if (result) {  
                //fb('Stack is working fine !');
            } else {
                //fb(willAllow, 'will Allow pattern');
            }
            return result;
        }
        
        // Stack in the Tree with orders set
        if (typeof right_1['objs'] != 'undefined') {
            var rightArr = arrangeObjsByOrder_Stack(right_1);
            var inputArr = arrangeObjsByOrder_Stack(input_1, true);
            //fb(rightArr, 'right_Stack_ordered_ahjin');
            //fb(inputArr, 'user_Stack_ordered_ahjin');
            
            if (rightArr.length !== inputArr.length) {
                return false;
            }
            
            for (var [k, rArr] of rightArr.entries()) {
                var iArr = inputArr[k];
                if (rArr.length !== iArr.length) {
                    return false;
                }
                
                rArr.sort();
                iArr.sort();
                if (rArr.join('') !== iArr.join('')) {
                    return false;
                }
            }
            
            return true;
        } 
        
        if (typeof right_1['locianOptions']['check'] != 'undefined' && right_1['locianOptions']['check']) {
            right_1 = right_1['locianOptions']['answer']['index'];
        } else {
            right_1 = -1;
        }
        
        if (typeof input_1['locianOptions']['check'] != 'undefined' && input_1['locianOptions']['check']) {
            input_1 = input_1['index'];
        } else {
            input_1 = -1;
        }
        
        return right_1 === input_1;
    }
    
    return false;
}

export function Stack_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}

export function getIndexFromPattern_Stack(object, user = false) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var index = [];
    for (var stack of object_1['pattern']) {
        if (typeof stack['locianOptions']['check'] != 'undefined' && stack['locianOptions']['check']) {
            if (user)
            index.push(user ? stack['index'] : stack['locianOptions']['answer']['index']);
        } else {
            index.push(-1);
        }
    }
    
    return index;
} 

export function arrangeObjsByOrder_Stack(object, user=false) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var orderArr = [];
    var objArr = [];
    for (var stack of object_1['objs']) {
        var order;
        var index;
        if (typeof stack['locianOptions']['check'] != 'undefined' && stack['locianOptions']['check']) {
            order = stack['locianOptions']['order'];
            index = user ? stack['index'] : stack['locianOptions']['answer']['index'];
        } else {
            order = -1;
            index = -1;
        }
        if (orderArr.includes(order)) {
            position = orderArr.indexOf(order);
            if (typeof objArr[position] == 'undefined') {
                objArr[position] = [];
            }
            objArr[position].push(index);
        } else {
            orderArr.push(order);
            objArr.push([index]);
        }
    }
    
    return objArr;
}
