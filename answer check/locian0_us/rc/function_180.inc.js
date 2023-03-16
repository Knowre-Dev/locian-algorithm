

export function compareSpan(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Span_ahjin');
    //fb(input_1, 'user_Span_ahjin');

    return TRUE;
}

export function Span_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    organizeAnswerObj(object_1['value'], answer, checktypeDefault);
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}