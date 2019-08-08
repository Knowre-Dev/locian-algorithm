<?php

//Math objects
/*
Object의 수학적 표현 (data)

@ Angle Interval
	{'start':start angle,'angle': angle size}
@ Angle2D
	{'center':angle center,'start':angle start,'end':angle end,'height':angle height}
@ Arc2D
	{'center':arc center,'start':arc start,angle}
@ Face2D
	Vertices
@ Interval
	{'min':min,'max':max}
@ Label2D
	{'coord':coord,'value':value}
@ Path2D
	Vertices
@ Point2D
	{'x':x,'y':y}
@ Rectangle2D
	{'center':center,'size':size,'rotation':rotation}
@ Segment2D
	{'start':segment start,'end': segment end}
@ Vector2D
	{'start':start,'end':end}
*/





//Cartesian2D
  
/*
1. Definition
	Cartesian2D
2. construct
	$objects: objects 

3. methods
	
*/
class M_Cartesian2D
{
	function __construct($objects)
	{
		$this->objects = func_get_args();
		if (is_array($this->objects[0]))
		{
			$this->objects = $this->objects[0];
		}
	}
		
	function objects($type)
	{
		$objects = [];
		foreach ($this->objects as $object)
		{
			if ($object->type() == $type)
			{
				$objects[] = $object;
			}
		}
		return $objects;
	}
	
	function rotation($angle,$center)
	{
		$objects_size = sizeof($this->objects);
		$angle->angle *= -1;
		for ($i = 0; $i < $objects_size; $i++)
		{
			$this->objects[$i]->rotation($angle,$center);
		}
	}
	
	function translation($point)
	{
		$objects_size = sizeof($this->objects);
		$point->x *= -1;
		$point->y *= -1;
		for ($i = 0; $i < $objects_size; $i++)
		{
			$this->objects[$i]->addition($point);
		}
	}
	
	function type()
	{
		return 'Cartesian2D';
	}
}


/*
Basic objects
	Angle2D
	Arc2D
	Polygon2D
	Label2D
	Path2D
	Point2D
	Measure_Arc2D
	Measure_Segment2D
	Segment2D
*/  

/*
Additional objects
	Angle
	Interval
	Interval_angle
	Interval2D
	Rectangle2D
	Rectangle2D_size
	Vector2D
	
*/




/*
1. Definition
	angle in polar coord (0 ~ 2*M_PI)
2. construct
	$size: angle size
	
3. methods
	
*/

class M_Angle
{
	function __construct($angle)
	{
		$this->angle = M_angle_polar($angle);
	}
		
	function data()
	{
		return {'angle':$this->angle};
	}
	
	
	
	
	
	function addition($angle)
	{
		return new M_Angle(M_angle_polar($this->angle+$angle->angle));
	}
	
	function angle_included($angle)
	{
		return new M_Angle(M_angle_included($this->angle,$angle->angle));
	}
		
	function degree()
	{
		return rad2deg($this->angle);
	}
	
	function is_equal_approximately($angle)
	{
		return M_is_equal_approximately_angle($this->angle,$angle->angle)
	}
	
	function subtraction($angle)
	{
		return new M_Angle(M_angle_polar($this->angle-$angle->angle));
	}
	
	function type()
	{
		return 'Angle';
	}
}


/*
1. Definition
	2D angle
2. construct
	$center: center (object)
	$start: start (object)
	$end: end (object)
	$height: actual angle height
3. methods
	
*/

class M_Angle2D
{
	function __construct($center,$start,$end,$height_actual)
	{
		$this->center = $center;
		$this->start = $start;
		$this->end = $end;
		$this->height_actual = $height_actual;
	}
	
	function data()
	{
		return D_Angle2D($this->center->data(),$this->start->data(),$this->end->data(),$this->height_actual};
	}
	
	
	
		
	function angle()
	{
		return new M_Angle(M_vector_angle($this->center->data(),$this->end->data())-M_vector_angle($this->center->data(),$this->start->data()));
	}
	
	function bisector()
	{
		$center = $this->center->data();
		$start = $this->start->data();
		$end = $this->end->data();
		$angle_start = M_atan2_polar($start['y'],$start['x']);
		$angle_end = M_atan2_polar($end['y'],$end['x']);
		$angle = ($angle_start+$angle_end)/2;
		$a = sin($angle);
		$b = -cos($angle);
		$c = -$a*$center['x']-$b*$center['y'];
		return M_Line2D($a,$b,$c);
				
	}
	
	
		
	function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Angle2D':
			{
				return is_overlap_Angle2D_Angle2D($this->data(),$object->data());
			}
		}
	}
	
	function label_coord($label_size)
	{
		$angle_inverval = new M_Interval_angle(M_vector_angle($this->center->data(),$this->start->data()),$this->angle()->angle);
		$label_coord = rectangle_center_between_halflines($this->center->coord,$label_size->data(),$interval_angle,$this->height);
		return new M_Point2D($label_coord['x'],$label_coord['y']);
	}
	
	function rotation($angle,$center)
	{
		$this->center->rotation($angle,$center);
		$this->start->rotation($angle,$center);
		$this->end->rotation($angle,$center);
	}	
	
	function translatoin($point)
	{
		$this->center->addition($point);
		$this->start->addition($point);
		$this->end->addition($point);
	}	
		
	function type()
	{
		return 'Angle2D';
	}
}


/*
1. Definition
	2D arc
2. construct
	$center: center (object)
	$start: start (object)
	$angle: angle (object)
3. methods
	
*/
class M_Arc2D
{
    function __construct($center,$start,$angle)
	{
		$this->center = $center;
		$this->start = $start;
		$this->angle = $angle;
	}
	
	function data()
	{
		return D_Arc2D($this->center->data(),$this->start->data(),$this->angle->angle);
	}
	
	
	
	
	function end()
	{
		$end = M_rotation($this->center->data(),$this->start->data(),$this->angle->angle);
		return new M_Point2D($end['x'],$end['y']);
	}
	
	function is_containing($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return is_contained($object->data(),$this->data());
			}
		}
	}
	
	function is_containing_strictly($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return is_contained_strictly($object->data(),$this->data());
			}
		}
	}
	
	function is_crossing($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_overlap_Arc2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function is_overlap($object)
	{
		switch ($object->type())
		{
			case 'Arc2D':
			{
				return is_overlap_Arc2D_Arc2D($this->data(),$object->data());
			}
		}
	}
	
	function intersections($object)
	{
		$intersections = [];
		switch ($object->type())
		{
			case 'Segment2D':
			{
				$intersections = intersections_Arc2D_Segment2D($this->data(),$object->data());
				break;
			}
		}
		foreach ($intersections as $key => $value)
		{
			$intersections[$key] = new M_Point2D($value['x'],$value['y']);
		}
		return $intersections;
	}
	
	function radius()
	{
		return M_distance($this->center->data(),$this->start->data());
	}
	
	function rotation($angle,$center)
	{
		$this->center->rotation($angle,$center);
		$this->start->rotation($angle,$center);
	}
	
	function translation($point)
	{
		$this->center->addition($point);
		$this->start->addition($point);
		
	}
		
	function type()
	{
		return 'Arc2D';
	}
}

/*
1. Definition
	2D Circle
2. construct
	$center: center
	$radius: radius
3. methods
	
*/
class M_Circle2D
{
	function __construct($center,$radius)
	{
		$this->center = $center;
		$this->radius = $radius;
	}
	
	function data()
	{
		return {'center':$this->center->data(),'radius':$this->radius}
	}
	
	
	
	function Arc2D($angle_start,$angle_end)
	{
		$center = $this->center->data();
		$start = D_Point2D($this->radius*cos($angle_start),$this->radius*sin($angle_start));
		$start = M_addition($start,$center);
		$start = M_Point2D($start['x'],$start['y']);
		$end = D_Point2D($this->radius*cos($angle_end),$this->radius*sin($angle_end));
		$end = M_addition($end,$center);
		$end = M_Point2D($end['x'],$end['y']);
		return new M_Arc2D($this->center,$start,$end);
	}
	
