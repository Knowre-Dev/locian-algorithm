<?php




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
수학 함수
*/




/*
1. 기능
   acos(number)를 계산해서 polar각으로 변환
2. 입력
   number
3. 출력
   atan(number)의 polar angle
*/
function M_acos_polar($number)
{
    return M_angle_polar(acos($number));
}

/*



/*
1. 기능
   점의 합 계산
2. 입력
   point_1,point_2,...
3. 출력
   point_1+point_2+
*/

function M_addition()
{
    $points = func_get_args();
    $points_size = func_num_args();

    $result = $points[0];
    for ($i = 1; $i < $points_size; $i++)
    {
        foreach ($points[$i] as $key => $value)
        {
            $result[$key] += $value;
            ++$key;
        }
    }
    return $result;
}



/*
1. 기능
   두 점의 affine sum 계산
2. 입력
   t: 상수
   point_1,point_2
3. 출력
   t*point_1+(1-t)*point_2
*/
function M_affine_sum($t,$point_1,$point_2)
{
   return M_addition(M_multiplication_scalar($t,$point_1),M_multiplication_scalar(1-$t,$point_2));
}






/*
1. Function
    Compute inclucded angle of two angles
2. Input
    $angle_1: angle of line_1
    $angle_2: angle of line_2
3. Output
    Included angle
*/

function M_angle_included($angle_1,$angle_2)
{
    $angle_included = M_angle_polar($angle_1-$angle_2);
    if ($angle_included <= M_PI)
    {
        return $angle_included;
    }
    return 2*M_PI - $angle_included;
}

/*
1. 기능
   angle들을 크기순으로 나열한 후 최대 사이각의 중간값 출력
2. 입력
   angles: angle들
3. 출력
   쵀대 사이각의 중간값-위오른쪽에 위치한 각을 우선으로 선택
*//*
function angle_mid_max($angles)
{
    $angles_size = sizeof($angles);

    if ($angles_size == 1)
    {
        return M_angle_polar($angles[0]+M_PI);
    }

    if ($angles_size >= 2)
    {
        sort($angles,SORT_NUMERIC);
        $angles[] = $angles[0];
        $angles_differecne = [];
        $angles_mid = [];
        $angles_position = [];
        $error = 0.1;


        for ($i = 0; $i < $angles_size; $i++)
        {
            $angles_difference[$i] = M_angle_polar($angles[$i+1]-$angles[$i]);
            $angles_mid[$i] = M_angle_polar($angles[$i]+$angles_difference[$i]/2);
            $angles_position[$i] = polar_to_cartesian([1,$angles_mid[$i]]);
        }

        $angles_difference_max = max($angles_difference);
        $angle_position = [0,-2];
        for ($i = 0; $i < $angles_size; $i++)
        {
            if (is_equal_approximately_angle($angles_difference[$i],$angles_difference_max))
            {
                if ($angles_position[$i][1] > $angle_position[1]+$error)
                {
                    $angle_position = $angles_position[$i];
                    $result = $angles_mid[$i];
                }
                else if (is_equal_approximately_angle($angles_position[$i][1],$angle_position[1]) && $angles_position[$i][0] > $angle_position[0]+$error)
                {
                    $angle_position = $angles_position[$i];
                    $result = $angles_mid[$i];
                }
            }
        }

        return $result;
    }
    return null;

}

/*
1. 기능
   각을 polar coordinate의 각으로 변환
2. 입력
   angle
3. 출력
   polar coordinate의 각으로 변형된 각
*/
function M_angle_polar($angle)
{
    return $angle-2*M_PI*floor($angle/(2*M_PI));
}



/*
1. Function
   Compute complement of angle intervals
2. Input
   $angle_intervals: angle intervals (unionized)
3. Output
   angle intervals complement
*/
function M_angle_intervals_complement($angle_intervals)
{
    $angle_intervals_size = sizeof($angle_intervals);
    if ($angle_intervals_size === 1)
    {
        return [M_angle_polar(array_sum($angle_intervals[0]),2*M_PI-$angle_intervals[0][1]];
    }
    $angle_intervals = M_angle_intervals_union($angle_intervals);
    $angle_intervals_size = array_push($angle_intervals,$angle_intervals[0])
    $angle_intervals_complement = [];
    for ($i = 0; $i < $angle_intervals_size; $i++)
    {
        $angle_start = M_angle_polar(array_sum($angle_intervals[$i]));
        $angle_intervals_complement[] = [$angle_start,M_angle_polar($angle_intervals[$i+1][0]-$angle_start)];
    }

    return $angle_intervals_complement;
}

/*
1. Function
   Compute angle interval which has maximum intervals size
2. Input
   $angle_intervals: angle intervals
3. Output
   maximum interval
*/
function M_angle_intervals_max($angle_intervals)
{
    $angle_intervals_size = sizeof($angle_intervals);
    if ($angle_intervals_size === 1)
    {
        return $angle_intervals[0];
    }
    usort($angle_intervals,'usort_array_ascending');
    $angle_intervals_max = $angle_intervals[0];
    for ($i = 1; $i < $angle_intervals_size; $i++)
    {
        if ($angle_intervals[$i][1] > $angle_intervals_max[1])
        {
            $angle_intervals_max = $angle_intervals[$i];

        }
    }
    return $angle_intervals_max;
}

/*
1. Function
   Unionize angle intervals, that is, unionize overlaping intervals
2. Input
   $angle_intervals: angle interval array
3. Output
   Unionized angle intervals
*/
function M_angle_intervals_union($angle_intervals)
{
    $angle_intervals_size = sizeof($angle_intervals);
    if ($angle_intervals_size === 1)
    {
        return $angle_intervals;
    }
    usort($angle_intervals,'usort_array_ascending');
    $angle_intervals_unionized = [$angle_intervals[0]];
    array_push($angle_intervals,$angle_intervals[0]);
    for ($i = 1; $i <= $angle_intervals_size; $i++)
    {
        $index_last = sizeof($angle_intervals_unionized)-1;
        $angle_intervals_unionized_last_sum = array_sum($angle_intervals_unionized[$index_last]);
        if ($angles_intervals[$i][0] <= $angle_intervals_unionized_last_sum)
        {
            $angle_intervals_i_sum = array_sum($angle_intervals[$i]);

            $angle_intervals_unionized[$index_last][1] = M_angle_polar(max($angle_intervals_unionized_last_sum,array_sum($angle_intervals[$i]))
                                                         -$angle_intervals_unionized[$index_last][0]);
        }
        else
        {
           $angle_intervals_unionized[] = $angle_intervals[$i];
        }
    }
    return $angle_intervals_unionized;
}




/*
1. 기능
   array_unique에 is_equal_approximately 적용
2. 입력
   array
3. 출력
   array_unique된 array
*//*
function array_unique_approximately($array,$error = 0.1)
{
    $array_size = sizeof($array);
    $result = [];

    for ($i = 0; $i < $array_size; $i++)
    {
        for ($j = 0; $j < $i; $j++)
        {
            if (M_is_equal_approximately($array[$i],$array[$j],$error))
            {
                break;
            }
        }
        $result[] = $array[$i];
    }
    return $result;
}



/*
1. 기능
   asin(number)를 계산해서 polar각으로 변환
2. 입력
   number
3. 출력
   asin(number)의 polar angle
*/
function M_asin_polar($number)
{
    return M_angle_polar(asin($number));
}





/*
1. 기능
   atan2(number)를 계산해서 polar각으로 변환
2. 입력
   number
3. 출력
   number의 polar angle
*/
function M_atan2_polar($y,$x)
{
    return M_angle_polar(atan2($y,$x));
}

/*
1. 기능
   cartesian coord를 polar coord로 변형
2. 입력
   $point: cartesian coord point
3. 출력
   polar coord
*/
function M_cartesian_to_polar($point)
{
	$point = array_values($point);$
	$radius = sqrt(pow($point[0],2)+pow($point[1],2));
	$angle = M_atan2_polar($point[1],$point[0]);

	return [$radius,$angle];

}














/*
1. 기능
   matrix의 determinant 계산
2. 입력
   M: square matrix
3. 출력
   determinant
*/
function M_determinant($M)
{
    return $M[0][0]*$M[1][1]-$M[0][1]*$M[1][0];

}

/*
1. 기능
   두 점의 거리 계산
2. 입력
   point_1,point_2: 두 점
3. 출력
   point_1과 point_2의 거리
*/
function M_distance($point_1,$point_2)
{
    $result = 0;
    foreach ($point_1 as $key => $value))
    {
        $result += pow($point_2[$key]-$point_1[$key],2);
    }
    return sqrt($result);
}

