<?php



//Object 2D
/*
Object의 수학적 표현 (data)
@ Angle
  [angle center,angle start,angle end,angle height]
@ Arc
  [arc center,arc start,angle]
@ Cartesian
@ Face
  Vertices
@ Interval
	[min,max]
@ Interval_angle
  [start angle, size]
@ Interval2D  
  [[x min, x max],[y min, y max]]
@ Paper
@ Path
  Vertices
@ Point
  Point coord
@ Segment
  [segment start, segment end]
@ Angle Interval
  [start angle, angle size]
@ Rectangle
  [center,rectangle size,rotation]

@ Set_rectangle
  1. Rectangle의 array
  2. 주로 curve가 차지하는 영역을 나타낼 때 사용
/*
-추가-
@ Label polygon
  1. Label2D가 차지하는 polygon
  2. Label2D의 polygon의 vertex로 구성
@ Angle Label 위치 (Point Label위치도 같은 방법으로 구함)
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
  1. Label의 크기
  2. Grid의 label의 크기
  3. Angle의 style-height와 style-markerHeight
@ ratio가 영향을 주는 것들
  1. Label의 크기
  2. Grid의 label의 크기
@ Angle
  1. style-height와 style-markerHeight는 동일하게 설정
@ Measure의 결정 요소
  1. 다음의 세 점으로 이루어진 Bezier Curve
     segment start
     segment end
     segment의 중심에서 2배 meausre의 height의 2배 만큼 수선을 그은 점
     ex) [0,0],[l,0],[l/2,2h] (l: segment length, h: measure height)

/*
 요청사항
 1. 각 object의 id
*/









// Object의 요소 표현


//Basic objects

/*
1. Object
	Angle
2. Properties
	center
	start
	end
3. Methods
	angle: return angle
*/
class M_Angle
{
	public $center;
	public $start;
	public $end; 
	public $height = new M_Class('value','actual');
	
	
	public $color;
	public $label;
	public $marker = new M_Class('type','height');;
	public $json_original;
	
	public $id;
	
	public $type = 'Angle';
	
	private $error_angle = deg2rad(1);
	
	public function __construct($center,$start,$end,$height)
	{
		$this->center = $center;
		$this->start = $start;
		$this->end = $end;
		
		$this->height->value = $height;
		$this->height->actual = $height;
		
	}
	
	public function set_height($height)
	{
		$this->height->value = $height;
		if ($this->marker->type == 'right')
		{
			$this->height->actual = 2*$this->height->value*abs(cos($this->angle()/2));
		}
		else if ($this->marker->type != 'none')
		{
			$this->height->actual = max($this->height->value,$this->marker->height);
		}
		else 
		{
			$this->height->actual = $this->height->value;
		}
	}

	public function set_marker($marker_type,$marker_height)
	{
		$this->marker->type = $marker_type;
		$this->marker->height = $marker_height;
		if ($this->marker->type == 'right')
		{
			$this->height->actual = 2*$this->height->value*abs(cos($this->angle()/2));
		}
		else if ($this->marker->type != 'none')
		{
			$this->height->actual = max($this->height->value,$this->marker->height);
		}
	}
	
	
	
	
	
	public function angle()
	{
		return M_math::angle_polar($this->angle_end()-$this->angle_start());
	}
	
	public function angle_start()
	{
		return $this->center->vector_angle($this->start);
	}
	
	public function angle_end()
	{
		return $this->center->vector_angle($this->end);
	}
	
	public function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Angle':
			{
				$angle = $object;
				if ($this->center->is_equal_approximately($angle->center) &&
					abs($this->height->actual-$angle->height->actual) < 0.01)
				{
					$this_angle = $this->angle();
					$angle_angle = $angle->angle();
					$this_start_angle = $this->angle_start();
					$angle_start_angle = $angle->angle_start();
					$this_end_angle = $this->angle_end();
					$angle_end_angle = $angle->angle_end();
					if (M_math::angle_polar($this_start_angle-$angle_start_angle) <= $angle_angle+$this->error_angle ||
						M_math::angle_polar($angle_start_angle-$this_start_angle) <= $this_angle+$this->error_angle ||
						M_math::angle_polar($this_end_angle-$angle_end_angle) <= $this_angle+$this->error_angle ||
						M_math::angle_polar($angle_end_angle-$thisend_angle) <= $angle_angle+$this->error_angle)
					{
						return true;
					}
				}


				return false;
			}
			
		}
	}
	
	public function json()
	{
		$angle = $this->json;
		
		$angle['center'] = ['x' => $this->center->x,'y' => $this->center->y];
		$angle['start'] = ['x' => $this->start->x,'y' => $this->start->y];
		$angle['end'] = ['x' => $this->end->x,'y' => $this->end->y];
		$angle['height'] = $this->height->value;
		$angle['id'] = $this->id; 

		if ($this->marker->type == 'right')
		{
			$angle['style']['rightAngle'] = true;
		}
		else 
		{
			$angle['style']['marker'] != $this->marker->type;
			if ($this->marker->type != 'none')
			{
				$angle['style']['markerHeight'] = $this->marker->height;
			}
			
		}
					
		return $angle;
	}
	
	public function set_rectangle($bounds)
	{
		$this_angle = $this->angle();
		$set_rectangle = new M_Set_rectangle;
		if ($this->marker->type != 'right')
		{
			if (0 <= $this_angle && $this_angle <= M_PI/2)
			{
				$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($this->center,$this->start),-$this->height->actual*sin($this_angle));
			}
			else if (M_PI/2 < $this_angle && $this_angle <= M_PI)
			{
				$scalar = cos($this_angle)*$angle->height->actual
				$end = $this->center->addition($this->start->subtraction($this->center)->multiplication_scalar($scalar));
				$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($this->start,$end),-$this->height->actual);
			}
			else if (M_PI < $this_angle && $this_angle <= 3*M_PI/2)
			{
				$end = $this->center->subtraction($this->start->subtraction($this->center));
				$segment = new M_Segment($this->center,$end);
				$set_rectangle->rectangles[] = new M_Rectangle_segment($segment,-$this->height->actual);
				$set_rectangle->rectangles[] = new M_Rectangle_segment($segment,$this->height->actual*sin($this_angle-M_PI));
			}
			else
			{
				$end = $this->center->subtraction($this->start->subtraction($this->center));
				$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($this->start,$end),-$this->height->actual);
				$scalar = cos($this_angle)*$this->height->actual;
				$start = $this->center->addition($end->subtraction($this->center)->multiplication_scalar($scalar));
				$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($start,$end),$this->height->actual);
			}
			return $set_rectangle;
		}

		
		if (0 <= $this_angle && $this_angle <= M_PI/2)
		{
			$end = new M_Point_polar($this->height->actual*cos($this_angle/2),$this->center->vector_angle($this->start));
			$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($this->center,$end),-$this->height->actual*sin($this_angle));
		}
		else if (M_PI/2 < $this_angle && $this_angle <= M_PI)
		{
			$scalar = cos($this_angle)*$this->height->value;
			$start = $this->center->addition($this->start->subtraction($this->center)->multiplication_scalar($scalar));
			$set_rectangle->rectangles[] = new M_Rectangle_segment(M_Segment($start,$this->start),sin($this_angle)*$this->height->value);
		}
		else if (M_PI < $this_angle && $this_angle <= 3*M_PI/2)
		{
			$scalar = cos($this_angle)*$this->height->value;
			$start = $this->center->addition($this->start->subtraction($this->center)->multiplication_scalar($scalar));
			$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($start,$this->start),sin($this_angle)*$this->height->value);

		}
		else
		{
			$end = new M_Point_polar($this->height->actual*cos($this_angle/2),$this->center->vector_angle($this->start)]);
			$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($this->center,$end),-$angle->height->actual*sin($this_angle));

		}
		

		return $set_rectangle;
	}
	
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->center = $this->center->rotation($angle,$center);
		$this_rotated->start = $this->start->rotation($angle,$center);
		$this_rotated->end = $this->end->rotation($angle,$center);
		
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->center = $this->center->addition($translation);
		$this_translated->start = $this->start->addition($translation);
		$this_translated->end = $this->end->addition($translation);
		
		return $this_translated;
	}
	
	
	
}



/*
1. Object
	Arc
2. Properties
	center
	start
	end
	angle
3. Methods
	angle: return angle
*/
class M_Arc
{
	public $center;
	public $start;
	public $angle;
	public $id;
	public $type = 'Arc';
	
	
	public $dash;
	public $json_original;
	public $label;
	public $measure;
	public $marker;
	
	
	
	
	
	public function __construct($center,$start,$angle)
	{
		$this->center = $center;
		$this->start = $start;
		$this->angle = $angle;
		
		
	}
	
	
	
	
	
	
	public function angle_start()
	{
		return $this->center->vector_angle($this->start);
	}
	
	public function angle_end()
	{
		return M_math::angle_polar($this->angle_start()+$this->angle);
	}
	
	public function end()
	{
		$radius = $this->radius();
		$angle_end = $this->angle_end();
		
		$end = $this->center;
		$end->x += $radius*cos($angle_end);
		$end->y += $radius*sin($angle_end);
		return $end;
	}
	
	
	
	public function intersections($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$vector_1 = $segment->vecor(-1);
				$vector_2 = $this->center->subtraction($segment->end);

				$a = pow($segment->length(),2);
				$b = $vector_1->inner_product($vector_2);
				$c = pow($vector_2->norm(),2)-pow($this->center->distance($this->start),2);

				$D = pow($b,2)-$a*$c;
				$t_1 = (-$b-sqrt($D))/$a;
				$t_2 = (-$b+sqrt($D))/$a;

				if ($D == 0 && 0 <= $t_1 && $t_1 <= 1)
				{
					return [$vector_1->multiplication_scalar($t_1)->addition($vector_2)];
				}
				if ($D > 0)
				{
					$intersections = [];
					if (0 <= $t_1 && $t_1 <= 1)
					{
						$intersections[] = $vector_1->multiplication_scalar($t_1)->addition($vector_2);
					}
					if (0 <= $t_2 && $t_2 <= 1)
					{
						$intersections[] = $vector_1->multiplication_scalar($t_2)->addition($vector_2);
					}
					return $intersections;
				}
				break;
			}
		}
	}
	
	public function is_crossing($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				$segment_start_is_contained_this = $segment->start->is_contained($this);
				$segment_end_is_contained_this = $segment->end->is_contained($this);
				$intersections = $this->intersections($segment);
				if ($intersections_size == 1 &&
					!$segment_start_is_contained_this &&
					!$segment_end_is_contained_this)
				{
					return true;
				}
				if ($intersections_size == 2 && !$this->is_tangent($segment) &&
					(!$segment_start_is_contained_this || !$segment_end_is_contained_this))
				{
					return true;
				}
				return false;
			}
		}
	}
	
	public function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Arc':
			{
				$arc = $object;
				$this_start_angle = $this->angle_start();
				$this_end_angle = $this->angle_end();
				$arc_start_angle = $arc->angle_start();
				$arc_end_angle = $arc->angle_end();

				if ($this->center->is_equal_approximately($arc->center) && abs($this->radius()-$arc->radius()) < 0.1)
				{
					if (M_math::angle_polar($arc_start_angle-$this_start_angle) <= $this->angle ||
						M_math::angle_polar($arc_end_angle-$this_start_angle) <= $this->angle ||
						M_math::angle_polar($this_start_angle-$arc_start_angle) <= $arc->angle ||
						M_math::angle_polar($this_end_angle-$arc_start_angle) <= $arc->angle)
					{
						return true;
					}
				}
				return false;
			}
		}
	}
	
	public function is_tangent($segment)
	{
		if (sizeof($this->intersections($segment)) == 1)
		{
			$angle_difference = $segment->angle()-$this->center->vector_angle($intersections[0]);
			if (M_math::is_equal_approximately_angle($angle_difference,M_PI/2) ||
				M_math::is_equal_approximately_angle($angle_difference,3*M_PI/2))
			{
				return true;
			}
		}
		return false;
	}
	
	public function json()
	{
		$arc = $this->json;
		$arc['center'] = ['x' => $this->center->x,'y' => $this->center->y];
		$arc['start'] = ['x' => $this->start->x,'y' => $this->start->y];
		$arc['angle'] = $this->angle;
		$arc['id'] = $this->id;
		
		if ($this->measure->height)
		{
			$arc['measure']['style']['height']) = $this->measure->height;
			
		}
		
		return $arc;
	}
	
		
	public function label_coord($height_min = 0.5)
	{
		return $this->start->multiplication_scalar(0.25/$this->radius())->rotation($this->angle()/2,$this->center);
		
	}
	
	public function radius()
	{
		return $this->center->distance($this->start);
	}
	
	
	public function set_rectangle($bounds)
	{
		$rectangles_number = ceil($this->angle/M_PI/6);
		$angle = $this->angle/$rectangles_number;
		$this_radius = $this->radius();
		$distance_arc_measure = ($this_radius+$this->measure->height)/cos($angle/2);
		$start = $this->center;
		$rectangle_height = $this_radius+$this->measure->height-$this_radius*cos($angle/2));
		$set_rectangle = new M_Set_rectangle;
		for ($i = 1; $i <= $rectangles_number; $i++)
		{
			if ($this->measure->height)
			{
				$start = $this->center->addition(new M_Point_polar($distance_arc_measure,$this->center->vector_angle($start)));
			}
			$end = $start->rotation($i*$angle,$this->center);
			$set_rectangle->rectangles[] = new M_Rectangle_segment(new M_Segment($start,$end),-$rectangle_height);
			$start = $end;
		}
		return $set_rectangle;
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->center = $this->center->rotation($angle,$center);
		$this_rotated->start = $this->start->rotation($angle,$center);
		if ($this_rotated->measure)
		{
			$this_rotated->measure = $this->measure->rotation($angle,$center);
			
		}
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->center = $this->center->addition($translation);
		$this_translated->start = $this->start->addition($translation);
		if ($this_translated->measure)
		{
			$this_translated->measure = $this->measure->translation($translation);
			
		}
		return $this_translated;
	}
	
	
}