	function area()
	{
		return M_PI*pow($this->radius,2);
	}
	
	function chord($angle_start,$angle_end)
	{
		$center = $this->center->data();
		$start = D_Point2D($this->radius*cos($angle_start),$this->radius*sin($angle_start));
		$start = M_addition($start,$center);
		$start = M_Point2D($start['x'],$start['y']);
		$end = D_Point2D($this->radius*cos($angle_end),$this->radius*sin($angle_end));
		$end = M_addition($end,$center);
		$end = M_Point2D($end['x'],$end['y']);
		return new M_Segment2D($start,$end);
	}
	
	function chord_diameter($angle)
	{
		return $this->chord($angle,$angle+M_PI);
	}
	
	function circumference()
	{
		return 2*M_PI*$this->radius;
	}
	
	function common_chord($circle)
	{
		$x = $this->center->x-$circle->center->x;
		$y = $this->center->y-$circle->center->y;
		$a = 2*$this->radius*$x;
		$b = 2*$this->radius*$y;
		$c = pow($x,2)+pow($y,2)+pow($this->radius,2)-pow($circle->radius,2);
		$d = sqrt(pow($a,2)+pow($b,2));
		$constant = -$c/$d;
		if (abs($constant) > 1 or $constant == 0)
		{
			return null;
		}
		$theta_1 = M_atan2_polar($a/$d,$b/$d);
		$theta_2 = asin($constant);
		$angle_1 = M_angle_polar(-$theta_1+$theta_2);
		$point_1 = M_Point2D($this->radius*cos($angle_1)+$this->center->x,$this->radius*sin($angle_1)+$this->center->y);
		$angle_2 = M_angle_polar(-$theta_1+M_PI/2+M_angle_polar(M_PI/2-$theta_2));
		$point_1 = M_Point2D($this->radius*cos($angle_2)+$this->center->x,$this->radius*sin($angle_2)+$this->center->y);
		return new M_Segment2D($point_1,$point_2);
	}
	
	function common_tangent_lines($circle)
	{
		$distance_centers = M_distance($this->center->data(),$circle->center->data());
		$difference_radii = abs($this->radius-$circle->radius);
		if ($distance_centers < $difference_radii)
		{
			return [];
		}
		if ($distance_centers == $difference_radii)
		{
			if ($this->center->data() == $circle->center->data())
			{
				return [];
			}
			$vector = M_multiplication_scalar(M_sign($this->radius-$circle->radius),M_subtraction($circle->center->data(),$this->center->data()));
			$point_tangent = M_addition($this->center->data(),$vector);
			$a = $point_tangent['x']-$this->center->x;
			$b = $point_tangent['y']-$this->center->y;
			$c = -$a*$this->center->x-$b*$this->center->y-pow($this->radius,2);
			return [M_Line2D($a,$b,$c)];
		}
		$sum_radii = $this->radius+$circle->radius;
		$distance_tangent_points = sqrt(pow($distance_centers,2)-pow($difference_radii,2));
		
		$x = ($circle->center->x-$this->center->x)/$distance_centers;
		$y = ($circle->center->y-$this->center->y)/$distance_centers
		
		$r = ($circle->radius-$this->radius)/$distance_centers;
		$a = $x*$r-$y*sqrt(1-pow($r,2));
		$b = $x*$r+$y*sqrt(1-pow($r,2));
		$c = -$a*$this->center->x-$b*$this->center->y+$this->radius;
		
		$lines = [new M_Line2D($a,$b,$c),new M_Line2D($b,$a,$c)];
		if ($distance_centers < $sum_radii)
		{
			return $lines;
		}
		
		if ($distance_centers == $sum_radii)
		{
			$vector = M_multiplication_scalar($this->radius/$distance_centers,M_subtraction($circle->center->data(),$this->center->data()));
			$point_tangent = M_addition($this->center->data(),$vector);
			$a = $point_tangent['x']-$this->center->x;
			$b = $point_tangent['y']-$this->center->y;
			$c = -$a*$this->center->x-$b*$this->center->y-pow($this->radius,2);
			$lines[] = new M_Line2D($a,$b,$c);
			return $lines;
		}
		if ($distance_centers > $sum_radii)
		{
			$r = $sum_radii/$distance_centers;
			$a = $x*$r-$y*sqrt(1-pow($r,2));
			$b = $x*$r+$y*sqrt(1-pow($r,2));
			$c = -$a*$this->center->x-$b*$this->center->y+$this->radius;
			$lines[] = new M_Line2D($a,$b,$c);
			$lines[] = new M_Line2D($b,$a,$c);
			return $lines;
		}
	}
	
	
	
	
	
	
	function intersections_Circle2D($circle)
	{
		$x = $this->center->x-$circle->center->x;
		$y = $this->center->y-$circle->center->y;
		$a = 2*$this->radius*$x;
		$b = 2*$this->radius*$y;
		$c = pow($x,2)+pow($y,2)+pow($this->radius,2)-pow($circle->radius,2);
				
		$d = sqrt(pow($a,2)+pow($b,2));
		$constant = -$c/$d;
		if (abs($constant) > 1)
		{
			return [];
		}
		$sin_theta_1 = $a/$d;
		$cos_theta_1 = $b/$d;
		$theta_1 = M_atan2_polar($sin_theta_1,$cos_theta_1);
		if ($constant == 0)
		{
			$angle = M_angle_polar($theta_1+M_PI/2);
			return [new M_Point2D($this->radius*cos($angle)+$this->center->x,$this->radius*sin($angle)+$this->center->y)];
		}
		$theta_2 = asin($constant);
		$angle_1 = M_angle_polar(-$theta_1+$theta_2);
		$point_1 = new M_Point2D($this->radius*cos($angle_1)+$this->center->x,$this->radius*sin($angle_1)+$this->center->y);
		$angle_2 = M_angle_polar(-$theta_1+M_PI/2+M_angle_polar(M_PI/2-$theta_2));
		$point_2 = new M_Point2D($this->radius*cos($angle_2)+$this->center->x,$this->radius*sin($angle_2)+$this->center->y);
		return [$point_1,$point_2];
	}
	
	
	function intersections_Line2D($line)
	{
		$c = $line->a*$this->center->x+$line->b*$this->center->y+$line->c;
		$distance = abs($c)/sqrt(pow($line->a,2)+pow($line->b,2));
		if ($distance > $line->radius)
		{
			return [];
		}
		$a = $line->a*$this->radius;
		$b = $line->b*$this->radius;
		$distance = 
		$d = sqrt(pow($a,2)+pow($b,2));
		$constant = -$c/$d;
		
		$sin_theta_1 = $a/$d;
		$cos_theta_1 = $b/$d;
		$theta_1 = M_atan2_polar($sin_theta_1,$cos_theta_1);
		if ($constant == 0)
		{
			$angle = M_angle_polar($theta_1+M_PI/2);
			return [new M_Point2D($this->radius*cos($angle)+$this->center->x,$this->radius*sin($angle)+$this->center->y)];
		}
		$theta_2 = asin($constant);
		$angle_1 = M_angle_polar(-$theta_1+$theta_2);
		$point_1 = new M_Point2D($this->radius*cos($angle_1)+$this->center->x,$this->radius*sin($angle_1)+$this->center->y);
		$angle_2 = M_angle_polar(-$theta_1+M_PI/2+M_angle_polar(M_PI/2-$theta_2));
		$point_2 = new M_Point2D($this->radius*cos($angle_2)+$this->center->x,$this->radius*sin($angle_2)+$this->center->y);
		return [$point_1,$point_2];

	}
	
	function Point2D($angle)
	{
		$point = D_Point2D($this->radius*cos($angle),$this->radius*sin($angle));
		$point = M_addition($point,$this->center->data());
		return new M_Point2D($point['x'],$point['y']);
	}
	