/*
1. Function
   Compute distance between point and line that contain segment)
2. Input
   $point: point
   $segment: segment
3. Output
   distance
*/
function M_distance_point_segment($point,$segment)
{
	$segment = array_values($segment);
	$point = array_values($point);
    $vector = M_subtract($segment[1],$segment[0])
    return abs($vector[1]*$point[0]-$vector[0]*$point[1]+
               ($segment[1][0]*$segment[0][1]-$segment[1][1]*$segment[0][0]))/sqrt(pow($vector[0],2)+pow($vector[1],2));
}

/*
1. 기능
   두 vector의 inner product 계산
2. 입력
   vector_1,vector_2
3. 출력
   inner product
*/
function M_inner_product($vector_1,$vector_2)
{
    $inner_product = 0;

    foreach ($vector_1 as $key => $value)
    {
        $inner_product += $vector_1[$key]*$vector_2[$key];
    }
    return  $inner_product;

}






/*
1. 기능
   square matrix M의 inverse matrix 계산
2. 입력
   M = [[m_11,...m_1n],...[m_n1,...m_nn]]
3. 출력
   inverse matrix
*/
function M_inverse_matrix($M)
{
    $D = M_determinant($M);
    if ($D)
    {
        return [[$M[1][1]/$D,-$M[0][1]/$D],[-$M[1][0]/$D,$M[0][0]/$D]];
    }
    return null;

}

/*
1. Function
   To check if an angle is between two angles
2. Input
   $angle: angle
   $start_angle: start angle
   $end_angle: end angle
3. Output
   true: between angles
   false: not bewteen angles
*/
function M_is_between_angles($angle,$start_angle,$end_angle)
{
    if (M_angle_polar($angle-$start_angle) <= M_angle_polar($end_angle-$start_angle))
    {
        return true;
    }
    return false;
}



/*
1. 기능
   두 value가 일치하는지 판단
2. 입력
   [value_1,value_2]: [실수,실수],[실수 array,실수 array]
3. 출력
   true: 근사치 내
   false: 근사치 밖
*//*
function M_is_equal($value_1,$value_2)
{
    if (is_numeric($value_1) && is_numeric($value_2))
    {
        if ($value_1 != $value_2)
        {
            return false;
        }
        else
        {
            return true;
        }
    }

    foreach ($value_1 as $key => $value)
    {
        if ($value_1[$key] != $value_2[$key])
        {
            return false;
        }
    }

    return false;
}

/*
1. 기능
   두 value가 근사적으로 일치하는지 판별
2. 입력
   [value_1,value_2]: [실수,실수],[실수 array,실수 array],[실수,실수 array]
3. 출력
   true: 근사치 내
   false: 근사치 밖
*/
function M_is_equal_approximately($value_1,$value_2,$error = 0.1)
{
    if (M_distance($value_1,$value_2) <= $error)
    {
        return true;
    }

    return false;
}
/*
1. 기능
   두 angle이 근사적으로 일치하는지 판별
2. 입력
   $angle_1: angle
   $angle_2: angle
3. 출력
   true: 근사치 내
   false: 근사치 밖
*/
function M_is_equal_approximately_angle($angle_1,$angle_2)
{
    if (abs(M_angle_polar($angle_1-$angle_2)) < deg2rad(1))
    {
        return true;
    }

    return false;
}





/*
1. 기능
   value_1 value_2중 하나에 근사적으로 일치하는지 판별
2. 입력
   [value_1,value_2]: [실수,실수 array] 또는 [실수 array,실수 array의 array]
3. 출력
   true: 근사치 내
   false: 근사치 밖
*/
function M_is_equal_approximately_one_of($value_1,$value_2,$error = 0.1)
{
    foreach ($value_2 as $value_2_i)
    {
        if (M_distance($value_1,$value_2_i) <= $error)
        {
            return true;
        }
    }

    return false;
}














/*
1. Function
   Check if two angle intervals intersect
2. Input
   $interval_1: angle interval
   $interval_2: angle interval
3. 출력
   true: intersect
   false: not intersect
*/
function M_is_intersect_intervals_angle($interval_1,$interval_2)
{
	$interval_1 = array_values($interval_1);
	$interval_2 = array_values($interval_2);
    if (M_is_between_angles($interval_2[0],$interval_1[0],$interval_1[1]) ||
        M_is_between_angles($interval_2[1],$interval_1[0],$interval_1[1]))
    {
        return true;
    }
    return false;

}



