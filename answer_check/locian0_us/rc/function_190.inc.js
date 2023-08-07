var object_1 = {
    "type": "BoxPlot1D",
    "offset": 0.7,
    "min": {
        "coord": 37
    },
    "q1": {
        "coord": 37
    },
    "median": {
        "coord": 42
    },
    "q3" : {
        "coord": 44
    }, 
    "max": {
        "coord":45
    }
}
var object_2 = {
    "type": "BoxPlot1D",
    "offset": 0.7,
    "min": {
        "coord": 37
    },
    "q1": {
        "coord": 37
    },
    "median": {
        "coord": 42
    },
    "q3" : {
        "coord": 44
    }, 
    "max": {
        "coord":45
    }
}


console.log(compareBoxPlot1D(object_1, object_2));

export function compareBoxPlot1D(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    if (right_1['type'] === 'BoxPlot1D' && input_1['type'] === 'BoxPlot1D') {
       
        
        var right_data = BoxPlot1D_getInfo(right);
        var input_data = BoxPlot1D_getInfo(input);
        
        
        if (right_data === false && input_data === false) {
            return true;
        }
        if (right_data === false || input_data === false) {
            return false;
        }
        if (right_data.length === 0) { 
            return true;
        }
        for (var [kr, r] of right_data.entries()) {
            for (var [ki, i] of input_data.entries()) {
                if (kr === ki) {
                    if (kr === 'outliers') {
                        
                    } else {
                        if (typeof r['coord'] != 'undefined') {
                            if (JSON.stringify(r['coord']) !== JSON.stringify(i['coord'])) {
                                return false;
                            }
                        }
                        if (typeof r['selected'] != 'undefined') {
                            if (r['selected'] !== i['selected']) {
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    return true;
}

export function BoxPlot1D_getAnswer(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    return object;
}

export function BoxPlot1D_getInfo(object) {
    var object_1 = JSON.parse(JSON.stringify(object));
    if (typeof object_1['locianOptions'] == 'undefined') {
        return false;
    }
    if (typeof object_1['locianOptions']['check'] != 'undefined' || 
        !object_1['locianOptions']['check']) {
        return false;
    }
    
    var keys = ['min', 'q1', 'median', 'q3', 'max', 'outliers'];
    var result = new Object();
    for (var [key, prop] of object_1.entries()) {
        if (keys.includes(key)) {
            if (key === 'outliers') {
                
            } else {
                if (typeof prop['locianOptions'] != 'undefined') { // right answer
                    if (prop['locianOptions']['check']) {
                        result[key] = new Object();
                        if (typeof prop['locianOptions']['coord'] != 'undefined') {
                            result[key]['coord'] = prop['locianOptions']['coord'];
                        }
                        if (typeof prop['locianOptions']['selected'] != 'undefined') {
                            result[key]['selected'] = prop['locianOptions']['selected'];
                        }
                    }
                } else {  // user input
                    result[key] = new Object();
                    result[key]['coord'] = prop['coord'];
                    result[key]['selected'] = prop['interaction']['selected'];
                }
            }
        }
    }
    
    return result;
}

var object = {
    "type": "BoxPlot1D",
    "offset": 0.7,
    "min": {
        "coord": 37
    },
    "q1": {
        "coord": 37
    },
    "median": {
        "coord": 42
    },
    "q3" : {
        "coord": 44
    }, 
    "max": {
        "coord":45
    }
}




function getClassicObject() {
    var bounds = [];
    if (this.bounds[0] % 1 == 0 && this.gcd > 1) {
        bounds = [
            this.bounds[0] % this.gcd == 0 ? this.bounds[0] / this.gcd : new Fraction(this.bounds[0], this.gcd),
            this.bounds[1] % this.gcd == 0 ? this.bounds[1]/this.gcd : new Fraction(this.bounds[1], this.gcd)
        ];
    } else {
        bounds = this.bounds;
    }
    var grid = this.grid;
    var gridLabel = this.gridlabel;
    
    //Set Number line
    var numberLine = this.numberlineJson();
    var newJSON = LapleConverter.conv(numberLine);

    //Set coords for values
    var boxPlot1D = {
        'type': 'BoxPlot1D',
        'offset': 0.7,
        'min': {
            'coord': this.gcd == 1 ? DStophp(this.values[0]) : Math.round(DStophp(this.values[0]) * this.gcd)
        },
        'q1': {
            'coord': this.gcd == 1 ? DStophp(this.values[1]) : Math.round(DStophp(this.values[1]) * this.gcd)
        },
        'median': {
            'coord': this.gcd == 1 ? DStophp(this.values[2]) : Math.round(DStophp(this.values[2]) * this.gcd)
        },
        'q3': {
            'coord': this.gcd == 1 ? DStophp(this.values[3]) : Math.round(DStophp(this.values[3]) * this.gcd)
        },
        'max': {
            'coord': this.gcd == 1 ? DStophp(this.values[4]) : Math.round(DStophp(this.values[4])*this.gcd)
        }
    };
    //Set Outliers
    var outliers = [];
    if (typeof this.outliers != 'undefined') {
        for (var o of this.outliers) {
            var outlier = new Object();
            if (typeof o == 'object') {
                outlier['coord'] = this.gcd == 1 ? DStophp(o) : Math.round(DStophp(o) * this.gcd);
                var jh = this.gcd == 1 ? DStophp(o) : Math.round(DStophp(o) * this.gcd);
                if (!isNaN(parseFloat(o.color))) {
                    outlier['style']['color']['code'] = LapleConverter.staticColorMap[o.color];
                }
            } else if (!isNaN(parseFloat(o))) {
                outlier['coord'] = o;
            }
            outliers.push(outlier);
        }
        boxPlot1D['outliers'] = outliers;
        boxPlot1D['outlier']['template']['style']['marker'] = this.outlierMarker;
    }
    
    //Set color
    var colors = this.colors;
    if (!isNaN(parseFloat(colors[0]))) { 
        boxPlot1D['min']['style']['color']['code'] = LapleConverter.staticColorMap[colors[0]]; 
    }
    if (!isNaN(parseFloat(colors[1]))) { 
        boxPlot1D['q1']['style']['color']['code'] = LapleConverter.staticColorMap[colors[1]]; 
    }
    if (!isNaN(parseFloat(colors[2]))) { 
        boxPlot1D['median']['style']['color']['code'] = LapleConverter.staticColorMap[colors[2]]; 
    }
    if (!isNaN(parseFloat(colors[3]))) { 
        boxPlot1D['q3']['style']['color']['code'] = LapleConverter.staticColorMap[colors[3]]; 
    }
    if (!isNaN(parseFloat(colors[4]))) { 
        boxPlot1D['max']['style']['color']['code'] = LapleConverter.staticColorMap[colors[4]]; 
    }
    newJSON['elements'] = [boxPlot1D];
    newJSON['spaceBelow'] = 0.5;
    newJSON['ratio'] = 0.4;
    
    //Set Label of Cartesian1D
    var labelVal = this.label;
    if (typeof labelVal != 'undeinfed') {
        var label;
        if (typeof labelVal == 'string') {
            var strlen = strlen_parsing170(labelVal);
            var leftPosition = 0.48 - 0.0068 * strlen;
            label = {
                'type': 'Text',
                'content': labelVal,
                'position': {
                    'left': leftPosition,
                    'fixedTop': 190
                } 
            };
        } else if (typeof labelVal == 'object') {
            label = DotPlot.getTitleLabel(labelVal, 160);
        }
        newJSON['label'] = label;
    }
    
    

    return newJSON;
}

