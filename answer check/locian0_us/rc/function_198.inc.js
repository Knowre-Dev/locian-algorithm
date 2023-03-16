export function compareMath(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Math' && input_1['type'] === 'Math') {
        if (typeof right_1['locianOptions']['check'] != 'undefined') {
            if (right_1['locianOptions']['check'] === true) {
                right_1 = right_1['locianOptions']['selected'];
                input_1 = input_1['interaction']['selected'];
                return right_1 === input_1;
            }
        }
    }

    return true;
}

export function Math_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}