

export function compareSelect(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Select' && input_1['type'] === 'Select') { 
        
        
        var answer = right_1['value'];
        var answer_1 = [];
        for (var ans of answer) {
            answer_1.push(ans.toString());
        } 
        var inswer = input_1['value'];
        var inswer_1 = [];
        for (var ins of inswer) {
            inswer_1.push(ins.toString());
        }
       
        answer_1.sort();
        inswer_1.sort();        
        return JSON.stringify(answer_1) === JSON.stringify(inswer_1);
    }

    return false;
}

export function Select_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
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