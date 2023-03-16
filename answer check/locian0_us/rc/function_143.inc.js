

export function compareSelect(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Select' && input_1['type'] === 'Select') { 
        //fb(right_1, 'right_Select_' + right_1['mode'] + '_ahjin');
        //fb(input_1, 'user_Select_' + right_1['mode'] + '_ahjin');
        
        var answer = right_1['value'];
        for (var ans of answer) {
            ans = ans + '';
        } 
        var inswer = input_1['value'];
        for (var ins of inswer) {
            ins = ins + '';
        }
        //fb(answer, 'right_Select_'+ right_1['mode'] + '_getInfo_ahjin');
        //fb(inswer, 'user_Select_' + right_1['mode'] + '_getInfo_ahjin');
        
        answer.sort();
        inswer.sort();        
        return JSON.stringify(answer) === JSON.stringify(inswer);
    }

    return false;
}

export function Select_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    return object_1;
}