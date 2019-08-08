<?php



//Cartesian2D algorithm KR
/*
Object의 수학적 표현 (data)
@ Angle2D
  [angle center,angle start,angle end,angle height]
@ Arc2D
  [arc center,arc start,angle]
@ Face2D
  Vertices
@ Path2D
  Vertices
@ Point2D
  Point coord
@ Segment2D
  [segment start, segment end]
@ Angle Interval
  [start angle, angle size]
@ Rectangle
  [[x_min,x_max],[y_min,y_max],rotation]
  1. x_min: x 최소값, x_max: x 최대값
  2. y_min: y 최소값, y_max: y 최대값
  3. rotation: rectangle 회전각(시계 방향)
@ Region
  1. Rectangle의 array
  2. 주로 curve가 차지하는 영역을 나타낼 때 사용
/*
-추가-
@ Label2D polygon
  1. Label2D가 차지하는 polygon
  2. Label2D의 polygon의 vertex로 구성
@ Angle2D Label 위치 (Point2D Label위치도 같은 방법으로 구함)
  1. Label이 차지하는 부분은 polygon으로 구성
  2. Polygon의 중심은 polygon을 둘러싸는 가장 작은 직사각형의 중심
  3. Angle 중심(Angle의 두 segment가 이루는 각의 중심)을 지나는 segment위에 polygon의 중심이 위치
  4. Polygon의 모든 vertices가 angle 내부에 존재
@ Point coord {x:, y:}
*/
/*
Algorithm 규칙
@ 기본 길이 단위: 0.5
@ size가 영향을 주는 것들
  1. Label2D의 크기
  2. Grid2D의 label의 크기
  3. Angle2D의 style-height와 style-markerHeight
@ ratio가 영향을 주는 것들
  1. Label2D의 크기
  2. Grid2D의 label의 크기
@ Angle2D
  1. style-height와 style-markerHeight는 동일하게 설정
@ Measure2D의 결정 요소
  1. 다음의 세 점으로 이루어진 Bezier Curve
     segment start
     segment end
     segment의 중심에서 2배 meausre의 height의 2배 만큼 수선을 그은 점
     ex) [0,0],[l,0],[l/2,2h] (l: segment length, h: measure height)

/*
 요청사항
 1. 각 object의 id
*/




// GEO2D의 object의 요소 표현 function (json)


/*
1. 기능
   angle의 center 출력
2. 입력
   $angle: angle
3. 출력
   angle center
*//*
function angle_center($angle)
{
    return $angle['coords']['center'];
}

/*
1. 기능
   Angle2D의 정보 계산
2. 입력
   $angle: Angle2D
3. 출력
  [angle center,angle start,angle end,angle height actual]
*/
function angle_data($angle)
{
    return {'center':object_center($angle),'start':object_start($angle),'angle':object_end($angle),'height_actual':angle_height_actual($angle)};
}

/*
1. 기능
   angle의 end 출력
2. 입력
   $angle: angle
3. 출력
   angle end
*//*
function angle_end($angle)
{
    return $angle['coords']['end'];
}

/*
1. 기능
   angle의 height 출력
2. 입력
   $angle: angle
3. 출력
   angle height
*/
function angle_height($angle)
{
    return $angle['height'];


/*
1. 기능
   Angle2D의 marker 출력
2. 입력
   $angle: Angle2D
3. 출력$a
   angle marker
*/
function angle_marker($angle)
{
    return $angle['style']['marker'];
}

/*
1. 기능
   Return angle marker height
2. 입력
   $angle: Angle2D
3. 출력
   angle marker height
*/
function angle_marker_height($angle)
{
    return $angle['style']['markerHeight'];
}

/*
1. 기능
   Angle2D의 right angle 유무 출력
2. 입력
   $angle: Angle2D
3. 출력
   angle right angle
*/
function angle_right_angle($angle)
{
    return $angle['style']['rightAngle']
}

/*
1. 기능
   angle의 start 출력
2. 입력
   $angle: angle
3. 출력
   angle start
*//*
function angle_start($angle)
{
    return $angle['coords']['start'];


/*
1. 기능
   arc의 angle 출력
2. 입력
   $arc: arc
3. 출력
   arc angle
*/
function arc_angle($arc)
{
    return $arc['angle'];
}

/*
1. 기능
   arc의 center 출력
2. 입력
   $arc: arc
3. 출력
   arc center
*//*
function arc_center($arc)
{
    return $arc['coords']['center'];
}


/*
1. 기능
   Arc2D의 정보 계산
2. 입력
   $arc: Arc2D
3. 출력
  [arc center,arc start,angle]
*/
function arc_data($arc)
{
    return {'center':object_center($arc),'start':object_start($arc),'angle':arc_angle($arc)};
}

/*
1. 기능
   arc의 measure의 height 출력
2. 입력
   $arc: arc
3. 출력
   arc의 measure의 height
*/
function arc_measure_height($arc)
{
    return $arc['measure']['style']['height'];
}


/*
1. 기능
   arc의 start 출력
2. 입력
   $arc: arc
3. 출력
   arc start
*//*
function arc_center($arc)
{
    return $arc['coords']['start'];
}

/*
1. Function
   Return bounds of Cartesian2D
2. Input
   $Cartesian2D: Cartesian2D
3. Output
   bounds
*/
function Cartesian2D_bound($Cartesian2D)
{
	$bound = [[],[]];
    $bound['x']['min'] = $Cartesian2D['x']['min']; // x축 최소값
    $bound['x']['max'] = $Cartesian2D['x']['max']; // x축 최대값
    $bound['y']['min'] = $Cartesian2D['y']['min']; // y축 최소값
    $bound['y']['max'] = $Cartesian2D['y']['max']; // y축 최대값
    return $bound;
}


/*
1. Function
   Return ratio of Cartesian2D
2. Input
   $Cartesian2D: Cartesian2D
3. Output
   ratio
*/
function Cartesian2D_ratio($Cartesian2D)
{
    return $Cartesian2D['ratio']);
}



/*
1. Function
   Return rotation of Cartesian2D
2. Input
   $Cartesian2D: Cartesian2D
3. Output
   rotation
*/
function Cartesian2D_rotation($Cartesian2D)
{
    return deg2rad($Cartesian2D['rotation']);
}


/*
1. Function
   Return objects of Cartesian2D (reference)
2. Input
   $Cartesian2D: Cartesian2D
3. Output
   objects
*/
function &Cartesian2D_object(&$Cartesina2D)
{
    return $Cartesian2D['elements'];
}






/*
1. 기능
   Face2D의 정보 계산
2. 입력
   $face: Face2D
3. 출력
  face coords
*/
function face_data($face)
{
    return $face['coords'];

}

/*
1. Function
   Return keys of coord
2. Input
3. Output
   keys of coord
*//*
function keys_coord()
{
    return ['x','y'];
}


/*
1. 기능
   Label2D의 정보 계산
2. 입력
   $label: Label2D
3. 출력
   [label coord,label label]
*/
function label_data($label)
{
    return {'coord':label_coord($label),'label':label_label($label)};

}

/*
1. 기능
   Label의 value출력
2. 입력
   $label: label
3. 출력
   label의 value
*/
function label_label($label)
{
    return $label['label']['content'];
}

/*
1. 기능
   Label의 type 출력
2. 입력
   $label: label
3. 출력
   label의 type
*/
function label_type($label)
{
    return $label['label']['type'];
}

/*
1. 기능
   label이 지정하는 object id 출력
2. 입력
   $label: label
3. 출력
   label이 지정하는 object
*/
function labeled_object_id($label)
{
    return $label['labeledObject'];
}


/*
1. 기능
   Path2D의 정보 계산
2. 입력
   $path: path
3. 출력
   path coords
*/
function path_data($path)
{
    return $path['coords'];
}

/*
1. 기능
   Point2D의 정보 계산
2. 입력
   $point: point
3. 출력
   point coord
*/
function point_data($point)
{
    return $point['coord'];
}


/*
1. 기능
   object color 출력
2. 입력
   $object: object
3. 출력
   object color
*/
function object_color($object)
{
    return $object['style']['color'];

}

/*
1. 기능
   object center 출력
2. 입력
   $object: object
3. 출력
   object center
*/
function object_center($object)
{
    return $object['coord']['center'];

}


/*
1. 기능
   object dash 유무 출력
2. 입력
   $object: object
3. 출력
   object dash
*/
function object_dash($object)
{
    return $object['style']['dash'];

}


/*
1. 기능
   object end 출력
2. 입력
   $object: object
3. 출력
   object end
*/
function object_end($object)
{
    return $object['coord']['end'];

}

/*
1. 기능
   object id 출력
2. 입력
   $object: object
3. 출력
   object id
*/
function object_id($object)
{
    return $object['id'];

}


/*
1. Funciton
   Return object interaction-interactive (old: selectable)
2. 입력
   $object: object
3. 출력
   object s
*/
function object_interactive($object)
{
    return $object['interaction']['interactive'];

}

/*
1. Function
   Return the label of object (if tere is)
2. Input
   $object: object
   $labels: labels
3. Output
   object label
*/
function &object_label($object,&$labels)
{
    foreach ($labels as &$label)
    {
        if (labeled_object_id($label) == object_id($object))
        {
            return $label;
        }
    }
    return null;
}


/*
1. 기능
   object의 measure 출력
2. 입력
   $object: object
3. 출력
   object measure
*/
function &object_measure(&$object)
{
    return $object['measure']
}

/*
1. 기능
   object의 measure height 계산
2. 입력
   $object: arc or segment
3. 출력
   object measure height
*/
function object_measure_height($segment)
{
    return $object['measure']['style']['height'];
}

/*
1. 기능
   object의 measure height 계산
2. 입력
   $object: arc or segment
3. 출력
   object measure height
*/
function object_measure_type($segment)
{
    return object_type(object_measure($object));
}

/*
1. 기능
   object start 출력
2. 입력
   $object: object
3. 출력
   object start
*/
function object_start($object)
{
    return $object['coord']['start'];

}




/*
1. 기능
   object style 출력
2. 입력
   $object: object
3. 출력
   object style
*/
function object_style($object)
{
    return $object['style'];

}




/*
1. 기능
   object type 출력
2. 입력
   $object: object
3. 출력
   object type
*/
function object_type($object)
{
    return $object['type'];

}