	function tangent_lines($point)
	{
		$d = M_distance($point->data(),$this->center->data());
		if ($d == $this->radius)
		{
			$a = $point->x-$this->center->x;
			$b = $point->y-$this->center->y;
			$c = -$this->center->x*$a-$this->center->y*$b;
			return new M_Line2D($a,$b,$c);
		}
		if ($d > $this->radius)
		{
			$lines = [];
			$angle_center_point = M_vector_angle($this->center->data(),$point->data());
			$angle = acos($this->radius/$d);
			$r = sqrt(pow($d,2)-pow($this->radius,2));
			$angle_1 = M_angle_polar($angle_center_point+$angle);
			$a_1 = cos($angle_1);
			$b_1= cos($angle_1);
			$c_1 = -$point->x*$a_1-$point->y*$b_1;
			$lines[] = new M_Line2D($a_1,$b_1,$c_1);
			$angle_1 = M_angle_polar($angle_center_point+$angle);
			$a_1 = cos($angle_1);
			$b_1= cos($angle_1);
			$c_1 = -$point->x*$a_1-$point->y*$b_1;
			$lines[] = new M_Line2D($a_1,$b_1,$c_1);
			
			return $lines;
			
		}
		return null
		
		
	}
	
	function tangent_points($point)
	{
		$d = M_distance($point->data(),$this->center->data());
		if ($d == $this->radius)
		{
			return $point;
		}
		if ($d > $this->radius)
		{
			$points = [];
			$angle_point_center = M_vector_angle($this->center->data(),$point->data());
			$angle = acos($this->radius/$d);
			$angle_1 = M_angle_polar($angle_center_point-$angle);
			$points[] = new M_Point2D($this->radius*cos($angle_1)+$this->center->x,$this->radius*sin($angle_1)+$this->center->y);
			$angle_2 = M_angle_polar($angle_center_point+$angle);
			$points[] = new M_Point2D($this->radius*cos($angle_2)+$this->center->x,$this->radius*sin($angle_2)+$this->center->y);
			
			return $points;
			
		}
		return null
	}
	
	function translation($point)
	{
		$point = $point->data();
		$center = M_addition($this->center->data(),$point);
		$this->center = M_Point2D($center['x'],$center['y']);
	}
	
	function type()
	{
		return 'Circle2D';
	}
	
}

class M_Circle2D_points extends M_Circle2D
{
	function __construct($point_1,$point_2,$point_3)
	{
		$p_1 = $point_1->data();
		$p_2 = $point_2->data();
		$p_3 = $point_3->data();
		$d = $p_1['x']*$p_2['y']-$p_2['x']*$p_1['y']+$p_2['x']*$p_3['y']-$p_3['x']*$p_2['y']+$p_3['x']*$p_1['y']-$p_1['x']*$p_3['y'];
		$l_1 = pow($p_1['x'],2)+pow($p_1['y'],2);
		$l_2 = pow($p_2['x'],2)+pow($p_2['y'],2);
		$l_3 = pow($p_3['x'],2)+pow($p_3['y'],2);
		$center = [];
		$center['x'] = (($p_1['y']-$p_2['y'])*$l_3+($p_2['y']-$p_3['y'])*$l_1+($p_3['y']-$p_1['y'])*$l_2)/(2*$d);
		$center['y'] = (($p_1['x']-$p_2['x'])*$l_3+($p_2['x']-$p_3['x'])*$l_1+($p_3['x']-$p_1['x'])*$l_2)/(2*$d);
		$this->center = new M_Point2D($center['x'],$center['y']);
		$this->radius = sqrt(pow($p_1['x']-$center['x'],2)+pow($p_1['y']-$center['y'],2));
	}
}

/*
1. Definition
	Curve2D equation
2. construct
	$equation: equation (string)
3. methods
	
*/

class M_Curve2D_equation
{
	function __construct($equation)
	{
		$parts = explode('==',$equation);
		$this->expression = $parts[0].'-('.$parts[1].')';
	}
	
	function data()
	{
		return {'expression':$this->expression};
	}
	
	
		
	
	function evaluation($point)
	{
		return S_evaluation_Point2D($this->expression,$point->data());
		
	}
		
	function rotation($angle,$center)
	{
		$x_0 = 'x-'.$center->x;
		$y_0 = 'y-'.$center->y;
		$x_1 = cos($angle->angle).'*'.$x.'-'.sin($angle->angle).'*'.$y;
		$y_1 = sin($angle->angle).'*'.$x.'+'.cos($angle->angle).'*'.$y;
		$x_2 = $x_1.'+'.$center->x;
		$y_2 = $y_2.'+'.$center->y;
		$this->expression = str_replace(['x','y'],[$x_2,$y_2]);
	}
	
	function translation($point)
	{
		$x = 'x+'.$point->x;
		$y = 'y+'.$point->y;
		$this->expression = str_replace(['x','y'],[$x,$y]);
	}
	
	
	function type()
	{
		return 'Curve2D_equation';
	}
}



/*
1. Definition
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
2. Inputs
	$type: type
	$coefficients: coefficients
3. methods
	
*/

class M_Curve2D_expression
{
	function __construct($type,$coefficients)
	{
		$this->type = $type;
		$this->coefficients = $coefficients;
		$this->expression = S_Curve2D_y($this->type,$this->coefficients).'-y';
	}
	
	function data()
	{
		return {'expression':$this->expression};
	}
	
	
	
	function equation()
	{
		return $this->expression.'==0';
	}
		
	
	function evaluation($point)
	{
		return S_evaluation_Point2D($this->expression,$point->data());
		
	}
		
	function rotation($angle,$center)
	{
		$x_0 = 'x-'.$center->x;
		$y_0 = 'y-'.$center->y;
		$x_1 = cos($angle->angle).'*'.$x.'-'.sin($angle->angle).'*'.$y;
		$y_1 = sin($angle->angle).'*'.$x.'+'.cos($angle->angle).'*'.$y;
		$x_2 = $x_1.'+'.$center->x;
		$y_2 = $y_2.'+'.$center->y;
		$this->expression = str_replace(['x','y'],[$x_2,$y_2]);
		
	}
	
	function translation($point)
	{
		$x = 'x+'.$point->x;
		$y = 'y+'.$point->y;
		$this->expression = str_replace(['x','y'],[$x,$y]);
		
	}
	
	function type()
	{
		return 'Curve2D_expression';
	}
	
	function type_expression()
	{
		return 'Curve2D_expression_'.$this->type;
	}
}


/*
1. Definition
	Interval
2. construct
	$min: min
	$max: max
3. methods
	
*/
class M_Interval
{
	function __construct($min,$max)
	{
		$this->min = $min;
		$this->max = $max;
	}
	
	function data()
	{
		return D_Interval($this->min,$this->max);
	}
	
	
	
	function type()
	{
		return 'Interval';
	}
	
}

/*
1. Definition
	Interval
2. construct
	$x: x interval
	$y: y interval
3. methods
	
*/
class M_Interval2D
{
	function __construct($interval_x,$interval_y)
	{
		$this->x = $interval_x;
		$this->y = $interval_y;
	}
	
	function data()
	{
		return D_Interval2D($this->x,$this->y);
	}
	
	
	
	function type()
	{
		return 'Interval2D';
	}
	
}



/*
1. Definition
	Angle interval
2. construct
	$start: start angle
    $angle: angle between start angle and end angle
3. methods
	
*/
class M_Interval_angle
{
	function __construct($start,$angle)
	{
		$this->start = $start;
		$this->angle = $angle;
	}
	
	function data()
	{
		return D_Interval_angle($this->start->angle,$this->angle->angle);
	}
	
	
	
	
	function end()
	{
		return new M_Angle(M_angle_polar($this->start+$this->angle));
	}
	
	function is_intersect($interval_angle)
	{
		return is_intersect_Intervals_angle($this->data(),$interval_angle->data());
	}
		
	function type()
	{
		return 'Interval_angle';
	}
	
	function union($interval_angle)
	{
		$union = Intervals_angle_union($this->data(),$interval_angle->data());
		return new M_Interval_angle($union['start'],$union['angle']);
	}
	
}