/*
1. Object
	Curve
2. Properties
	
3. Methods
	
*/
class M_Curve
{
	public $equation;
	public $domain;
	public $label;
	public $id;
	public $type = 'Curve';
	
	public $json_original;
	
	public function __construct($equation,$domain)
	{
		$this->equation = $equation;
		$this->domain = $domain;
	}
	
	
	public function json()
	{
		return $this->json;
	}	
	
	
	
	
	
	public function label_set_rectangle()
	{
		
		$rectangle_domain = new M_Rectangle_interval2D($this->domain,0)
		$rectangle_bounds->rotation = 0;
		$curve_points = $this->points();
		$curve_points_size = sizeof($curve_points);
		$diagonal_half = $label->size->norm();
		$angle = $label->size->angle();
		$label_rectangles = [];
		

		$angle_left_bottom = M_math::angle_polar($angle+$rotation);
		$angle_left_top = M_math::angle_polar(-$angle+$rotation);
		$angle_right_bottom = M_math::angle_polar(M_PI-$angle+$rotation);
		$angle_right_top = M_math::angle_polar(M_PI+$angle+$rotation);

		for ($i = 0; $i < $curve_points_size; $i++)
		{
			$margin_left_bottom = new M_Tuple($label->size->x,$label->size->y);
			$point_left_bottom = $curve_points[$i]->addition(new M_Point_polar($diagonal_half,$angle_left_bottom));
			$rectangle_left_bottom = new M_Rectangle_point($point_left_bottom,$margin_left_bottom,0);
			$is_contained_left_bottom = false;
			
			$margin_left_top = new M_Tuple($label->size->x,-$label->size->y);
			$point_left_top = $curve_points[$i]->addition(new M_Point_polar($diagonal_half,$angle_left_top));
			$rectangle_left_top = new M_Rectangle_point($point_left_top,$margin_left_top,0);
			$is_contained_left_top = false;

			$margin_right_bottom = new M_Tuple(-$label->size->x,$label->size->y);
			$point_right_bottom = $curve_points[$i]->addition(new M_Point_polar($diagonal_half,$angle_right_bottom));
			$rectangle_right_bottom = new M_Rectangle_point($point_right_bottom,$margin_right_bottom,0);
			$is_contained_right_bottom = false;

			$margin_right_top = new M_Tuple(-$label->size->x,-$label->size->y);	
			$point_right_top = $curve_points[$i]->addition(new M_Point_polar($diagonal_half,$angle_right_top));
			$rectangle_right_top = new M_Rectangle_point($point_right_top,$margin_right_top,0);
			$is_contained_right_top = false;

			for ($j = 0; $j < $curve_points_size && $j != $i; $j++)
			{
				if (!$is_contained_left_bottom &&
					$rectangle_left_bottom->is_contained($rectangle_domain) &&
					$curve_points[$j]->is_contained($rectangle_left_bottom))
				{
					$is_contained_left_bottom = true;
				}


				if (!$is_contaiend_left_top &&
					$rectangle_left_top->is_contained($rectangle_domain) &&
					$curve_points[$j]->is_contained($rectangle_left_top))
				{
					$is_contaiend_left_top = true;
				}


				if (!$is_contained_right_bottom &&
					$rectangle_right_bottom->is_contained($rectangle_domain) &&
					$curve_points[$j]->is_contained($rectangle_right_bottom))
				{
					$is_contained_right_bottom = true;
				}

				if (!$is_contained_right_top &&
					$rectangle_right_top->is_contained($rectangle_domain) &&
					$curve_points[$j]->is_contained($rectangle_right_top))
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
				$label_rectangles[] = $rectangle_left_bottom;
			}

			if (!$is_contaiend_left_top)
			{
				$label_rectangles[] = $rectangle_left_top;
			}

			if (!$is_contaiend_right_bottom)
			{
				$label_rectangles[] = $rectangle_right_bottom;
			}

			if (!$is_contaiend_right_top)
			{
				$label_rectangles[] = $rectangle_right_top;
			}
		}

		usort($label_rectangles,'$this->usort_rectangle_descending');
		return new M_Set_rectangle($label_rectangles);
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$x_0 = 'x-'.$center->x;
		$y_0 = 'y-'.$center->y;
		$x_1 = cos($angle).'*'.$x_0.'-'.sin($angle).'*'.$y_0;
		$y_1 = sin($angle).'*'.$x_0.'+'.cos($angle).'*'.$y_0;
		$x_2 = $x_1.'+'.$center->x;
		$y_2 = $y_2.'+'.$center->y;
		$this_rotated->equation = str_replace(['x','y'],[$x_2,$y_2]);
		return $this_rotated;
	}
	
	public function translation($point)
	{
		$this_translated = $this;
		$x = 'x+'.$point->x;
		$y = 'y+'.$point->y;
		$this_translated->equation = str_replace(['x','y'],[$x,$y]);
		return $this_translated;
	}
	
		/*
	1. Function
		Sort rectangles in according to the order of center
		(both x and y coordinates are decreasing, x first)
	2. Input
		$rectangle_1,$rectangle_2: rectangles
	3. Output
		
	*/
	public function usort_rectangle_descending($rectangle_1,$rectangle_2)
	{
		if ($rectangle_1->center->x > $rectangle_2->center->x)
		{
			return 1;
		}
		else if ($rectangle_1->center->x < $rectangle_2->center->x)
		{
			return -1;
		}
		if ($rectangle_1->center->y > $rectangle_2->center->y)
		{
			return 1;
		}
		else if ($rectangle_1->center->y < $rectangle_2->center->y)
		{
			return -1;
		}
		return 0;

	}
	
	
	
}




class M_Curve_equation extends M_Curve
{
	public $expression;
	
	public function __construct($equation,$domain)
	{
		parent::__construct($this->javascript_to_php($equation),$domain);
		
		$sides = explode('==',$equation);
		$this->expression = $sides[0].'-'.$side[1];
	}
	
	/*
	1. Function
		Change javascript math expression to php math expression
	2. Input
		$javascript: javascript string
	3. Output
		php string
	*/
	private function javascript_to_php($javascript)
	{
		$replacements = [];
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
	
	
	
	
	public function set_rectangle()
	{	
		$rectangles = [];
		$rectangle_size = new M_Tuple(0.5,0.5)
		
		$rectangles_number = new M_Class('x','y');
		$rectangles_number->x = ceil($this->domain->x->max-$this->domain->x->min)/$rectangle_size->x;
		$rectangles_number->y = ceil($this->domain->y->max-$this->domain->y->min)/$rectangle_size->y;

        
		$xs = [];
		$xs[0] = $this->domain->x->min;

		$ys = [];
		$ys[0] = $this->domain->y->min;
		$ys[1] = $this->domain->y->max+$rectangle_size->x;

		$values_y = [];
		$values_y[0] = str_replace('y',$ys[0],$this->expression);
		$values_y[1] = str_replace('y',$ys[1],$this->expression);

		$signs = [];
		$signs[0] = [];
		$signs[0][0] = M_math::sign(eval(str_replace('x',$xs[0],$values_y[0]).';'));
		$signs[0][1] = M_math::sign(eval(str_replace('x',$xs[0],$values_y[1]).';'));

		for ($i_x = 1; $i_x <= $rectangles_number->x; $i_x++)
		{

			$signs[$i_x] = [];
			$signs[$i_x][0] = M_math::sign(eval(str_replace('x',$xs[$i_x],$values_y[0])));
			$signs[$i_x][1] = M_math::sign(eval(str_replace('x',$xs[$i_x],$values_y[1])));
			if (abs($signs[$i_x-1][0]+$signs[$i_x-1][1]+$signs[$i_x][0]+$signs[$i_x][1]) < 4)
			{
				$interval2D = new M_Interval2D(new M_Interval($xs[$i_x-1],$xs[$i_x]),new M_Interval($ys[0],$ys[1]));
				$rectangles[] = new M_Rectangle_interval2D($interval2D,0);
			}
		}
		for ($i_y = 2; $i_y <= $rectangles_number->y; $i_y++)
		{
			$ys[$i_y] = $this->domain->x->min+$i_y*$rectangle_size->x;
			$values_y[$i_y] = str_replace('y',$ys[$i_y],$curve->equation);
			for ($i_x = 1; $i_x <= $rectangles_number->x; $i_x++)
			{
				$signs[$i_x][$i_y] = new M_math::sign(eval(str_replace('x',$xs[$i_x],$values_y[$i_y])));
				if (abs($signs[$i_x-1][$i_y-1]+$signs[$i_x-1][$i_y]+$signs[$i_x][$i_y-1]+$signs[$i_x][$i_y]) < 4)
				{
					$interval2D = new M_Interval2D(new M_Interval($xs[$i_x-1],$xs[$i_x]),new M_Interval($ys[$i_y-1],$ys[$i_y]));
					$rectangles[] = new M_Rectangle_interval2D($interval2D,0);
				}
			}
		}

		return new M_Set_rectangle($rectangles);
	}
		
	
	
	
}



/*
1. Object
	Curve2D expression form
		absolute: y=a|x+b|+c
		cubic: y=ax^3+bx^2+cx+d
		exponential: y=a*b^(x+c)+d
		inverse_proportion: y=a/x
		linear: y=ax+b
		logarithmic: y=a*log(x+b,c)+d
		quadratic: y=a*x^2+b*x+c
		rational: y=a/(x+b)+c
		sine: y=a*sin(b*x+c)+d
		square_root: y=a*sqrt(b*x+c)+d
		tangent: y=a*tan(b*x+c)+d
2. Properties
	
3. methods
	
*/

class M_Curve_expression extends M_Curve
{
	public $expression_x;
	public $type_curve;
	function __construct($type_curve,$domain)
	{
		$this->type_curve = $type_curve;
		switch ($this->type_curve)
		{
			case 'absolute'://y=2|x| (y=a|x|)
			{
				$this->expression_x = '2*abs(x)';
				break;
			}
			case 'cubic'://y=x^3
			{
				$this->expression_x = 'pow(x,3)';
				break;
				
			}
			case 'exponential'://y=2^x (y=a^x)
			{	
				$this->expression_x = 'pow(2,x)';
				break;
				
			}
			case 'inverse_proportion'://y=1/x
			case 'rational'://y=1/x
			{
				$this->expression_x = '1/x';
				break;
			}
			case 'linear'://y=1.1x+0.5 (y=ax+b)
			{
				$this->expression_x = '1.1*x+0.5';
				break;
			}
			case 'logarithmic'://y=log(x)/log(a)
			{
				$this->expression_x = 'log(x)/log(10)';
				break;
				
			}
			case 'quadratic'://y=x^2
			{
				$this->expression_x = 'pow(x,2)';
				break;
			}

			case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
			{
				$this->expression_x = 'sin(M_PI/2*x)';
				break;
			}
			case 'square_root': //y=sqrt(x)
			{
				$this->expression_x = 'sqrt(x)';
				break;
			}
			case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
			{
				$this->expression_x = 'tan(M_PI/4*x)';
				break;
			}
		}
		parent::__construct($this->expression_x.'-y',$domain)
		$this->equation = 'y=='.$this->expression_x
	}
	