/*
1. 기능
   region의 curves 출력
2. 입력
   $region: region
3. 출력
   region curves
*/
function region_curves($region)
{
    return $region['curves']

}

/*
1. 기능
   Segment2D의 정보 계산
2. 입력
   segment
3. 출력
   [segment start, segment end]
*/
function segment_data($segment)
{
    return {'start':object_start($segment),'end':object_end($sedment)};
}

}


/*
1. 기능
   Segment2D의 parallel 유무 출력 계산
2. 입력
   $segment: segment
3. 출력
   segment paralle
*/
function segment_parallel($segment)
{
    return $segment['parallel'];
}

/*
1. 기능
   Segment2D의 start 출력
2. 입력
   $segment: segment
3. 출력
   start
*/
function segment_start($segment)
{
    return $segment['coords']['start'];
}


//GEO2D object function (json)
/*
1. Function
   Compute actual height of angle
2. Input
   $angle: angle
3. Output
   actual height
*/
function angle_height_actual($angle)
{
    if (angle_right_angle($angle))
    {
        $angle_data = [object_center($angle),object_start($angle),object_end($angle)];
        return 2*angle_height($angle)*abs(cos(angle_angle($angle_data)/2));
    }
    if (angle_marker($angle) == 'none')
    {
        return angle_height($angle);
    }
    return max(angle_height($angle),angle_marker_height($angle));
}

/*
1. Function
   Change height of angle
2. Input
   $angle: segment
   $height_new: new height
3. Output
   height changed angle
*/
function angle_height_change(&$angle,$height_new,$marker_height_new = 0.5)
{
    $angle['style']['height'] = $height_new;
    if ($heiht_new)
    {
        $angle['style']['markerHeight'] = $height_new;
    }
    else
    {
        $angle['style']['markerHeight'] = $marker_height_new;
    }
}






/*
1. 기능
   두 Arc가 교점을 가질 경우 union을 구해줌
2. 입력
   arc_1: Arc
   arc_2: Arc
3. 출력
   교점일 있을 경우: union된 Arc
   교점일 없을 경우: null
*//*
function arcs_union($arc_1,$arc_2)
{
    $arc_1_data = arc_data($arc_1);
    $arc_2_data = arc_data($arc_2);
    if (is_overlap_arc_arc($arc_1_data,$arc_2_data))
    {
        if (is_contained_arc_arc($arc_1_data,$arc_2_data))
        {
            //$arcs_union = object_copy($arc_2);
            $arcs_union = $arc_2;
        }
        else if (is_contained_arc_arc($arc_2_data,$arc_1_data))
        {
            //$arcs_union = object_copy($arc_1);
            $arcs_union = $arc_1;
        }
        else
        {
            $arc_1_start_angle = M_vector_angle($arc_1_data[0],$arc_1_data[1]);
            $arc_2_start_angle = M_vector_angle($arc_2_data[0],$arc_2_data[1]);

            if (M_angle_polar($arc_2_start_angle-$arc_1_start_angle) <= $arc_1_data[2])
            {
               $arcs_union = $arc_1;
               $arcs_union['angle'] = M_angle_polar($arc_2_start_angle-$arc_1_start_angle+$arc_2_data[2]);
            }
            else if (M_angle_polar($arc_1_start_angle-$arc_2_start_angle) <= $arc_2_data[2])
            {
                $arcs_union = $arc_2;
                $arcs_union['angle'] = M_angle_polar($arc_1_start_angle-$arc_2_start_angle+$arc_1_data[2]);
            }
        }

        $arcs_union['id'] = object_id($arc_1).object_id($arc_2);
        $arcs_union['style']['dash'] = false;
        $arcs_union['style']['marker1'] = 'none';
        $arcs_union['style']['marker2'] = 'none';
        $arcs_union['style']['marker2'] = 'none';
        $arcs_union['measure']['type'] = 'Blank';

        return $arcs_union;
    }

    return null;

}    */



/*
1. Function
   Compute bounds of a curve
2. Input
   $curve: curve
   $bounds: bounds
3. Output
*/
function curve_bounds($curve,$bounds)
{
    if (!$curve['domain'])
    {
        return $bounds;
    }
    
	$curve_bounds = [];
	$curve_bounds['x'] = [];
	$curve_bounds['y'] = [];
    if ($curve['domain']['x']['min'])
    {
        $curve_bounds['x']['min'] = max($bounds['x']['min'],$curve['domain']['x']['min']);
    }
    else
    {
        $curve_bounds['x']['min'] = $bounds['x']['min'];
    }

    if ($curve['domain']['x']['max'])
    {
        $curve_bounds['x']['max'] = max($bounds['x']['max'],$curve['domain']['x']['max']);
    }
    else
    {
        $curve_bounds['x']['max'] = $bounds['x']['max'];
    }

    if ($curve['domain']['y']['min'])
    {
        $curve_bounds['y']['min'] = min($bounds['y']['min'],$curve['domain']['y']['min']);
    }
    else
    {
        $curve_bounds['y']['min'] = $bounds['y']['min'];
    }

    if ($curve['domain']['y']['max'])
    {
        $curve_bounds['y']['max'] = max($bounds['y']['max'],$curve['domain']['y']['max']);
    }
    else
    {
        $curve_bounds['y']['max'] = $bounds['y']['max'];
    }

    return $curve_bounds;
}

/*
1. Function
    Compute coordinates of point on a curve
2. Input
    $type: curve type
3. Output
    expression: expression string
*/
function curve_expression($type,$x_only = true)
{
    switch ($type)
    {
        case 'absolute'://y=2|x| (y=a|x|)
        {
			if ($x_only)
			{
				return '2*abs(x)';
			}
			return '2*abs(x)-y';
        }
        case 'cubic'://y=x^3
        {
			if ($x_only)
			{
				return 'pow(x,3)';
			}
			return 'pow(x,3)-y';
        }
        case 'exponential'://y=2^x (y=a^x)
        {	
			if ($x_only)
			{
				return 'pow(2,x)';
			}
            return 'pow(2,x)-y';
        }
        case 'inverse_proportion'://y=1/x
        case 'rational'://y=1/x
        {
			if ($x_only)
			{
				return '1/x';
			}
            return '1/x-y';
        }
        case 'linear'://y=1.1x+0.5 (y=ax+b)
        {
			if ($x_only)
			{
				return '1.1*x+0.5';
			}
            return '1.1*x+0.5-y';
        }
        case 'logarithmic'://y=log(x)/log(a)
        {
			if ($x_only)
			{
				return 'log(x)/log(10)';
			}
            return 'log(x)/log(10)-y';
        }
        case 'quadratic'://y=x^2
        {
			if ($x_only)
			{
				return 'pow(x,2)';
			}
            return 'pow(x,2)-y';
        }

        case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
        {
			if ($x_only)
			{
				return 'sin(M_PI/2*x)';
			}
            return 'sin(M_PI/2*x)-y'
        }
        case 'square_root': //y=sqrt(x)
        {
			if ($x_only)
			{
				return 'sqrt(x)';
			}
            return 'sqrt(x)-y';
        }
        case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
        {
			if ($x_only)
			{
				return 'tan(M_PI/4*x)';
			}
            return 'tan(M_PI/4*x)-y';
        }
    }
}


