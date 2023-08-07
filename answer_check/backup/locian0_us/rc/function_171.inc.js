import {Laco} from '../libs/common.inc.js';

var laco = new Laco();
laco.setSinod(
    {
        /*
        object type => [
            check export function name,
            get export function name
        ]
        */

        // classic
        'SingleChoice': [
            'compareSingleChoice', 
            'SingleChoice_getAnswer'
        ],
        
        'MultipleChoice': [
            'compareMultipleChoice',
            'MultipleChoice_getAnswer'
        ],
        
        'SelectBox': [
            'compareSelectBox',
            'SelectBox_getAnswer'
        ],
        
        'Clock': [
            'compareClock',
            'Clock_getAnswer'
        ],

        'Dropzone': [
            'compareDropzone', 
            'Dropzone_getAnswer'
        ],
        
        'Chart': [
            'compareChart',
            'Chart_getAnswer'
        ], 
        
        'ChartGraph': [
            'compareChartGraph',
            'ChartGraph_getAnswer'
        ], 
        
        'Tree': [           // contains old and classic sinod
            'compareTree',
            'Tree_getAnswer'
        ],
        
        'Stack': [
            'compareStack',
            'Stack_getAnswer'
        ],
        
        'Relation': [       // contains old and classic sinod
            'compareRelation',
            'Relation_getAnswer'
        ],
        
        'Cartesian1D': [
            'compareCartesian1D',
            'Cartesian1D_getAnswer'
        ],
        
        'Cartesian2D': [   // contains old and classic sinod
            'compareCartesian2D',
            'Cartesian2D_getAnswer'
        ],
        
        'Cases': [
            'compareCases',
            'Cases_getAnswer'
        ],
        
        'DotPlot1D': [
            'compareDotPlot1D',
            'DotPlot1D_getAnswer'
        ],
        
        'BoxPlot1D': [
            'compareBoxPlot1D',
            'BoxPlot1D_getAnswer'
        ],
        
        'Trig': [
            'compareTrig',
            'Trig_getAnswer'
        ],
        
        /*
        'GridChart' => [     // not sure if we use it
            'compareGridChart',
            'GridChart_getAnswer'
        ],
        */
        
        'Partial': [         // contains old and classic sinod
            'comparePartial',
            'Partial_getAnswer'
        ],
        
        'Box': [
            'compareBox',
            'Box_getAnswer'
        ],
        
        'Layer': [       // contains old and classic sinod
            'compareLayer',
            'Layer_getAnswer'
        ],
        
        'Table': [
            'compareTable',
            'Table_getAnswer'
        ],
        
        'Connect': [
            'compareConnect',
            'Connect_getAnswer'
        ],
        
        'Math': [
            'compareMath',
            'Math_getAnswer'
        ],
        
        'Text': [
            'compareText',
            'Text_getAnswer'
        ],
        
        'Shade': [
            'compareShade',
            'Shade_getAnswer'
        ],
        
        'Image2D': [
            'compareImage2D',
            'Image2D_getAnswer'
        ],
        
        // old sinod
        'Geometry2D': [
            'compareGeometry2D',
            'Geometry2D_getAnswer'
        ], 
        
        'NumberLine': [
            'compareNumberLine',
            'NumberLine_getAnswer'
        ], 
        
        'Select': [
            'compareSelect',
            'Select_getAnswer'
        ],
        
        'Block': [
            'compareBlock',
            'Block_getAnswer'
        ],
        
        'Span': [
            'compareSpan',
            'Span_getAnswer'
        ],
        
        'Lattice': [
            'compareLattice',
            'Lattice_getAnswer'
        ]
    }
);
