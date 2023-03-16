

export function compareCases(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Cases_ahjin');
    //fb(input_1, 'user_Cases_ahjin');

    return TRUE;
}

export function Cases_getAnswer(object_1, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(right));
    organizeAnswerObj(object_1['cases'], answer, checktypeDefault);
    organizeAnswerObj(object_1['conditions'], answer, checktypeDefault);
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}