	public function points()
	{
		$points = [];
		switch ($this->type_curve)
		{
			case 'absolute'://y=2|x| (y=a|x|)
			{
				$a = 2;
				$points_size = ceil(min($a*abs($curve->domain->x->max),$curve->domain->y->max));
				for ($i = 0; $i <= $points_size; $i++)
				{
					$points[] = new M_Point($i/$a,$i);
					$points[] = new M_Point(-$i/$a,$i);
				}
				break;
			}
			case 'cubic'://y=x^3
			{
				$points_size = ceil(min(pow($bounds->x->max,3),$curve->domain->y->max));
				for ($i = 0; $i <= $points_size; $i++)
				{
					$point = new M_Point(pow($i,1/3),$i);
					$points[] = $point;
					$points[] = new M_Point(-$point->x,-$point->y);

				}

				break;
			}
			case 'exponential'://y=2^x (y=a^x)
			{
				$a = 2;
				$points_size_negative = ceil(abs($curve->domain->x->min);
				for ($i = 0; $i <= $points_size_negative; $i++)
				{
					$points[] = new M_Point(-$i,pow($a,-$i));
				}

				$points_size_positive = ceil($curve->domain->y->max);
				for ($i = 1; $i <= $points_size_positive; $i++)
				{
					$points[] = new M_Point(log($i)/log($a),$i);
				}

				break;

			}
			case 'inverse_proportion'://y=1/x
			case 'rational'://y=1/x
			{
				$points_size_x = ceil($curve->domain->x->max);
				$points_size_y = ceil($curve->domain->y->max);
				for ($i = 1; $i <= $points_size_x; $i++);
				{
					$points[] = new M_Point($i,1/$i);
					$points[] = new M_Point(-$i,-1/$i);
				}
				for ($i = 0; $i <= $points_size_y; $i++)
				{
					$points[] = new M_Point(1/$i,$i);
					$points[] = new M_Point(-1/$i,$i);
				}
				break;

			}
			case 'linear'://y=1.1x+0.5 (y=ax+b)
			{
				$a = 1.1;
				$b = 0.5;
				$y_min = $a*$bounds->x->min+$b;
				if ($bounds->y->min <= $y_min)
				{
					$point_min = new M_Point($curve->domain->x->min,$y_min]);
				}
				else
				{
					$point_min = new M_Point(($curve->domain->y->min-$b)/$a,$bounds->y->min);
				}
				$y_max = $a*$bounds->x->max+$b;
				if ($y_max <= $bounds->y->max)
				{
					$point_max = new M_Point($curve->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point(($curve->domain->y->max-$b)/$a,$bounds->y->max);
				}
				if ($a <= 1)
				{
					$index_min = floor($point_min->x);
					$index_max = ceil($point_max->x);
					for ($i = $index_min; $i <= $index_max; $i++)
					{
						$points[] = new M_Point($i,$a*$i+$b);
					}

				}
				else
				{
					$index_min = floor($point_min->y);
					$index_max = ceil($point_max->y);
					for ($i = $index_min; $i <= $index_max; $i++)
					{
						$points[] = new M_Point(($i-$b)/$a,$i);
					}
				}
				break;

			}
			case 'logarithmic'://y=log(x)/log(a)
			{
				$a = 2;
				$y_min = log($bounds->x->min)/log($a);
				$index_min = floor(max(log($curve->domain->x->min)/log($a),$curve->domain->y->min));
				$y_max = ;
				if (log($curve->domain->x->max)/log($a) <= $curve->domain->y->max)
				{
					$index_max = ceil($curve->domain->x->max);
					$point_max = new M_Point($curve->domain->x->max,$y_max);
				}
				else
				{
					$index_max = ceil(pow($a,$curve->domain->y->max));
				}

				for ($i = $index_min; $i <= 0; $i++)
				{
					$points[] = new M_Point(pow($a,$i),$i);
				}

				for ($i = 1; $i <= $index_max; $i++)
				{
					$points[] = new M_Point($i,log($i)/log($a));

				}

				break;
			}
			case 'quadratic'://y=x^2
			{
				$y_max = pow($curve->domain->x->max,2);
				$points_number = ceil(min(pow($curve->domain->x->max,2),$curve->domain->y->max));
				for ($i = 0; $i <= $points_number; $i++)
				{
					$point = new M_Point($i,pow($i,2));
					$points[] = $point;
					$points[] = new M_Point(-$point->x,$point->y);
				}

				break;
			}

			case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
			{
				$a = M_PI/2;
				$period = 2*M_PI/$a;
				$points_number = 3
				$index_min = floor($curve->domain->x->min/$period);
				$index_max = ceil($curve->domain->x->max/$period);
				for ($i  = 0; $i <= $points_number; $i++)
				{
					for ($j = $index_min;$j < $index_max)
					{
						$points[] = new M_Point($i/2+$period*$j,sin($a*($i/2+$period*$j));
					}
				}
				break;
			}
			case 'square_root': //y=sqrt(x)
			{
				$index_max = ceil($curve->domain->x->max);
				for ($i = 0;$i <= $index_max; $i++)
				{
					$points[] = new M_Point($i/2,sin($i/2));
				}
				break;
			}
			case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
			{
				$a = M_PI/4;
				$period = M_PI/$a;
				$index_min = floor($curve->domain->y->min);
				$index_max = ceil($curve->domain->y->max);
				$index_min_graph = floor($curve->domain->x->min/$period);
				$index_max_graph = ceil($curve->domain->x->max/$period);
				for ($i = $index_min; $i <= $index_max; $i++)
				{
					for ($j = $index_min_graph; $j <= $index_max_graph; $j++)
					{
						$points[] = new M_Point($i+$period*$j,tan($i+$period*$j));
					}
				}
				break;
			}
		}
		return usort($curve_points,'$this->usort_point_descending');

	}
	
	public function set_rectangle()
	{
		$rectangles = [];
		switch ($this->type_curve)
		{
			
			case 'absolute'://y=2|x| (y=a|x|)
			{
				$a = 2;
				$y_max = $a*abs($this->domain->x->max);
				if ($y_max <= $bounds->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point($this->domain->y->max/2,$this->domain->y->max);
				}
				$point_min = new M_Point(0,0);
				
				$center = $point_min->addition($point_max)->multiplication_scalar(0.5);
				$width = 2*$point_min->distance($point_max);
				$size = new M_Tuple($width,0);
				$rotation = $point_min->vector_angle($point_max);
				$rectangle = new M_Rectangle($center,$size,$rotation);
				$rectangles[] = $rectangle;
				
				$rectangle->center->x *= -1;
				$rectangle->rotation = M_math::angle_polar(M_PI-$rotation);
				$rectangles[] = $rectangle;
				break;
			}
			case 'cubic'://y=x^3
			{
				$y_max = pow($this->domain->x->max,3);
				if ($y_max <= $this->domain->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point(pow($this->domain->y->max,1/3),$this->domain->y->max);
				}
				$rectangles_number = ceil($point_max->y);
				for ($i = 0; $i < $rectangles_number; $i++)
				{
					$start = new M_Point($i,pow($i,3));
					$end = new M_Point($i+1,pow($i+1,3));
					$point_tangent_x = sqrt(tan($start->vector_angle($end))/3);
					$point_tangent_y = pow($point_tangent_x,3);
					$point_tangent = new M_Point($point_tangent_x,$point_tangent_y);
					$segment = new M_Segment($start,$end);
					$rectangle = new M_Rectangle_segment($segment,-$point_tangent->distance($segment));
					$rectangles[] = $rectangle;
					
					$rectangle->center->multiplication_scalar(-1);
					$rectangle->rotation = M_math::angle_polar(-$rectangle->rotation);
					$rectangles[] = $rectangle;
				}

				break;
			}
			case 'exponential'://y=2^x (y=a^x)
			{
				$a = 2;
				$y_min = pow($a,$this->domain->x->min);
				if ($this->domain->y->min <= $y_min)
				{
					$point_min = new M_Point($this->domain->x->min,$y_min);
				}
				else
				{
					$point_min = new M_Point(log($this->domain->y->min)/log($a),$this->domain->y->min);
				}
				$y_max = pow($a,$this->domain->x->max;
				if ($y_max <= $this->domain->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point(log($this->domain->y->max)/log($a),$this->domain->y->max);
				}
				$points = [];
				$points[0] = $point_min;
				$points[1] = new M_Point(-1,pow($a,-1));
				$points[2] = new M_Point(1,pow($a,1));
				$points[3] = $point_max;
				$points_size = sizeof($points);
				for ($i = 0; $i < $points_size; $i++)
				{
					$point_tangent_x = log(tan($points[$i]->vector_angle($points[$i+1]))/log($a))/log($a);
					$point_tangent_y = pow($a,$point_tangent_x);
					$point_tangent = new M_Point($point_tangent_x,$point_tangent_y);
					$segment = new M_Segment($points[$i],$points[$i+1]);
					$rectangles[] = new M_Rectangle_segment($segment,-$point_tangent->distance($segment);
				}
				break;

			}
			case 'inverse_proportion'://y=1/x
			case 'rational'://y=1/x
			{

				$point_min = new M_Point($this->domain->x->max,1/$this->domain->x->max);
				$point_max = new M_Point(1/$this->domain->y->max,$this->domain->y->max);
				$points = [];
				$points[0] = $point_min;
				$points[1] = new M_Point(1,1);
				$points[2] = $point_max;
				$points_size = sizeof($points);
				for ($i = 0; $i < $points_size; $i++)
				{
					$segment = new M_Segment($points[$i],$points[$i+1])
					$x = sqrt(-1/tan($segment->angle());
					$point_tangent = new M_Point($x,1/$x);
					$rectangle = new M_Rectangle_segment($segment,$point_tangent->distance($segment));
					$rectangles[] = $rectangle;
					
					
					$interval_x = new M_Interval(-$rectangle->size->x->max,-$rectangle->size->x->max);
					$interval_y = new M_Interval(-$rectangle->size->y->max,-$rectangle->size->y->min);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($interval_x,$interval_y),M_math::angle_polar(-$rectangle->rotation));
				}

				break;

			}
			case 'linear'://y=1.1x+0.5 (y=ax+b)
			{
				$a = 1.1;
				$b = 0.5;
				$y_min = $a*$this->domain->x->min+$b;
				if ($this->domain->y->min <= $y_min)
				{
					$start =new M_Point($this->domain->x->min,$y_min);
				}
				else
				{
					$start = new M_Point(($this->domain->y->min-$b)/$a,$this->domain->y->min);
				}
				$y_max = $a*$this->domain->x->max+$b;
				if ($y_max <= $this->domain->y->max)
				{
					$end = new M_Point($this->domain->y->min,$y_max);
				}
				else
				{
					$end = new M_Point(($this->domain->y->max-$b)/$a,$this->domain->y->max);
				}
				$rectangles[] = new M_Rectangle_segment(new M_Segment($start,$end),0);
				break;

			}
			case 'logarithmic'://y=log(x)/log(a)
			{
				$a = 2;
				$y_min = log($this->domain->x->min)/log($a);
				if ($this->domain->y->min <= $y_min)
				{
					$point_min = new M_Point($this->domain->x->min,$y_min);
				}
				else
				{
					$point_min = new M_Point(pow($a,$this->domain->y->min),$this->domain->y->min);
				}
				$y_max = log($this->domain->x->max)/log($a);
				if ($y_max <= $this->domain->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point(pow($a,$this->domain->y->max),$this->domain->y->max);
				}
				$points = [];
				$points[0] = $point_min;
				$points[1] = new M_Point(pow($a,-1),-1);
				$points[2] = new M_Point(2,log($a)/log(2));
				$points[3] = $point_max;
				$points_size = sizeof($points);
				for ($i = 0; $i < $points_size; $i++)
				{
					$segment = new M_Segment($points[$i],$points[$i+1]);
					$x = sqrt(-1/tan($segment->angle()));
					$point_tangent = new M_Point($x,log($x)/log($a));
					
					$rectangles[] = new M_Rectangle_segment($segment,$point_tangent->distance($segment));
				}

				break;;
			}
			case 'quadratic'://y=x^2
			{
				$y_max = pow($this->domain->x->max,2);
				if ($y_max <= $this->domain->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max)
				}
				else
				{
					$point_max = new M_Point(sqrt($this->domain->y->max),$this->domain->y->max);
				}

				$points = [];
				$points[0] = new M_Point(0,0);
				$points[1] = new M_Point(1,1);
				$points[2] = $point_max;
				$points_size = sizeof($points);
				for ($i = 0; $i < $points_size; $i++)
				{
					$point_tangent = new M_Point;
					$point_tangent->x = tan($points[$i]->vector_angle($points[$i+1]))/2;
					$point_tangent->y = pow($point_tangent->x,2);
										
					$segment = new M_Segment($points[$i],$points[$i+1]);
					$rectangle = new M_Rectangle_segment($segment,-$point_tangent->distance($segment));
					$rectangles[] = $rectangle;
					
					$interval_x = new M_Interval(-$rectangle->size->x->max,-$rectangle->size->x->min);
					$interval_y = new M_Interval($rectangle->size->y->min,$rectangle->size->y->max);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($interval_x,$interval_y),M_math::angle_polar(M_PI-$rectangle->rotation));
					
				}


				break;;
			}

			case 'sine'://y=sin((pi/2)*x) (y=sin(ax))
			{
				$a = M_PI/2;
				$period_half = M_PI/$a;
				$period_half_numbers = ceil($this->domain->x->max/$period_half);

				$start = new M_Point(0,0);
				$end = new M_Point($period_half/2,1);
				$x = acos(tan($start->vector_angle($end)/$a))/$a
				$point_tangent = new M_Point($x/$a,sin($a*$x));
				$segment = new M_Segment($start,$end);
				$height = $point_tangent->distance($segment);
				$rectangle = new M_Rectangle_segment($segment,pow(-1,$i)*$height);
				$rectangles[] = $rectangle;
				
				$rectangle->center->multiplication_scalar(-1);
				$rectangle->rotation = M_math::angle_polar(-$rectangle->rotation);
				$rectangles[] = $rectangle;
				
				for ($i = 1; $i < $period_half_numbers; $i++)
				{
					$start->x += $period_half;
					$end->x += $period_half;
					$end->y *= -1;
					$rectangle = new M_Rectangle_segment(new M_Segment($start,$end),pow(-1,$i)*$height);
					$rectangles[] = $rectangle;
					
					$rectangle->center->multiplication_scalar(-1);
					$rectangle->rotation = M_math::angle_polar(-$rectangle->rotation);
					$rectangles[] = $rectangle;
				}
				break;
			}
			case 'square_root': //y=sqrt(x)
			{
				$y_max = sqrt($this->domain->x->max);
				if ($y_max <= $this->domain->y->max)
				{
					$point_max = new M_Point($this->domain->x->max,$y_max);
				}
				else
				{
					$point_max = new M_Point(pow($this->domain->y->max,2),$this->domain->y->max);
				}
				$points = [];
				$points[0] = new M_Point(0,0);
				$points[1] = new M_Point(1,1);
				$points[2] = $point_max;
				$points_size = sizeof($points);
				for ($i = 0; $i < $points_size; $i++)
				{
					$segment = new M_Segment($points[$i],$points[$i+1]);
					$x = pow(1/(2*tan($segment->angle()))),2);
					$point_tangent = new M_Point($x,sqrt($x));
					$height = $point_tangent->distance($segment);
					$rectangles[] = new M_Rectangle_segment($segment,$height);

					$start = $end;

				}
				while ($start->x < $point_max->x && $start->y < $point_max->y);

				break;;
			}
			case 'tangent'://y=tan((pi/4)*x) (y=tan(ax))
			{
				$a = M_PI/4;
				$period = M_PI/$a;
				$periods_number_half = ceil(($this->domain->x->max-$this->domain->x->min)/$period)/2;
				
				$start = new M_Point(0,0);
				$end = new M_Point(atan(2)/$a,2);
				$x = acos(1/sqrt(tan($start->vector_angle($end))));
				$point_tangent = new M_Point($x,tan($a*$x));
				$segment = new M_Segment($start,$end);
				
				$rectangle_11 = new M_Rectangle_segment($segment,-$point_tangent->distance($segment));
				$rectangles[] = $rectangle_11;
				
				$rectangle_12 = $rectangle_11;
				$rectangle_12->center = $rectangle_12->center->multiplication_scalar(-1);
				$rectangle_12->rotation = M_math::angle_polar(-$rectangle_12->rotation);
				$rectangles[] = $rectangle_12;
				
				$start = $end;
				$end = new M_Point(atan($this->domain->y->max)/$a,$this->domain->y->max);
				$x = acos(1/sqrt(tan($start->vector_angle($end))));
				
				$point_tangent = new M_Point($x,tan($a*$x);
				$segment = new M_Segment($start,$end);
				
				$rectangle_21 = new M_Rectangle_segment($segment,-$point_tangent->distance($segment));
				$rectangles[] = $rectangle_21;
				
				$rectangle_22 = $rectangle_21;
				$rectangle_22->center = $rectangle_22->center->multiplication_scalar(-1);
				$rectangle_22->rotation = M_math::angle_polar(-$rectangle_22->rotation);
				$rectangles[] = $rectangle_22;
				for ($i = 1; $i < $periods_number_half; $i++)
				{
					
					$interval_x = new M_Interval($rectangle_11->size->x->min+$i*$period,$rectangle_11->size->x->max+$i*$period);
					$interval_y = new M_Interval($rectangle_11->size->y->min,$rectangle_11->size->y->max);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($interval_x,$interval_y),$rectangle_11->rotation);
					
					$interval_x = new M_Interval($rectangle_12->size->x->min-$i*$period,$rectangle_12->size->x->max-$i*$period);
					$interval_y = new M_Interval($rectangle_12->size->y->min,$rectangle_12->size->y->max);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($bounds_x,$bounds_y),$rectangle_12->rotation);
					
					$interval_x = new M_Interval($rectangle_21->size->x->min+$i*$period,$rectangle_21->size->x->max+$i*$period);
					$interval_y = new M_Interval($rectangle_21->size->y->min,$rectangle_21->size->y->max);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($bounds_x,$bounds_y),$rectangle_21->rotation);
					
					$interval_x = new M_Interval($rectangle_22->size->x->min-$i*$period,$rectangle_22->size->x->max-$i*$period);
					$interval_y = new M_Interval($rectangle_22->size->y->min,$rectangle_22->size->y->max);
					$rectangles[] = new M_Rectangle_interval2D(new M_Interval2D($bounds_x,$bounds_y),$rectangle_22->rotation);
					   

				}
				break;
			}
	
		}
		return new M_Set_rectangle($rectangles);
	
	}	
	
