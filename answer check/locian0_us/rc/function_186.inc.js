function compareTableCellBox(right = null, input = null) {
    var right_1 = JSON.parse(JSON.stringify(right));
    var input_1 = JSON.parse(JSON.stringify(input));
    //fb(right_1, 'right_TableCellBox_ahjin');
    //fb(input_1, 'user_TableCellBox_ahjin');

    return true;
}

var object = {
    "type": "TableCellBox",
    "elements": [
        {
            "type": "Image", 
            "url": "https:\/\/contents.knowreapi.com\/us\/illust\/marking\/png\/big_dot.png"
        }
    ],
    "align": {
        "hor": "left",
        "ver":
        "top"
    },
    "color": {
        "code": -1
    },
    "size": {
        "width": 0.016666666666667
    }
};

//this => tableCellBox
function json(expo = SINOD_EXPORT_TYPE_NEW) {
    var json = new Object();
    switch(expo) {
        case 0:
            if (this.elements.length > 1 ) {
                json = {
                    'type': 'Block',
                    'value': this.elements,
                    'option': {
                        'mode': this.mode,
                        'title': this.title,
                        'width': this.size['width'],
                        'align': this.align['horiz'],
                        'textAlign': this.textAlign,
                        'border': this.border
                    }
                };
                //block은 option이 필요없지?
            } else {
                var object = this.elements;
                var option = {
                    'background': this.backgroundColor,
                    'preset': this.preset,
                    'textAlign': this.textAlign,
                    'colspan': this.colspan,
                    'rowspan': this.rowspan,
                    'paddingRight': this.padding['right'],
                    'paddingLeft': this.padding['left'],
                    'paddingTop': this.padding['top'],
                    'paddingBottom': this.padding['bottom'],
                    'width': this.size['width'],
                    'height': this.size['height']
                };
                json = {
                    'object': object,
                    'option': option
                };
            }
            break;

        case 1:
            var margin = Object.entries(
                {
                    'top': this.margin['top'], 
                    'bottom': this.margin['bottom'], 
                    'left': this.margin['left'], 
                    'right': this.margin['right']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            
            var padding = Object.entries(
                {
                    'top': this.padding['top'], 
                    'bottom': this.padding['bottom'], 
                    'left': this.padding['left'], 
                    'right': this.padding['right']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );

            var position = Object.entries(
                {
                    'top': this.position['top'],
                    'left': this.position['left']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            
            //Border
            var top = Object.entries(
                {
                    'width': this.width['top'], 
                    'style': this.style['top'], 
                    'color': parent.getColorObject(this.color['top'])
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            var bottom = Object.entries( 
                {
                    'width': this.width['bottom'], 
                    'style': this.style['bottom'], 
                    'color': parent.getColorObject(this.color['bottom'])
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            var left = Object.entries(
                {
                    'width': this.width['left'],
                    'style': this.style['left'], 
                    'color': parent.getColorObject(this.color['left'])
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            var right = Object.entries(
                {
                    'width': this.width['right'], 
                    'style': this.style['right'], 
                    'color': parent.getColorObject(this.color['right'])
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            var border = [top, right, bottom, left].filter(
                v => typeof v != 'undefined'
            );

            var size = Object.entries(
                {
                    'width': this.size['width'],
                    'height': this.size['height']
                }
            ).filter(
                ([k, v]) => typeof v != 'undefined'
            );
            
            var align = Object.entries(
                {
                    'horiz': 'align' in args ? this.align['horiz'] : null,
                    'vert': this.size['vert']
                }).filter(
                    ([k, v]) => typeof v != 'undefined'
                );

            //return value
            json = Object.entries(
                {
                    'type': 'TableCellBox',
                    'position': position,
                    'margin': margin ,
                    'border': border,
                    'elements': this.elements,
                    'size': size,
                    'align': align,
                    'colspan': this.colspan,
                    'rowspan': this.rowspan,
                    'background': Object.entries(
                        {
                            'color': parent.getColorObject(this.backgroundColor)
                        }
                    ).filter(
                        ([k, v]) => typeof v != 'undefined'
                    ),
                    'padding': padding
                }
            ).filter(
                ([k, v]) =>  ![null, undefined, 0, '', '0'].includes(v)
            );
            break;   
    }

    return json;
}