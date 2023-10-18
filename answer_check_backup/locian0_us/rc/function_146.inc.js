

export function compareGeometry2D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'Geometry2D' && 
        input_1['type'] === 'Geometry2D') {
       
        
        var right_keys = Geometry2D_getInfo(right);
        var input_keys = Geometry2D_getInfo(input);
        
        if (right_keys.length !== input_keys.length) {
            return false;
        }
        right_keys.sort();
        input_keys.sort();
        
        return JSON.stringify(right_keys) === JSON.stringify(input_keys);
    }

    return false;
}

export function Geometry2D_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    return object_1;
}

export function Geometry2D_getInfo(geoObj) {
    var geoObj_1 = JSON.parse(JSON.stringify(geoObj));
    var result = [];
    for (var [k, obj] of geoObj_1['object'].entries()) {
        if (typeof obj['selectable'] != 'undefined' && obj['selectable']) {
            if (typeof obj['selectedAnswer'] != 'undefined' && obj['selectedAnswer']) {
                result.push(k);
            } else if (typeof obj['selected'] != 'undefined' && obj['selected']) {
                result.push(k);
            }
        } 
    }
    return result;
}

var object = {
    "type": "Geometry2D",
    "object": [
        {
            "type": "PointGeo2D",
            "id": "00000000397bec1800007f1732ff46b3",
            "coord": [
                4,
                -2
            ],
            "color": 0,
            "isFill": true,
            "visible": true,
            "selectable": true,
            "selected": true,
            "label": {
                "type": "Static",
                "mode": "math",
                "value": ""
            },
            "labelSign": "NN"
        },
        {
            "type": "PointGeo2D",
            "id": "00000000397bec1f00007f1732ff46b3",
            "coord": [
                0,
                4
            ],
            "color": 0,
            "isFill": true,
            "visible": true,
            "selectable": true,
            "selected": true,
            "label": {
                "type": "Static",
                "mode": "math",
                "value": ""
            },
            "labelSign": "NN"
        },
        {
            "type": "PointGeo2D",
            "id": "00000000397bec1900007f1732ff46b3",
            "coord": [
                -4,
                -2
            ],
            "color": 0,
            "isFill": true,
            "visible": true,
            "selectable": true,
            "selected": true,
            "label": {
                "type": "Static",
                "mode": "math",
                "value": ""
            },
            "labelSign": "NN"
        }
    ],
    "window": [
        [
            -10,
            10
        ],
        [
            -10,
            10
        ]
    ],
    "rotate": 0,
    "size": [
        1,
        1
    ]
}