	/*
	1. 기능
		두 point를 비교해 usort에 쓰기 위한 function (usort 참조)
	2. 입력
		$point_1: point
		$point_2: point
	3. 출력

	*/

	public function usort_point_descending($point_1,$point_2)
	{
		if ($point_1->x > $point_2->x)
		{
			return 1;
		}
		else if ($point_1->x < $point_2->x)
		{
			return -1;
		}
		if ($point_1->y > $point_2->y)
		{
			return 1;
		}
		else if ($point_1->y < $point_2->y)
		{
			return -1;
		}
		return 0;

	}
	
		
	
}







/*
1. Object
	Label
2. Properties
	
3. Methods
	
*/
class M_Label
{
	public $coord;
	public $label;
	public $size;
	public $type = 'Label';
	public $id_object;
	public $id;
	
	public $json_original;
			
	public function __construct($coord,$label)
	{
		$this->coord = $coord;
		$this->label = $label;
		$this->size = $this->label->size();
		
		
	}
	
	
	
	public function json()
	{
		$label = $this->json;
		$label['coord'] = ['x' => $this->x,'y' => $this->coord->y];
		$label_json['label']['content'] = $this->label->latex;
		$label['id'] = $label->id;
		$label['labeledObject'] = $this->id_object;
		
		return $label;
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		
		$this_rotated->coord = $this->coord->rotation($angle,$center);
		return $this_rotated;
		
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->coord = $this->coord->addition($translation);
		return $this_translated;
	}
	
	public function polygon()
	{
		return new $this->label->polygon();
	}
		
}







/*
1. Object
	2D (segment) meausre
2. Properties
	
3. methods
	
*/
class M_Measure
{
	
	public $height;
	
	public $type = 'Measure';
	public $id;
	
	public $label;
	public $color;
	
	
    public function __construct($segment_start,$segment_end,$height)
	{
		$this->start = $segment_start;
		$this->end = $segment_end;
		$this->height = $height;
		
	}
	
		
		
	public function angles()
	{
		$angles = new M_Class('start','end');
		$angles->start = M_math::angle_polar(M_math::sign($this->height)*(M_PI/2-M_math::atan2_polar(abs($this->height)*2,$this->start->distance($this->end)/2)));
		$angles->end = M_math::angle_polar(2*M_PI-$angle->start);
	}
	
	
	
	public function label_coord()
	{
		$segment_length = $this->start->distance($this->end);
		$midpoint = $this->start->addition($this->end)->multiplication_scalar(0.5);
		return $this->start->multiplication_scalar(0.25/$segment_length)->rotation(M_math::sign($this->height)*M_PI/2,$midpoint);
		
	}
	
	
	
	
	
	
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->center = $this->center->rotation($angle,$center);
		$this_rotated->start = $this->start->rotation($angle,$center);
		$this_rotated->end = $this->end->rotation($angle,$center);
		
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->center = $this->center->addition($translation);
		$this_translated->start = $this->start->addition($translation);
		$this_translated->end = $this->end->addition($translation);
		
		return $this_translated;
	}
	
	
	
}


/*
1. Object
	2D arc meausre
2. Properties
	
3. methods
	
*/
class M_Measure_arc
{
	
	public $center;
	public $start;
	public $angle;
	public $height;
	public $label;
	public $marker;
	public $id;
	public $id_object;
	public $type = 'Measure_arc';
	
		
    public function __construct($center_arc,$start_arc,$angle_arc,$height)
	{
		$this->center = $center_arc;
		$this->height = $height;
		$this->angle = $angle_arc;
		$vector_start = new M_Point_polar($this->height,$center_arc->vector_angle($start_arc));
		$this->start = $start_arc->addition($vector_start);
		
		
		$this->id = $id;
		
	}
	
	
	
	
	public function angle_start()
	{
		return $this->center->vector_angle($this->start);
	}
	
	public function angle_end()
	{
		return $this->center->vector_angle($this->end);
	}
	
	public function end()
	{
		return $this->start->rotation($this->center,$this->angle);
	}
	
	
	public function label_coord($height_min = 0.5)
	{
		$height = max($this->y,$height_min);
		$label_coord = $this->start->rotation($this->angle()/2,$this->center);
		return $label_coord;
	}

	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->center = $this->center->rotation($angle,$center);
		$this_rotated->start = $this->start->rotation($angle,$center);
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->center = $this->center->addition($translation);
		$this_translated->start = $this->start->addition($translation);
		return $this_translated;
	}
	
	
	
}












/*
1. Object
	Path
2. Properties
	
3. Methods
	
*/
class M_Path
{
	public $vertices;
	public $label;
	public $id;
	public $type = 'Path';
	public $json_original;
		
	public function __construct($vertices)
	{
		$this->vertices = $vertices;
		
		
	}
	
	
	
	public function edges()
	{
		$edges_size = sizeof($vertices)-1;
		$edges = [];
		for ($i = 0; $i < $edges_size; $i++)
		{
			$edges[$i] = new M_Segment($vertices[$i],$vertices[$i+1]);
		}
		return $edges;
	}
	
	public function is_crossing($object)
	{
		switch ($object->type())
		{
			case 'Segment':
			{
				$segment = $object;
				$this_edges = $this->edges();
				foreach ($this_edges as $edge)
				{
					if ($edge->is_crossing($segment))
					{
						return true;
					}
				}
				return false;
			}
		}
	}
	
	public function json()
	{
		$path = $this->json;
		$path['coords'] = [];
		foreach ($this->vertices as $point)
		{
			$path['coords'][] = ['x' => $point->x,'y' => $point->y];
		}
		$path['id'] = $this->id;
		
		
		return $path;
	}
	
	public function set_rectangle()
	{
		$path_edges = $path->edges();
		$rectangles = [];
		foreach ($path_edges as $edge)
		{
			$rectangles[] = new M_Rectangle_segment($edge,0);
		}
		return new M_Set_rectangle($rectangles);
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		foreach ($this->vertices as $key => $vertex)
		{
			$this_rotated->vertices[$key] = $vertex->rotation($angle,$center);
		}
		return $this_rotated
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		foreach ($this->vertices as $key = $vertex)
		{
			$this_translated->vertices[$key] = $vertex->addition($translation);
		}
	}
	
	
	
	
	
	
		
}













/*
1. Object
	Point
2. Properties
	
3. Methods
	
*/
class M_Point
{
	public $x;
	public $y;
	public $label;
	public $id;
	public $type = 'Point';
	public $json_original;
	
	private $error = 0.01;
			
	public function __construct($x,$y)
	{
		$this->x = $x;
		$this->y = $y;
	}
	
	
	
	public function addition($point)
	{
		$point_added = $this;
		$point_added->x += $point->x;
		$point_added->y += $point->y;
		return $point_added;
	}
	
	public function affine_sum($t,$point)
	{
		$affine_sum = $this;
		$affine_sum->x = $t*$affine_sum->x+(1-$t)*$point->x;
		$affine_sum->y = $t*$affine_sum->y+(1-$t)*$point->y;
		return $affine_sum;
	}
	
	public function angle()
	{
		return 	sqrt(pow($this->x,2)+pow($this->y,2));
	}
	
	public function distance($object)
	{
		switch ($object->type)
		{
			case 'Point':
			{
				$point = $object;
				return sqrt(pow($this->x-$point->x,2)+pow($this->y-$point->y,2));
			}
			case 'Segment':
			{
				$segment = $object;
				$segmenet_vector = $segment->vector();
				return abs($segmenet_vector->y*$this->x-$segmenet_vector->x*$this->y+($segment->end->x*$segment->start->y-$segment->end->y*$segment->start->x))/$segmenet_vector->norm();
			}
		}
	}
	
	
	public function inner_product($point)
	{
		return $this->x*$point->x+$this->y*$point->y;
	}
	
	
	
	public function is_contained($object)
	{
		switch ($object->type)
		{
			case 'Arc':
			{
				$arc = $object;
				if (!$this->is_equal_approximately($arc->center) &&
					abs($this->distance($arc->center)-$arc->center->distance($arc->start)) < 0.1 &&
					M_math::angle_polar($arc->center->vector_angle($this)-$arc->center->vector_angle($arc->start)) <= $arc->angle+deg2rad(1))
				{
					return true;
				}
				return false;
			}
			case 'Rectangle':
			{
				$rectangle = $object;
				$point_rotated = $this->rotation($rectangle->rotation,$rectangle->center);
				if (abs($point_rotated->x-$rectangle->center->x)<= $rectangle->size->x/2 && 
					abs($point_rotated->y-$rectangle->center->y)<= $rectangle->size->y/2)
				{
					return true;
				}
				return false;
			}
			case 'Segment':
			{
				$segment = $object;
				if ($this->is_equal_approximately($segment->start))
				{
					return true;
				}
				if ($this->is_equal_approximately($segment->end))
				{
					return true;
				}
				if (M_math::is_equal_approximately_angle($this->vector_angle($segment->start),$this->vector_angle($segment->end)))
				{
					return true;
				}
				return false;
			}
		}
	}
	
	public function is_contained_strictly($object)
	{
		switch ($object->type)
		{
			case 'Arc':
			{
				$arc = $object;
				if ($this->is_contained($arc) && 
					!$this->is_equal_approximately($arc->start) &&
					!$this->is_equal_approximately($arc->end))
				{
					return true;
				}
				return false;
			}
			case 'Segment':
			{
				$segment = $object;
				if ($this->is_contained($segment) &&
					M_math::is_equal_approximately_angle($this->vector_angle($segment->start)-$this->vector_angle($segment->end),M_PI))
				{
					return true;
				}
				return false;
			}
		}
		
	}
	
	public function is_equal($point)
	{
		if ($this->x != $point->x || $this->y != $this->y)
		{
			return false;
		}
		return true;
	}
	