/*
1. Definition
	2D line
2. construct
	ax+by+c=0
	$a: a
	$b: b
	$c: c
3. methods
	
*/



/*
1. Definition
	2D label
2. construct
	$coord: coord (object)
	$value: lavel value
3. methods
	
*/
class M_Label2D
{
	function __construct($coord,$value)
	{
		$this->coord = $coord;
		$this->value = $value;
	}
	
	function data()
	{
		return {'coord':$this->coord,'value':$this->value};
	}
	
	
	
	
	
	function rotation($angle,$center)
	{
		$this->coord->rotation($angle,$center);
	}
	
	function set_coord($coord_new)
	{
		$this->data() = $coord_new;
	}
	
	function size()
	{
		$size = S_latex_size($this->value)
		return new M_Rectangle2D_size($size['x'],$size['y']);
	}
	
	function translation($point)
	{
		$this->coord->addition($point);
	}
	
	function type()
	{
		return 'Label2D';
	}
	
	
}



class M_Line2D
{
	function __construct($a,$b,$c)
	{
		$this->a = $a;
		$this->b = $b;
		$this->c = $c;
	}
	
	function data()
	{
		return {'a':$this->a,'b':$this->b,'c':$this->c};
	}
	
	
	
	
	function angle()
	{
		return new M_Angle(atan2_polar($this->a,$this->b));
	}
			
	function distance($point)
	{
		return abs($this->a*$point->x+$this->b*$point->y+$this->c)/sqrt(pow($this->a,2)+pow($this->b,2));
	}
	
	function intercept_x()
	{
		if ($this->b != 0)
		{
			return M_Point2D(0,-$this->c/$this->b);
		}
		return null;
	}
	
	function intercept_y()
	{
		if ($this->a != 0)
		{
			return M_Point2D(0,-$this->c/$this->a);
		}
		return null;
	}
	
	function perpendicular_foot($point)
	{
		$d = -($this->a*$point->x+$this->b*$point->y+$this->c);
		if ($d == 0)
		{
			return $point;
		}
		$k = $d/sqrt(pow($this->a,2)+pow($this->b,2));
		return new M_Point2D($point->x+$k*$this->a,$point->y+$k*$this->b);
		
	}
				
	function rotation($angle,$center)
	{
		$this->c = -$this->a*$center->x-$this->b*$center->y;
		$this->a = $this->a*cos($angle->angle)-$this->b*sin($angle->angle);
		$this->b = $this->a*sin($angle->angle)+$this->b*cos($angle->angle);
		$this->c = $this->a*$center->x+$this->b*$center->y;
	}
	
	function translation($point)
	{
		$this->c = -$this->a*$point->x-$this->b*$point->y;
	}
		
	function type()
	{
		return 'Line2D';
	}
	
	
	
	
}



/*
1. Definition
	2D arc meausre
2. construct
	$center: arc center(object)
	$start: arc start (object)
	$angle: arc angle (object)
	$height: measure height
3. methods
	
*/
class M_Measure_Arc2D
{
    function __construct($center,$start,$angle,$height_actual)
	{
		$this->center = $center;
		$this->start = $start;
		$this->angle = $angle;
		$this->height_actual = $height_actual;
	}
	
	function data()
	{
		return {'center':$this->center->data(),'start':$this->start->data(),'angle':$this->angle->angle,'height_actual':$this->height_actual};
	}
	
	
	
	
	
	function end()
	{
		$end = M_rotation($this->center->data(),$this->start->data(),$this->angle->angle);
		return new M_Point2D($end['x'],$end['y']);
	}
	
	function end_measure()
	{
		$end = $this->end();
		$angle = M_vector_angle($this->center->data(),$end->data());
		$vector = M_polar_to_cartesian($this->height,$angle);
		$end_measure = addition($end->data(),$vector);
		return new M_Point2D($end_measure);
	}
	
	
	
	function label_coord()
	{
		$height_min = 0.5;
		$height = max($this->height,$height_min);
		$angle_start = M_vector_angle($this->center->data(),$this->start->data());
		$vector = M_polar_to_cartesian($height,$angle_start);
		$start = M_addition($this->start->data(),$vector);
		$label_coord = M_rotation($this->center->data(),$start,$this->angle->angle/2);
		return new M_Point2D($label_coord['x'],$label_coord['y']);
	}

	function radius()
	{
		return M_distance($this->center->data(),$this->start->data())+$this->height;
	}
	
	function rotation($angle,$center);
	{
		$this->center->rotation($angle,$center); 
		$this->start->rotation($angle,$center);
	}
		
	function start()
	{
		$angle = M_vector_angle($this->center->data(),$this->start->data());
		$vector = M_polar_to_cartesian($this->height,$angle);
		
		$start = addition($this->start->data(),$vector);
		return new M_Point2D($start['x'],$start['y']);
	}
	
	function translation($point);
	{
		$this->center->addition($point); 
		$this->start->addition($point);
	}	
		
	function type()
	{
		return 'Arc2D';
	}
}


/*
1. Definition
	2D segment measure
2. construct
	$start: start point (object)
	$end: end point (object)
	$height: height
3. methods
	
*/

class M_Measure_Segment2D
{
	function __construct($start,$end,$height)
	{
		$this->start = $start;
		$this->end = $end;		
		$this->height = $height;
		
	}
	
	function data()
	{
		return {'start':$this->start->data(),'end':$this->end->data(),'height':$this->height];
	}
	
	
	
	
	
	function angles()
	{
		$angle_start = new M_Angle(M_sign($this->height)*(M_PI/2-M_atan2_polar(abs($this->height)*2,M_distance($this->start->data(),$this->end->data())/2)));
		$angle_end = new M_Angle(-$angle_start->angle);
    
		return {'start':$angle_start,'end':$angle_end};
	}
		
	function center()
	{
		$angle = M_angle_polar($this->angle()+M_sign($this->height)*M_PI/2);
		$center = M_addition($this->center()->data(),M_polar_to_cartesian(abs($this->height),$angle));
		return new M_Point2D($center['x'],$center['y']);                                      
	}	
	
	
	
	
	function height_sign()
	{
		return M_sign($this->height);
	}
	
	function label_coord()
	{
		$angle = M_angle_polar(M_vector_angle($this->start->data(),$this->end->data())+M_sign($height)*M_PI/2);
		$vector = M_polar_to_cartesian(abs($height),$angle);
		$label_coord = M_addition($this->center()->data(),$vector);
		return new M_Point2D($label_coord['x'],$label_coord['y']);
	}
	
	function rotation($angle,$center);
	{
		$this->start->rotation($angle,$center);
		$this->end->rotation($angle,$center);
		
	}
	
	function swap_start_end()
	{
		$temp = $this->start;
		$this->start = $this->end;
		$this->end = $temp;
	}
	
	function translation($point);
	{
		$this->start->addition($point);
		$this->end->addition($point);
		
	}
	
	function type()
	{
		return 'Segment2D';
	}
	
	











	
	

/*
1. Definition
	2D path
2. construct
	$vertices: vertices (object)
3. methods
	
*/
class M_Path2D
{
	function __construct($vertices)
	{
		$this->vertices = $vertices;
		
	}
	
	function data()
	{
		$data = [];
		foreach ($this->vertices as $vertex)
		{
			$data[] = $vertex->data();
		}
		return $data;
	}
	
	
	
	
	
	function is_overlap($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_overlap_Path2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function rotation($angle,$center)
	{
		$vertices_size = sizeof($this->vertices);
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$this->vertices[$i]->rotation($angle,$center);
		}
	}
	
	function segments()
	{
		$vertices = $this->vertices;
		$vertices_size = sizeof($vertices);
		$vertices[] = $this->vertices[0];
		$segments = [];
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$segments[] = new M_Segment2D($vertices[$i],$vertices[$i+1]);
		}
		return $segments;
	}
	