/*
1. Function
    Compute curve label region
2. Input
    $curve: curve
    $label_size: label size
    $bounds: bounds
    $rotation: rotation
3. Output
    curve label region
*/
function curve_label_region($curve,$label_size,$bounds,$rotation)
{
    $rectangle_bounds = $bounds;
    $rectangle_bounds['rotation'] = 0;
    $curve_region_points = curve_points($curve,$bounds);
    $curve_region_points_size = sizeof($curve_region_points);
    $diagonal_half = rectangle_diagonal($label_size['x'],$label_size['y'])/2;
    $angle = M_atan2_polar($label_size['y'],$label_size['x']);
    $curve_label_region = [];
    $rectangle_margin = D_rectangle_size($label_size['x'],$label_size['y']);

    $angle_left_bottom = M_angle_polar($angle+$rotation);
    $angle_left_top = M_angle_polar(-$angle+$rotation);
    $angle_right_bottom = M_angle_polar(M_PI-$angle+$rotation);
    $angle_right_top = M_angle_polar(M_PI+$angle+$rotation);

	for ($i = 0; $i < $curve_region_points_size; $i++)
    {
        $center_left_bottom = M_addition($curve_region_points[$i],M_polar_to_cartesian([$diagonal_half,$angle_left_bottom]);
        $rectangle_left_bottom = D_rectangle_by_point($center_left_bottom,$rectangle_margin,$rotation);
        $is_contained_left_bottom = false;

        $center_left_top = M_addition($curve_region_points[$i],M_polar_to_cartesian([$diagonal_half,$angle_left_top],$keys_coord));
        $rectangle_left_top = D_rectangle_by_point($center_left_top,$rectangle_margin,$rotation);
        $is_contained_left_top = false;

        $center_right_bottom = M_addition($curve_region_points[$i],M_polar_to_cartesian([$diagonal_half,$angle_right_bottom],$keys_coord));
        $rectangle_right_bottom = D_rectangle_by_point($center_right_bottom,$rectangle_margin,$rotation);
        $is_contained_right_bottom = false;

        $center_right_top = M_addition($curve_region_points[$i],M_polar_to_cartesian([$diagonal_half,$angle_right_top],$keys_coord));
        $rectangle_right_top = D_rectangle_by_point($center_right_top,$rectangle_margin,$rotation);
        $is_contained_right_top = false;

        for ($j = 0; $j < $curve_region_points_size && $j != $i; $j++)
        {
            if (!$is_contained_left_bottom &&
                is_contained_rectangle_rectangle($rectangle_left_bottom,$rectangle_bounds) &&
                is_contained_point_rectangle($curve_region_points[$j],$rectangle_left_bottom))
            {
                $is_contained_left_bottom = true;
            }


            if (!$is_contaiend_left_top &&
                is_contained_rectangle_rectangle($rectangle_left_top,$rectangle_bounds) &&
                is_contained_point_rectangle($curve_region_points[$j],$rectangle_left_top))
            {
                $is_contaiend_left_top = true;
            }


            if (!$is_contained_right_bottom &&
                is_contained_rectangle_rectangle($rectangle_right_bottom,$rectangle_bounds) &&
                is_contained_point_rectangle($curve_region_points[$j],$rectangle_right_bottom))
            {
                $is_contained_right_bottom = true;
            }

            if (!$is_contained_right_top &&
                is_contained_rectangle_rectangle($rectangle_right_top,$rectangle_bounds) &&
                is_contained_point_rectangle($curve_region_points[$j],$rectangle_right_top))
            {
                $is_contained_right_top = true;
            }

            if ($is_contained_left_bottom && $is_contaiend_left_top && $is_contained_right_bottom && $is_contained_right_top)
            {
                break;
            }

        }

        if (!$is_contaiend_left_bottom)
        {
            $curve_label_region[] = $rectangle_left_bottom;
        }

        if (!$is_contaiend_left_top)
        {
            $curve_label_region[] = $rectangle_left_top;
        }

        if (!$is_contaiend_right_bottom)
        {
            $curve_label_region[] = $rectangle_right_bottom;
        }

        if (!$is_contaiend_right_top)
        {
            $curve_label_region[] = $rectangle_right_top;
        }
    }

    return sort_region($curve_label_region);
}


/*
1. Function
    Compute coordinates of point on a curve
2. Input
    $curve: curve
3. Output
    points coordinate
*/
function curve_points($curve,$bounds)
{
    $bounds = curve_bounds($curve,$bounds);
    $curve_points = [];

    if ($curve['interaction']['movable-mode'] == 'none')
    {
        $unit = 0.5;
		$equation = S_javascrpt_to_php($curve['equation']);
        $expression = S_equation_to_expression($equation);

        $points_size_x = ceil(($bounds['x']['max']-$bounds['x']['min'])/$unit);
        $points_size_y = ceil(($bounds['y']['max']-$bounds['y']['min'])/$unit);
        $curve_values = [];
        $curve_values[0] = [];
        $x = (string) $bounds['x']['min'];
        $y = (string) $bounds['y']['min'];
        $curve_value = str_replace('xy',$y,str_replace($'x',$x,$expression));
        eval('$curve_value='.$curve_value.';');
        $curve_values[0][0] = $curve_value;
        for ($i = 0; $i < $points_size_x; $i++)
        {
            $curve_values[$i] = [];
            $x_i = (string) $bounds['x']['min']+$i*$unit;
            $x_i1 = (string) $bounds['x']['min']+($i+1)*$unit;
            for ($j = 0; $j < $points_size_y; $j++)
            {

                $y_j = (string) $bounds['y']['min']+$j*$unit;
                $curve_value = str_replace('y',$y_j,str_replace('x',$x_i1,$expression));
                eval('$curve_value='.$curve_value.';');
                $curve_values[$i+1][$j] = $curve_value;
                $y_j1 = (string) $bounds[1][0]+($j+1)*$unit;
                $curve_value = str_replace('x',$y_j1,str_replace('x',$x_i,$expression));
                eval('$curve_value='.$curve_value.';');
                $curve_values[$i][$j+1] = $curve_value;
                if ($curve_values[$i][$j] == 0)
                {
                    $curve_points[] = D_point($bounds['x']['min']+$i*$unit,$bounds['x']['min']+$j*$unit);
                }
                else
                {
                    if ($curve_values[$i][$j]*$curve_values[$i+1][$j] < 0)
                    {
                        $a = abs($curve_values[$i+1][$j])/(abs($curve_values[$i][$j])+abs($curve_values[$i+1][$j]));
                        $b = abs($curve_values[$i][$j])/(abs($curve_values[$i][$j])+abs($curve_values[$i+1][$j]));
                        $curve_points[] = M_addition(M_multiplication_scalar($a,$curve_values[$i][$j]),M_multiplication_scalar($b,$curve_values[$i+1][$j]));

                    }
                    if ($curve_values[$i][$j]*$curve_values[$i][$j+1] < 0)
                    {
                        $a = abs($curve_values[$i][$j+1])/(abs($curve_values[$i][$j])+abs($curve_values[$i][$j+1]));
                        $b = abs($curve_values[$i][$j])/(abs($curve_values[$i][$j])+abs($curve_values[$i][$j+1]));
                        $curve_points[] = M_addition(M_multiplication_scalar($a,$curve_values[$i][$j]),M_multiplication_scalar($b,$curve_values[$i][$j+1]));
                    }
                }
            }
            if ($curve_values[$i][$points_size_y] == 0)
            {
                $curve_points[] = [$bounds['x']['min']+$i*$unit,$bounds['x']['min']+$points_size_y*$unit];
            }
            else
            {
                if ($curve_values[$i][$points_size_y]*$curve_values[$i+1][$points_size_y] < 0)
                {
                    $a = abs($curve_values[$i+1][$points_size_y])/(abs($curve_values[$i][$points_size_y])+abs($curve_values[$i+1][$points_size_y]));
                    $b = abs($curve_values[$i][$points_size_y])/(abs($curve_values[$i][$points_size_y])+abs($curve_values[$i+1][$points_size_y]));
                    $curve_points[] = M_addition(M_multiplication_scalar($a,$curve_values[$i][$points_size_y]),M_multiplication_scalar($b,$curve_values[$i+1][$points_size_y]));
                }
            }
        }
        for ($j = 0; $j < $points_size_y; $j++)
        {
            if ($curve_values[$points_size_x][$j] == 0)
            {
                $curve_points[] = [$bounds['x']['min']+$points_size_x*$unit,$bounds['x']['min']+$j*$unit];
            }
            else
            {
                if ($curve_values[$points_size_x][$j]*$curve_values[$points_size_x][$j+1] < 0)
                {
                    $a = abs($curve_values[$points_size_x][$j+1])/(abs($curve_values[$points_size_x][$j])+abs($curve_values[$points_size_x][$j+1]));
                    $b = abs($curve_values[$points_size_x][$j])/(abs($curve_values[$points_size_x][$j])+abs($curve_values[$points_size_x][$j+1]));
                    $curve_points[] = M_addition(M_multiplication_scalar($a,$curve_values[$points_size_x][$j]),M_multiplication_scalar($b,$curve_values[$points_size_x][$j+1]));
                }
            }
        }
        if ($curve_values[$points_size_x][$points_size_y] == 0)
        {
            $curve_points[] = [$bounds['x']['min']+$points_size_x*$unit,$bounds['x']['min']+$points_size_y*$unit];
        }


        return usort($curve_points,'usort_point_descending');
    }
    switch ($curve['interaction']['movable-mode'])
    {
        case 'absolute'://y=2|x| (y=a|x|)
        {
            $a = 2;
            $points_size = ceil(min($a*abs($bounds['x']['max']),$bounds['y']['max']));
            for ($i = 0; $i <= $points_size; $i++)
            {
                $curve_points[] = D_point($i/$a,$i);
                $curve_points[] = D_point(-$i/$a,$i);
            }
            break;
        }
        case 'cubic'://y=x^3
        {
            $points_size = ceil(min(pow($bounds['x']['max'],3),$bounds['y']['max']));
            for ($i = 0; $i <= $points_size; $i++)
            {
                $point = D_point(pow($i,1/3),$i);
                $curve_points[] = $point;
                $curve_points[] = D_point(-$point['x'],-$point['y']);

            }

            break;
        }
        case 'exponential'://y=2^x (y=a^x)
        {
            $a = 2;
            $points_size_negative = ceil(abs($bounds['x']['min']);
            for ($i = 0; $i <= $points_size_negative; $i++)
            {
                $curve_points[] = D_point(-$i,pow($a,-$i));
            }

            $points_size_positive = ceil($bounds['y']['max']);
            for ($i = 1; $i <= $points_size_positive; $i++)
            {
                $curve_points[] = D_point(log($i)/log($a),$i);
            }

            break;

        }
        case 'inverse_proportion'://y=1/x
        case 'rational'://y=1/x
        {
            $points_size_x = ceil($bounds['x']['max']);
            $points_size_y = ceil($bounds['y']['max']);
            for ($i = 1; $i <= $points_size_x; $i++);
            {
                $curve_points[] = D_point($i,1/$i);
                $curve_points[] = D_point(-$i,-1/$i);
            }
            for ($i = 0; $i <= $points_size_y; $i++)
            {
                $curve_points[] = D_point(1/$i,$i);
                $curve_points[] = D_point(-1/$i,$i);
            }
            break;

        }
        case 'linear'://y=1.1x+0.5 (y=ax+b)
        {
            $a = 1.1;
            $b = 0.5;
            $y_min = $a*$bounds['x']['min']+$b;
            if ($bounds['y']['min'] <= $y_min)
            {
                $point_min = D_point($bounds['x']['min'],$y_min]);
            }
            else
            {
                $point_min = D_point(($bounds['y']['min']-$b)/$a,$bounds['y']['min']);
            }
            $y_max = $a*$bounds['x']['max']+$b;
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $point_max = D_point(($bounds['y']['max']-$b)/$a,$bounds['y']['max']);
            }
            if ($a <= 1)
            {
                $index_min = floor($point_min['x']);
                $index_max = ceil($point_max['x']);
                for ($i = $index_min; $i <= $index_max; $i++)
                {
                    $curve_points[] = D_point($i,$a*$i+$b);
                }

            }
            else
            {
                $index_min = floor($point_min['y']);
                $index_max = ceil($point_max['y']);
                for ($i = $index_min; $i <= $index_max; $i++)
                {
                    $curve_points[] = D_point(($i-$b)/$a,$i);
                }
            }
             break;

        }
        case 'logarithmic'://y=log(x)/log(a)
        {
            $a = 2;
            $y_min = log($bounds['x']['min'])/log($a);
            $index_min = floor(max(log($bounds['x']['min'])/log($a),$bounds['y']['min']));
            $y_max = ;
            if (log($bounds['x']['max'])/log($a) <= $bounds['y']['max'])
            {
                $index_max = ceil($bounds['x']['max']);
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $index_max = ceil(pow($a,$bounds['y']['max']));
            }

            for ($i = $index_min; $i <= 0; $i++)
            {
                $curve_points[] = D_point(pow($a,$i),$i);
            }

            for ($i = 1; $i <= $index_max; $i++)
            {
                $curve_points[] = D_point($i,log($i)/log($a));

            }

            break;
        }
        case 'quadratic'://y=x^2
        {
            $y_max = pow($bounds['x']['max'],2);
            $points_number = ceil(min(pow($bounds['x']['max'],2),$bounds['y']['max']));
            for ($i = 0; $i <= $points_number; $i++)
            {
                $point = D_point($i,pow($i,2));
                $curve_points[] = $point;
                $curve_points[] = D_point(-$point['x'],$point['y']);
            }

            break;
        }

        case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
        {
            $a = M_PI/2;
            $period = 2*M_PI/$a;
            $points_number = 3
            $index_min = floor($bounds['x']['min']/$period);
            $index_max = ceil($bounds['x']['max']/$period);
            for ($i  = 0; $i <= $points_number; $i++)
            {
                for ($j = $index_min;$j < $index_max)
                {
                    $curve_points[] = D_point($i/2+$period*$j,sin($a*($i/2+$period*$j));
                }
            }
            break;
        }
        case 'square_root': //y=sqrt(x)
        {
            $index_max = ceil($bounds['x']['max']);
            for ($i = 0;$i <= $index_max; $i++)
            {
                $curve_points[] = D_point($i/2,sin($i/2));
            }
            break;
        }
        case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
        {
            $a = M_PI/4;
            $period = M_PI/$a;
            $index_min = floor($bounds['y']['min']);
            $index_max = ceil($bounds['y']['max']);
            $index_min_graph = floor($bounds['x']['min']/$period);
            $index_max_graph = ceil($bounds['x']['max']/$period);
            for ($i = $index_min; $i <= $index_max; $i++)
            {
                for ($j = $index_min_graph; $j <= $index_max_graph; $j++)
                {
                    $curve_points[] = D_point($i+$period*$j,tan($i+$period*$j));
                }
            }
            break;
        }
    }
    return usort($curve_points,'usort_point_descending');

}



/*
1. Function
    Compute region of curve
2. Input
   $curve: curve
   $bounds: bounds


3. Output
   curve region
*/
function curve_region($curve,$bounds)
{
    $bounds = curve_bounds($curve,$bounds);
    $curve_region = [];
	$rectangle_size = {'x':0.5,'y':0.5}
    if ($curve['interaction']['movable-mode'] == 'none')
    {
        $curve_equation = $curve['equation'];
        $equation = S_javascrpt_to_php($curve['equation']);
        $expression = S_equation_to_expression($equation);
        
		$rectangles_number = [];
        $rectangles_number['x'] = ceil($bounds['x']['max']-$bounds['x']['min'])/$rectangle_size['x'];
        $rectangles_number['y'] = ceil($bounds['y']['max']-$bounds['y']['min'])/$rectangle_size['y'];

        
        $xs = [];
        $xs[0] = $bounds['x']['min'];

        $ys = [];
        $ys[0] = $bounds['y']['min'];
        $ys[1] = $bounds['y']['max']+$rectangle_size['x'];

        $values_y = [];
        $values_y[0] = str_replace('y',$ys[0],$expression);
        $values_y[1] = str_replace('y',$ys[1],$expression);

        $signs = [];
        $signs[0] = [];
        $signs[0][0] = M_sign(eval(str_replace('x',$xs[0],$values_y[0]).';'));
        $signs[0][1] = M_sign(eval(str_replace('x',$xs[0],$values_y[1]).';'));

        for ($i_x = 1; $i_x <= $rectangles_number['x']; $i_x++)
        {

            $signs[$i_x] = [];
            $signs[$i_x][0] = M_sign(eval(str_replace('x',$xs[$i_x],$values_y[0])));
            $signs[$i_x][1] = M_sign(eval(str_replace('x',$xs[$i_x],$values_y[1])));
            if (abs($signs[$i_x-1][0]+$signs[$i_x-1][1]+$signs[$i_x][0]+$signs[$i_x][1]) < 4)
            {
				$bounds_x = 
				$bounds_y = ;
                $curve_region[] = D_rectangle(D_interval($xs[$i_x-1],$xs[$i_x]),D_interval($ys[0],[1]),0);
            }
        }
        for ($i_y = 2; $i_y <= $rectangles_number[1]; $i_y++)
        {
            $ys[$i_y] = $bounds['x']['min']+$i_y*$rectangle_size['x'];
            $values_y[$i_y] = str_replace('y',$ys[$i_y],$equation);
            for ($i_x = 1; $i_x <= $rectangles_number['x']; $i_x++)
            {
                $signs[$i_x][$i_y] = M_sign(eval(str_replace('x',$xs[$i_x],$values_y[$i_y])));
                if (abs($signs[$i_x-1][$i_y-1]+$signs[$i_x-1][$i_y]+$signs[$i_x][$i_y-1]+$signs[$i_x][$i_y]) < 4)
                {
					$curve_region[] = D_rectangle(D_interval($xs[$i_x-1],$xs[$i_x]),D_interval($ys[$i_y-1],$ys[$i_y]),0);
                }
            }
        }

        return $curve_region;
    }

    switch ($curve['interaction']['movable-mode'])
    {
        case 'absolute'://y=2|x| (y=a|x|)
        {
            $a = 2;
            $y_max = $a*abs($bounds['x']['max']);
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $point_max = D_point($bounds['y']['max']/2,$bounds['y']['max']);
            }
            $point_min = D_point(0,0);
            $angle = M_vector_angle($point_min,$point_max);
            $width_half = M_distance($point_min,$point_max);
            $center = segment_center([$point_min,$point_max]);
			
			$bounds_x = D_interval($center['x']-$width_half,$center['x']+$width_half);
			$bounds_y = D_interval($center['x'],$center['x'])
            $curve_region[] = D_rectangle($bounds_x,$bounds_y,$angle);
			
			$bounds_x = D_interval(-$center['x']-$width_half,-$center['x']+$width_half);
			$bounds_y = D_interval($center['y'],$center['y']);
            $curve_region[] = D_rectangle($bounds_x,$bounds_y,M_angle_polar(M_PI-$angle));
            return $curve_region;
        }
        case 'cubic'://y=x^3
        {
            $y_max = pow($bounds['x']['max'],3);
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $point_max = D_point(pow($bounds['y']['max'],1/3),$bounds['y']['max']);
            }
            $rectangles_number = ceil($point_max['y']);
            for ($i = 0; $i < $rectangles_number; $i++)
            {
                $start = D_point($i,pow($i,3));
                $end = D_point($i+1,pow($i+1,3));
                $point_tangent = [];
                $point_tangent['x'] = sqrt(tan(M_vector_angle($start,$end))/3);
                $point_tangent['y'] = pow($point_tangent['x'],3);
				$segment = D_segment($start,$end);
				$rectangle = D_rectangle_by_segment($segment,-M_distance_point_segment($point_tangent,$segment));
                $curve_region[] = $rectangle;
				
				$bounds_x = D_interval(-$rectangle['x']['max'],-$rectangle['x']['min']);
				$bounds_y = D_interval(-$rectangle['y']['max'],-$rectangle['y']['min']);
                $curve_region[] = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle['rotation']));
            }

            return $curve_region;
        }
        case 'exponential'://y=2^x (y=a^x)
        {
            $a = 2;
            $y_min = pow($a,$bounds['x']['min']);
            if ($bounds['y']['min'] <= $y_min)
            {
                $point_min = D_point($bounds['x']['min'],$y_min);
            }
            else
            {
                $point_min = D_point(log($bounds['y']['min'])/log($a),$bounds['y']['min']);
            }
            $y_max = pow($a,$bounds['x']['max'];
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $point_max = D_point(log($bounds['y']['max'])/log($a),$bounds['y']['max']);
            }
            $points = [];
            $points[0] = $point_min;
            $points[1] = D_point(-1,pow($a,-1));
            $points[2] = D_point(1,pow($a,1));
            $points[3] = $point_max;
            $points_size = sizeof($points);
            for ($i = 0; $i < $points_size; $i++)
            {
                $point_tangent = [];
                $point_tangent['x'] = log(tan(M_vector_angle($points[$i],$points[$i+1]))/log($a))/log($a);
                $point_tangent['y'] = pow($a,$point_tangent['x']);
				$segment = D_segment($points[$i],$points[$i+1]);
				$curve_region[] = D_rectangle_by_segment($segment,-M_distance_point_segment($point_tangent,$segment);
            }
            return $curve_region;

        }
        case 'inverse_proportion'://y=1/x
        case 'rational'://y=1/x
        {

            $point_min = D_point([$bounds['x']['max'],1/$bounds['x']['max']]);
            $point_max = D_point([1/$bounds['y']['max'],$bounds['y']['max']]);
            $points = [];
            $points[0] = $point_min;
            $points[1] = point([1,1]);
            $points[2] = $point_max;
            $points_size = sizeof($points);
            for ($i = 0; $i < $points_size; $i++)
            {
                $point_tangent = D_point(sqrt(-1/tan(M_vector_angle($points[$i],$points[$i+1]))),1/$point_tangent['x']);
                $rectangle = D_rectangle_by_segment(D_segment($start,$end),M_distance_point_segment($point_tangent,[$points[$i],$points[$i+1]]);
                $curve_region[] = $rectangle;
				
				$bounds_x = D_interval(-$rectangle['x']['max'],-$rectangle['x']['max']);
				$bounds_y = D_interval(-$rectangle['y']['max'],-$rectangle['y']['min']);
                $curve_region = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle['rotation']));
            }

            return $curve_region;

        }
        case 'linear'://y=1.1x+0.5 (y=ax+b)
        {
            $a = 1.1;
            $b = 0.5;
            $y_min = $a*$bounds['x']['min']+$b;
            if ($bounds['y']['min'] <= $y_min)
            {
                $start = D_point($bounds['x']['min'],$y_min);
            }
            else
            {
                $start = D_point(($bounds['y']['min']-$b)/$a,$bounds['y']['min']);
            }
            $y_max = $a*$bounds['x']['max']+$b;
            if ($y_max <= $bounds['y']['max'])
            {
                $end = D_point($bounds['y']['min'],$y_max);
            }
            else
            {
                $end = D_point(($bounds['y']['max']-$b)/$a,$bounds[1][1]);
            }
            return [rectangle_by_segment(D_segment($start,$end),0)];

        }
        case 'logarithmic'://y=log(x)/log(a)
        {
            $a = 2;
            $y_min = log($bounds['x']['min'])/log($a);
            if ($bounds['y']['min'] <= $y_min)
            {
                $point_min = D_point($bounds['x']['min'],$y_min);
            }
            else
            {
                $point_min = D_point(pow($a,$bounds['y']['min']),$bounds['y']['min']);
            }
            $y_max = log($bounds['x']['max'])/log($a);
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
            }
            else
            {
                $point_max = D_point(pow($a,$bounds['y']['max']),$bounds['y']['max']);
            }
            $points = [];
            $points[0] = $point_min;
            $points[1] = D_point(pow($a,-1),-1);
            $points[2] = D_point(2,log($a)/log(2));
            $points[3] = $point_max;
            $points_size = sizeof($points);
            for ($i = 0; $i < $points_size; $i++)
            {
                $point_tangent = D_point(sqrt(-1/tan(M_vector_angle($points[$i],$points[$i+1]))),log($point_tangent[0])/log($a));
				
				$segment = D_segment($points[$i],$points[$i+1]);
				$curve_region[] = D_rectangle_by_segment($segment,M_distance_point_segment($point_tangent,$segment));
            }

            return $curve_region;
        }
        case 'quadratic'://y=x^2
        {
            $y_max = pow($bounds['x']['max'],2);
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max)
            }
            else
            {
                $point_max = D_point(sqrt($bounds['y']['max']),$bounds['y']['max']);
            }

            $points = [];
            $points[0] = D_point(0,0);
            $points[1] = D_point(1,1);
            $points[2] = $point_max;
            $points_size = sizeof($points);
            for ($i = 0; $i < $points_size; $i++)
            {
                $point_tangent = [];
                $point_tangent['x'] = tan(M_vector_angle($points[$i],$points[$i+1]))/2;
                $point_tangent['y'] = pow($point_tangent['x'],2);
				
				$segment = D_segment($points[$i],$points[$i+1]);
				$rectangle = D_rectangle_by_segment($segment,-M_distance_point_segment($point_tangent,$segment));
                $curve_region[] = $rectangle;
				$bounds_x = D_interval(-$rectangle['x']['max'],-$rectangle['x']['min']);
				$bounds_y = D_interval($rectangle['y']['min'],$rectangle['y']['max']);
                $curve_region[] = D_rectangle($bounds_x,$bounds_y,M_angle_polar(M_PI-$rectangle['rotation']));
                $curve_region[] = $rectangle;
            }


            return $curve_region;
        }

        case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
        {
            $a = M_PI/2;
            $period_half = M_PI/$a;
            $period_half_numbers = ceil($bounds[0][1]/$period_half);

            $start = D_point(0,0);
            $end = D_point($period_half/2,1);
            $point_tangent = D_point(acos(tan(M_vector_angle($start,$end)/$a))/$a,sin($point_tangent[0]));
			$segment = D_segment($start,$end);
            $height = M_distance_point_segment($point_tangent,$segment);
            $rectangle = D_rectangle_by_segment($segment,pow(-1,$i)*$height);
            $curve_region[] = $rectangle;
			$bounds_x = D_interval(-$rectangle['x']['max'],-$rectangle['x']['min']);
			$bounds_y = D_interval(-$rectangle['y']['max'],-$rectangle['y']['min']);
            $rectangle = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle['rotation']));
            $curve_region[] = $rectangle;
            for ($i = 1; $i < $period_half_numbers; $i++)
            {
                $start['x'] += $period_half;
                $end['x'] += $period_half;
                $end['y'] *= -1;
                $rectangle = D_rectangle_by_segment(D_segment($start,$end),pow(-1,$i)*$height);
                $curve_region[] = $rectangle;
				$bounds_x = D_interval(-$rectangle['x']['max'],-$rectangle['x']['min']);
				$bounds_y = D_interval(-$rectangle['y']['max'],-$rectangle['y']['min']);
                $rectangle = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle['rotation']));
                $curve_region[] = $rectangle;
            }
            return $curve_region;
        }
        case 'square_root': //y=sqrt(x)
        {
            $y_max = sqrt($bounds['x']['max']);
            if ($y_max <= $bounds['y']['max'])
            {
                $point_max = D_point($bounds['x']['max'],$y_max);
			}
            else
            {
                $point_max = D_point(pow($bounds['y']['max'],2),$bounds['y']['max']);
            }
            $points = [];
            $points[0] = D_point(0,0);
            $points[1] = D_point(1,1);
            $points[2] = $point_max;
            $points_size = sizeof($points);
            for ($i = 0; $i < $points_size; $i++)
            {
                $point_tangent = D_point(pow(1/(2*tan(M_vector_angle($points[$i],$points[$i+1]))),2),sqrt($point_tangent['x']));
				$segment = D_segment($points[$i],$points[$i+1]);
                $height = M_distance_point_segment($point_tangent,$segment);
                $curve_region[] = D_rectangle_by_segment($segment,$height);

                $start = $end;

            }
            while ($start['x'] < $point_max['x'] && $start['y'] < $point_max['y']);

            return $curve_region;
        }
        case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
        {
            $a = M_PI/4;
            $period = M_PI/$a;
            $periods_number_half = ceil(($bounds['x']['max']-$bounds['x']['min'])/$period)/2;
            
			$start = D_point(0,0);
            $end = D_point(atan(2)/$a,2);
            $point_tangent = D_point(acos(1/sqrt(tan(M_vector_angle($start,$end)))),tan($a*$point_tangent['x']));
			$segment = D_segment($start,$end);
            
			$rectangle_11 = rectangle_by_segment($segment,-M_distance_point_segment($point_tangent,$segment));
            $curve_region[] = $rectangle_11;
            
			$bounds_x = D_interval(-$rectangle_11['x']['max'],-$rectangle_11['x']['min']);
			$bounds_y = D_interval(-$rectangle_11['y']['max'],-$rectangle_11['y']['min']);
			$rectangle_12 = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle_11['rotation']));
            $curve_region[] = $rectangle_12;
			
            $start = $end;
            $end = D_point(atan($bounds['y']['max'])/$a,$bounds['y']['max']);
            $point_tangent = D_point(acos(1/sqrt(tan(M_vector_angle($start,$end)))),tan($a*$point_tangent['x']);
			$segment = D_segment($start,$end);
			
			$rectangle_21 = D_rectangle_by_segment($segment,-M_distance_point_segment($point_tangent,$segment));
            $curve_region[] = $rectangle_21;
			
			$bounds_x = D_interval(-$rectangle_21['x']['max'],-$rectangle_21['x']['min']);
			$bounds_y = D_interval(-$rectangle_21['y']['max'],-$rectangle_21['y']['min']);
            $rectangle_22 = D_rectangle($bounds_x,$bounds_y,M_angle_polar(-$rectangle_21['rotation']));
            $curve_region[] = $rectangle_22;
            for ($i = 1; $i < $periods_number_half; $i++)
            {
					$bounds_x = D_interval($rectangle_11['x']['min']+$i*$period,$rectangle_11['x']['max']+$i*$period);
					$bounds_y = D_interval($rectangle_11['y']['min'],$rectangle_11['y']['max']);
                    $curve_region[] = D_rectangle($bounds_x,$bounds_y,$rectangle_11['rotation']);
                    
					$bounds_x = D_interval($rectangle_12['x']['min']-$i*$period,$rectangle_12['x']['max']-$i*$period);
					$bounds_y = D_interval($rectangle_12['y']['min'],$rectangle_12['y']['max']);
					$curve_region[] = D_rectangle($bounds_x,$bounds_y,$rectangle_12['rotation']);
					
					$bounds_x = D_interval($rectangle_21['x']['min']+$i*$period,$rectangle_21['x']['max']+$i*$period);
					$bounds_y = D_interval($rectangle_21['y']['min'],$rectangle_21['y']['max']);
					$curve_region[] = D_rectangle($bounds_x,$bounds_y,$rectangle_21['rotation']);
					
                    $bounds_x = D_interval($rectangle_22['x']['min']-$i*$period,$rectangle_22['x']['max']-$i*$period);
					$bounds_y = D_interval($rectangle_22['y']['min'],$rectangle_22['y']['max']);
					$curve_region[] = D_rectangle($bounds_x,$bounds_y,$rectangle_22['rotation']);
                   

            }
            return $curve_region;
        }







    }
    return $curve_region;

}