	public function is_equal_approximately($point,$error = 0.01)
	{
		if ($this->distance($point) < $error)
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
	public static function is_equal_approximately_one_of($points)
	{
		foreach ($points as $point)
		{
			if ($this->is_approximately_equal($point))
			{
				return true;
			}
		}
		return false;
		
	}
	
	
	public function is_surrounded_by_set_interval_angle($set_interval_angle)
	{
		$angles = [];
		foreach ($set_interval_angle->intervals_angle as $interval_angle)
		{
			$angle_part_number = ceil(rad2deg($interval_angle->start));
			for ($i = 0; $i <= $angle_part_number; $i++)
			{
				$angles[] = M_math::mod($interval_angle->start+$i,360);
			}
		}

		if (sizeof(array_unique($angles)) >= 360)
		{
			return true;
		}
		return false;
	}
	
	public function is_within($point,$radius)
	{
		if ($this->distance($point) <= $radius)
		{
			return true;
		}
		return false;
	}
	
	public function json()
	{
		$point = $this->json;
		$point['coord'] = ['x' => $this->x,'y' => $this->y];
		
		$point['id'] = $this->id;
		
		return $point;
	}
	
	public function multiplication_entrywise($point)
	{
		$point_multiplied = $this;
		$point_multiplied->x *= $point->x;
		$point_multiplied->y *= $point->y;
		return $point_multiplied;
	}
	
	public function multiplication_scalar($scalar)
	{
		$point_multiplied = $this;
		$point_multiplied->x *= $scalar;
		$point_multiplied->y *= $scalar;
		return $point_multiplied;
	}
	
	
	public function norm()
	{
		return sqrt(pow($this->x,2)+pow($this->y,2));
	}
	
	public function points_distance_max($points)
	{
		$distance_max = 0;
		foreach ($points as $point)
		{
			$distance_max = max($distance_max,$this->distance($point));
		}
		return $distance_max;
	}
	
	
	
	
	
	
	
	public function rectangle_distance_max($rectangle)
	{
		$x = $rectangle->center->x+M_math::sign($rectangle->center->x-$this->x)*$rectangle->size->x/2;
		$y = $rectangle->center->y+M_math::sign($rectangle->center->y-$this->y)*$rectangle->size->y/2;
				
		return $this->distance(new M_Point($x,$y));

	}
	
	public function segments_measure_direction_number($segments)
	{
		$segments_measure = [];
		foreach ($segments as $segment)
		{
			if ($segment->measure->height &&
				$this->is_contained_strictly($segment))
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
				
				
				$segments_measure_i_angle = $segments_measure[$i]->angle();
				$segments_measure_i_measure_height_sign = M_math::sign($segments_measure[$i]->measure->height);
				$different_direction_number = 0;

				for ($j = 0; $j < $i; $j++)
				{
					
					$segments_measure_j_angle = $segments_measure[$j]->angle();
					$segments_measure_j_measure_height_sign = M_math::sign($segments_measure[$j]->meausure->height);

					if ((!M_math::is_equal_approximately_angle($segments_measure_i_angle,$segments_measure_j_angle) &&
						 !M_math::is_equal_approximately_angle($segments_measure_i_angle-$segments_measure_j_angle,M_PI) ||
						(M_math::is_equal_approximately_angle($segments_measure_i_angle,$segments_measure_j_angle) &&
						 $segments_measure_i_measure_height_sign != $segments_measure_j_measure_height_sign) ||
						(M_math::is_equal_approximately_angle($segments_measure_i_angle-$segments_measure_j_angle,M_PI) &&
						 $segments_measure_i_measure_height_sign == $segments_measure_j_measure_height_sign))
					{
						++$different_direction_number;
					}
					
				}

				if ($different_direction_number == $i-1)
				{
					++$segments_measure_direction_number;
				}
				
			}
		}

		return $segments_measure_direction_number;
	}
	
	public function rotation($angle,$center)
	{
		if (!$center)
		{
			$center = new M_Point(0,0);
		}
		$this_rotated = $this;
		$x = $this->x-$center->x;
		$y = $this->y-$center->y;
		$x_rotated = cos($angle)*$x-sin($angle)*$y;
		$y_rotated = sin($angle)*$x+cos($angle)*$y;
		
		$this_rotated->x = $x_rotated+$center->x;
		$this_rotated->y = $y_rotated+$center->y;
		return $point_rotated;
		
		
	}
	
	public function  segment_measure_distance($segment)
	{
		if ($this->is_contained($segment))
		{
			$t = sqrt($this->distance($segment->start)/$segment->length());
			return 4*abs($segment->measure->height)*$t*(1-$t);
		}
		return null;
	}
	
	
	
	public function subtraction($point)
	{
		$point_subtracted = $this;
		$point_subtracted->x -= $point->x;
		$point_subtracted->y -= $point->y;
		return $point_subtracted;
	}
	
	public function vector_angle($point)
	{
		$vector = $point->subtraction($this);
		return M_math::atan2_polar($vector->y,$vector->x);
	}
		
}

/*
1. Object
	Point
2. Properties
	
3. Methods
	
*/
class M_Point_polar extends M_Point
{
	public function __construct($radius,$angle)
	{
		parent::__construct($radius*cos($angle),$radius*sin($angle));
		
	}
		
}

/*
1. Object
	Polygon (Face)
2. Properties
	
3. Methods
	
*/
class M_Polygon
{
	public $vertices;
	public $id;
	public $type  = 'Polygon';
	public $json_original;
		
	public function __construct($vertices)
	{
		$this->vertices = $vertices;
		
		
	}
	
	
	public function center_between_halflines($point,$interval_angle,$distance_lower_bound)
	{
		$vertices = [];
		$this_centroid_vertices = $this->centroid_vertices();
		foreach ($this->vertices as $vertex)
		{
			$vertices[] = $vertex->subtraction($this_centroid_vertices)->addition($point);
		}
		
		if ($interval_angle->size >= M_PI)
		{
			$bounds = new M_Interval2D;
			$bounds->x = new M_Interval($vertices[0]->x,$vertices[0]->x);
			$bounds->y = new M_Interval($vertices[0]->y,$vertices[0]->y);
			$vertices_size = sizeof($vertices);
		
			for ($i = ; $i < $vertices_size; $i++)
			{
				$bounds->x->min = min($bounds->x->min,$vertices[$i]->x);
				$bounds->x->max = max($bounds->x->max,$vertices[$i]->x);
				$bounds->y->min = min($bounds->y->min,$vertices[$i]->y);
				$bounds->y->max = max($bounds->y->max,$vertices[$i]->y);
			}	
						
			$angle_end = $interval_angle->end();
			if (0 <= $interval_angle->start && $interval_angle->start <= M_PI &&  0 <= $angle_end && $angle_end <= M_PI))
			{
				return $point->addition(new M_Point_polar($distance_lower_bound+$bounds->y->length()/2,3*M_PI/2));
			}
			if (M_PI <= $interval_angle->start && $interval_angle->start <= 2*M_PI && M_PI <= $angle_end && $angle_end <= 2*M_PI))
			{
				return $point->addition(new M_Point_polar($distance_lower_bound+$bounds->y->length()/2,M_PI/2));
			}
			if (M_PI <= $interval_angle->start && $interval_angle->start <= 3*M_PI/2 && M_PI/2 <= $angle_end && $angle_end <= M_PI)
			{
				return $point->addition(new M_Point_polar($distance_lower_bound+$bounds->x->length()/2,0));
			}
			if (0 <= $interval_angle->start && $interval_angle->start <= M_PI/2 && 3*M_PI/2 <= $angle_end && $angle_end <= 2*M_PI)
			{
				return $point->addition(new M_Point_polar($distance_lower_bound+$bounds->x->length()/2,M_PI));
			}
		}
		$angle_half = $interval_angle->size/2;
		$angle_rotation = M_PI/2-M_math::angle_polar($interval_angle->start+$angle_half);
		$vertices_rotated = [];
		foreach ($vertices as $vertex)
		{
			$vertices_rotated[] = $vertex->rotation($angle_rotation);
		
		}	
	
		$x_abs_max = $distance_lower_bound*sin($angle_half);
		$distance = $distance_lower_bound;
	
		foreach ($vertices_rotated as $vertex)
		{
			$x_vertex_abs = abs($vertex->x);
			if ($x_vertex_abs <= $x_abs_max)
			{
				$distance = max($distance,-$vertex->y+sqrt(pow($distance_lower_bound,2)-pow($x_vertex_abs,2));
			}
			else 
			{
				$distance = max($distance,-$vertex->y+$x_vertex_abs/tan($angle_half));
			}
		}
	
		return $point->addition(new M_Point_polar($distance,$angle_center));

	}
	
	public function centroid()
	{
		$centroid = new M_Point(0,0);
		$vertices = $this->vertices;
		$vertices_size = sizeof($vertices);
		array_push($vertices,$vertices[0]);
		$area_array = [];
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$area_array[$i] = $vertices[$i]->x*$vertices[$i+1]->y-$vertices[$i]->y*$vertices[$i+1];
			$centroid->x = ($vertices[$i]->x+$vertices[$i+1]->x)*$area_array[$i];
			$centroid->y = ($vertices[$i]->y+$vertices[$i+1]->y)*$area_array[$i];
		}
		$area = array_sum($area_array)/2;
		$centroid->x /= 6*$area;
		$centroid->y /= 6*$area;
		
		return $centroid;
	}
	
	
	public function centroid_vertices()
	{
		$centroid_vertices = new M_Point(0,0);
		foreach ($this->vertices as $vertex)
		{
			$centroid_vertices = $centroid_vertices->addition($vertex);
			
		}
		$centroid_vertices = $centroid_vertices->multiplication_scalar(sizeof($this->vertices));
		return $centroid_vertices;
		
	}
	
	
	
	public function edges()
	{
		$vertices = $this->vertices;
		$vertices_size = sizeof($vertices);
		array_push($this_vertices,$vertices[0]);
		$edges = [];
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$edges[$i] = new M_Segment($vertices[$i],$vertices[$i+1]);
		}
		return $edges;
	}
	
	public function is_crossing($object);
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				$this_edges = $this->edges();
				foreach ($this_edges as $edge)
				{
					if ($edge->is_crossing($segment))
					{
						return true;
					}
				}
				return false;
			}
		}
	}
	
	public function json()
	{
		$polygon = $this->json;
		$polygon['coords'] = [];
		foreach ($this->vertices as $point)
		{
			$polygon['coords'][] = ['x' => $point->x,'y' => $point->y];
		}
		$polygon['id'] = $this->id;
		
		return $polygon;
	}
	
	

	
	public function set_rectangle()
	{
		$this_edges = $this->edges();
		$rectangles = [];
		foreach ($this_edges as $edge)
		{
			$rectangles[] = new M_Rectangle_segment($edge,0);
		}
		return new M_Set_rectangle($rectangles);
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		foreach ($this->vertices as $key => $vertex)
		{
			$this_rotated->vertices[$key] = $vertex->rotation($angle,$center);
		}
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		foreach ($this->vertices as $key => $vertex)
		{
			$this_translated->vertices[$key] = $vertex->addition($translation);
		}
		return $this_translated;
	}
	
	
	
	
}

/*
1. Object
	region
2. Properties
	
3. Methods
	
*/
class M_Region
{
	public $curves;
	public $id;
	public $type = 'Region';
	
	public $label;
	public $json_original;
	
	public function __construct($curves);
	{
		$this->curves = $curves;
	}
	
	public function json()
	{
		return $this->json;
	}
}


/*
1. Object
	Segment
2. Properties
	
3. Methods
	
*/
class M_Segment
{
	public $end;
	public $start;
	public $id;
	public $type = 'Segment';
	
	public $label;
	public $measure;
	public $parallel;
	public $color;
	public $json_original;
		
	public function __construct($start,$end)
	{
		$this->end = $start;
		$this->start = $end;
	}
	
	
	
	public function angle($direction = 1)
	{
		if ($direction == 1)
		{
			return $this->start->vector_angle($this->end);
		}
		return $this->end->vector_angle($this->start);
	}
	