	function translation($point)
	{
		$vertices_size = sizeof($this->vertices);
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$this->vertices[$i]->addition($point);
		}
	}
	
	function type()
	{
		return 'Path2D';
	}
}
/*
1. Definition
	2D point
2. construct
	$x: x
	$y: y
	
3. methods
	
*/
class M_Point2D
{
	function __construct($x,$y)
	{		
		$this->x = $x;
		$this->y = $y;
	}
	
	function data()
	{
		return D_Point2D($this->x,$this->y);
	}
	
	
	
	
	function addition($point)
	{
		if (is_data($point))
		{
			$point = $point->data();
		}
		$point_added = M_addition($this->data(),$point);
		return new M_Point2D($point_added['x'],$point_added['y']);
	}
	
	function polar()
	{
		return M_cartesian_to_polar($this->data());
	}
	
	
	
	function distance($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return M_distance($this->data(),$object->data());
			}
			case 'Segment2D':
			{
				return distance_Point2D_Segment2D($this->data(),D_Segment2D($object->start->data(),$object->end->data()));
			}
		}
	}
	
	function is_contained($object)
	{
		switch ($object->type)
		{
			case 'Arc2D':
			{
				return is_contained_Point2D_Arc2D($this->data(),$object->data());
			}
			case 'Rectangle2D':
			{
				return is_contained_Point2D_Rectangle2D($this->data(),$object->data());
			}
			case 'Segment2D':
			{
				return is_contained_Point2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function is_contained_strictly($object)
	{
		switch ($object->type)
		{
			case 'Arc2D':
			{
				return is_contained_strictly_Point2D_Arc2D($this->data(),$object->data());
			}
			case 'Segment2D':
			{
				return is_contained_strictly_Point2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function rotation($angle,$center)
	{
		
		$point_rotated = M_rotation($this->data(),$angle->angle,$center->data());
		return new M_Point2D($point_rotated['x'],$point_rotated['y']);
	}
	
	function set_coord($coord_new)
	{
		$this->x = $coord_new->x;
		$this->y = $coord_new->y;
	}
	
	function subtraction($point)
	{
		$point_subtracted = M_subtraction($this->data(),$point->data());
		return new M_Point2D($point_subtracted['x'],$point_subtracted['y']);
	}
	
	function type()
	{
		return 'Point2D';
	}
	
	
	
}



/*
1. Definition
	2D Polygon
2. construct
	$vertices: vertices (anticlockwise order)
3. methods
	
*/

class M_Polygon2D
{
	function __construct($vertices)
	{
		$this->vertices = $vertices;
	}
	
	function data()
	{
		$data = [];
		foreach ($this->vertices as $vertex)
		{
			$data[] = $vertex->data();
		}
		
		return $data;
	}
	
	
	
	function angles();
	{
		$angles = [];
		$vertices = $this->data();
		$vertices_size = sizeof($vertices);
		array_unshift($vertices,$vertices[$vertices_size-1]);
		array_push($vertices,$vertices[1]);
		for ($i = 1; $i <= $vertices_size; $i++)
		{
			$center = new M_Point2D($vertices[$i]['x'],$vertices[$i]['y']);
			$start = new M_Point2D($vertices[$i+1]['x'],$vertices[$i+1]['y']);
			$end = new M_Point2D($vertices[$i-1]['x'],$vertices[$i-1]['y']);
			$angles[] = new M_Angle2D($center,$start,$end);
		}
		return $angles;
	}
	
	
	function area()
	{
		$vertices = $this->data();
		$vertices_size = sizeof($vertices);
		array_push($vertices,$vertices[0]);
		$area = 0;
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$area += $vertices[$i]['x']*$vertices[$i+1]['y']-$vertices[$i]['y']*$vertices[$i+1]['x'];
		}
		
		return $area/2;
	}
	
	
	
	function center()
	{
		$center = M_mean_arithmetic($this->vertices->data());
		
		return new M_Point2D($center['x'],$center['y']);
	}
	
	function centroid()
	{
		$vertices = $this->data();
		$vertices_size = sizeof($vertices);
		array_push($vertices,$vertices[0]);
		$numerator_x = 0;
		$numerator_y = 0;
		$denominator = 0;
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$a = $vertices[$i]['x']*$vertices[$i+1]['y']-$vertices[$i]['y']*$vertices[$i+1]['x'];
			$numerator_x += $a*($vertices[$i]['x']+$vertices[$i+1]['x']);
			$numerator_y += $a*($vertices[$i]['y']+$vertices[$i+1]['y']);
			$denominator += $a;
		}
		$denominator /= 6;
		
		$x = $numerator_x/$denominator;
		$y = $numerator_y/$denominator;
		return new M_Point2D($x,$y);
	}
	
	
	
	
	function edges()
	{
		$vertices_size = sizeof($this->vertices)
		$vertices = $this->vertices;
		$vertices[] = $vertices[0];
		$segments = [];
		for ($i = 0; $i < $vertice_size; $i++)
		{
			$segments[] = new M_Segment2D($vertices[$i],$vertices[$i+1]);
		}
	}
	
	
	function is_overlap($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_overlap_Face2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function label_coord()
	{
		return $this->center();
	}
	
	function rotation($angle,$center)
	{
		$vertices_size = sizeof($this->vertices);
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$this->vertices[$i]->rotation($angle,$center);
		}
		
	}
	
	
	
	function translation($point)
	{
		$vertices_size = sizeof($this->vertices);
		for ($i = 0; $i < $vertices_size; $i++)
		{
			$this->vertices[$i]->addition($point);
		}
		
	}
	
	function type()
	{
		return 'Face2D';
	}
}












/*
1. Definition
	2D quadrangle
2. Construct
	$vertices: vertices 
3. Methods
	
*/

class M_Polygon2D_quadrangle extends M_Polygon2D
{
	
		
	function center_incircle()
	{
		
		$edge_lengths = $this->edge_lengths();
		if ($edge_lengths[0]+$edge_lengths[2] != $edge_lengths[1]+$edge_lendths[2])
		{
			return null;
		}
		$A = $this->vertices[0]->data();
		$B = $this->vertices[1]->data();
		$C = $this->vertices[2]->data();
		$D = $this->vertices[3]->data();
		
		$angle_1 = (atan2($D['y']-$A['y'],$D['x']-$A['x'])+atan2($B['y']-$A['y'],$B['x']-$A['x']))/2;
		$angle_2 = (atan2($A['y']-$B['y'],$A['x']-$B['x'])+atan2($C['y']-$B['y'],$C['x']-$B['x']))/2;
				
		$a_1 = sin($angle_1);
		$b_1 = -cos($angle_1);
		$c_1 = -$a_1*$A['x']+$b_1*$A['y'];
		
		$a_2 = sin($angle_2);
		$b_2 = -cos($angle_2);
		$c_2 = -$a_2*$A['x']+$b_2*$A['y'];
		
		$d = $a_1*$b_2-$a_2*$b_1;
		$x = ($b_1*$c_2-$b_2*$c_1)/$d;
		$y = (-$a_1*$c_2+$a_2*$c_1)/$d;
		
		return new M_Point2D($x,$y);
	}
	
	
	
	function diagonal_lengths()
	{
		$diagonal_lengths = [];
		$diagonal_lengths[0] = M_distance($this->vertices[0]->data(),$this->vertices[2]->data());
		$diagonal_lengths[1] = M_distance($this->vertices[1]->data(),$this->vertices[3]->data());
		return $diagonal_lengths;
	}
	
	function diagonals()
	{
		$diagonals = [];
		$diagonals[0] = new M_Segment2D($this->vertices[0],$this->vertices[2]);
		$diagonals[1] = new M_segment2D($this->vertices[1],$this->vertices[3]);
		return $diagonals;
	}
	
	function edge_lengths()
	{
		$edge_lengths = [];
		$edge_lengths[0] = M_distance($this->vertices[0]->data(),$this->vertices[1]->data());
		$edge_lengths[1] = M_distance($this->vertices[1]->data(),$this->vertices[2]->data());
		$edge_lengths[2] = M_distance($this->vertices[2]->data(),$this->vertices[3]->data());
		$edge_lenghts[3] = M_distance($this->vertices[3]->data(),$this->vertices[0]->data());
		return $edge_lengths;
	}
	
	function intersection_diagonals()
	{
		$edge_lengths = $this->edge_lengths();
		$diagonal_lengths = $this->diagonal_lengths();
		$s_1 = ($edge_lengths[0]+$edge_lengths[1]+$diagonal_lengths[0])/2;
		$area_1 = sqrt($s_1*($s_1-$edge_lengths[0])*($s_1-$edge_lengths[1])*($s_1-$diagonal_lengths[0]));
		$s_2 = ($edge_lengths[2]+$edge_lengths[3]+$diagonal_lengths[0])/2;
		$area_1 = sqrt($s_1*($s_1-$edge_lengths[2])*($s_1-$edge_lengths[3])*($s_1-$diagonal_lengths[0]));
		$c_1 = $area_1/($area_1+$area_2);
		$c_2 = $area_2/($area_1+$area_2);
		$intersection = M_addition(M_multiplication_scalar($c_2,$this->vertices[1]->data()),M_multiplication_scalar($c_1,$this->vertices[3]->data()));
		return new M_Point2D($intersection['x'],$intersection['y']);
	}
	
	function radius_incircle()
	{
		$edge_lengths = $this->edge_lengths();
		if ($edge_lengths[0]+$edge_lengths[2] != $edge_lengths[1]+$edge_lendths[2])
		{
			return null;
		}
		$diagonal_lengths = $this->diagonal_lengths();
		$area = sqrt(pow($diagonal_lengths[0]*$diagonal_lengths[1],2)-
		(-pow($edge_lengths[0],2)+pow($edge_lengths[1],2)-pow($edge_lengths[2],2)+pow($edge_lengths[3],2))/4);
		
		return $area/(2*array_sum($edge_lengths));
	}
	
	
		
	
	
	
	function type()
	{
		return 'Quadrangle2D';
	}
	
	
	
	
}

/*
1. Definition
	2D triangle
2. Construct
	$vertices: vertices 
3. Methods
	
*/

class M_Polygon2D_triangle extends M_Polygon2D
{
	
	function angles()
	{
		$angles = [];
		$angle_01 = M_vector_angle($this->vertices[0]->data(),$this->vertices[1]->data());
		$angle_12 = M_vector_angle($this->vertices[1]->data(),$this->vertices[2]->data());
		$angle_20 = M_vector_angle($this->vertices[2]->data(),$this->vertices[1]->data());
		$angles[0] = new M_Angle(M_angle_polar($angle_01-$angle_20-M_PI));
		$angles[1] = new M_Angle(M_angle_polar($angle_12-$angle_01-M_PI));
		$angles[2] = new M_Angle(M_PI-$angles[0]->angle-$angles[1]->angle);
		return $angles;
		
		
	}
	
	
	function center_centroid()
	{
		$centroid = M_multiplication_scalar(1/3,addition($this->vertices[0]->data(),$this->vertices[1]->data(),$this->vertices[2]->data()));
		return new M_Point2D($centroid['x'],$centroid['y']);
	}
	
	function center_circumcircle()
	{
		$edge_lengths = $this->edge_lengths();
		$coeff_0 = pow($edge_lengths[0],2)*(pow($edge_lengths[1],2)+pow($edge_lengths[2],2)-pow($edge_lengths[0],2));
		$coeff_1 = pow($edge_lengths[1],2)*(pow($edge_lengths[2],2)+pow($edge_lengths[0],2)-pow($edge_lengths[1],2));
		$coeff_2 = pow($edge_lengths[2],2)*(pow($edge_lengths[0],2)+pow($edge_lengths[1],2)-pow($edge_lengths[2],2));
		$denominator = $coeff_0+$coeff_1+$coeff_2;
		$p_0 = M_multiplication_scalar($coeff_0/$denominator,$this->vertices[0]->data());
		$p_1 = M_multiplication_scalar($coeff_1/$denominator,$this->vertices[1]->data());
		$p_2 = M_multiplication_scalar($coeff_2/$denominator,$this->vertices[2]->data());
		$center = M_addition($p_0,$p_1,$p_2);
		return new M_Point2D($center['x'],$center['y']);
	}
	
	
	
	
	function center_incircle()
	{
		$edge_lengths = $this->edge_lengths();
		$denominator = $edge_lengths[0]+$edge_lengths[1]+$edge_lengths[2];
		$p_0 = M_multiplication_scalar($edge_lengths[0]/$denominator,$this->vertices[0]->data());
		$p_1 = M_multiplication_scalar($edge_lengths[1]/$denominator,$this->vertices[1]->data());
		$p_2 = M_multiplication_scalar($edge_lengths[2]/$denominator,$this->vertices[2]->data());
		$center = M_addition($p_0,$p_1,$p_2);
		return new M_Point2D($center['x'],$center['y']);
	}
	
	function centers_excircle()
	{
		$centers = [];
		$edge_lengths = $this->edge_lengths();	
		
		$denominator_0 = -$edge_lengths[0]+$edge_lengths[1]+$edge_lengths[2];
		$term_00 = M_scalar_multiplicatoin(-$edge_lengths[0]/$denominator_0,$this->vertices[0]);
		$term_01 = M_scalar_multiplication($edge_lengths[1]/$denominator_0,$this->vertices[1])
		$term_02 = M_scalar_multiplicatoin($edge_lengths[2]/$denominator_0,$this->vertices[2]);
		$center_0 = M_addition($term_00,$term_01,$term_02);
		$centers[] = new M_Point2D($center_0['x'],$center_0['y']);
		
		$denominator_1 = $edge_lengths[0]-$edge_lengths[1]+$edge_lengths[2];
		$term_10 = M_scalar_multiplicatoin($edge_lengths[0]/$denominator_1,$this->vertices[0]);
		$term_11 = M_scalar_multiplication(-$edge_lengths[1]/$denominator_1,$this->vertices[1])
		$term_12 = M_scalar_multiplicatoin($edge_lengths[2]/$denominator_1,$this->vertices[2]);
		$center_1 = M_addition($term_10,$term_11,$term_12);
		$centers[] = new M_Point2D($center_1['x'],$center_1['y']);
		
		$denominator_2 = $edge_lengths[0]+$edge_lengths[1]-$edge_lengths[2];
		$term_20 = M_scalar_multiplicatoin($edge_lengths[0]/$denominator_2,$this->vertices[0]);
		$term_21 = M_scalar_multiplication($edge_lengths[1]/$denominator_2,$this->vertices[1]
		$term_22 = M_scalar_multiplicatoin(-$edge_lengths[2]/$denominator_2,$this->vertices[2]);
		$center_2 = M_addition($term_20,$term_21,$term_22);
		$centers[] = new M_Point2D($center_2['x'],$center_2['y']);
		
		return $centers;
		
	}
	
	function Circle2D_circumcircle()
	{
		$center = $this->center_circumcircle();
		$radius = $this->radius_circumcircle();
		return new M_Circle2D($center,$radius);
	}
	
	function Circle2Ds_excircles();
	{
		$centers = $this->centers_excircle();
		$radii = $this->radii_excircle();
		$Circles2Ds = [];
		for ($i = 0; $i <= 2; $i++)
		{
			$Circle2Ds[$i] = new M_Circle2D($centers[$i],$radii[$i]);
		}
		return $Circle2Ds
	}
	
	
	
	function Circle2D_incircle()
	{
		$center = $this->center_incircle();
		$radius = $this->radius_incircle();
		return new M_Circle2D($center,$radius);
	}
	
	function edge_lengths()
	{
		$edge_lengths = [];
		$edge_lengths[0] = M_distance($this->vertices[1]->data(),$this->vertices[2]->data());
		$edge_lengths[1] = M_distance($this->vertices[2]->data(),$this->vertices[0]->data());
		$edge_lengths[2] = M_distance($this->vertices[0]->data(),$this->vertices[1]->data());
		return $edge_lengths;
	}
	
	
	
	function heights()
	{
		$edge_lengths = $this->edge_lengths();
		$s = ($edge_lengths[0]+$edge_lengths[1]+$edge_lengths[2])/2;
		$area = sqrt($s*($s-$edge_lengths[0])*($s-$edge_lengths[1])*($s-$edge_lenghts[2]));
		
		$heights = [];
		$heights[0] = $area/(2*$edge_lengths[0]);
		$heights[1] = $area/(2*$edge_lengths[1]);
		$heights[2] = $area/(2*$edge_lenghts[2]);
		return $heights;
		
		
	}
	
	function perpendicular_foots()
	{
		$vertices = $this->vertices;
		$edge_lengths = $this->edge_lengths();
		$perpendicular_foots = [];
		
		$constant_01 = (pow($edge_lengths[0],2)+pow($edge_lengths[1],2)-pow($edge_lengths[2],2))/(2*pow($edge_lengths[0],2));
		$constant_02 = (pow($edge_lengths[0],2)-pow($edge_lengths[1],2)+pow($edge_lengths[2],2))/(2*pow($edge_lengths[0],2));
		$point_0 = M_addition(M_multiplication_scalar($constant_01,$this->vertices[1]),M_multiplication_scalar($constant_02,$this->vertices[2]));
		$perpendicular_foots[0] = M_Point2D($point_0['x'],$point_0['y']);
		
		$constant_12 = (pow($edge_lengths[1],2)+pow($edge_lengths[2],2)-pow($edge_lengths[0],2))/(2*pow($edge_lengths[1],2));
		$constant_10 = (pow($edge_lengths[1],2)-pow($edge_lengths[2],2)+pow($edge_lengths[0],2))/(2*pow($edge_lengths[1],2));
		$point_1 = M_addition(M_multiplication_scalar($constant_12,$this->vertices[2]),M_multiplication_scalar($constant_10,$this->vertices[0]));
		$perpendicular_foots[1] = M_Point2D($point_1['x'],$point_1['y']);
		
		$constant_20 = (pow($edge_lengths[2],2)+pow($edge_lengths[0],2)-pow($edge_lengths[1],2))/(2*pow($edge_lengths[2],2));
		$constant_21 = (pow($edge_lengths[2],2)-pow($edge_lengths[0],2)+pow($edge_lengths[1],2))/(2*pow($edge_lengths[2],2));
		$point_2 = M_addition(M_multiplication_scalar($constant_20,$this->vertices[0]),M_multiplication_scalar($constant_21,$this->vertices[1]));
		$perpendicular_foots[2] = M_Point2D($point_2['x'],$point_2['y']);
		
		return $perpendicular_foots;
		
	}
	
	function radii_excircle()
	{
		$radii = [];
		$edge_lengths = $this->edge_lengths();
		$s = array_sum($edge_lengths)/2;
		$numerator = sqrt($s*($s-$edge_lengths[0])*($s-$edge_lengths[1])*($s-$edge_lengths[2]));
		$radii[0] = $numerator/($s-$edge_lengths[0]);
		$radii[1] = $numerator/($s-$edge_lengths[1]);
		$radii[2] = $numerator/($s-$edge_lengths[2]);
		
		return $radii;
		
	}
	
	
	function radius_circumcircle()
	{
		$edge_lengths = $this->edge_lengths();
		$s = ($edge_lengths[0]+$edge_lengths[1]+$edge_lengths[2])/2;
		$area = sqrt($s*($s-$edge_lengths[0])*($s-$edge_lengths[1])*($s-$edge_lenghts[2]));
		
		return $edge_lengths[0]*$edge_lengths[1]*$edge_lengths[2]/(4*$area);
	}
	
	function radius_incircle()
	{
		$edge_lengths = $this->edge_lengths();
		$s  = ($edge_lengths[0]+$edge_lengths[1]+$edge_lengths[2])/2;
		$area = sqrt($s*($s-$edge_lengths[0])*($s-$edge_lengths[1])*($s-$edge_lenghts[2]));
		
		return $area/$s;
	}
	
	
	
	function segments_mid()
	{
		$points_mid = [];
		$point_mid = M_addition(M_multiplication_scalar(1/2,$this->vertices[1]->data()),M_multiplication_scalar(1/2,$this->vertices[2]->data()));
		$points_mid[0] = new M_Point2D($point_mid['x'],$point_mid['y']);
		$point_mid = M_addition(M_multiplication_scalar(1/2,$this->vertices[2]->data()),M_multiplication_scalar(1/2,$this->vertices[0]->data()));
		$points_mid[1] = new M_Point2D($point_mid['x'],$point_mid['y']);
		$point_mid = M_addition(M_multiplication_scalar(1/2,$this->vertices[0]->data()),M_multiplication_scalar(1/2,$this->vertices[1]->data()));
		$points_mid[2] = new M_Point2D($point_mid['x'],$point_mid['y']);
		
		$segments_mid = [];
		$segments_mid[0] = new M_Segment2D($points_mid[2],$points_mid[1]);
		$segments_mid[1] = new M_Segment2D($points_mid[0],$points_mid[2]);
		$segments_mid[2] = new M_Segment2D($points_mid[1],$points_mid[0]);
		return $segments_mid;
		
	}
	
	
	function type()
	{
		return 'Triangle2D';
	}
	
	
	
	
}




/*
1. Definition
	2D rectangle for region
2. construct
	$center: center
	$size: size (rectangle size)
	$rotation: rotation of rectangle (object)
3. methods
	
*/

class M_Rectangle2D
{
	function __construct($center,$size,$rotation)
	{
		$this->center = $center;
		$this->size = $size;
		$this->rotation = $rotation;
	}
	
	function data()
	{
		return D_Rectangle2D($this->center->data(),$this->size->data(),$this->rotation->angle);
	}
	
	
		
	
	function is_containing($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return is_contained_Point2D_Rectangle2D($object->data(),$this->data());
			}
			case 'Rectangle':
			{
				return is_contained_Rectangle_Rectangle2D($object->data(),$this->data());
			}
		}
	}
	
	function is_contained($object)
	{
		switch ($object->type())
		{
			
			case 'Rectangle':
			{
				return is_contained_Rectangle_Rectangle2D($this->data(),$object->data());
			}
		}
	}
	
	function is_overlap($object)
	{
		switch ($object->type)
		{
			case 'Arc2D':
			{
				return is_overlap_Rectangle2D_Arc2D($this->data(),$object->data());
			}
			case 'Angle2D':
			{
				return is_overlap_Rectangle2D_Arc2D($this->data(),$object->data());
			}
			case 'Curve2D':
			{
				return is_overlap_Rectangle2D_Curve2D($this->data(),$object->data());
			}
			case 'Face2D':
			{
				return is_overlap_Rectangle2D_Face2D($this->data(),$object->data());
			}
			case 'Path2D':
			{
				return is_overlap_Rectangle2D_Path2D($this->data(),$object->data());
			}
			case 'Rectangle2D':
			{
				return is_overlap_Rectangle2D_Rectangle2D($this->data(),$object->data());
			}
			case 'Segment2D':
			{
				return is_overlap_Rectangle2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function rotation($angle,$center)
	{
		$this->center->rotation($angle,$center);
		$this->rotation->angle = M_angle_polar($this->rotation->angle+$angle->angle);
	}
	
	function translation($point)
	{
		$this->center->addition($point);
	}
	
	function vertices()
	{
		$rectangle_vertices = Rectangle2D_vertices($this->data());
		$vertices = [];
		foreach ($rectangle_vertices as $vertex)
		{
			$vertices[] = new M_Point2D($vertex['x'],$vertex['y']);
		}
		return $vertices;
	}
	
	function type()
	{
		return 'Rectangle2D';
	}
}
















/*
1. Definition
	rectangle size
2. construct
	$width: width
	$height: height
3. methods
	
*/

class M_Rectangle2D_size
{
	function __construct($width,$height)
	{
		$this->x = $width;
		$this->y = $height;
	}
	
		
	function data()
	{
		return D_Rectangle2D_size($this->x,$this->y);
	}
	
	
		
	function type()
	{
		return 'Rectangle2D_size';
	}
}


/*
1. Definition
	2D segment
2. construct
	$start: start point (object)
	$end: end point (object)
3. methods
	
*/

class M_Segment2D
{
	function __construct($start,$end,$measure_height)
	{
		$this->start = $start;
		$this->end = $end		
	}
	
	function data()
	{
		return D_Segment2D($this->start->data(),$this->end->data());
	}
	
	
	
	function angle()
	{
		return new M_Angle(M_vector_angle($this->end->data(),$this->start->data()));
	}
	
	
	function bisector()
	{
		$start = $this->start->data();
		$end = $this->end->data();
		$point = M_multiplication_scalar(1/2,M_addition($start,$end));
		$a = $end['y']-$start['y'];
		$b = -($end['x']-$start['x']);
		$c = -$a*$point['x']-$b*$point['y'];
		
		return new M_Line2D($a,$b,$c);
		
	}
	
	function center()
	{
		return new M_Point2D(($this->start->x+$this->end->x)/2,($this->start->y+$this->end->y)/2);
	}
		
	function distance($point)
	{
		return distance_Point2D_Segment2D($point->data(),$this->data());
	}
	
	
	
	function intersections($object)
	{
		swtich ($object->type())
		{
			case 'Arc2D':
			{
				return intersections_Arc2D_Segment2D($object->data(),$this->data());
			}
			
		}
	}
		
	function is_contained($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_contained_Segment2D_Segment2D($this->data(),$object->data());
			}
			
		}
	}
	
	function is_contained_strictly($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_contained_strictly_Segment2D_Segment2D($this->data(),$object->data());
			}
		}
	}
	
	function is_containing($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return is_contained_Point2D_Segment2D($object->data(),$this->data());
			}
			case 'Segment2D':
			{
				return is_contained_Segment2D_Segment2D($object->data(),$this->data());
			}
		}
	}
	
	function is_containing_strictly($object)
	{
		switch ($object->type())
		{
			case 'Point2D':
			{
				return is_contained_Point2D_Segment2D($object->data(),$this->data());
			}
		}
	}
	
	
	
	function is_equal_approximately($segment)
	{
		return is_equal_approximately_Segment2D_Segment2D($this->data(),$segment->data());
	}
	
	function is_line($rectangle)//$rectangle
	{
		return is_Segment2D_line($segment->data(),$rectangle->data());
	}
		
	function is_overlap($object)
	{
		switch ($object->type())
		{
			case 'Arc2D':
			{
				return is_overlap_Arc2D_Segment2D($object->data(),$this->data());
			}
			case 'Face2D':
			{
				return is_overlap_Face2D_Segment2D($object->data(),$this->data());
			}
			case 'Path2D':
			{
				return is_overlap_Path2D_Segment2D($object->data(),$this->data());
			}
			case 'Rectangle2D':
			{
				return is_overlap_Segment2D_Rectangle2D($this->data(),$object->data());
			}
			case 'Segment2D':
			{
				return is_overlap_Segment2D_Segment2D($object->data(),$this->data());
			}
		}
	}
	
	function is_overlap_approximately($object)
	{
		switch ($object->type())
		{
			case 'Segment2D':
			{
				return is_overlap_approximately_segment_segment($this->data(),$object->data());
			}
		}
	}
	
	function length()
	{	
		return M_distance($this->start->data(),$this->end->data());
	}
	
	
	function point_division_external($a,$b)
	{
		if ($a != $b)
		{
			$point = M_subtraction(M_multiplication_scalar($b/($b-$a),$this->start->data()),M_multiplication_scalar($a/($b-$a),$this->end->data()));
			return new M_Point2D($point['x'],$point['y']);
		}
		return null;
	}
	
	function point_division_internal($a,$b)
	{
		$point = M_addition(M_multiplication_scalar($b/($a+$b),$this->start->data()),M_multiplication_scalar($a/($a+$b),$this->end->data()));
		return new M_Point2D($point['x'],$point['y']);
		
	}
	function point_mid()
	{
		$point = M_addition(M_multiplication_scalar(1/2,$this->start->data()),M_multiplication_scalar(1/2,$this->end->data()));
		return new M_Point2D($point['x'],$point['y']);
		
	}
	
	
	function rotation($angle,$center)
	{
		$this->start->rotation($angle,$center);
		$this->end->rotation($angle,$center);
	}
	
	function swap_start_end()
	{
		$temp = $this->start;
		$this->start = $this->end;
		$this->end = $temp;
	}
	
	function translation($point)
	{
		$this->start->addition($point);
		$this->end->addition($point);
	}
	
	
	function type()
	{
		return 'Segment2D';
	}
	
	function union($segment)//overlap 한다고 가정
	{
		$angle_rotation = -$this->angle();
		$this_start = $this->start->data();
		$this_end = $this->end->data();
		$segment_start = $segment->start->data();
		$segment_end = $segment->end->data();
		$this_end_moved = M_subtraction(M_rotation($this_end,$angle_rotation,$this_start),$this_start);
		$segment_start_moved = M_subtraciton(M_rotation($segment_start,$angle_rotation,$this_start));
		$segment_end_moved = M_subtraciton(M_rotation($segment_end,$angle_rotation,$this_start));
		$this_start_moved = D_Point2D(0,0);
		
		if ($segment_start_moved['x'] < $segment_end_moved['x'])
		{
			if ($segment_start_moved['x'] < $this_start_moved['x'])
			{
				$union_start = $segment->start();
			}
			$union_start = $this->start();
						
			if ($segment_end_moved['x'] > $this_end_moved['x'])
			{
				$union_end = $segment->end();
			}
			$union_end = $this->end();
			
		}
		else 
		{
			if ($segment_end_moved['x'] < $this_start_moved['x'])
			{
				$union_start = $segment->end();
			}
			$union_start = $this->start();
						
			if ($segment_start_moved['x'] > $this_end_moved['x'])
			{
				$union_end = $segment->start();
			}
			$union_end = $this->end();
			
		}
		
		return new M_Segment2D($union_start,$union_end);
		
		
	}
	
	
}


