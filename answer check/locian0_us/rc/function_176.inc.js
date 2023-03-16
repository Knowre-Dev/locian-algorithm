

export function comparePartial(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Partial_ahjin');
    //fb(input_1, 'user_Partial_ahjin');

    return true;
}

export function Partial_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object['elements'] != 'undefined') {  // classic
        organizeAnswerObj(object_1['elements'], answer, checktypeDefault);
    } else { // old
        organizeAnswerObj(object_1['object'], answer, checktypeDefault);
    }
    
    //fb(object, object_1['type'] + 'Aihua');
    
    return object_1;
}