	public function arm_direction($objects)
	{
		$left_number = 0;
		$right_number = 0;

		$segment_angle = $segment->angle();
		foreach ($objects as $object)
		{
			if ($segment->id !== $object->id)
			{
				if ($segment->is_crossing($object))
				{
					return null;
				}
				switch ($object->type)
				{
					case 'Segment':
					{
						$segment_1 = $object;
						if (!$this->is_parallel($segment,$segment_1))
						{
							if ($segment_1->start->is_contained_strictly($segment))
							{
								$angle_difference = M_math::angle_polar($segment_1->angle()-$segment_angle);

								if (0 < $angle_difference && $angle_difference < M_PI)
								{
									++$left_number;
								}
								else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
								{
									++$right_number;
								}
							}

							if ($segment_1->end->is_contained_strictly($segment))
							{
								$angle_difference = M_math::angle_polar($segment_1->angle(-1)-$segment_angle);

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
					case 'Arc':
					{
						$arc = $object;
						$intersections = $this->intersections($arc);

						if (sizeof($intersections) == 1)
						{
							if (!$intersections[0]->is_equal_approximately($segment->start) &&
								!$intersections[0]->is_equal_approximately($segment->end))
							{
								if ($this->is_tangent($arc))
								{
									$angle_difference = M_math::angle_polar($intersections[0]->vector_angle($arc->center)-$segment_angle);

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
									$arc_end = $arc->end();
									if ($intersections[0]->is_equal_approximately($arc->start))
									{
										$angle_difference = M_math::angle_polar(M_math::angle_polar($arc->center->vector_angle($intersections[0])+M_PI/2)-$segment_angle);

										if (0 < $angle_difference && $angle_difference < M_PI)
										{
											++$left_number;
										}
										else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
										{
											++$right_number;
										}
									}
									else if ($intersections[0]->is_equal_approximately($arc_end))
									{
										$angle_difference = M_math::angle_polar(M_math::angle_polar($arc->start->vector_angle($intersections[0])-M_PI/2)-$segment_angle);

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
					case 'Path':
					{
						if ($path->vertices[0]->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_angle-$segment->start->vector_angle($path->vertices[1]));
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
						$path_vertices_size = sizeof($path->vertices);
						
						for ($i = 1; $i < $path_vertices_size-1; $i++)
						{
							if ($path->vertices[$i]->is_contained_strictly($segment))
							{
								$angle_difference_1 = M_math::angle_polar($segment_angle-$segment->start->vector_angle($path->vertices[$i-1]));
								$angle_difference_2 = M_math::angle_polar($segment_angle-$segment->start->vector_angle($path->vertices[$i+1]));
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
						if ($path[$path_vertices_size-1]->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_angle-$segment->start->vector_angle($path->vertices[$path_vertices_size-2]));
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
					case 'Polygon':
					{
						$polygon = $object;
						$polygon_vertices = $polygon->vertices;
						$polygon_vertices_size = sizeof($polygon_vertices);
						array_push($face_vertices,$face_vertices[0]);
						if ($polygon_vertices[0]->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_angle-$segment->start->vector_angle($polygon_vertices[1]));
							if (0 < $angle_difference && $angle_difference < M_PI)
							{
								++$left_number;
							}
							else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
							{
								++$right_number;
							}
						}
						for ($i = 1; $i <= $face_vertices_size-2; $i++)
						{
							if ($face_vertices[$i]->is_contained_strictly($segment))
							{
								$angle_difference_1 = M_math::angle_polar($segment_angle-$segment->start->vector_angle($polygon_vertices[$i-1]))
								$angle_difference_2 = M_math::angle_polar($segment_angle-$segment->start->vector_angle($polygon_vertices[$i+1]))
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
						if ($polygon_vertices[$polygon_vertices_size-1]->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_angle-$segment->start->vector_angle($polygon_vertices[$polygon_vertices_size-2]))
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
	
	
	public function center()
	{
		return new $this->start->addition($this->end)->multiplication_scalar(1/2);
	}
	
	public function distance($object)
	{
		switch ($object->type())
		{
			case 'Point':
			{
				$point = $object;
				$segment_vector = $this->vector();
				return abs($segment_vector->y*$point->x-$segment_vector->x*$point->y+($this->end->x*$this->start->y-$this->end->y*$this->start->x))/$segment_vector->norm();
			}
		
		}
	}
	
	
	public function  intersections($object)
	{
		switch ($object->type)
		{
			case 'Arc':
			{
				$arc = $object;
				$vector_1 = $this->vecor(-1);
				$vector_2 = $arc->center->subtraction($this->end);

				$a = pow($this->length(),2);
				$b = $vector_1->inner_product($vector_2);
				$c = pow($vector_2->norm(),2)-pow($arc->radius(),2);

				$D = pow($b,2)-$a*$c;
				$t_1 = (-$b-sqrt($D))/$a;
				$t_2 = (-$b+sqrt($D))/$a;

				if ($D == 0 && 0 <= $t_1 && $t_1 <= 1)
				{
					return [$vector_1->multiplication_scalar($t_1)->addition($vector_2)];
				}
				if ($D > 0)
				{
					$intersections = [];
					if (0 <= $t_1 && $t_1 <= 1)
					{
						$intersections[] = $vector_1->multiplication_scalar($t_1)->addition($vector_2);
					}
					if (0 <= $t_2 && $t_2 <= 1)
					{
						$intersections[] = $vector_1->multiplication_scalar($t_2)->addition($vector_2);
					}
					return $intersections;
				}
				break;
			}
		}
	}
	
	public function is_contained($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				if ($this->start->is_contained($segment) && $this->end->is_contained($segment))
				{
					return true;
				}
				return false;
			}
		}
	}
	
	
	public function is_crossing($object)
	{
		switch ($object->type)
		{
			case 'Arc':
			{
				$arc = $object;
				$intersections = $this->intersections($arc);
				$intersections_size = sizeof($intersections);

				if ($intersections_size == 1 &&
					!$this->start->is_contained($arc) &&
					!$this->end->is_contained($arc))
				{
					return true;
				}
				if ($intersections_size == 2 && 
					!$this->is_tangent($arc) &&
					(!$this->start->is_contained($arc) || !$this->end->is_contained($arc)))
				{
					return true;
				}
				return false;
			}
			case 'Path':
			{
				$path = $object;
				$path_edges = $path->edges();
				foreach ($path_edges as $edge)
				{
					if ($this->is_crossing($edge))
					{
						return true;
					}
				}
				return false;
			}
			
			case 'Polygon':
			{
				$polygon = $object;
				$polygon_edges = $polygon->edges();
				foreach ($polygon_edges as $edge)
				{
					if ($this->is_crossing($edge))
					{
						return true;
					}
				}
				return false;
			}
			case 'Rectangle':
			{
				$rectangle = $object;
				$this_rotated = $this->rotation($rectangle->center,$rectangle->rotation);
				$rectangle_edges = $rectangle->edges();
				$intersections_number = 0;
				foreach ($rectangle_edges as $edge)
				{
					if ($this_rotated->is_crossing($edge))
					{
						++$intersections_number;
					}
				}
				if ($intersection_number >= 2)
				{
					return true;
				}
				return false;
			}
			case 'Segment':
			{
				$segment = $object;
				if (!$this->start->is_contained($segment) && 
					!$this->end->is_contained($segment) &&
					!$segment->start->is_contained($this) && 
					!$segment->end->is_contained($this))
				{
					$angle_start_start = $this->start->vector_angle($segment->start);
					$angle_start_end = $this->start->vector_angle($segment->end);
					$angle_end_start = $this->end->vector_angle($segment->start);
					$angle_end_end = $this->end->vector_angle($segment->end);
					if ((M_math::angle_polar($angle_start_end-$angle_start_start) < M_PI && M_math::angle_polar($angle_end_start-$angle_end_end) < M_PI) ||
						(M_math::angle_polar($angle_start_end-$angle_start_start) > M_PI && M_math::angle_polar($angle_end_end-$angle_end_start) > M_PI))
					{
						return true;
					}
				}
				return true;
			}
		}
	}
	
	public function is_equal_approximately($segment)
	{
		if ($this->start->is_equal_approximately($segment->start) && 
			$this->end->is_equal_approximately($segment->end))
		{
			return true;
		}
		
		if ($this->start->is_equal_approximately($segment->end) && 
			$this->end->is_equal_approximately($segment->start))
		{
			return true;
		}

		return false;
	}
	
	public function is_line($bounds)
	{
		$error = 0.01;
		if ((min(abs($this->start->x-$bounds->x->min),abs($this->start->x-$bounds->x->max)) < 0.01 ||
		     min(abs($this->start->y-$bounds->y->min),abs($this->start->y-$bounds->y->min)) < 0.01) &&
			(min(abs($this->end->x-$bounds->x->min),abs($this->end->x-$bounds->x->max)) < 0.01 ||
		     min(abs($this->end->y-$bounds->y->min),abs($this->end->y-$bounds->y->min)) < 0.01))
		{
			return true;
		}

		return false;
	}
	
	
	public function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				$this_angle = $this->angle();
				$segment_angle = $segment->angle();

				if ($this->start == $segment->start || $this->end == $segment->end)
				{
					if (M_math::is_equal_approximately_angle($this_angle,$segment_angle))
					{
						return true;
					}
					return false;
				}
				if ($this->start == $segment->start || $this->end == $segment->start)
				{
					if (M_math::is_equal_approximately_angle($this_angle-$segment_angle,M_PI))
					{
						return true;
					}
					return false;
				}
				

				$start_start_angle = $this->start->vector_angle($segment->start);
				$start_end_angle = $this->start->vector_angle($segment->end);
				$end_start_angle = $this->end->vector_angle($segment->start);
				$end_end_angle = $this->end->vector_angle($segment->end);

				if ((M_math::is_equal_approximately_angle(M_math::angle_polar($start_start_angle-$start_end_angle),M_PI) ||
					 M_math::is_equal_approximately_angle(M_math::angle_polar($end_start_angle-$end_end_angle),M_PI) ||
					 M_math::is_equal_approximately_angle(M_math::angle_polar($start_start_angle-$end_start_angle),M_PI) ||
					 M_math::is_equal_approximately_angle(M_math::angle_polar($start_end_angle-$end_end_angle),M_PI)) &&
					(M_math::is_equal_approximately_angle($this_angle,$segment_angle) ||
					 M_math::is_equal_approximately_angle(M_math::angle_polar($segment_1_angle-$segment_2_angle),M_PI)))
				{
					return true;
				}
				return false;
			}
		}
	}
	
	public function is_overlap_strictly($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				if ($this->is_overlap($segment) &&
					!$this->start->is_equal_approximately($segment->start) &&
					!$this->start->is_equal_approximately($segment->end) &&
					!$this->end->is_equal_approximately($segment->start) &&
					!$this->end->is_equal_approximately($segment->end))
				{
					return true;
				}
				return false;
			}
		}
	}
	
	public function is_parallel($segment)
	{
		if (M_math::is_equal_approximately_angle(M_math::mod($this->angle()-$segment->angle(),M_PI),0))
		{
			return true;
		}
		return false;
	}
		
	public function is_tangent($arc)
	{
		if (sizeof($this->intersections($arc)) == 1)
		{
			$angle_difference = $this->angle()-$arc->center->vector_angle($intersections[0]);
			if (M_math::is_equal_approximately_angle($angle_difference,M_PI/2) ||
				M_math::is_equal_approximately_angle($angle_difference,3*M_PI/2))
			{
				return true;
			}
		}
		return false;
	}
	
	public function json()
	{
		$segment = $this->json;
		$segment['start'] = ['x' => $this->start->x,'y' => $this->start->y];
		$segment['end'] = ['x' => $this->end->x,'y' => $this->end->y];
		$segment['measure']['style']['height'] = $this->measure->height;
		$segment['id'] = $this->id;
		return $segment;
	}
	
	
	
	public function set_rectangle()
	{
		return new M_Set_rectangle([new M_Rectangle_segment($this,$this->measure->height)]);
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->start = $this->start->rotation($angle,$center);
		$this_rotated->end = $this->end->rotation($angle,$center);
		if ($this_rotated->measure)
		{
			$this_rotated->measure = $this->measure->rotation($angle,$center);
		}
		return $this_rotated;
	}
	
	public function swap()
	{
		$temp = $this->start;
		$this->start = $this->end;
		$this->end = $temp;
		if ($this->measure)
		{
			$temp = $this->measure->start;
			$this->measure->start = $this->measure->end;
			$this->measure->end = $temp;
		}
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->start = $this->start->addition($translation);
		$this_translated->end = $this->end->addition($translation);
		if ($this_translated->measure)
		{
			$this_translated->measure = $this->measure->translation($translation);
		}
	}
	
	
	
	public function vector($direction = 1)
	{
		if ($direction == 1)
		{
			return $this->end->subtraction($this->start);
		}
		return $this->start->subtraction($this->end);
	}
	
	
	
		
}











//Additional objects






class M_Class
{
	public function __construct()
	{
		$class_names = func_get_args();
		foreach ($class_names as $class_name)
		{
			$this->$class_name = null;
		}
	}
}


/*
1. Object
	Interval
2. Properties
	$min: min
	$max: max
3. Methods
    
*/
class M_Interval
{
	public $min;
	public $max;
	public $type = 'Interval';
	
	public function __construct($min,$max)
	{
		$this->min = $min;
		$this->max = $max;
		
	}
	
	public function center()
	{
		return ($this->min+$this->max)/2;
	}
	
	public function length()
	{
		return $this->max-$this->min;
	}
	
	
}


/*
1. Object
	Interval2D
2. Properties
	$min: min
	$max: max
3. Methods
    
*/
class M_Interval2D
{
	public $x;
	public $y;
	public $type;
	
	public function __construct($interval_x,$interval_y)
	{
		$this->x = $interval_x;
		$this->y = $interval_y;
		
	}
	
	public function center()
	{
		return new M_Point($this->x->center(),$this->y->center());
	}
	
	public function width()
	{
		return $this->x->length();
	}
	
	public function height()
	{
		return $this->y->length();
	}
	
	
		
}


/*
1. Object
	Angle interval
2. Properties
	$start: start
	$size: inverval size
3. Methods
    
*/
function M_Interval_angle($start,$size)
{
	public $start;
	public $size;
	public $type = 'Interval_angle';
	
	
	
	public function __construct($start,$size)
	{
		$this->start = $start;
		$this->size = $size;
		
	}
	
	public function end()
	{
		return M_math::angle_polar($this->start+$this->size);
	}
	
	public function is_intersect($interval_angle)
	{
		if (M_math::is_between_angles($interval_angle->start,$this->start,$this->end()) ||
			M_math::is_between_angles($interval_angle->end(),$this->start,$this->end()))
		{
			return true;
		}
		return false;
	}
	
	
}

/*
1. Object
	 Latex string
2. Properties
	
3. methods
	
*/
class M_Latex
{
	public $latex = '';
	public $type = 'Latex';
	
	
	private $frac = new M_Class('string','length')
	$this->frac->string = '\\frac{';
	$this->frac->length = strlen($this->frac->string);
	
	private $degree = new M_Class('string','length')
	$this->degree->string = '\\degree';
	$this->degree->length = strlen($this->degree->string);
	
	private $text = new M_Class('string','length','array');
	$this->text->string = '\\text';
	$this->text->length = strlen($this->text->string);
	$this->text->array = str_split($this->text->string);
	
	private $lower_case = new M_Class('letters','width');
	$this->lower_case->letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
	$this->lower_case->width = 1/4;
	
	private $number = new M_Class('letters','width');
	$this->number->letters = ['1','2','3','4','5','6','7','8','9','0'];
	$this->number->width = 1/4;
	
	private $upper_case = new M_Class('letters','width');
	$this->upper_case->letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];
	$this->upper_case->width = 2/7;

	private $symbol = new M_Class('widths');
	$this->symbol->widths = [];
	$this->symbol->widths['`'] = 1/8;//` acute
	$this->symbol->widths['&'] = 2/5;// & ampersand
	$this->symbol->widths['@'] = 11/6;//@ ampersat
	$this->symbol->widths['<'] = 2/7;// < angle bracket open
	$this->symbol->widths['>'] = 2/7;// > angle bracket close
	$this->symbol->widths['*'] = 2/9;// * asterik
	$this->symbol->widths['|'] = 1/10;// | bar
	$this->symbol->widths['['] = 1/6;// [ bracket open
	$this->symbol->widths[']'] = 1/6;// ] bracket close
	$this->symbol->widths[':'] = 1/8;// : colon
	$this->symbol->widths[','] = 1/8;// , comma
	$this->symbol->widths['\''] = 1/5;// \' double quote
	$this->symbol->widths['='] = 4/7;// = equal
	$this->symbol->widths['!'] = 1/6;//! exclamation
	$this->symbol->widths['-'] = 3/8;// - minus
	$this->symbol->widths['('] = 1/6;// ( parenthesis open
	$this->symbol->widths[')'] = 1/6;// ) parenthesis close
	$this->symbol->widths['%'] = 2/5;// % percent
	$this->symbol->widths['.'] = 1/8;// . period
	$this->symbol->widths['+'] = 3/8;// + plus
	$this->symbol->widths['?'] = 2/9;//? question
	$this->symbol->widths[';'] = 1/7;// ; semicolon
	$this->symbol->widths['#'] = 1/4;//# sharp
	$this->symbol->widths["'"] = 1/8;// single quote
	$this->symbol->widths['/'] = 1/7;// / slash
	$this->symbol->widths['~'] = 1/4;// ~ tilde
	$this->symbol->widths[' '] = 0;// white space
	$this->symbol->widths[$this->degree->string] = 1/5;// ˚degree
	$this->symbol->widths['\\left|'] = 1/8;// \left|
	$this->symbol->widths['\\right|'] = 1/8;// \right|
	$this->symbol->widths['\\lceil'] = 1/5;// \lceil
	$this->symbol->widths['\\rceil'] = 1/5;// \rceil
	$this->symbol->widths['\\lfloor'] = 1/5:// \lfloor
	$this->symbol->widths['\\rfloor'] = 1/5:// \rfloor
	$this->symbol->widths['\\left{'] = 3/8;// \left\{
	$this->symbol->widths['\\right}'] = 3/8;// \right\}
	
	
	
	function __construct($latex)
	{
		$this->latex = $latex;
	}
	
	
	/*
	1. Function
		Change equation to expression
	2. Input
		$equation: equation
	3. Output
		expression
	*/
	public function to_expression()
	{
		$sides = explode('=',$this->latex);
		if (sizeof($sides) == 2)
		{
			return $sides[0].'-'.$sides[1];
		}
		else 
		{
			return $this->latex;
		}
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
	public function fraction_separation()
	{
		$latex_length = strlen($this->latex);
		$parts = new M_Class('fractions','nonfraction')
		
		$parts->fractions = [];
		$parts->nonfraction = new M_Latex;
		
		
		for ($i = 0; $i < $latex_length; $i++)
		{
			if (substr($this->latex,$i,$this->frac->length) != $this->frac->string)
			{
				$parts->nonfraction->latex .= substr($this->latex,$i,1);
			}
			else 
			{
				$fraction = new M_Class('numerator','denominator');
				$fraction->numerator = new M_Latex;
				$fraction->denominator = new M_Latex;
				$key_numerator_start = $i+$this->frac->length;
				$parenthesis_sign = 1;
				for ($j = $key_numerator_start; $j < $latex_length; $j++)
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
				$fraction->numerator->latex = substr($this->latex,$key_numerator_start,$key_numerator_end-$key_numerator_start+1);
				$key_denominator_start = $key_numerator_end+3;
				$parenthesis_sign = 1;
				for ($j = $key_denominator_start; $j < $latex_length; $j++)
				{
					$character = substr($this->latex,$j,1); 
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
				$fraction->denominator->latex = substr($this->latex,$key_denominator_start,$key_denominator_end-$key_denominator_start+1);
				$parts->fractions[] = $fraction;
				$i = $key_denominator_end+1;
			}
		}
          
		return $parts;
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

	public function parenthesis_key($string,$key)
	{
		if (is_array($string))
		{
			$letters = $string;
		}
		else 
		{
			$letters = str_split($string);
		}
		
		$parenthesis = $letters[$key];
		$parenthesis_open = null;
		$parenthesis_close = null;
		$parenthesis_input = null;
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
		compile된 latex이 형성하는 polygon의 vertices 계산
	2. 입력
		$latex: label (string)
		$scaling: scaling
		$label_margin: label margin
	3. el
		label size
	*/

	public function polygon()
	{
		$sizes = [];
		$latex_length = strlen($this->latex);
		
		$width_rectangle = 0;
		$height_rectangle = 0;
		$nonfraction = new M_Latex;
		for ($i = 0; $i < $latex_length; $i++)
		{		
			if (substr($this->latex,$i,$this->degree->length) == $this->degree->string)
			{
				if ($nonfraction->latex != '')
				{
					$size_nonfraction = $nonfraction->size();
					$width_rectangle += $size_nonfraction->x;
					$height_rectangle = max($height_rectangle,$size_nonfraction->y);
					$sizes_part[] = $size_nonfraction;
				}
				$i = $this->degree->length-1;
				$sizes[] = $this->degree->string;
				$width_rectangle += $this->widths[$this->degree->string];
				$nonfraction->latex = '';
			
			
			}	
			else if (substr($this->latex,$i,$this->frac->length) == $this->frac->string)
			{
				if ($nonfraction != '')
				{
					$size_nonfraction = $nonfraction->size();
					$width_rectangle += $size_nonfraction->x;
					$height_rectangle = max($height_rectangle,$size_nonfraction->y);
					$sizes[] = $size_nonfraction;
				}
				$key_numerator_start = $i+$this->frac->length;
				$parenthesis_sign = 1;
				for ($j = $key_numerator_start; $j < $latex_length; $j++)
				{
					$character = substr($this->latex,$j,1); 
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
				$numerator = new M_Latex(substr($this->latex,$key_numerator_start,$key_numerator_end-$key_$numerator_start+1));
				$numerator_size = $numerator->size();
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
				$denominator = new M_Latex(substr($latex,$key_denominator_start,$key_denominator_end-$key_denominator_start+1));
				$denominator_size = $denominator->size();
				$frac_size = new M_Tuple(max($numerator_size->x,$denominator_size->x),$numerator_size->y+$denominator_size->y);
				$width_rectangle += $frac_size->x;
				$height_rectangle = max($height_rectangle,$frac_size->y);
				$sizes[] = $frac_size;
				$i = $key_denominator_end;
				$nonfraction->latex = '';
			
			}
			else 
			{
				$nonfraction->latex .= substr($this->latex,$i,1);
			}
		
		}
		
		if ($nonfraction->latex != '');
		{
			$size_nonfraction = $nonfraction->latex;
			$width_rectangle += $size_nonfraction->y;
			$height_rectangle = max($height_rectangle,$size_nonfraction->y);
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
			if ($sizes[$i] == $this->degree->string)
			{
			
				if ($height_rectangle_half > $y_max)
				{
					$vertices[] = new M_Point($x_min,$height_rectangle_half);
					$y_max = $height_rectangle_half;
				}
				$x_min += $this->symbol->widths[$this->degree->string];
			}
			else
			{
				$height_i_half = $sizes[$i]->y/2;
				if ($height_i_half > $y_max)
				{
					$width_i_half = $sizes[$i]->x/2;
					$vertices[] = new M_Point($width_i_half,$height_i_half);
					$vertices[] = new M_Point($width_i_half,-$height_i_half);
					if (-$heihgt_i_half < $y_min)
					{
						$y_min = -$height_i_half;
					}
					$y_max = $height_i_half;
				
				}	
				$x_min += $sizes[$i]->x/2;
			}
		
			$key = $sizes_size-1-$i; 
			if ($sizes[$key] == $this->degree->string)
			{
			
				if ($height_rectangle_half > $y_max)
				{
					$vertices[] = new M_Point($x_max,$height_rectangle_half);
					$y_max = 
				}
				$x_max -= $this->symbol->widths[$this->degree->string];
			
			}
			else
			{
				$height_key_half = $sizes[$key]->y/2;
				if ($height_key_half > $y_max)
				{
					$width_key_half = $sizes[$key]->x/2;
					$vertices[] = new M_Point($width_key_half,$height_key_half);
					$vertices[] = new M_Point($width_key_half,-$height_key_half);
					if (-$height_key_half < $y_min)
					{
						$y_min = -$height_key_half;
					}
					$y_max = $height_key_half;
				
				}	
				$x_min += $sizes[$key]->x/2;
			}
		}
    
		return new M_Polygon($vertices);

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
	public function size()
	{
		$latex = $this->latex;
		$latex_separated = $this->fraction_seperation();
		if (!$latex_seperated->denominator->latex)
		{
			$latex = $latex_separated->numerator;
			if ($latex->numerator)
			{
				$numerator_size = $latex->numerator->size();
				$denominator_size = $latex->denominator->size();
				return new M_Tuple(max($numerator_size->x,$denominator_size->x),$numerator_size->y+$denominator_size->y);
			}
		}
		else 
		{
			$size = new M_Tuple(0,0);
			$numerator_size = $latex_separated->numerator->size();
			$denominator_size = $latex_separated->denominator->size();
			$size->x += max($numerator_size->x,$denominator_size->x);
			$size->y = max($size->y,$numerator_size->y+$denominator_size->y);
			
			return $size;
		}
	
		
		$height = 0.45;
		$latex_size = new M_Tuple(0,$height);
				
	

		


		$latex_array = str_split($latex->latex);
		$latex_array_size = sizeof($latex_array);
		
		
	
		
		for ($i = 0; $i < $latex_array_size; $i++)
		{
			if (array_slice($latex_array,$i,$this->text->length) == $this->text->array)
			{
				$key = $this->parenthesis_key($latex_array,$i+$this->frac->length);
				$text = new M_Latex(implode(array_slice($latex_array,$i+$this->frac->length,$key-1-($i+$this->frac->length-1),false)));
				$text_size = $text->size_text();
				$latex_size->x += $text_size->x;
				$latex_size->y += $text_size->y;
				$i = $key-1;
			}
			else if (in_array($label_array[$i],$this->lower_case->letters))
			{
				$latex_size->x += $this->lower_case->width;
			}
			else if (in_array($label_array[$i],$this->number->letters))
			{
				$latex_size->x += $this->number->width;
			}
			else if (in_array($label_array[$i],$this->upper_case->letters))
			{
				$latex_size->x += $this->upper_case->width;
			}
			else
			{
				foreach ($this->symbol->widths as $symbol => $width)
				{
					if (array_slice($latex_array,$i,strlen($symbol)) == str_split($symbol))
					{
						$latex_size->x += $width;
						$i += strlen($symbol)-1;
					}
				}
			}
		}
		

		return new $latex_size;
	}
	
	
	
	/*
	1. 기능
		\\text{text}에서 text의 size 계산
		label의 type이 text인 경우
	2. 입력
		$text: string
		
	3. 출력
		text size
	*/
	private function size_text($text)
	{
		$text_size = new M_Tuple(0,0.45);
		$letters = str_split($text);
				
		foreach ($letters as $letter)
		{
			if (in_array($letter,$this->number->letters))
			{
				$text_size->x += $this->number->width;
			}
			else if (in_array($letter,$this->lower_case->letters))
			{
				$text_size->x += $this->lower_case->width;
			}
			else if (in_array($letter,$this->upper_case->letters))
			{
				$text_size->x += $this->upper_case->width;
			}
			else
			{
				foreach ($this->symbol->widths as $key => $width)
				{
					if ($letter == $key)
					{
						$text_size->x += $width;
					}
				}

			}
		}
		
		return $text_size;
	}
}

/*
1. Object
	 2*2 matrix
2. Properties
	
3. methods
	
*/
class M_Matrix
{
	public $entries;
	public $type = 'Matrix';
	
			
    function __construct($matrix_array)
	{
		$this->entries = $matrix_array;
		
		
	}

	function determinant() //only for square matrix
	{
		return $this->entries[0][0]*$this->entries[1][1]-$this->entries[0][1]*$this->entries[1][0];
	}
	
	function inverse() //only for square matrix
	{
		$D = $this->determinant();
		$inverse = [[$this->entries[1][1]/$D,-$this->entries[0][1]/$D],[-$this->entries[1][0]/$D,$this->entries[0][0]/$D]];
		return M_Matrix($inverse); 
	}
	
	function linear_equation_solutions($c)
	{
		if ($this->determinant())
		{
			$inverse = $this->inverse();
			return [$inverse->entries[0][0]*$c[0]+$inverse->entries[0][1]*$c[1],$inverse->entries[1][0]*$c[0]+$inverse->entries[1][1]*$c[1]];
		}
		return null;
	}
	
			
	
}






/*
1. Object
	Rectangle
2. Properties
	
3. Methods
	
*/

class M_Rectangle
{
	public $center;
	public $size;
	public $rotation:
	public $type = 'Rectangle';
	
	public function __construct($center,$size,$rotation)
	{
		$this->center = $center;
		$this->size = $size;
		$this->rotation = $rotation;
		
	}
	
		/*
	1. 기능
		공통 시점 p를 가지는 두 반직선이 이루는 영역에 들어가고 중심이 두 반직선의 각이 등분선 위에 있는
		rectangle과 p사이의 거리의 최소값의 lower bound가 주어질 때 일정 수보다 클때의 rectangle의 중심 좌표 계산
	2. 입력
		$point: point coord
		$interval_angle: [start angle, angle interval size]
		$distance_lower_bound: distance lower bound
	3. 출력
		rectangle의 center coord
	*/
	public static function center_between_halflines($point,$interval_angle,$distance_lower_bound)
	{
		if (max($this->size->x,$this->size->x->y) >= 2 && $interval_angle->size >= M_PI)
		{
			$angle_end = $interval_angle->end();
			if (0 <= $interval_angle->start && $interval_angle->start <= M_PI &&  0 <= $angle_end && $angle_end <= M_PI))
			{
				return new M_Point_polar($distance_lower_bound+$rectangle_size->y/2,3*M_PI/2);
			}
			if (M_PI <= $interval_angle->start && $interval_angle->start <= 2*M_PI && M_PI <= $angle_end && $angle_end <= 2*M_PI))
			{
				return new M_Point_polar($distance_lower_bound+$rectangle_size->y/2,M_PI/2);
			}
			if (M_PI <= $interval_angle->start && $interval_angle->start <= 3*M_PI/2 && M_PI/2 <= $angle_end && $angle_end <= M_PI)
			{
				return new M_Point_polar($distance_lower_bound+$rectangle_size->x/2,0);
			}
			if (0 <= $interval_angle->start && $interval_angle->start <= M_PI/2 && 3*M_PI/2 <= $angle_end && $angle_end <= 2*M_PI)
			{
				return new M_Point_polar($distance_lower_bound+$rectangle_size->x/2,M_PI);
			}
		}
	
		$angle_center = M_math::angle_polar($interval_angle->start+$interval_angle->size/2);
		$angle_diagonal = $this->size->angle();
		$diagonal_half = $this->size->norm()/2;

		if (M_math::angle_included($angle_center,0) <= $angle_diagonal || M_math::angle_included($angle_center,M_PI) <= $angle_diagonal)
		{
			$size = $this->size;
			$angle_diagonal_rotated = $angle_diagonal;
		}
		else
		{
			$size = new M_Tuple($this->size->y,$this->size->x);
			$angle_diagonal_rotated = M_PI/2-$angle_diagonal;
		}

		$angles_vertex = [];
		$angles_vertex[0] = M_math::angle_polar($angle_diagonal-$angle_center);
		$angles_vertex[1] = M_math::angle_polar(M_PI-$angle_diagonal-$angle_center);
		$angles_vertex[2] = M_math::angle_polar(M_PI+$angle_diagonal-$angle_center);
		$angles_vertex[3] = M_math::angle_polar(2*M_PI-$angle_diagonal-$angle_center);
		sort($angles_vertex);

		$angle_0 = M_PI/2-min(M_math::angle_included(M_PI,($angles_vertex[0]+$angles_vertex[1])/2),M_math::angle_included(M_PI,($angles_vertex[2]+$angles_vertex[3])/2));
		$distance_0 = $distance_lower_bound+$size->x/2;
		if ($distance_0*tan($angle_0) <= $size->y/2)
		{
			$distance_1 = $distance_0/cos($angle_0);
		}
		else
		{
			$angle_1 = M_PI/2;
			foreach ($angles_vertex as $angle)
			{
				$angle_1 = min($angle_1,M_math::angle_included(M_PI,$angle));

			}


			$distance_1 = $diagonal_half*cos($angle_1)+sqrt(pow($distance_lower_bound,2)-pow($diagonal_half*sin($angle_1),2));
		}

		$distances = [$distance_1];
		if ($angle_interval->size < M_PI)
		{
			for ($i = 0; $i < 4; $i++)
			{
				$distances[] = abs($diagonal_half*sin($angles_vertex[$i]))/tan($interval_angle->size/2);
			}
		}

		return new M_Point_polar(max($distances),$angle_center);

	}
	
	
	public function edges()
	{
		$vertices = $this->vertices();
		$edges = [];
		$edges[] = new M_Point($vertices->min_min,$vertices->max_min);
		$edges[] = new M_Point($vertices->max_min,$vertices->max_max);
		$edges[] = new M_Point($vertices->max_max,$vertices->min_max);
		$edges[] = new M_Point($vertices->min_max,$vertices->min_min);
		return $edges;
		
	}
	
	
	public function is_contained($object)
	{
		switch ($object->type)
		{
			case 'Rectangle':
			{
				$rectangle = $object;
				$this_vertices = $this->vertices();
				foreach ($this_vertices as $vertex)
				{
					if ($vertex->is_contained($rectangle))
					{
						return false;
					}
					
				}
				return true;
			}
			
		}
	}
	
	public function is_crossing($object)
	{
		switch ($object->type)
		{
			case 'Segment':
			{
				$segment = $object;
				$segment = $segment->rotation($this->center,$this->rotation);
				$this_edges = $this->edges();
				$intersections_number = 0;
				foreach ($this_edges as $edge)
				{
					if ($edge->is_crossing($segment))
					{
						++$intersection_number;
					}
				}
				if ($intersection_number >= 2)
				{
					return true;
				}
				return false;
			}
		}
	}
	
	public function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Rectangle':
			{
				$rectangle = $object;
				$this_vertices = $this->vertices();
				$this_vertices_rotated = $this_vertices;
				$this_vertices_rotated->min_min = $this_vertices->min_min->rotation(-$rectnagle->rotation,$rectangle_2->center);
				$this_vertices_rotated->max_min = $this_vertices->max_min->rotation(-$rectnagle->rotation,$rectangle_2->center);
				$this_vertices_rotated->min_max = $this_vertices->min_min->rotation(-$rectnagle->rotation,$rectangle_2->center);
				$this_vertices_rotated->max_max = $this_vertices->max_max->rotation(-$rectnagle->rotation,$rectangle_2->center);
				
				
				if ($rectangle->x->min > max($this_vertices_rotated->min_min->x,$this_vertices_rotated->max_min->x,$this_vertices_rotated->max_max->x,$this_vertices_rotated->min_max->x))
				{
					return false;
				}
				if ($rectangle->x->max < min($this_vertices_rotated->min_min->x,$this_vertices_rotated->max_min->x,$this_vertices_rotated->max_max->x,$this_vertices_rotated->min_max->x))
				{
					return false;
				}
				if ($rectangle->y->min > max($this_vertices_rotated->min_min->y,$this_vertices_rotated->max_min->y,$this_vertices_rotated->max_max->y,$this_vertices_rotated->min_max->y))
				{
					return false;
				}
				if ($rectangle->y->max < min($this_vertices_rotated->min_min->y,$this_vertices_rotated->max_min->y,$this_vertices_rotated->max_max->y,$this_vertices_rotated->min_max->y))
				{
					return false;
				}
				$rectangle_vertices_rotated = $rectangle->vertices();
				foreach ($rectangle_vertices_rotated as $key => $vertex)
				{
					$rectangle_vertices_rotated[$key]->rotation(-$this->rotation,$this->center);
				}
				if ($this->x->min > max($rectangle_vertices_rotated->min_min->x,$rectangle_vertices_rotated->max_min->x,$rectangle_vertices_rotated->max_max->x,$rectangle_vertices_rotated->min_max->x))
				{
					return false;
				}
				if ($this->x->max < min($rectangle_vertices_rotated->min_min->x,$rectangle_vertices_rotated->max_min->x,$rectangle_vertices_rotated->max_max->x,$rectangle_vertices_rotated->min_max->x))
				{
					return false;
				}
				if ($this->y->min > max($rectangle_vertices_rotated->min_min->x,$rectangle_vertices_rotated->max_min->x,$rectangle_vertices_rotated->max_max->y,$rectangle_2_vertices_rotated->min_max->y))
				{
					return false;
				}
				if ($this->y->max < min($rectangle_vertices_rotated->min_min->y,$rectangle_vertices_rotated->max_min->x,$rectangle_vertices_rotated->max_max->y,$rectangle_vertices_rotated->min_max->y))
				{
					return false;
				}
				return true;
			}
		}
	}
	
	public function rotation($angle,$center)
	{
		$this_rotated = $this;
		$this_rotated->center = $this->center->rotation($angle,$center);
		$this_rotated->rotation = M_math::angle_polar($this->rotation+$angle);
		
		return $this_rotated;
	}
	
	public function translation($translation)
	{
		$this_translated = $this;
		$this_translated->center = $this->center->addition($translation);
		return $this_translated;
	}
	
	
	
	public function vertices()
	{
		$vertices = new M_Class('min_min','max_min','min_max','max_max')[];
		
		$vertices->min_min = $this->center;
		$vertices->min_min->x -= $this->size->x/2;
		$vertices->min_min->y -= $height/2;
		
		
		$vertices->max_min = $this->center;
		$vertices->max_min->x += $this->size->x/2;
		$vertices->max_min->y -= $height/2;
	
		
		$vertices->min_max = $this->center;
		$vertices->min_max->x -= $this->size->x/2;
		$vertices->min_max->y += $this->size->y/2;
		
			
		$vertices->max_max = $this->center;
		$vertices->max_max->x += $this->size->x/2;
		$vertices->max_max->y += $this->size->y/2;
				
		return $vertices;
		
	}
}

/*
1. Object
	Rectangle
2. Properties
	
3. Methods
	
*/
class M_Rectangle_interval2D extends M_Rectangle
{
	
	
	public function __construct($interval2D,$rotation)
	{
		parent::__construct($interval2D->center(),new M_Tuple($interval2D->x->length(),$interval2D->y->length()),$rotation)
		
	}
	
}

/*
1. Object
	Rectangle
2. Properties
	
3. Methods
	
*/
class M_Rectangle_point extends M_Rectangle
{
	
	
	public function __construct($point,$margin,$rotation)
	{
		$center = $point;
		$center->x += $margin->x/2;
		$center->y += $margin->y/2;
		$size = $margin;
		$size->x = abs($size->x);
		$size->y = abs($size->y);
		parent::__construct($center,$size,$rotation);
	}
	
}



/*
1. Object
	Rectangle
2. Properties
	
3. Methods
	
*/
class M_Rectangle_segment extends M_Rectangle
{
	
	
	public function __construct($segment,$rectangle_height)
	{
		parent::__construct($segment->center,new M_Tuple($segment->length(),$rectangle_height),$segment->angle());
		
	}
	
}







/*
1. Object
	Set of angle intervals
2. Properties
	
3. Methods
	
*/
class M_Set_interval_angle
{
	public $intervals_angle;
	public $type = 'Set_interval_angle';
	
	public function __construct($intervals_angle)
	{
		$this->intervals_angle = $intervals_angle;
	}
	
	/*
	1. Function
		Compute complement of angle intervals
	2. Input
		$intervals_angle: angle intervals (unionized)
	3. Output
		angle intervals complement
	*/
	public function complement($intervals_angle)
	{
		$this_intervals_angle = $this->union();
		$this_intervals_angle_size = sizeof($this_intervals_angle);
		if ($this_intervals_angle_size === 1)
		{
			return new M_Interval_angle($this_intervals_angle[0]->end(),2*M_PI-$this_intervals_angle[0]->size);
		}
		$this_intervals_angle_size = sizeof($this_intervals_angle);
		array_push($this_intervals_angle,$this_intervals_angle[0])
		$this_intervals_angle_complement = [];
		for ($i = 0; $i < $this_intervals_angle_size; $i++)
		{
			$angle_start = $this_intervals_angle[$i]->start;
			$this_intervals_angle_complement[] = new M_Interval_angle($angle_start,M_math::angle_polar($this_intervals_angle[$i+1]->start-$angle_start)];
		}
		return $this_intervals_angle_complement;

	}
	
	/*
	1. Function
		Compute angle interval which has maximum interval size
	2. Input
		$angle_intervals: angle intervals
	3. Output
		maximum interval
	*/
	
	public function max()
	{
		$this_intervals_angle = $this->intervals_angle;
		$this_intervals_angle_size = sizeof($this_intervals_angle);
		if ($this_intervals_angle_size === 1)
		{
			return $this_intervals_angle[0];
		}
		usort($this_intervals_angle,'this->usort_interval_angle_ascending');
		$this_intervals_angle_max = $this_intervals_angle[0];
		for ($i = 1; $i < $this_intervals_angle_size; $i++)
		{
			if ($this_intervals_angle[$i]->size > $this_intervals_angle_max->size)
			{
				$this_intervals_angle_max = $this_intervals_angle[$i];

			}
		}
		return $this_intervals_angle;
	}
	
	/*
	1. Function
		Unionize angle intervals, that is, unionize overlaping intervals	
	2. Input
		$angle_intervals: angle interval array
	3. Output
		Unionized angle intervals
	*/
	public function union()
	{
		$this_intervals_angle = $this->intervals_angle;
		$this_intervals_angle_size = sizeof($this_intervals_angle);
		if ($this_intervals_angle_size == 1)
		{
			return $this_intervals_angle[0];
		}
		usort($this_intervals_angle,'this->usort_interval_angle_ascending');
		array_push($this_intervals_angle,$this_intervals_angle[0]);
		$this_intervals_angle_unionized = [$this_intervals_angle[0]];
		for ($i = 1; $i <= $this_intervals_anglesize; $i++)
		{
			$index_last = sizeof($this_intervals_angle_unionized)-1;
			$this_intervals_angle_unionized_last_end = $this_intervals_angle_unionized[$index_last]->end();
			if ($this_intervals_angle[$i]->start <= $this_intervals_angle_unionized_last_end)
			{
				$this_intervals_angle_i_end = $this_intervals_angle[$i]);

				$this_intervals_angle_unionized[$index_last]->size = M_math::angle_polar(max($this_intervals_angle_unionized_last_end,$this_intervals_angle[$i]->end())
                                                         -$this_intervals_angle_unionized[$index_last]->start);
			}
			else
			{
				$this_intervals_angle_unionized[] = $this_intervals_angle[$i];
			}
		}
		return $this_intervals_angle_unionized;
	}
	
	/*
	1. Function
		두 angle_interval을 비교해 usort에 쓰기 위한 function 
	2. 입력
		$interval_angle_1
		$interval_angle_2
	3. 출력

	*/

	public function usort_interval_angle_ascending($interval_angle_1,$interval_angle_2)
	{
		if ($interval_angle_1->start < $interval_angle_2->start)
		{
			return 1;
		}
		if ($interval_angle_1->start > $interval_angle_2->start)
		{
			return -1;
		}
		if ($interval_angle_1->size < $interval_angle_2->size)
		{
			return 1;
		}
		if ($interval_angle_1->size > $interval_angle_2->size)
		{
			return -1;
		}
	}
	
	
	
	
}


/*
1. Object
	Set of rectangles
2. Properties
	
3. Methods
	
*/
class M_Set_rectangle
{
	public $rectangles;
	public $type = 'Set_rectangle';
	
	public function __construct($rectangles)
	{
		$this->rectangles = $rectangle;
	}
	
	public function difference($set_rectangle)
	{
		$set_rectangle_difference = new M_Set_rectangle;
		foreach ($this->rectangles as $rectangle_1)
		{
			$is_overlap = false;
			foreach ($set_rectangle->rectangles as $rectangle_2)
			{
				if ($rectangle_1->is_overlap($rectangle_2))
				{
					$is_overlap = true;
					break;
				}
			}
			if (!$is_overlap)
			{
				$set_rectangle_difference->rectangles[] = $rectangle_1;
			}
		}
		return $set_rectangle_difference;
	}
	
	public function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Set_rectangle':
			{
				$set_rectangle = $object;
				{
					foreach ($this->rectangles as $rectangle_1)
					{
						foreach ($set_rectangle->rectangle as $rectangle_2)
						{
							return $rectangle_1->is_overlap($rectangle_2);
						}
					}
				}
			}
		}
		
	}
}






/*
1. Object
	Tuple
2. Properties
	$x
	$y
3. Methods
	
*/
class M_Tuple
{
	public $x;
	public $y;
	public $type = 'Tuple';
		
	public function __construct($x,$y)
	{
		$this->x = $x;
		$this->y = $y;
		
	}
	
	public function angle()
	{
		return M_math::atan2_polar($this->y,$this->x);
	}
	
	public function norm()
	{
		return sqrt(pow($this->x,2)+pow($this->y,2));
	}
	
		
}








































