

export function compareBlock(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_Block_ahjin');
    //fb(input_1, 'user_Block_ahjin');  

    return true;
}

export function Block_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    organizeAnswerObj(object_1['value'], answer, checktypeDefault);
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}