/*
1. 기능
   value거  array의 value중 하나와 일치하는지 판별
2. 입력
   value: 실수
   array: 실수 array
3. 출력
   true: 근사치 내
   false: 근사치 밖
*/
function M_is_equal_one_of($value,$array)
{
    foreach ($array as $value_1)
    {
        if ($value_1 == $value)
        {
            return true;
        }
    }

    return false;
}



/*
1. 기능
   array의 entry가 모두 numeric인지 판별
2. 입력
   array
3. 출력
   true: 모두 numeric
   false: 모두 numeric이 아님
*/
function M_is_numeric_array($array)
{
    foreach ($array as $value)
    {
        if(!is_numeric($value))
        {
            return false;
        }
    }

    return true;
}




/*
1. 기능
   두 angle의 차가 M_PI인지 판별
2. 입력
   두 angle: angle_1,angle_2
3. 출력
   true: 차가 M_PI
   false: 차가 M_PI가 아님
*//*
function is_opposite_angle($angle_1,$angle_2)
{
    return is_equal(M_angle_polar($angle_1-$angle_2),M_PI);
}

/*
1. 기능
   두 angle의 차가 근사적으로 M_PI인지 판별
2. 입력
   두 angle: angle_1,angle_2
3. 출력
   true: 차가 근사적으로 M_PI
   false: 차가 근사적으로 M_PI가 아님
*//*
function is_opposite_angle_approximately($angle_1,$angle_2)
{
    return is_equal_approximately_angle(M_angle_polar($angle_1-$angle_2),M_PI));
}



/*
1. 기능
   두 segment가 평행한지 여부 판별
2. 입력
   segment_1,segment_2
3. 출력
   true: 평행함
   false: 평행하지 않음
*/

function M_is_parallel_segment_segment($segment_1,$segment_2)
{
	$segment_1 = array_values($segment_1);
	$segment_2 = array_values($segment_2);
    $segment_1_angle = M_vector_angle($segment_1[0],$segment_1[1]);
    $segment_2_angle = M_vector_angle($segment_2[0],$segment_2[1]);

    if (M_is_equal_approximately_angle(M_mod($segment_1_angle-$segment_2_angle,M_PI),0))
    {
        return true;
    }


    return false;
}

/*
1. 기능
   arc와 segment가 접하는지 판별
2. 입력
   object_1,object_2
3. 출력
   true: 접함
   false: 접하지 않음
*/
function M_is_tangent_arc_segment($arc,$segment)
{
	$arc = array_values($arc);
	$segment = array_values($segment);
    if (sizeof(M_intersections_arc_segment($arc,$segment)) == 1)
    {
        $angle_difference = M_vector_angle($segment[0],$segment[1])-M_vector_angle($arc[0],$intersections[0]);
        if (M_is_equal_approximately_angle($angle_difference,M_PI/2) ||
            M_is_equal_approximately_angle($angle_difference,3*M_PI/2))
        {
            return true;
        }
    }
    return false;
}

/*

1. 기능
   한 점이 다른 점의 반경내에 있는지 판별
2. 입력
   point_1: point
   point_2: point
   radius: 반경
3. 출력
*/
function M_is_within($point_1,$point_2,$radius)
{
	$point_1 = array_values($point_1);
	$point_2 = array_values($point_2);
    if (M_distance($point_1,$point_2) <= $radius)
    {
        return true;
    }

    return false;
}


/*
1. 기능
   linear equation을 풀어줌 (2 variables)
2. 입력
   M: matrix
   c: 상수
3. 출력
   해: 유일해인 경우
   false: 해가 없거나 무한해일 경우
*/
function M_linear_equation_solution($M,$c)
{
    if (M_determinant($M))
    {
        $M_1 = M_inverse_matrix($M);
        return [$M_1[0][0]*$c[0]+$M_1[0][1]*$c[1],$M_1[1][0]*$c[0]+$M_1[1][1]*$c[1]];
    }
    return [];
}


/*
1. Function
   mod 계산
2. Input
   $a: real
   $b: positive real
3. Output
   $c: $a == $c (mod $b)
*/
function M_mod($a,$b)
{
    $c = fmod($a,$b);
    if ($c < 0)
    {
        $c += $b;
    }

    return $c;
}

/*
1. Function
   Multiply two vectors entrywise
2. Input
   $vector_1: vector
   $vector_2: vector
3. Output
   Entryise multiplicaiton
*/
function M_multiplication_entrywise($vector_0,$vector_1)
{
    $result = [];
    foreach ($vector_0 as $key => $value)
    {
        $result[$key] = $vector_0[$key]*$vector_1[$key];
    }

    return $result;
}


/*
1. Function
    Compute scalar multipcation
2. Input
   $scalar: scalar
   $point: point
3. Output
   scalar*point
*/
function M_multiplication_scalar($scalar,$point)
{
    $result = [];
    foreach ($point as $key => $value)
    {
        $result[$key] = $scalar*$value;
    }

    return $result;
}

/*
1. Function
   Compute norm of point
2. Input
   $point: point (array)
3. Output
   Norm
*/
function M_norm($point)
{
    $result = 0;
    foreach ($point as $value)
    {
        $result += pow($value,2);
    }
    return sqrt($result);

}


/*
1. Function
    Change point to rectangle
2. Input
    $point: [x,y]
    $rectangle_margin: [a,b]
    $angle: rotation angle
3. Output
    $region: [[x-a,x+a],[y-b,y+b]]
*//*
function M_rectangle_by_point($point,$rectangle_margin = [0.25,0.25],$angle = 0)
{
    $point = array_combine([0,1],$point);
    return [[$point[0]-$rectangle_margin[0],$point[0]+$rectangle_margin[0]],[$point[1]-$rectangle_margin[1],$point[1]+$rectangle_margin[1]],$angle];
}











/*
1. 기능
   산술 평군 계산
2. 입력
   $points: [v_1,...,v_n]
3. 출력
   (v_1+...+v_n)/n
*/
function M_mean_arithmetic($points)
{
    $sum = array_fill(0,sizeof($points[0]),0);

    foreach ($points as $point)
    {
        $sum = M_addition($sum,$point);
    }

    return M_multiplication_scalar(1/sizeof($points),$sum);
}


/*
1. 기능
   point들을 center를 중심으로 anticlockwise로 정렬
2. 입력
   points: point array
   center: 중심
3. 출력
   anticlockwise로 정렬한 point array
*//*
function points_anticlockwise($points,$center)
{
    $points_angle_key = [];

    foreach ($points as $point)
    {
        $points_angle_key[M_vector_angle($center,$point)] = $point;
    }
    ksort($points_angle_key,SORT_NUMERIC);

    $points_aligned = [];

    foreach ($points_angle_key as $point)
    {
        $points_aligned[] = $point;
    }

    return $points_aligned;
}

/*
1. Function
    Compute maximum distance between point and points
2. Input
    $point: point
    $points: points
3. Output
    maximum distance
*/
function M_point_points_distance_max($point,$points)
{
    $distance_max = 0;
	foreach ($points as $point_1)
	{
		$distance_max = max($distance_max,M_diatance($point,$point_1));
	}
	return $distance_max;
    

}