/*
1. 기능
   전체 object중에서 주어진 id를 가진 object를 찾아줌
2. 입력
   $id: 주어진 id
   $objects: 전체 object
3. 출력
   존쟤하는 경우: 주어진 id를 가진 object
   존재하지 않는 경우: false

*/
function &find_object($id,&$objects)
{
    foreach ($objects as &$object)
    {
        if ($id == object_id($object))
        {
            return $object;
        }
        $object_measure = &object_measure($object);
        if ($object_measure && $id == object_id($object_measure))
        {
            return $object_measure;
        }
    }
    return null;
}


/*
1. 기능
   segment와 object가 교차하는지 여부 계산
2. 앱력
   $segment: segment
   $object: object

3. 출력
   true: 교차함
   false: 교차하지 않음
*/

function is_crossing_segment_object($segment,$object)
{
    if (object_id($segment) != object_id($object))
    {
        $segment_data = segment_data($segment);
        $object_type = object_type($object);
        switch ($object_type)
        {
            case 'Segment2D':
            {
                return is_crossing_segment_segment(segment_data($object),$segment_data);
            }
            case 'Arc2D':
            {
                return is_crossing_arc_segment(arc_data($object),$segment_data);
            }
            case 'Face2D':
            {
                return is_crossing_face_segment(face_data($object),$segment_data);
            }
            case 'Path2D':
            {
                return is_crossing_path_segment(path_data($object),$segment_data);
            }
        }
    }

    return false;
}