/*
1. Definition
	Point2D set
2. construct
	Point2Ds
3. methods
	
*/

class M_Set_Point2D
{
	function __construct()
	{
		$this->Point2Ds = func_get_args();
		if (is_array($this->Point2Ds[0]))
		{
			$this->Point2Ds = $this->Point2Ds[0];
		}
	}
	
		
	function data()
	{
		$points = [];
		foreach ($this->Point2Ds as $point)
		{
			$points[] = $point->data();
		}
		return $points
		
	}
	
	
	
	function face()
	{
		$points = $this->data();
		$points_size = sizeof($points);
		$x_min = $points[0]['x'];
		$key_x_min = 0;
		for ($i = 1; $i < $points_size; $i++)
		{
			if ($points[$i]['x'] < $x_min)
			{
				$key_x_min = $i;
			}
		}
		
	}
		
	function type()
	{
		return 'Set_Point2D';
	}
}




/*
1. Definition
	2D vector
2. construct
	$start: start point (object)
	$end: end point (object)
3. methods
	
*/
class M_Vector2D
{
	function __construct($start,$end)
	{
		$this->start = $start;
		$this->end = $end;
	}
	
	function data()
	{
		return {'start':$this->start->data(),'end':$this->end->data()};
	}
	
	
	
	function angle()
	{
		return new M_Angle(M_vector_angle($this->start->data(),$this->end->data()));
	}
	
	
	
	function direction()
	{
		return new M_Point2D($this->end->x-$this->start->x,$this->end->y-$this->start->y);
	}
	
	function length()
	{
		return M_distance($this->start->data(),$this->end->data());
	}
	
	function rotation($angle,$center)
	{
		$this->start->rotation($angle,$center);
		$this->end->rotation($angle,$center);
	}
	
	function translation($point)
	{
		$this->start->addition($point);
		$this->end->addition($point);
	}
	
	function type()
	{
		return 'Vector2D';
	}
	

}














