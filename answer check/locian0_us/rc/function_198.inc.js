var object_1 = {
    "type": "Math", 
    "content": "4",
    "wrap": false,
    "whiteSpaces": true,
    "innerPadding": false,
    "font":{
        "color": {
            "text":{
                "code": 0
            }
        }
    }
}


var object_2 = {
    "type": "Math", 
    "content": "4",
    "wrap": false,
    "whiteSpaces": true,
    "innerPadding": false,
    "font":{
        "color": {
            "text":{
                "code": 0
            }
        }
    }
}

console.log(compareMath(object_1, object_2));


export function compareMath(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Math' && input_1['type'] === 'Math') {
        if (typeof right_1['locianOptions'] != 'undefined'&&
            typeof right_1['locianOptions']['check'] != 'undefined') {
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

var object = {
    "type": "Math",
    "content": "\\bullet", 
    "wrap": false, 
    "whiteSpaces": true,
    "innerPadding": false
};

object = {
    "type": "Math", 
    "content": "4",
    "wrap": false,
    "whiteSpaces": true,
    "innerPadding": false,
    "font":{
        "color": {
            "text":{
                "code": 0
            }
        }
    }
}



//this => math
//parent => laple

function json(exp = SINOD_EXPORT_TYPE_NEW) {
    var json = new Object();
    switch(exp) {
        case 0:
            json = {
                'type':  'Static',
                'mode':  'math',
                'value':  this.underline ? '\\underline{'.this.value + '}' : this.value,
                'option':  {
                    'color':  this.color,
                    'bgColor':  this.backgroundColor,
                    'bold':  this.bold,
                    'font-size':  this.size
                }
            };
            break;

        case 1:
            var args = this.arguments;
            var color = Object.entries(
                {
                    'text': 'color' in args ? parent.getColorObject(this.color) : null,
                    'background': 'backgroundColor' in args ? parent.getColorObject(this.backgroundColor) : null
                }
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            ); 
            
            var decoration = Objec.entries(
                {
                    'underline':  'underline' in args ? this.underline : null,
                    'blod': 'bold' in args ? this.bold : null,
                    'italic':  'italic' in args ? this.italic : null
                }
            ).filter(
                ([k, v]) => ![null, undefined].includes(v)
            );                   
            var font = Object.entries(
                {
                    'color': color,
                    'size': 'size' in args ? this.size : null,
                    'decoration':  decoration
                }
            ).filter(
                ([k, v]) => ![null, undefined, false, 0, '', '0'].includes(v)
            );
            //!empty를 넣었었는데, 즉 사용자가 index=>null이라고 했을경우에도 제거해 주기 위함이었는데, 어찌되었던 사용자가 넣은 정보니깐 그냥 보여주는게 맞나 했지만, 그럴경우 false를 넣었을 때와 동일하게 보이므로 그냥 !empty를 넣는걸로.
             
            var position = Object.entries(
                {
                    'top': 'position' in args ? this.position['top'] : null,
                    'left': 'position' in args ? this.position['left'] : null
                }
            ).filter(
                ([k, v]) => ![null, undefine].includes(v)
            );
                
            var transform = Object.entries(
                {
                    'rotate': 'rotate' in this.transform,
                    'flip': 'flip' in this.transform
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            
            json = Object.entries(
                {
                    'type': 'Math',
                    'font':  font,
                    'position': position,
                    'transform': transform,
                    'content': this.value + ''
                },
            ).filter(
                ([k, v]) => ![null, undefined, false, 0, '', '0'].includes(v)
            );
            break;
    }

    //return json_encode($json);
    return json;
}