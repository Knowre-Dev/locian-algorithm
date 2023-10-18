
export function compareText(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Text' && input_1['type'] === 'Text') {
        if (typeof right_1['locianOptions']['check'] != 'undefined') {
            if (right_1['locianOptions']['check'] === true) {
                right_1 = right_1['locianOptions']['selected'];
                input_1 = input_1['interaction']['selected'];
                
                return JSON.stringify(right_1) === JSON.stringify(input_1);
            }
        }
    }

    return true;
}

export function Text_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    
    
    return object_1;
}


var object = {
    "type": "Select",
    "mode": "checkbox",
    "value": [
        0,
        1
    ],
    "size": 2,
    "option": [
        {
            "type": "Static",
            "mode": "text",
            "value": "mean"
        },
        {
            "type": "Static",
            "mode": "text",
            "value": "median"
        }
    ]
}

