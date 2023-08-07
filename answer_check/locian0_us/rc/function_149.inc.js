





export function compareChartGraph(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));  
    
    var right_data = ChartGraph_getInfo(right_1);
    var input_data = ChartGraph_getInfo(input_1);

    if (right_data.length !== input_data.length) { 
        return false;
    }
    
    for (var [k, data] of right_data.entries()) {
      
        
        if (typeof data['coord'] != 'undefined') {
            if (JSON.stringify(data['coord']) !== JSON.stringify(input_data[k]['coord'])) {
                return false;
            }
        } 
        if (typeof data['selected'] != 'undefined') {
            if (data['selected'] !== input_data[k]['selected']) {
                return false;
            }
        }
    }
    
    return true;
}

export function ChartGraph_getAnswer(object, answer, checktypeDefault) {
    var object_1 = JSON.parse(JSON.stringify(object));
    var checktypeDefault_1 = JSON.parse(JSON.stringify(checktypeDefault));
    
    return object_1;
}

export function ChartGraph_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));

    var result = [];
    if (typeof object_1['type'] != 'undefined' && object_1['type'] === 'ChartGraph') {
        for (var data of object_1['data']) {
            for (var d of data) {
                result.push(d);
            }
        }

    } else {
        
        for (var [key, data] of Object.entries(object_1)) {
            result.push(data);
        }
        
    }
    
    return result;
}

var object = {
    "type": "ChartGraph",
    "data": [
        [
            {
                "coord": 0,
                "label": {
                    "type": "Blank",
                    "category": "StandAlone"
            }
            },
            {
                "coord": 3,
                "label": {
                    "type": "Blank",
                    "category": "StandAlone"
                }
            },
            {
                "coord": 2,
                "label": {
                    "type": "Blank",
                    "category": "StandAlone"
                }
            },
            {
                "coord": 1,
                "label": {
                    "type": "Blank",
                    "category": "StandAlone"
                }
            }
        ]
    ],
    "legend": [
      
    ],
    "style": [
        {
            "color": 4,
            "fill": true,
            "graphMiddle": false
        }
    ],
    "graph": "Bar",
    "interaction": {
        "selectable": false,
        "movable": false
    }
}