/*
1. 기능
   point set translation
2. 입력
   $points: points array
   $translation: transtion
3. 출력
   translated pointvertices
*/
function M_points_translation($points,$translation)
{
	$points_translated = [];
	foreach ($points as $point)
	{
		$points_translated[] = M_addition($point,$translatoin);
	}
	return $points_translated;
}


/*
1. 기능
   polar coord를 cartesian coord로 변환
2. 입력
   $point_polar = [radius,angle]
   $keys: keys of coords
3. 출력
   catesian coord
*/

function M_polar_to_cartesian($radius,$angle)
{
	
    return D_point($radius*cos($angle),$radius*sin($angle));
}

/*
1. 기능
   공통 시점 p를 가지는 두 반직선이 이루는 영역에 들어가고 중심이 두 반직선의 각이 등분선 위에 있는
   polygon과 p사이의 거리의 최소값의 lower bound가 주어질 때 일정 수보다 클때의 polygon의 중심 좌표 계산
2. 입력
   $point: p
   $vectors: the array of vertices of polygon whose center is [0,0]
   $angle_interval: [start angle, angle interval size]
   $distance_lower_bound: distance lower bound
3. 출력
   polygon의 center coord
*/
function M_polygon_center_between_halflines($point,$vertices,$angle_interval,$distance_lower_bound)
{
	$angle_interval = array_values($angle_interval);
	$angle_end = M_angle_polar($angle_interval[0]+$angle_interval[1]);
    if ($angle_interval[1] >= M_PI)
    {
        $angle_end = M_angle_polar(array_sum($angle_interval));
        if (0 <= $angle_interval[0] && $angle_interval[0] <= M_PI &&  0 <= $angle_end && $angle_end <= M_PI))
        {
            return addition($point,M_polar_to_cartesian([]$distance_lower_bound+$rectangle_size[1]/2,3*M_PI/2]));
        }
        if (M_PI <= $angle_interval[0] && $angle_interval[0] <= 2*M_PI && M_PI <= $angle_end && $angle_end <= 2*M_PI))
        {
            return addition($point,M_polar_to_cartesian([$distance_lower_bound+$rectangle_size[1]/2,M_PI/2]));
        }
        if (M_PI <= $angle_interval[0] && $angle_interval[0] <= 3*M_PI/2 && M_PI/2 <= $angle_end && $angle_end <= M_PI)
        {
            return addition($point,M_polar_to_cartesian([]$distance_lower_bound+$rectangle_size[0]/2,0]));
        }
        if (0 <= $angle_interval[0] && $angle_interval[0] <= M_PI/2 && 3*M_PI/2 <= $angle_end && $angle_end <= 2*M_PI)
        {
            return addition($point,M_polar_to_cartesian([$distance_lower_bound+$rectangle_size[0]/2,M_PI]));
        }
    }
	$angle_half = $angle_interval[1]/2;
	$angle_center = ;
	$angle_rotation = M_PI/2-M_angle_polar($angle_interval[0]+$angle_half);
	$vertices_rotated = [];
	foreach ($vertices_polygon as $vertex)
	{
		$vertices_rotated[] = M_rotation($vertex,$angle_rotation);
		
	}
	
	$x_abs_max = $distance_lower_bound*sin($angle_half);
	$distance = $distance_lower_bound;
	
	foreach ($vertices_rotated as $vertex)
	{
		$vertex = array_values($vertex);
		$x_vertex_abs = abs($vertex[0]);
		if ($x_vertex_abs <= $x_bas_max)
		{
			$distance = max($distance,-$vertex[1]+sqrt(pow($distance_lower_bound,2)-pow($x_vertex_abs,2));
		}
		else 
		{
			$distance = max($distance,-$vertex[1]+$x_vertex_abs/tan($angle_half));
		}
	}
	
	return addition($point,M_polar_to_cartesian([$distance,$angle_center]));

}




/*
1. 기능
   공통 시점 p를 가지는 두 반직선이 이루는 영역에 들어가고 중심이 두 반직선의 각이 등분선 위에 있는
   rectangle과 p사이의 거리의 최소값의 lower bound가 주어질 때 일정 수보다 클때의 rectangle의 중심 좌표 계산
2. 입력
   $point: point coord
   $rectangle_size: [rectangle width rectangle height]
   $angle_interval: [start angle, angle interval size]
   $distance_lower_bound: distance lower bound
3. 출력
   rectangle의 center coord
*/
function M_rectangle_center_between_halflines($point,$rectangle_size,$angle_interval,$distance_lower_bound)
{
	$rectangle_size = array_values($rectangle_size);
	$angle_interval = array_values($angle_interval);
    if (max($rectangle_size) >= 2 && $angle_interval[1] >= M_PI)
    {
        $angle_end = M_angle_polar(array_sum($angle_interval));
        if (0 <= $angle_interval[0] && $angle_interval[0] <= M_PI &&  0 <= $angle_end && $angle_end <= M_PI))
        {
            return M_polar_to_cartesian($distance_lower_bound+$rectangle_size[1]/2,3*M_PI/2);
        }
        if (M_PI <= $angle_interval[0] && $angle_interval[0] <= 2*M_PI && M_PI <= $angle_end && $angle_end <= 2*M_PI))
        {
            return M_polar_to_cartesian($distance_lower_bound+$rectangle_size[1]/2,M_PI/2);
        }
        if (M_PI <= $angle_interval[0] && $angle_interval[0] <= 3*M_PI/2 && M_PI/2 <= $angle_end && $angle_end <= M_PI)
        {
            return M_polar_to_cartesian($distance_lower_bound+$rectangle_size[0]/2,0);
        }
        if (0 <= $angle_interval[0] && $angle_interval[0] <= M_PI/2 && 3*M_PI/2 <= $angle_end && $angle_end <= 2*M_PI)
        {
            return M_polar_to_cartesian($distance_lower_bound+$rectangle_size[0]/2,M_PI);
        }
    }
	
    $angle_center = M_angle_polar($angle_interval[0]+$angle_interval[1]/2);
    $angle_diagonal = M_atan2_polar($rectangle_size[1],$rectangle_size[0]);
    $diagonal_half = M_rectangle_diagonal($rectangle_size[0],$rectangle_size[1])/2;

    if (M_angle_included($angle_center,0) <= $angle_diagonal || M_angle_included($angle_center,M_PI) <= $angle_diagonal)
    {
        $size = $rectangle_size;
        $angle_diagonal_rotated = $angle_diagonal;
    }
    else
    {
        $size = [$rectangle_size[1],$rectangle_size[0]];
        $angle_diagonal_rotated = M_PI/2-$angle_diagonal;
    }

    $angles_vertex = [];
    $angles_vertex[0] = M_angle_polar($angle_diagonal-$angle_center);
    $angles_vertex[1] = M_angle_polar(M_PI-$angle_diagonal-$angle_center);
    $angles_vertex[2] = M_angle_polar(M_PI+$angle_diagonal-$angle_center);
    $angles_vertex[3] = M_angle_polar(2*M_PI-$angle_diagonal-$angle_center);
    sort($angles_vertex);

    $angle_0 = M_PI/2-min(M_angle_included(M_PI,($angles_vertex[0]+$angles_vertex[1])/2),M_angle_included(M_PI,($angles_vertex[2]+$angles_vertex[3])/2));
    $distance_0 = $distance_lower_bound+$size[0]/2;
    if ($distance_0*tan($angle_0) <= $size[1]/2)
    {
        $distance_1 = $distance_0/cos($angle_0);
    }
    else
    {
        $angle_1 = M_PI/2;
        foreach ($angles_vertex as $angle)
        {
            $angle_1 = min($angle_1,M_angle_included(M_PI,$angle));

        }


        $distance_1 = $diagonal_half*cos($angle_1)+sqrt(pow($distance_lower_bound,2)-pow($diagonal_half*sin($angle_1),2));
    }

    $distances = [$distance_1];
    if ($angle_interval[1] < M_PI)
    {
        for ($i = 0; $i < 4; $i++)
        {
            $distances[] = abs($diagonal_half*sin($angles_vertex[$i]))/tan($angle_interval[1]/2);
        }
    }

    return M_polar_to_cartesian([max($distances),$angle_center]);

}