/*
1. Function
   Check if a point is surrouned by segment measure
2. Input
   $point: point object
   $segments_measure: segments with measure
3. Output
   true: surrouned
   false: not surrounded
*/
function is_surrounded_by_segment_measures($point,$segments_measure)
{
    $segments_measure_size = sizeof($segment_measure);
    if ($segments_measure_size <= 1)
    {
        return false;
    }
    $point_data = point_data($point);
    for ($i = 0; $i < $segments_measure_size; $i++)
    {
        $segment_i_data = segment_data($segments_measure[$i]);
        if (is_contained_strictly_point_segment($point_data,$segment_i_data))
        {
            $segment_i_angle = vector_polar($segment_i_data['start'],$segment_i_data1['end']);
            $segment_i_measure_height_sign = M_sign(object_measure_height($segment));
            for ($j = $i+1; $j < $segments_measure_size; $j++)
            {
                $segment_j_data = segment_data($segments_measure[$j]);
                if (is_contained_strictly_point_segment($point_data,$segment_j_data))
                {
                    $segment_j_angle = vector_polar($segment_j_data['start'],$segment_j_data['end']);
                    if (is_equal_approximately_angle($segment_i_angle,$segment_j_angle) &&
                        $segment_i_measure_height_sign === M_sign(object_measure_height($segments_mreasure[$j])))
                    {
                        return true;
                    }
                    else if (is_equal_approximately_angle($segment_i_angle,$segment_j_angle+M_PI) &&
                             $segment_i_measure_height_sign === -M_sign(object_measure_height($segments_mreasure[$j])))
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;

}









function label_coord_change(&$label,$coord_new)
{
    $label['coords'] = $coord_new;
    $label['target'] = $coord_new;
}
/*
1. 기능
   Label의 size 계산
2. 입력
   $label: label (string)
   $scaling: scaling
   $label_margin: label margin
3. el
   label size
*/

/*
1. 기능
   Label이 형성하는 polygon을 둘러싸는 가장 작은 rectangle center 계산
2. 입력
   $vertices: polygon vertices
3. 출력
   center
*/
/*
function label_polygon_center($vertices)
{
	$x_min = 0;
	$x_max = 0;
	$y_min = 0;
	$y_max = 0;
	foreach ($vertices as $vertex)
	{
		$vertex = array_values($vertex);
		$x_min = min($x_min,$vertex[0]);
		$x_max = max($x_max,$vertex[0]);
		$y_min = min($y_min,$vertex[1]);
		$y_max = max($y_max,$vertex[1]);
	}
	
	return [($x_min+$x_max)/2,($y_min+$y_max)/2];
    
}



/*
1. 기능
   label의 size 계산
   
2. 입력
   $label: label
   $scaling: scaling
3. 출력
   label size
*/

function label_size($label,$scaling)
{
	
    //str_replace('\\degree','˚',$label);
    //str_replace('\\circ','˚',$label);
	$label_margin = {'x':0.2,'y':0.2};
    $height = 0.45;

    $lower_case = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    $number = ['1','2','3','4','5','6','7','8','9','0'];
    $upper_case = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    $scaling_standard = {'x':1,'y':1};


    $width_lower_case = 1/4;

    $width_number = 1/4;

    $width_upper_case = 2/7;

    $widths = [];
    $widths['`'] = 1/8;//` acute
    $widths['&'] = 2/5;// & ampersand
    $widths['@'] = 11/6;//@ ampersat
    $widths['<'] = 2/7;// < angle bracket open
    $widths['>'] = 2/7;// > angle bracket close
    $widths['*'] = 2/9;// * asterik
    $widths['|'] = 1/10;// | bar
    $widths['['] = 1/6;// [ bracket open
    $widths[']'] = 1/6;// ] bracket close
    $widths[':'] = 1/8;// : colon
    $widths[','] = 1/8;// , comma
    $widths['˚'] = 1/5;// ˚degree
    $widths['\''] = 1/5;// \' double quote
    $widths['='] = 4/7;// = equal
    $widths['!'] = 1/6;//! exclamation
    $widths['-'] = 3/8;// - minus
    $widths['('] = 1/6;// ( parenthesis open
    $widths[')'] = 1/6;// ) parenthesis close
    $widths['%'] = 2/5;// % percent
    $widths['.'] = 1/8;// . period
    $widths['+'] = 3/8;// + plus
    $widths['?'] = 2/9;//? question
    $widths[';'] = 1/7;// ; semicolon
    $widths['#'] = 1/4;//# sharp
    $widths["'"] = 1/8;// single quote
    $widths['/'] = 1/7;// / slash
    $widths['~'] = 1/4;// ~ tilde
    $widths[' '] = 0;// white space
	$widths['\\degree'] = 1/5;// ˚degree
    $widths['\\left|'] = 1/8;// \left|
	$widths['\\right|'] = 1/8;// \right|
    $widths['\\lceil'] = 1/5;// \lceil
    $widths['\\rceil'] = 1/5;// \rceil
    $widths['\\lfloor'] = 1/5:// \lfloor
    $widths['\\rfloor'] = 1/5:// \rfloor
    $widths['\\left\\{'] = 3/8;// \left\{
    $widths['\\right\\}'] = 3/8;// \right\}


    $label_array = str_split($label);
    $label_array_size = sizeof($label_array);
    $label_width = 0;
    $label_height = $height;
    $frac = '\\frac';
    $frac_length = strlen($frac);
    $frac_array = str_split($frac);
    $text = '\\text';
    $text_length = strlen($text);
    $text_array = str_split($text);
    for ($i = 0; $i < $label_array_size; $i++)
    {
        if (array_slice($label_array,$i,$frac_length) == $frac_array)
        {
            $key_0 = parenthesis_key($label_array,$i+$frac_length);
            $key_1 = parenthesis_key($label_array,$key_0+1);
            $string_0 = implode(array_slice($label_array,$i+$frac_length,$key_0-1-($i+$frac_length-1),false));
            $string_1 = implode(array_slice($label_array,$key_0+2,$key_1-1-($key_0+1),false));
            $string_0_size = label_size_text($string_0,$scaling_standard);
            $string_1_size = label_size_text($string_1,$scaling_standard);
            $label_width += max($string_0_size['x'],$string_1_size['x']);
            $label_height += max($label_height,$string_0_size['y']+$string_1_size['y']);
            $i = $key_1;
        }
        else if (array_slice($label_array,$i,$text_length) == $text_array)
        {
            $key = parenthesis_key($label_array,$i+$frac_length);
            $string = implode(array_slice($label_array,$i+$frac_length,$key-1-($i+$frac_length-1),false));
            $string_size = label_size_text($string,$scaling_standard);
            $label_width += $string_size['x'];
            $label_height += $string_size['y'];
            $i = $key;
        }
        else if (in_array($label_array[$i],$lower_case))
        {
            $label_width += $width_lower_case;
        }
        else if (in_array($label_array[$i],$number))
        {
            $label_width += $width_number;
        }
        else if (in_array($label_array[$i],$upper_case))
        {
            $label_width += $width_upper_case;
        }
        else
        {
            foreach ($widths as $symbol => $width)
            {
                if (array_slice($label_array,$i,strlen($symbol)) == str_split($symbol))
                {
                    $label_width += $width;
                    $i += strlen($symbol);
                }
            }
        }
    }

    $label_width += $label_margin['x'];
    $label_height += $label_margin['x'];


    return M_multiplication_entrywise($scaling,{'x':$label_width,'y':$label_height});
}
/*
1. 기능
   \\text{text}에서 text의 size 계산
   label의 type이 text인 경우
2. 입력
   $text: text
   $scaling: scaling
3. 출력
   text size
*/
function label_size_text($text,$scaling)
{
    $letters = str_split($text);

    $label_height = 0.45;

    $lower_case = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    $number = ['1','2','3','4','5','6','7','8','9','0'];
    $upper_case = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    $width_lower_case = 1/5;

    $width_number = 1/5;

    $width_upper_case = 1/3;

    $widths = [];
    $widths['`'] = 1/7;//` acute
    $widths['&'] = 1/3;// & ampersand
    $widths['@'] = 2/5;//@ ampersat
    //$widths['<'] = 2/7;// < angle bracket open
    //$widths['>'] = 2/7;// > angle bracket close
    $widths['*'] = 1/5;// * asterik
    $widths['|'] = 1/12;// | bar
    $widths['['] = 1/7;// [ bracket open
    $widths[']'] = 1/7;// ] bracket close
    $widths[':'] = 1/8;// : colon
    $widths[','] = 1/9;// , comma
    $widths['˚'] = 1/7;// ˚degree
    $widths['='] = 1/4;// = equal
    $widths['!'] = 1/7;//! exclamation
    $widths['-'] = 1/7;// - minus
    $widths['('] = 1/7;// ( parenthesis open
    $widths[')'] = 1/7;// ) parenthesis close
    $widths['%'] = 1/3;// % percent
    $widths['.'] = 1/9;//. period
    $widths['+'] = 1/4;// + plus
    $widths['?'] = 1/5;//? question
    $widths[';'] = 1/8;// ; semicolon
    $widths['#'] = 1/5;//# sharp
    $widths["'"] = 1/13; // ' single_quote
    $widths['/'] = 1/8; // / slash
    $widths['~']= 1/4; // ~ tilde

    $label_width = 0;
    foreach ($letters as $letter)
    {
        if (in_array($letter,$number))
        {
            $label_width += $width_number;
        }
        else if (in_array($letter,$lower_case))
        {
            $label_width += $width_lower_case;
        }
        else if (in_array($letter,$upper_case))
        {
            $label_width += $width_upper_case;
        }
        else
        {
            foreach ($widths as $key => $width)
            {
                if ($letter == $key)
                {
                    $label_width += $width;
                }
            }

        }
    }

    return M_multiplication_entrywise($scaling,{'x':$label_width,'y':$label_height});
}



/*
1. 기능
   measure가 속해 있는 object를 찾음
2. 입력
   $measure: measure
   $objects: 전체 objects
3. 출력
   measure가 속해있는 object
*//*

function measured_object($measure,$objects)
{
    foreach ($objects as $object)
    {
        $object_type = object_type($object);
        if (in_array($object_type,['Segment2D','Arc2D']) && object_id($measure) == object_id(object_measure($object)))
        {
            return $object;
        }
    }
    return null;
}




/*
1. Function
   Change measure height of object
2. Input
   $object: object (arc or segment)
   $height_new: new height
3. Output
   Measure height changed segment
*/
function object_measure_height_change(&$object,$height_new)
{
    $object['measure']['style']['height'] = $height_new;
}


/*
1. Function
   Return marker of object measure
2. Input
   $object: object (arc or segment)
3. Output
   marker of object measure
*/
function object_measure_marker($object)
{
    return $object['measure']['style']['marker'];
}


/*
1. Function
    Compute region of an object
2. Input
    $object: object
    $bounds: bounds
    $rectangle_margin: ranges
    $keys_coord: keys of coord
3. Output
    region array
*/
function object_region($object,$bounds)
{
	$rectangle_margin = {'x':0.25,'y':0.25}
    switch (object_type($object))
    {
        case 'Arc2D':
        {
            $arc_data = arc_data($object);
            $rectangles_number = ceil($arc_data['angle']/M_PI/6);
            $angle = $arc_data['angle']/$rectangles_number;
            $radius_arc = M_distance($arc_data['center'],$arc_data['start']);
            $radius_arc_measure = $radius_arc+object_measure_height($object);
            $distance_arc_measure = $radius_arc_measure/cos($angle/2);
            $arc_measure_type = object_measure_type($object);
            $start = $arc_data['center'];
            $rectangle_height = $radius_arc*(1-cos($angle/2));
            $rectangle_height_measure = $radius_arc_measure-$radius_arc*cos($angle/2));
			$region = [];
            for ($i = 1; $i <= $rectangles_number; $i++)
            {
                if ($arc_measure_type != 'MeasureArc2D')
                {
                    $end = M_rotation($start,$i*$angle,$arc_data['center']);
                    $region[] = rectangle_by_segment([$start,$end],-$rectangle_height);
                }
                else
                {
                    $start_measure = M_addition($arc_data['center'],polar_to_cartesian([$distance_arc_measure,M_vector_angle($arc_data['center'],$start)]));
                    $end_measure = M_rotation($start_measure,$i*$angle,$arc_data['center']);
                    $region[] = D_rectangle_by_segment([$start_measure,$end_measure],-$rectangle_height_measure);
                }
                $start = $end;
            }
            return $region;

        }
        case 'Angle2D': //height가 작다고 가정
        {
            $angle_data = angle_data($object);
            $angle_angle = angle_angle($angle_data);
            if (!angle_right_angle($angle))
            {
                if (0 <= $angle_angle && $angle_angle <= M_PI/2)
                {
                    $region[] = D_rectangle(D_segment([$angle_data['center'],$angle_data['start']],-$angle_data['height_actual']*sin($angle_angle));
                }
                else if (M_PI/2 < $angle_angle && $angle_angle <= M_PI)
                {
                    $end = M_addition($angle_data['center'],M_multiplication_scalar(cos($angle_angle)*$angle_data['height_actual'],M_subtraction($angle_data['start'],$angle_data['center'])));
                    $region[] = D_rectangle_by_segment(D_segment($angle_data['start'],$end),-$angle_data['height_actual']);
                }
                else if (M_PI < $angle_angle && $angle_angle <= 3*M_PI/2)
                {
                    $end = M_addition($angle_data['center'],M_multiplication_scalar(-1,M_subtraction($angle_data['start'],$angle_data['center'])));
                    $segment = D_segment($angle_data['center'],$end);
					$region[] = rectangle_by_segment($segment,-$angle_data['height_actual']);
                    $region[] = rectangle_by_segment($segment,$angle_data['height_actual']*sin($angle_angle-M_PI));
                }
                else
                {
                    $end = M_addition($angle_data['center'],M_multiplication_scalar(-1,M_subtraction($angle_data['start'],$angle_data['center'])));
                    $region[] = D_rectangle_by_segment(D_segment($angle_data['start'],$end),-$angle_data['height_actual']);
                    $start =  = M_addition($angle_data['center'],M_multiplication_scalar(cos($angle_angle)*$angle_data[3],M_subtraction($end,$angle_data['center'])));
                    $region[] = D_rectangle_by_segment(D_segment($start,$end),$angle_data['height_actual']);
                }


            }
            else
            {
                if (0 <= $angle_angle && $angle_angle <= M_PI/2)
                {
                    $end = M_polar_to_cartesian([$angle_data['height_actual']*cos($angle_angle/2),M_vector_angle($angle_data['center'],$angle_data['start'])]);
                    $region[] = D_rectangle_by_segment(D_segment($angle_data['center'],$end),-$angle_data['height_actual']*sin($angle_angle));
                }
                else if (M_PI/2 < $angle_angle && $angle_angle <= M_PI)
                {
                    $start = M_addition($angle_data['center'],M_multiplication_scalar(cos($angle_angle)*angle_height($angle),M_subtraction($angle_data['start'],$angle_data['center'])));
                    $region[] = D_rectangle_by_segment(D_segment($start,$angle_data['start']),sin($angle_angle)*angle_height($angle));
                }
                else if (M_PI < $angle_angle && $angle_angle <= 3*M_PI/2)
                {
                    $start = M_addition($angle_data['center'],M_multiplication_scalar(cos($angle_angle)*angle_height($angle),M_subtraction($angle_data['start'],$angle_data['center'])));
                    $region[] = D_rectangle_by_segment(D_segment($start,$angle_data['start']),sin($angle_angle)*angle_height($angle));

                }
                else
                {
                    $end = M_polar_to_cartesian([$angle_data['height_actual']*cos($angle_angle/2),M_vector_angle($angle_data['center'],$angle_data['start'])]);
                    $region[] = D_rectangle_by_segment(D_segment($angle_data['center'],$end),-$angle_data['height_actual']*sin($angle_angle));

                }
            }

            return $region;
        }
        case 'Axis2D':
        {

			$region = [];
			$region[] = D_rectangle(D_interval($bounds['x']['min'],$bounds['x']['max']),D_interval(0,0),0);
			$region[] = D_rectangle(D_interval(0,0),D_interval($bounds['y']['min'],$bounds['y']['max'],0);
			return $region;

        }
        case 'Curve2D':
        {
            return curve_region($curve,$bounds);
        }
        case 'Face2D':
        {
            $face_data = face_data($object);
            $face_data_size = sizeof($face_data);
            array_push($face_data,$face_data[0]);
            for ($i = 0; $i < $face_data_size; $i++)
            {
                $region[] = rectangle_by_segment(D_segment($face_data[$i],$face_data[$i+1]),0);

            }
            return $region;

        }
        case 'Grid2D':
        {
            $unit = [$object['labels']['unit']['x'],$object['labels']['unit']['y']];
            $margin = 0.25;
            if ($unit[0])
            {
                $index_min = ceil($bounds['x']['min']/$unit[0]);
                $index_max = floor($bounds['x']['max']/$unit[0]);
                $bounds_y = D_interval(-2*$margin,0);
                for ($i = $index_min; $i <= $index_max; $i++)
                {
                    $region[] = D_rectangle(D_interval($i*$unit[0]-$margin,$i*$unit[0]+$margin),$bounds_y,0);
                }
            }
            if ($unit[1])
            {
                $index_min = ceil($bounds['y']['min']/$unit[1]);
                $index_max = floor($bounds['y']['max']/$unit[1]);
                $bounds_x = D_interval(-2*$margin,0);
                for ($i = $index_min; $i <= $index_max; $i++)
                {
                    $region[] = D_rectangle($bounds_x,D_interval($i*$unit[0]-$margin,$i*$unit[0]+$margin),0);
                }
            }

        }
        case 'Path2D':
        {
            $path_data = path_data($object);
            $path_data_size = sizeof($path_data);
            $region = [];
            for ($i = 0; $i < $path_data_size-1; $i++)
            {
                $region[] = D_rectangle_by_segment(D_segment($path_data[$i],$path_data[$i+1]),0);

            }
            return $region;
        }
        case 'Point2D':
        {
            $point_data = point_data($object);
            return D_rectangle(D_interval($point_data['x'],$point_data['x']),D_interval($point_data['y'],$point_data['y']),0);
		}
        case 'Segment2D':
        {


            if (object_measure_type($object) == 'Measure2D')
            {
                $segment_measure_height = object_measure_height($object);
            }
            else
            {
                $segment_measure_height = 0;
            }

			$segment_data = segment_data($object);
            $region[] = D_rectangle_by_segment(D_segment($segment_data['start'],$segment_data['end']),$segment_measure_height);

            return $region;
        }
    }

}














/*
1. 기능
   segment를 crossing하는 object들의 방향의 종류 계산 (left, right만 확인)
2. 입력
   segment
   objects: 전체 object
3. 출력 (start -> end 방향을 기준으로 함)
   none
   left
   right
   both
*/
function segment_arm_direction($segment,$objects)
{
    $left_number = 0;
    $right_number = 0;

    $segment_data = segment_data($segment);
    $segment_angle = M_vector_angle($segment_data[0],$segment_data[1]);
    foreach ($objects as $object)
    {
        if (object_id($segment) != object_id($object))
        {
            if (is_crossing_segment_object($segment,$object))
            {
                return null;
            }
            $object_type = object_type($object);
            switch ($object_type)
            {
                case 'Segment2D':
                {
                    $segment_1_data = segment_data($object);
                    if (!is_parallel_segment_segment($segment_data,$segment_1_data))
                    {
                        if (is_contained_strictly_point_segment($segment_1_data['end'],$segment_data))
                        {
                            $angle_difference = M_angle_polar(M_vector_angle($segment_1_data['start'],$segment_1_data['end'])-$segment_angle);

                            if (0 < $angle_difference && $angle_difference < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                            {
                                ++$right_number;
                            }
                        }

                        if (is_contained_strictly_point_segment($segment_1_data['end'],$segment_data))
                        {
                            $angle_difference = M_angle_polar(M_vector_angle($segment_1_data['end'],$segment_1_data['star'])-$segment_angle);

                            if (0 < $angle_difference && $angle_difference < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                            {
                                ++$right_number;
                            }
                        }
                    }
                    if ($left_number && $right_number)
                    {
                        return null;
                    }
                    break;
                }
                case 'Arc2D':
                {
                    $arc_data = arc_data($object);
                    $intersection_points = intersections_arc_segment($arc_data,$segment_data);

                    if (sizeof($intersection_points) == 1)
                    {
                        if (!is_equal_approximately($intersection_points[0],$segment_data['start']) &&
                            !is_equal_approximately($intersection_points[0],$segment_data['end']))
                        {
                            if (is_tangent_arc_segment($arc_data,$segment_data))
                            {
                                $angle_difference = M_angle_polar(M_vector_angle($intersection_points[0],$arc_data['center'])-$segment_angle);

                                if (0 < $angle_difference && $angle_difference < M_PI)
                                {
                                    ++$left_number;
                                }
                                else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                                {
                                    ++$right_number;
                                }
                            }
                            else
                            {
                                $arc_end = arc_end($arc_data);
                                if (is_equal_approximately($intersection_points[0],$arc_data['start']))
                                {
                                    $angle_difference = M_angle_polar(M_angle_polar(M_vector_angle($arc_data['center'],$intersection_points[0])+M_PI/2)-$segment_angle);

                                    if (0 < $angle_difference && $angle_difference < M_PI)
                                    {
                                        ++$left_number;
                                    }
                                    else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                                    {
                                        ++$right_number;
                                    }
                                }
                                else if (is_equal_approximately($intersection_points[0],$arc_end))
                                {
                                    $angle_difference = M_angle_polar(M_angle_polar(M_vector_angle($arc_data['star'],$intersection_points[0])-M_PI/2)-$segment_angle);

                                    if (0 < $angle_difference && $angle_difference < M_PI)
                                    {
                                        ++$left_number;
                                    }
                                    else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                                    {
                                        ++$right_number;
                                    }
                                }
                            }
                        }
                    }
                    if ($left_number && $right_number)
                    {
                        return null;
                    }
                    break;
                }
                case 'Path2D':
                {
                    $path_data = path_data($object);;
                    $path_data_size = sizeof($path_data);
                    if (is_contained_strictly_point_segment($path_data[0],$segment_data))
                    {
                        $angle_difference = M_angle_polar($segment_angle-M_vector_angle($segment_data[0],$path_data[1]));
                        if (0 < $angle_difference && $angle_difference < M_PI)
                        {
                            ++$left_number;
                        }
                        else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                        {
                            ++$right_number;
                        }
                    }
                    if ($left_number && $right_number)
                    {
                            return null;
                    }
                    for ($i = 1; $i <= $path_data_size-2; $i++)
                    {
                        if (is_contained_strictly_point_segment($path_data[$i],$segment_data))
                        {
                            $angle_difference_1 = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$path_data[$i-1]));
                            $angle_difference_2 = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$path_data[$i+1]));
                            if (0 < $angle_difference_1 && $angle_difference_1 < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference_1 && $angle_difference_1 < 2*M_PI)
                            {
                                ++$right_number;
                            }

                            if (0 < $angle_difference_2 && $angle_difference_2 < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference_2 && $angle_difference_2 < 2*M_PI)
                            {
                                ++$right_number;
                            }

                            if ($left_number && $right_number)
                            {
                               return null;
                            }
                        }
                    }
                    if (is_contained_strictly_point_segment($path_data[$path_data_size-1],$segment_data))
                    {
                        $angle_difference = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$path_data[$path_data_size-2]));
                        if (0 < $angle_difference && $angle_difference < M_PI)
                        {
                            ++$left_number;
                        }
                        else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                        {
                            ++$right_number;
                        }
                    }
                    if ($left_number && $right_number)
                    {
                        return null;
                    }
                    break;
                }
                case 'Face2D':
                {
                    $face_data = face_data($object);
                    $face_data_size = sizeof($face_data);
                    array_push($face_data,$face_data[0]);
                    if (is_contained_strictly_point_segment($face_data[0],$segment_data))
                    {
                        $angle_difference = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$face_data['end']));
                        if (0 < $angle_difference && $angle_difference < M_PI)
                        {
                            ++$left_number;
                        }
                        else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                        {
                            ++$right_number;
                        }
                    }
                    for ($i = 1; $i <= $face_data_size-2; $i++)
                    {
                        if (is_contained_strictly_point_segment($face_data[$i],$segment_data))
                        {
                            $angle_difference_1 = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$face_data[$i-1]))
                            $angle_difference_2 = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$face_data[$i+1]))
                            if (0 < $angle_difference_1 && $angle_difference_1 < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference_1 && $angle_difference_1 < 2*M_PI)
                            {
                                ++$right_number;
                            }
                            if (0 < $angle_difference_2 && $angle_difference_2 < M_PI)
                            {
                                ++$left_number;
                            }
                            else if (M_PI < $angle_difference_2 && $angle_difference_2 < 2*M_PI)
                            {
                                ++$right_number;
                            }

                            if ($left_number && $right_number)
                            {
                                return null;
                            }
                        }
                    }
                    if ($left_number && $right_number)
                    {
                        return null;
                    }
                    if (is_contained_strictly_point_segment($face_data[$face_data_size-1],$segment_data))
                    {
                        $angle_difference = M_angle_polar($segment_angle-M_vector_angle($segment_data['start'],$face_data[$face_data_size-2]))
                        if (0 < $angle_difference && $angle_difference < M_PI)
                        {
                            ++$left_number;
                        }
                        else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                        {
                            ++$right_number;
                        }
                    }
                    if ($left_number && $right_number)
                    {
                        return null;
                    }
                    break;
                }
            }
        }
    }

    if (!$left_number && $right_number)
    {
        return 'right';
    }
    else if ($left_number && !$right_number)
    {
        return 'left';
    }
    /*
    else if ($left_number && $right_number)
    {
        return 'both';
    }
      */

    return null;
}



















