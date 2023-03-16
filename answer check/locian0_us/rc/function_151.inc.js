

export function compareMultipleChoice(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'MultipleChoice' && input_1['type'] === 'MultipleChoice') {
        //fb(right_1, 'right_MultipleChoice_ahjin');
        //fb(input_1, 'user_MultipleChoice_ahjin');
        
        if (Array.isArray(right_1['answer'])) {
            if (!right_1['answer']) {
                right_answer = [-1];
            } else {
                right_answer = right_1['answer'];
            }
        } else {
            right_answer = [right_1['answer']];
        }
        if (Array.IsArray(input_1['answer'])) {
            if (!input_1['answer']) {
                input_answer = [-1];
            } else {
                input_answer = input_1['answer'];
            }
        } else {
            input_answer = [input_1['answer']];
        }
        
        right_answer.sort();
        input_answer.sort();
        return right_answer.join('') === input_answer.join('');
    }

    return false;
}

export function MultipleChoice_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var keys = object_1['answer'];
    if (!Array.isArray(keys)) {
        keys = [keys];
    }
    
    if (keys) {
        for (var [k, choice] of object_1['choices'].entries()) {
            if (k, keys.includes(k)) {
                organizeAnswerObj(choice, answer, checktypeDefault);
            }
        }
    }

    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}