/*
1. 기능
   직사각형의 대각선 길이 계산
2. 입력
   width: 가로
   height: 세로
3. 출력
   대각선 길이
*/
function M_rectangle_diagonal($width,$height)
{
    return sqrt(pow($width,2)+pow($height,2));
}










/*
1. 기능
   회전 이동한 점 계산
2. 입력

   point: 점
   angle: 회전각 또는 회전각 array
   $center: center of rotation

3. 출력
   point를 angle만큼 center를 중심으로 회전한 점
*/

function M_rotation($point,$angle,$center = [0,0])
{
    $keys = array_keys($point);
    $values = array_values($point)
    $point_rotated = [];
    $point_rotated[$keys[0]] = cos($angle)*$values[0]-sin($angle)*$values[1];
    $point_rotated[$keys[1]] = sin($angle)*$values[0]+cos($angle)*$values[1];
    return M_addition($center,$point_rotated);

}

/*
1. 기능
   수의 부호 계산
2. 입력
   number: 실수
3. 출력
   -1: number < 0
   0: number = 0
   1: number >0
*/
function M_sign($number)
{
    if ($number < 0)
    {
        return = -1;
    }
    else if ($number == 0)
    {
        return = 0;
    }
    else if ($number > 0)
    {
        return = 1;
    }

}

/*
1. Function
   Compute solutions of quadratic equation ax^2+bx+c=0
2. Input
   $coefficients: [a,b,c]
3. Output
   Solutions
*/
function M_solutions_quadratic($coefficients)
{
    $a = $coefficients[0];
    $b = $coefficients[1];
    $c = $coefficients[2];
    $D = pow($b,2)-4*$a*$c;

    if ($D == 0)
    {
        return [-$b/(2*$a)];
    }
    else if ($D >= 0)
    {
        return [(-$b+sqrt($D))/(2*$a),(-$b-sqrt($D))/(2*$a)];
    }
    return [];
}













/*
1. 기능
   두 점의 차 계산
2. 입력
   point_1,point_2: 두점
3. 출력
   point_1-point_2
*/

function M_subtraction($point_1,$point_2)
{
    $result = [];
    foreach ($point_1 as $key => $value)
    {
        $result[$key] = $point_1[$key]-$point_2[$key];
    }
    return $result;
}





