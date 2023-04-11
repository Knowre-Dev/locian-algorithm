


export function compareSelectBox(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'SelectBox' && input_1['type'] === 'SelectBox') { 
        
        var right_answer = Array.isArray(right['answer']) ? typeof right['answer'][0] != 'undefined' ? right['answer'][0] : -1 : right['answer'];
        var input_answer = Array.isArray(input['answer']) ? typeof input['answer'][0] != 'undefined' ? input['answer'][0] : -1 : input['answer'];
        
        return JSON.stringify(right_answer) === JSON.stringify(input_answer);
    }
    
    return false;
}

export function SelectBox_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    //fb(object_1, object_1['type'] + 'Aihua');
    
    return object_1;
}

var object = {
    "type": "SelectBox",
    "choices": [
        {
            "type": "Box",
            "elements": [
                {
                    "type": "Text",
                    "content": "an increase"
                }
            ]
        },
        {
            "type": "Box",
            "elements": [
                {
                    "type": "Text",
                    "content": "a decrease"
                }
            ]
        }
    ],
    "answer": "0"
}