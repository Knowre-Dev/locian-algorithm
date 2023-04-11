

export function compareShade(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    
    
    var rightArr = Shade_getInfo(right_1);
    var inputArr = Shade_getInfo(input_1);
    
    var countRight = 0;
    for (var rShade of rightArr) {
        countRight += rShade['locianOptions']['selectedCells'].length;
    }
    
    var countInput = 0;
    for (var iShade of inputArr) {
        countInput += iShade['selectedCells'].length;
    }

    return countRight === countInput;
}

export function Shade_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    
    
    return object_1;
}

export function Shade_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var objArr = [];
    if (object_1['type'] == 'Shade') {
        if (typeof object_1['objs'] != 'undefined') {
            for (var shade of object_1['objs']) {
                if (typeof shade['locianOptions']['check'] != 'undefined' && shade['locianOptions']['check']) {
                    objArr.push(shade);
                }
            }
        } else {
            objArr.push(object);
        }
    }
    
    return objArr;
}






var object = {
    "type": "Shade",
    "row": 10,
    "column": 10,
    "border": {
        "width": 1,
        "color": {
            "code": 2
        }
    },
    "cellBorder": {
        "width": 1,
        "color": {
            "code": 2
        }
    },
    "interaction": {
        "selectable": true,
        "draggable": true
    },
    "size": {
        "fixedWidth": 300,
        "fixedHeight": 300
    },
    "selectedCells": [
      
    ],
    "locianOptions": {
        "check": true,
        "selectedCells": [
            {
                "row": 0,
                "column": 0
            },
            {
                "row": 0,
                "column": 1
            },
            {
                "row": 0,
                "column": 2
            },
            {
                "row": 0,
                "column": 3
            },
            {
                "row": 0,
                "column": 4
            },
            {
                "row": 0,
                "column": 5
            },
            {
                "row": 0,
                "column": 6
            }
        ]
    }
}