/*
1. Function
   Compute union of two angle intervals
2. Input
   $interval_1: angle interval
   $interval_2: angle interval
3. 출력
   union (array of intervals)
*/
function M_union_intervals_angle($interval_1,$interval_2)
{
	$keys = array_keys($interval_1);
	$interval_1 = array_values($interval_1);
	$interval_2 = array_values($interval_2);
    $union = [];
    if (M_is_between_angles($interval_2[0],$interval_1[0],$interval_1[1]))
    {
        if (M_is_between_angles($interval_2[1],$interval_2[0],$interval_1[1]))
        {
            return [array_combine($keys,$interval_1)];
        }
        if (M_is_between_angles($interval_2[1],$interval_1[0],$interval_2[0]))
        {
            return [[0,2*M_PI];
        }
        return [array_combine($keys,[$interval_1[0],$interval_2[1]])];

    }
    else
    {
        if (M_is_between_angles($interval_2[1],$interval_1[0],$interval_1[1]))
        {
            return [array_combine($keys,[$interval_2[0],$interval_1[1]])];
        }
        return array_combine($keys,[$interval_1,$interval_2]);

    }
    return $union;
}




/*
1. 기능
   시점,종점이 주어질 때 vector 계산
2. 입력
   start: 시점
   end: 종점
3. 출력
   a
   end-start = [rcos(a),rsin(a)];
*/

function M_unit_vector($start,$end)
{
    return M_multiplication_scalar(1/M_distance($start,$end),M_subtraction($end,$start));
}




/*
1. Function
   For given numbers v, a, b compute w such that
   w = v (min(a,b) <= v <= max(a,b))
     = min(a,b) (v < min(a,b))
     = max(a,b) (max(a,b) < v)
2. Input
   $number: v
   $number_1: a
   $number_2: b
3. Output
   Computed result
*/
function M_value_bounds($number,$number_1,$number_2)
{
    return min(max($number,min($number_1,$number_2)),max($number_1,$number_2));
}



/*
1. 기능
   vector의 극좌표의 angle
2. 입력
   start: 시점
   end: 종점
3. 출력
   a
   end-start = [rcos(a),rsin(a)];
*/

function M_vector_angle($start,$end)
{
    $vector = array_values(M_subtraction($start,$end));
    return M_atan2_polar($vector[1],$vector[0]);
}



// usort functions

 /*
1. 기능
   두 array를 비교해 usort에 쓰기 위한 function (usort 참조)
2. 입력
   $array_1: array
   $array_2: array
3. 출력

*/

function usort_array_ascending($array_1,$array_2)
{
    if (!is_array($array_1))
    {
        $array_1 = [$array_1];
    }
    if (!is_array($array_2))
    {
        $array_2 = [$array_2];
    }
    $array_1_size = sizeof($array_1);
    $array_2_size = sizeof($array_2);
    $result = 0;
    if ($array_1_size <= $array_2_size)
    {
        foreach ($array_1 as $key => $value)
        {
            if ($value < $array_2[$key])
            {
                return 1;
            }
            if ($value > $array_2[$key])
            {
                return -1;
            }
        }
        if ($array_1_size < $array_2_size)
        {
            return 1;
        }
        return 0;

    }
    else
    {
        foreach ($array_2 as $key => $value)
        {
            if ($array_1[$key] < $value)
            {
                return 1;
            }
            if ($array_1[$key] > $value)
            {
                return -1;
            }
        }
        return 0;
    }
}


 /*
1. 기능
   두 array를 비교해 usort에 쓰기 위한 function (usort 참조)
2. 입력
   $array_1: array
   $array_2: array
3. 출력

*/

function usort_array_descending($array_1,$array_2)
{
    if (!is_array($array_1))
    {
        $array_1 = [$array_1];
    }
    if (!is_array($array_2))
    {
        $array_2 = [$array_2];
    }
    $array_1_size = sizeof($array_1);
    $array_2_size = sizeof($array_2);
    $result = 0;
    if ($array_1_size <= $array_2_size)
    {
        foreach ($array_1 as $key => $value)
        {
            if ($value > $array_2[$key])
            {
                return 1;
            }
            if ($value < $array_2[$key])
            {
                return -1;
            }
        }
        if ($array_1_size > $array_2_size)
        {
            return 1;
        }
        return 0;

    }
    else
    {
        foreach ($array_2 as $key => $value)
        {
            if ($array_1[$key] > $value)
            {
                return 1;
            }
            if ($array_1[$key] < $value)
            {
                return -1;
            }
        }
        return 0;
    }
}




/*
1. 기능
   두 point를 비교해 usort에 쓰기 위한 function (usort 참조)
2. 입력
   $point_1: point
   $point_2: point
3. 출력

*/

function usort_point_descending($point_1,$point_2)
{
    $point_1 = array_values($point_1);
	$point_2 = array_values($point_2);
    if ($point_1[0] > $point_2[0])
    {
        return 1;
    }
    else if ($point_1[0] < $point_2[0])
    {
        return -1;
    }
    if ($point_1[0] > $point_2[0])
    {
        return 1;
    }
    else if ($point_1[1] < $point_2[1])
    {
        return -1;
    }
    return 0;


}



//string functions

/*
1. Function
	Change equation to expression
2. Input
	$equation: equation
3. Output
	expression
*/
function S_equation_to_expression($equation)
{
	$sides = explode('=',$equation);
	if (sizeof($sides) == 2)
	{
		return $sides[0].'-'.$sides[1];
	}
	else 
	{
		return $equation;
	}
}

/*
1. Function
	evaluate expression with a given point
2. Input
	$expression: expression (string)
	$point: point
	
3. Output
	evaluation
*/
function S_evaluation_point($expression,$point)
{
	foreach ($point as $key => $value)
	{
		$evaluation = str_replace($key,$value,$expression);
	}
	eval('$evaluation='.$evaluation.';');
	return $evaluation;
}



/*
1. Function
    separate fraction from string
2. Input
    $string: string
3. Output
    [$frations,$nonfraction]
    $fractions =  array of fractions in string
                    [[numerator string,denominator string],...]
    $nonfraction: remaining part of string
*/
function S_fraction_separation($string)
{
    $string_length = strlen($string);
    $fractions = [];
    $nonfraction = '';
    $frac = '\\frac{';
    $frac_length = strlen($frac);
    for ($i = 0; $i < $string_length; $i++)
    {
        if (substr($string,$i,$frac_length) != $frac)
        {
            $nonfraction .= substr($string,$i,1);
        }
        else 
        {
            $fractions = [];
            $key_numerator_start = $i+$frac_length;
            $parenthesis_sign = 1;
            for ($j = $key_numerator_start; $j < $string_length; $j++)
            {
                $character = substr($string,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
                if ($parenthesis_sign == 0)
                {
                    $key_numerator_end = $j-1;
                    break;
                }
            }
            $fraction[0] = substr($string,$key_numerator_start,$key_numerator_end-$key_numerator_start+1);
            $key_denominator_start = $key_numerator_end+3;
            $parenthesis_sign = 1;
            for ($j = $key_denominator_start; $j < $string_length; $j++)
            {
                $character = substr($string,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
                if ($parenthesis_sign == 0)
                {
                    $key_denominator_end = $j-1;
                    break;
                }
            }
            $fraction[1] = substr($string,$key_denominator_start,$key_denominator_end-$key_denominator_start+1);
            $fractions[] = $fraction;
            $i = $key_denominator_end+1;
        }
    }
       
    return [$fractions,$nonfraction];
}



/*
1. Function
    Change javascript math expression to php math expression
2. Input
    $javascript: javascript string
3. Output
    php string
*/
function S_javascript_to_php($javascript)
{
    $replacements = [];
    //$replacements['='] = '==';
    $replacements['Math.E'] = 'M_E';
    $replacements['Math.LN2'] = 'M_LN2';
    $replacements['Math.LN10'] = 'M_LN10';
    $replacements['Math.LOG2E'] = 'M_LOG2E';
    $replacements['Math.LOG10E'] = 'M_LOG10E';
    $replacements['Math.PI'] = 'M_PI';
    $replacements['Math.SQRT1_2'] = 'M_SQRT1_2';
    $replacements['Math.SQRT2'] = 'M_SQRT2';
    $replacements['NaN'] = 'NAN';
    $replacements['POSITIVE_INFINITY'] = 'INF';
    $replacements['NEGATIVE_INFINITY'] = '-INF';

    $php = $javascript;
    foreach ($replacements as $key => $value)
    {
        $php = str_replace($key,$value,$php);
    }

    return str_replace('Math.','',$php);

}

/*
1. Function
    separate fraction and nonfraction from latex
2. Input
    $string: string
3. Output
    [fration or non fraction,...]
    fraction: [numerator string,denominator string]
    onfraction: nonfraction string
*/
function S_latex_fraction_separation($latex)
{
	$parts = [];
    $latex_length = strlen($latex);
    $frac = '\\frac{';
    $frac_length = strlen($frac);
	$nonfraction = '';
	for ($i = 0; $i < $latex_length; $i++)
    {
        if (substr($latex,$i,$frac_length) != $frac)
		{
			$nonfraction .= substr($string,$i,1);
			
		}
        else
        {
			if ($nonfraction != '')
			{
				$parts[] = $nonfraction;
			}
            $key_numerator_start = $i+$frac_length;
            $parenthesis_sign = 1;
            for ($j = $key_numerator_start; $j < $latex_length; $j++)
            {
                $character = substr($latex,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
                if ($parenthesis_sign == 0)
                {
                    $key_numerator_end = $j-1;
                    break;
                }
            }
            $fraction[0] = substr($latex,$key_numerator_start,$key_numerator_end-$key_numerator_start+1);
            $key_denominator_start = $key_numerator_end+3;
            $parenthesis_sign = 1;
            for ($j = $key_denominator_start; $j < $latex_length; $j++)
            {
                $character = substr($latex,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
                if ($parenthesis_sign == 0)
                {
                    $key_denominator_end = $j-1;
                    break;
                }
            }
            $fraction[1] = substr($latex,$key_denominator_start,$key_denominator_end-$key_denominator_start+1);
            $parts[] = $fraction;
            $i = $key_denominator_end+1;
			$nonfraction = '';
        }
		
    }
       
    return $parts;
}

/*
1. 기능
   compile된 latex이 형성하는 polygon의 vertices 계산
2. 입력
   $latex: label (string)
   $scaling: scaling
   $label_margin: label margin
3. el
   label size
*/

function S_latex_vertices($latex)
{
	$sizes = [];
    $latex_length = strlen($latex);
    $frac = '\\frac{';
	$frac_length = strlen($frac);
	$degree = '\\degree';
    $degree_length = strlen($degree);
	$degree_width = 1/5;
	$width_rectangle = 0;
	$height_rectangle = 0;
	for ($i = 0; $i < $latex_length; $i++)
    {
		
        if (substr($latex,$i,$degree_length) == $degree)
		{
			if ($nonfraction != '')
			{
				$size_nonfraction = S_latex_size($nonfraction);
				$width_rectangle += $size_nonfraction['x']);
				$height_rectangle = max($height_rectangle,$size_nonfraction['y']);
				$sizes_part[] = $size_nonfraction;
			}
			$i = $degree_length-1;
			$sizes[] = $degree;
			$width_rectangle += $
			$nonfraction = '';
			
			
		}	
        else if (substr($latex,$i,$frac_length) == $frac)
        {
			if ($nonfraction != '')
			{
				$size_nonfraction = S_latex_size($nonfraction);
				$width_rectangle += $size_nonfraction['x'];
				$height_rectangle = max($height_rectangle,$size_nonfraction['y']);
				$sizes[] = S_latex_size($nonfraction);
			}
            $key_numerator_start = $i+$frac_length;
            $parenthesis_sign = 1;
			for ($j = $key_numerator_start; $j < $latex_length; $j++)
            {
                $character = substr($latex,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
				
                if ($parenthesis_sign == 0)
                {
					$key_numerator_end = $j-1;
                    break;
                }
            }
			$numerator = substr($latex,$key_numerator_start,$key_numerator_end-$key_$numerator_start+1);
            $numerator_size = S_latex_size($numerator);
			$key_denominator_start = $key_numerator_end+3;
            $parenthesis_sign = 1;
            for ($j = $key_denominator_start; $j < $latex_length; $j++)
            {
                $character = substr($latex,$j,1); 
                if ($character == '{')
                {
                    ++$parenthesis_sign;
                }
                else if ($character == '}')
                {
                    --$parenthesis_sign;
                }
								
                if ($parenthesis_sign == 0)
                {
                    $key_denominator_end = $j-1;
                    break;
                }
            }
            $denominator = substr($latex,$key_denominator_start,$key_denominator_end-$key_denominator_start+1);
			$denominator_size = S_latex_size($denominator);
			$frac_size = [max($numerator_size['x'],$denominator_size['x']),$numerator_size['y']+$denominator_size['y']];
			$width_rectangle += $frac_size['x'];
			$height_rectangle = max($height_rectangle,$frac_size['y']);
            $sizes[] = $frac_size;
            $i = $key_denominator_end;
			$nonfraction = '';
			
        }
		else 
		{
			$nonfraction .= substr($latex,$i,1);
		}
		
    }
	if ($nonfraction != '');
	{
		$size_nonfraction = S_latex_size($nonfraction);
		$width_rectangle += $size_nonfraction['y'];
		$height_rectangle = max($height_rectangle,$size_nonfraction['y']);
		$sizes[] = $size_nonfraction;
	}
	
	$width_rectangle_half = $width_rectangle/2;
	$height_rectangle_half = $height_rectangle/2;
	$sizes_size = sizeof($sizes);
	$sizes_end = $sizes[$sizes_size-1];
	$vertices = [];
	$sizes_size_half = ceil($sizes_part_size/2);
	$y_min = 0;
	$y_max = 0;
	$x_min = -$width_rectangle_half;
	$x_max = $width_rectangle_half;
	for ($i = 0; $i <= $sizes_size_half; $i++)
	{
		if ($sizes[$i] == $degree)
		{
			
			if ($height_rectangle_half > $y_max)
			{
				$vertices[] = [$x_min,$height_rectangle_half];
				$y_max = $height_rectangle_half;
			}
			$x_min += $width_degree;
		}
		else
		{
			$height_i_half = $sizes[$i]['y']/2;
			if ($height_i_half > $y_max)
			{
				$width_i_half = $sizes[$i]['x']/2;
				$vertices[] = [$width_i_half,$height_i_half];
				$vertices[] = [$width_i_half,-$height_i_half];
				if (-$heihgt_i_half < $y_min)
				{
					$y_min = -$height_i_half;
				}
				$y_max = $height_i_half;
				
			}	
			$x_min += $sizes[$i]['x']/2;
		}
		
		$key = $sizes_size-1-$i; 
		if ($sizes[$key] == $degree)
		{
			
			if ($height_rectangle_half > $y_max)
			{
				$vertices[] = [$x_max,$height_rectangle_half];
				$y_max = 
			}
			$x_max -= $width_degree;
			
		}
		else
		{
			$height_key_half = $sizes[$key]['y']/2;
			if ($height_key_half > $y_max)
			{
				$width_key_half = $sizes[$key]['x']/2;
				$vertices[] = [$width_key_half,$height_key_half];
				$vertices[] = [$width_key_half,-$height_key_half];
				if (-$height_key_half < $y_min)
				{
					$y_min = -$height_key_half;
				}
				$y_max = $height_key_half;
				
			}	
			$x_min += $sizes[$key]['x']/2;
		}
	}
    
	return $vertices;

}


/*
1. Function
    Compute size of compiled latex
2. Input
    $latex: latex string
	$scaling: scaling;
3. Output
    [width,height]
*/
function S_latex_size($latex,$scaling)
{
    //str_replace('˚','\\degree',$latex);
    //str_replace('\\circ','\\degree',$latex);
	$scaling = array_values($scaling);	
    $latex_separated = S_latex_fraction_separation($latex);
	$latex_separated_size = sizeof($latex_separated);
	if ($latex_separated_size == 1)
    {
		$latex = $latex_separated[0]
		if (sizeof($latex) == 2)
		{
			$size_numerator = S_latex_size($latex[0]);
            $size_denominator = S_latex_size($latex[1]);
			return [max($size_numerator[0],$size_denominator[0]),$size_numerator[1]+$size_denominator[1]];
        }
    }
    else 
    {
        $size = [0,0];
        foreach ($latex_separated as $part)
        {
            $size_part = S_latex_size($part);
            $size[0] += $size_part[0]
            $size[1] = max($size[1],$size_part[1]);
        }
        return $size;
    }
	
	
    $height = 0.45;

    $lower_case = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    $number = ['1','2','3','4','5','6','7','8','9','0'];
    $upper_case = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

    $scaling_standard = [1,1];

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
    $widths['\\left{'] = 3/8;// \left\{
    $widths['\\right}'] = 3/8;// \right\}


    $latex_array = str_split($latex);
    $latex_array_size = sizeof($latex_array);
    $latex_width = 0;
    $latex_height = $height;
    $text = '\\text';
    $text_length = strlen($text);
    $text_array = str_split($text);
    for ($i = 0; $i < $latex_array_size; $i++)
    {
        if (array_slice($latex_array,$i,$text_length) == $text_array)
        {
            $key = S_parenthesis_key($latex_array,$i+$frac_length);
            $string = implode(array_slice($latex_array,$i+$frac_length,$key-1-($i+$frac_length-1),false));
            $string_size = S_text_size($string,$scaling_standard);
            $latex_width += $string_size[0];
            $latex_height += $string_size[1];
            $i = $key-1;
        }
        else if (in_array($label_array[$i],$lower_case))
        {
            $latex_width += $width_lower_case;
        }
        else if (in_array($label_array[$i],$number))
        {
            $latex_width += $width_number;
        }
        else if (in_array($label_array[$i],$upper_case))
        {
            $latex_width += $width_upper_case;
        }
        else
        {
            foreach ($widths as $symbol => $width)
            {
                if (array_slice($latex_array,$i,strlen($symbol)) == str_split($symbol))
                {
                    $latex_width += $width;
                    $i += strlen($symbol)-1;
                }
            }
        }
    }

    $latex_width += $label_margin[0];
    $latex_height += $label_margin[1];
	
	if ($sacling)
	{
		$latex_width *= $scaling[0];
		$latex_height *= $scaling[1];
	}

    return D_rectangle_size($latex_width,$latex_height);
}




/*
1. Function
   string에서 주어진 oepn parenthesis와 대응하는 close parenthesis의 key 또는 close parenthesis와 대응하는 open parenthesis의 key 계산
2. Input
   $string: string 또는 string에 str_split을 적용한 array
   $key: $parenthesis의 key
3. Output
   parenthesis의 key에 대응하는 key
*/

function S_parenthesis_key($string,$key)
{
    if (is_string($string))
    {
        $letters = str_split($string);
    }
    else
    {
        $letters = $string;
    }

    $parenthesis = $letters[$key];
    $parenthesis_open = NULL;
    $parenthesis_close = NULL;
    $parenthesis_input = NULL;
    switch($parenthesis)
    {
        case '(':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '(';
            $parenthesis_close = ')';
            break;
        }
        case ')':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '(';
            $parenthesis_close = ')';
            break;
        }
        case '{':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '{';
            $parenthesis_close = '}';
            break;
        }
        case '}':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '{';
            $parenthesis_close = '}';
            break;
        }
        case '[':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '[';
            $parenthesis_close = ']';
            break;
        }
        case ']':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '[';
            $parenthesis_close = ']';
            break;
        }
        case '\\left|':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '\\left|';
            $parenthesis_close = '\\right|';
            break;
        }
        case '\\right|':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '\\left|';
            $parenthesis_close = '\\right|';
            break;
        }
        case  '\\lfloor':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '\\lfloor';
            $parenthesis_close = '\\rfloor';
            break;
        }
        case '\\rfloor':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '\\lfloor';
            $parenthesis_close = '\\rfloor';
            break;
        }
        case '\\lceil':
        {
            $parenthesis_input = 'open';
            $parenthesis_open = '\\lceil';
            $parenthesis_close = '\\rceil';
            break;
        }
        case '\\rceil':
        {
            $parenthesis_input = 'close';
            $parenthesis_open = '\\lceil';
            $parenthesis_close = '\\rceil';
            break;
        }
    }

    $key_corresponding = $key;
    if ($parenthesis_input == 'open')
    {
        $parenthesis_position = 1;
        $letters_size = sizeof($letters);
        for ($i = $key+1; $i < $letters_size; $i++)
        {
            if ($letters[$i] == $parenthesis_open)
            {
                ++$parenthesis_position;
            }
            else if ($letters[$i] == $parenthesis_close)
            {
                --$parenthesis_position;
            }

            if ($parenthesis_position === 0)
            {
                $key_corresponding = $i;
                break;
            }
        }
    }
    else if ($parenthesis_input == 'close')
    {
        $parenthesis_position = -1;
        for ($i = $key - 1; 0 <= $i; $i--)
        {
            if ($letters[$i] == $parenthesis_close)
            {
                --$parenthesis_position;
            }
            else if ($letters[$i] == $parenthesis_open)
            {
                ++$parenthesis_position;
            }

            if ($parenthesis_position === 0)
            {
                $key_corresponding = $i;
                break;
            }
        }
    }

    return $key_corresponding;
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
function S_text_size($text,$scaling)
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
    //$widths['˚'] = 1/7;// ˚degree
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

    return D_rectangle(M_multiplication_entrywise($scaling,[$label_width,$label_height]));
}


//php function

/*
1. Function
   Swap values of two variables
2. Input
   $variable_1: variable
   $variable_2: variable
3. Output
   Swapped variables
*/


function P_swap(&$variable_1,&$variable_2)
{
    $temp = $variable_1;
    $variable_1 = $variable_2;
    $variable_2 = $temp;
}