/*
1. 기능
   point를 포함하는 segment들 중에서 measure가 visible인 segment들의 방향의 갯수 계산
2. 입력
   point
   segments 또는 segments_measure
3. 출력
   방향의 갯수
*/
function segments_measure_direction_number($point,$segments)
{
    $segment_measure_type = 'Mesasure2D';

    $segments_measure = [];
    $point_data = point_data($point);
    foreach ($segments as $segment)
    {
        if (object_measure_type($segment) == $segment_measure_type &&
            is_contained_strictly_point_segment($point_data,segment_data($segment)))
        {
            $segments_measure[] = $segment;
        }
    }

    $segments_measure_direction_number = 0;

    if ($segments_measure)
    {
        ++$segments_measure_direction_number;
        $segments_measure_size = sizeof($segments_measure);


        for ($i = 0; $i < $segments_measure_size; $i++)
        {
            if (object_measure_type($segments_measure[$i]) == $segment_measure_type)
            {
                $segment_i_data = segment_data($segments_measure[$i]);
                $segment_i_angle = M_vector_angle($segment_i_data['start'],$segment_i_data['end']);
                $segment_i_measure_sign = M_sign(object_measure_height($segments_measure[$i]));
                $different_direction_number = 0;

                for ($j = 0; $j < $i; $j++)
                {
                    if (object_measure_type($segments_measure[$j]) == $segment_measure_type)
                    {
                        $segment_j_data = segment_data($segments_measure[$j]);
                        $segment_j_angle = M_vector_angle($segment_j_data['start'],$segment_j_data['end']);
                        $segment_j_measure_sign = M_sign(object_measure_height($segments_measure[$j]));

                        if ((!M_is_equal_approximately_angle($segment_i_angle,$segment_j_angle) &&
                             !M_is_equal_approximately_angle($segment_i_angle-$segment_j_angle,M_PI) ||
                            (M_is_equal_approximately_angle($segment_i_angle,$segment_j_angle) &&
                             $segment_i_measure_sign != $segment_j_measure_sign) ||
                            (M_is_equal_approximately_angle($segment_i_angle-$segment_j_angle,M_PI) &&
                             $segment_i_measure_sign == $segment_j_measure_sign))
                        {
                            ++$different_direction_number;
                        }
                    }
                }

                if ($different_direction_number == $i-1)
                {
                    ++$segments_measure_direction_number;
                }
            }
        }
    }

    return $segments_measure_direction_number;
}

function segment_swap_start_end(&$segment)
{
    P_swap($segment['coord']['start'],$segment['coord']['end']);
    if (object_measure_type($segment) == 'Mesasure2D') // 규칙 2
    {
        P_swap($segment['measure']['style']['arrow']['start'],$segment['measure']['style']['arrow']['end']);
    }
}


/*
1. 기능
   두 Segmnents가 교점을 가질 경우 union을 구해줌
2. 입력
   segment_1: Segment
   segment_2: Segment
3. 출력
   교점이 있을 경우: union된 Segment
   교점이 없을 경우: null
*/
function segments_union($segment_1,$segment_2)
{
    $segment_1_data = segment_data($segment_1);
    $segment_2_data = segment_data($segment_2);
    if (is_overlap_segment_segment($segment_1_data,$segment_2_data))
    {
        if (is_contained_segment_segment($segment_1_data,$segment_2_data))
        {
            return $segment_2;
        }
        if (is_contained_segment_segment($segment_2_data,$segment_1_data))
        {
            return $segment_1;
        }

        if (M_is_equal_approximately_angle(abs(M_vector_angle($segment_1_data['start'],$segment_2_data['start'])-M_vector_angle($segment_1_data['start'],$segment_2_data['end'])),M_PI)) 
        {
            $segments_union = $segment_1;
            $segments_union['coords']['start'] = $segment_2_data['start'];
            $segments_union['measure']['coords']['start'] = object_start(object_measure($segment_2));
            $segments_union['startPoint'] = $segment_2['startPoint'];
        }
        else if (M_is_equal_approximately_angle(abs(M_vector_angle($segment_1_data['end'],$segment_2_data['start'])-M_vector_angle($segment_1_data['end'],$segment_2_data['end'])),M_PI))
        {
            $segments_union = $segment_2;
            $segments_union['coords']['start'] = $segment_1_data['start'];
            $segments_union['measure']['coords']['start'] = object_start(object_measure($segment_1));
            $segments_union['startPoint'] = $segment_1['startPoint'];
        }


        $segments_union['id'] = object_id($segment_1).object_id($segment_2);
        $segments_union['style']['dash'] = false;
        $segments_union['style']['marker1'] = 'none';
        $segments_union['style']['marker2'] = 'none';
        $segments_union['style']['marker2'] = 'none';
        $segments_union['label']['content'] = '';
        $segments_union['measure']['type'] == 'Blank';

        return $segments_union;

    }

    return null;
}



