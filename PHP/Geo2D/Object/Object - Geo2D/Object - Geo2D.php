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
@ Rectangle_size
  [width,height]
@ set_rectangle
  1. rectangle set
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






/*
1. Object
	Geo2D
2. Properties
	
3. Methods
	
*/
class M_Geo2D
{
	
	public $Geo2D;
	
	public $Geo2D_elements_key_id = [];
	public $bounds;
	public $ratio;
	public $size;
	public $scaling;
	public $objects = new M_Class('objects','angle','arc','curve','label','path','point','polygon','region','segment','objects_labeled');
	
	$this->objects->angle = new M_Class('angles','arc','nonarc','right','not_arc','label','color','interactive','marker','marker_none');
	$this->objects->arc = new M_Class('arcs','dash','label','measure','measure_label');
	$this->objects->curve = new M_Class('curves','label');
	$this->objects->label = new M_Class('labels','vertices');
	$this->objects->path = new M_Class('paths','label');
	$this->objects->point = new M_Class('points','label');
	$this->objects->polygon = new M_Class('polygons','label');
	$this->objects->region = new M_Class('regions','label','curve_label');
	$this->objects->segment = new M_Class('segments','dash','line','label','measure','measure_label','parallel');
	$classes = get_class_vars($this->objects->angle);
	foreach ($classes as $class => $value_class)
	{
		$subclasses = get_class_vars($this->objects->$class)
		foreach ($subclasse as $subclass => $value_subclass)
		{
			$this->objects->$class->$subclass = [];
		}
		
	}
	$this->objects->objects = [];
	
	
	
	private $angle_markers_arc = ['none','single','double','triple'];
	private $error = 0.01;
	private $error_angle = deg2rad(1);
	public function __construct($Geo2D)
	{
		$this->Geo2D = $Geo2D;
		$interval_x = new M_Interval($this->Geo2D['x']['min'],$this->Geo2D['x']['max']);
		$interval_y = new M_Interval($this->Geo2D['y']['min'],$this->Geo2D['y']['max'])
		$this->bounds = new M_Interval2D($interval_x,$interval_y);
		$this->ratio = $this->Geo2D['ratio'];
		$this->rotation = $this->Geo2D['rotation'];
		$this->size = $this->Geo2D['size'];
		$this->scaling = new M_Tuple($this->size,$this->size/$this->ratio);
		
		
		foreach ($Geo2D['elements'] as &$element)
		{
			$this->Geo2D_elements_key_id[$element['id']] = $element;
			switch ($element['type'])
			{
				case 'Angle2D':
				{
					$angle_json = $element;
					$angle = new M_Angle;
					$angle->center = new M_Point($angle_json['center']['x'],$angle_json['center']['y']);
					$angle->start = new M_Point($angle_json['start']['x'],$angle_json['start']['y']);
					$angle->end = new M_Point($angle_json['end']['x'],$angle_json['end']['y']);
					$angle->height->value = $angle_json['height'];
					$angle->id = $angle_json['id']; 
					$angle->json = $angle_json;
					
					if ($angle_json['style']['rightAngle'])
					{
						$angle->set_marker('right',$angle_json['style']['markerHeight']);
					}
					else 
					{
						$angle->set_marker($angle_json['style']['marker'],$angle_json['style']['markerHeight']);
					}
					
					
					$this->objects->objects[] = $angle;
					$this->objects->angle->angles[] = $angle;
					
					if ($angle->color)
					{
						$this->objects->angle->color[] = $angle;
					}
					if ($angle->interactive)
					{
						$this->objects->angle->interactive[] = $angle;
					}
					if ($angle->marker->type == 'right')
					{
						$this->objects->angle->right[] = $angle;
						$this->objects->angle->not_arc[] = $angle;
					}
					else 
					{
						if ($object->marker->type == 'none')
						{
							$this->objects->angle->marker_none[] = $angle;
						}
						else 
						{
							$this->objects->angle->marker[] = $angle;
						}
						
						if (in_array($angle->marker->type,$this->angle_markers_arc))
						{
							$this->objects->angle->arc[] = $angle;
						}
						else
						{
							$this->objects->angle->nonarc[] = $angle;
							$this->objects->angle->not_arc[] = $angle;
						}
					}
									
					break;
				}
				case 'Arc2D':
				{
					$arc_json = $element;
					$arc = new M_Arc;
					$arc->center = new M_Point($arc_json['center']['x'],$arc_json['center']['y']);
					$arc->start = new M_Point($arc_json['start']['x'],$arc_json['start']['y']);
					$arc->angle = $arc_json['angle'];
					$arc->id = $arc_json['id'];
					$arc->json = $arc_json;
					
					if ($arc_json['measure']['label'])
					{
						$label = new M_Label;
						$label->coord = new M_Point($arc_json['measure']['label']['coord']['x'],$arc_json['measure']['label']['coord']['y']);
						$label->label->latex = $arc_json['measure']['label']['content'];
						$segment->measure->label = $label;
					}
					
					if ($arc_json['measure']['style']['height'])
					{
						$arc->measure = new M_Measure_arc($arc->center,$arc->start,$arc->end,$arc_jon['measure']['style']['height']);
						
					}
					
					$this->objects->objects[] = $arc;
					$this->objects->arc->arcs[] = $arc;
					
					if ($arc->dash)
					{
						$this->objects->arc->dash[] = $arc;
					}
					if ($arc->measure)
					{
						if ($arc->measure->height)
						{
							$this->objects->arc->measure[] = $arc;
						}
						if ($arc->measure->label)
						{
							$this->objects->arc->measure_label[] = $arc;
						}
					}					
					
					
					break;
					
					
					
				}
				case 'Curve2D':
				{
					$curve_json = $element;
					if ($curve_json['interaction']['movable-mode'] == 'none'])
					{
						$curve = new M_Curve_equation($curve_json['equation'],$curve_json['domain']);
						
					}
					else 
					{
						$curve = new M_Curve_expression($curve_json['interaction']['movable-mode'],$curve_json['domain']);
					}
					$curve->domain = $curve_json['domain'];
					$curve->json = $curve_json;
					
					$this->objects->objects[] = $curve;
					$this->objects->curve->curves[] = $curve;
					
					break;
					
				}
				
				
				case 'Face2D':
				{
					$polygon_json = $element;
					$polygon = new M_Polygon;
					foreach ($polygon_json['coords'] as $coord)
					{
						$polygon->vertices[] = new M_Point($coord['x'],$coord['y']);
					}
					$polygon->id = $polygon_json['id'];
					$polygon->json = $polygon_json;
					
					
					$this->objects->objects[] = $polygon;
					$this->objects->polygon->polygons[] = $polygon;
					break;
				}
				case 'Label2D':
				{
					$label_json = $element;
					$label = new M_Label;
					$label->coord = new M_Point($label_json['coord']['x'],$label_json['coord']['y']);
					$label->label = new M_Latex;
					$label->label->latex = $label_json['label']['content'];
					$label->id = $label_json['id'];
					$label->id_object = $label_json['labeledObject'];
					$label->json = $label_json;
					
					$this->objects->objects[] = $label;
					$this->objects->label->labels[] = $label;
					
					break;
				}
				
				case 'Path2D':
				{
					$path_json = $element;
					$path = new M_Path;
					foreach ($path_json['coords'] as $coord)
					{
						$path->vertices[] = new M_Point($coord['x'],$coord['y']);
					}
					$path->id = $path_json['id'];
					$path->json = $path_json;
					
					
					$this->objects->objects[] = $path;
					$this->objects->path->paths[] = $path;
					break;
					
					
				}
				
				case 'Point2D':
				{
					$point_json =$element;
					$point = new M_Point($point_json['coord']['x'],$point_json['coord']['y']);
					
					$point->id = $path_json['id'];
					$point->json = $point_json;
					
					$this->objects->objects[] = $point;
					$this->objects->point->points[] = $point;
					
					break;
				}
				
				
				
				case 'Region2D':
				{
					$region_json = $element;
					$region = new M_Region;
					foreach ($resion_json['curves'] as $curve_json)
					{
						if ($curve_json['interaction']['movable-mode'] == 'none'])
						{
							$curve = new M_Curve_equation($curve_json['equation'],$curve_json['domain']);
						
						}
						else 
						{
							$curve = new M_Curve_expression($curve_json['interaction']['movable-mode'],$curve_json['domain']);
						}
						$curve->domain = $curve_json['domain'];
						$curve->id = $curve_json['id'];
						$curve->json = $curve_json;
						$region->curves[] = $curve;
						
					}
					$region->id = $region_json['id'];
					$region->json = $region_json;
					
					$this->objects->objects[] = $region;
					$this->objects->region->regions[] = $region;
					break;
				}
				
				case 'Segment2D':
				{
					$segment_json = $element;
					$segment_start = new M_Point($segment_json['start']['x'],$segment_json['start']['y']);
					$segment_end = new M_Point($segment_json['end']['x'],$segment_json['end']['y']);
					$segment = new M_Segment($segment_start,$segment_end);
					
					
					if ($segment_json['measure']['style']['height'])
					{
						$segment->measure = new M_Measure($segment->start,$segment->end,$segment_json['measure']['style']['height']);
						
					}
					
					
					if ($segment_json['measure']['label'])
					{
						$label = new M_Label;
						$label->coord = new M_Point($segment_json['measure']['label']['coord']['x'],$segment_json['measure']['label']['coord']['y']);
						$label->label = new M_Latex;
						$label->label->latex = $segment_json['measure']['label']['content'];
						$segment->measure->label = $label
					}
					$segment->id = $segment_json['id'];
					$segment->json = $segment_json;
					
					
					$this->objects->objects[] = $segment;
					$this->objects->segment->segments[] = $segment;
					if ($segment->dash)
					{
						$this->objects->segment->dash[] = $segment;
					}
					if ($segment->measure)
					{
						if ($segment->measure->height)
						{
							$this->objects->segment->measure[] = $segment;
						}
						if ($segment->measure->label)
						{
							$this->objects->segment->measure_label[] = $segment;
						}
					}
					if ($segment->parallel != 'none')
					{
						$this->objects->segment->parallel[] = $segment;
					}
					if ($segment->is_line($this->bounds))
					{
						$this->objects->segment->line[] = $segment;
					}
					
					break;
					
					
				}
				
				
			} 
			
		}
		unset($element);
		
		foreach ($this->objects->label->labels as &$label)
		{
			foreach ($this->objects->objects as &$object)
			{
				if ($object->id == $label->id_object)
				{
					$object->label = $label;
					switch ($object->type)
					{
						case 'Angle':
						{
							$this->objets->angle->label[] = $object;
							break;
						}
						case 'Arc':
						{
							$this->objets->arc->label[] = $object;
							break;
						}
						case 'Curve':
						{
							$this->objets->curve>label[] = $object;
							break;
						}
						case 'Path':
						{
							$this->objets->path->label[] = $object;
							break;
						}
						case 'Point':
						{
							$this->objets->point->label[] = $object;
							break;
						}
						case 'Polygon':
						{
							$this->objets->polygon->label[] = $object;
							break;
						}
			
						case 'Segment':
						{
							$this->objets->segment->label[] = $object;
							break;
						}
					}
				}
				else if ($object->type == 'Region')
				{
					foreach ($object->curves as &$curve)
					{
						if ($curve->id == $label->id_object)
						{
							$curve->label = $label;
							$this->objects->region->curve_label[] = $curve;
						}
					}
					unset($curve);
				}
			}
			unset($object);
			
			
		}
		unset($label); 
	}	
	
	public function algorithm()
	{
		/*
		@ 내용
			Segment2D에 parallel을 표현할 경우 source, target에 상관없이 parallel 표현이 한쪽으로 정렬되도록 하는 것
		@ 규칙
			1. Segment2D의 angle a가 0 <= a < M_PI가 되도록 한다.
			2. angle을 조정할 때 measure-style-arrow가 존재하면 measure-style-arrow-start와 measure-style-arrow-end를 교환한다.
		*/
		 /*
		@ 내용
			겹쳐있는 parallel 표시들이 같을 경우에 가장 큰 segment의 표현 하나만 남기는 것
		*/
		
		foreach ($this->objects->segment->parallel as &$segment)
		{
			$segment_angle = $segment->angle();
			if (M_PI <= $segment_angle && $segment_angle <= 2*M_PI) // 규칙 1
			{
				$segment->swap();
			}
			
			foreach ($this->objects->segment->parallel as $segment_1)
			{
            
				if ($segment->id != $segment_1->id && $segment->is_contained($segment_1))
				{
					$segment->parallel = 'none';
				}
			}
		}
        unset($segment);
		
		
		//measure의 height 결정
       
    
		//arc의 measure - arc를 포함하는 원의 반지름에 따라 measure의 height 결정
		foreach ($this->objects->arc->measure as &$arc)
        {
            $arc->measure->height = 0.5*min($arc->radius()*0.2,2);
        }    
		unset($arc);
    
		//겹치는 arc의 measure height 결정
   
		if ($this->objects->arc->measure)
		{
			$height_increment_overlap = 0.125;
			$height_increment_contained = 0.125;
			$height_increment_contained_label = 0.5;
			$arc_measure_size = sizeof($this->objects->arc->measure);
        
			for ($i = 1; $i < $arc_measure_size; $i++)
			{
				for ($j = 0; $j < $i; $j++)
				{
					if (!$this->objects->arc->measure[$j]->is_contained($this->objects->arc->measure[$i]) &&
						!$this->objects->arc->measure[$i]->is_contained($this->objects->arc->measure[$j]) &&
						$this->objects->arc->measure[$i]->is_overlap($this->objects->arc->measure[$j])&&
						abs($this->objects->arc->measure[$i]->measure->height-$this->objects->arc->measure[$j]->measure->height) < $this->error)
					{
						$this->objects->arc->measure[$i]->measure->height = $this->objects->arc->measure[$j]->measure->height+$height_increment_overlap;
					} 
				}
			}
        
			foreach ($this->objects->arc->measure as &$arc)
			{
				foreach ($this->objects->arc->measure as $arc_1)
				{
					if ($arc->id != $arc_1->id)
					{
						if ($arc_1->is_contained($arc))
						{
							if ($arc->label)
							{
								$arc->measure->height += $height_increment_contained_label;
							}
							else 
							{
								$arc->measure->height += $height_increment_contained;
							}
						}
					} 
				}
			}
			unset($arc);
    
		}
	
	
		 /*
		 @ 내용
		   angle height와 angle의 label 위치 결정
		 @ 규칙
		   0. Acute angle: height == 0, Obtuse angle: height != 0
		   1. Angle2D를 style-rightAngle이 거나 style-marker != 'none'인 것들($angles_marker)과 그렇지 않은 것들($angles_marker_none)로 분류
		   2. $angles_marker에 있는 Angle2D의 style-height와 markerHeight는 기본값으로 설정
		   3. $angles_marker_none에 있는 Angle2D를 angle의 크기가 작은 순으로 정렬
		   4. $angles_marker_none에 있는 Angle2D angle_1 $angles_marker에 있는 Angle2D angle_2가 겹치면 angle_1의 height와 markerHeight를 증가 시킴
		   5. $angles_marker_none에 있는 두 Angle2D가 겹치면 크기가 큰 Angle2D의 height와 markerHeight를 증가 시킴
		   
		*/
    
         
		if ($this->objects->angle->angles)
		{
			$angle_height_standard = $unit_length*$Cartesian2D_size; // angle height 기준값
			$Angle2D_marker_none_height_standard = 0; // Angle marker == none인 경우 height의 기준값
			$angle_right_height_standard = $angle_height_standard*sqrt(2); // Angle2D의 rightAngle == true인 경우 height의 기준값
			
			
			//Initial angle height
			foreach ($this->objects->angle->right as &$angle_right)
			{
				$angle_right->set_height($angle_right_height_standard);  
			}
			unset($angle_right);
			
			foreach ($this->objects->angle->marker as &$angle_marker)
			{
				$angle_marker->set_height($angle_height_standard);
			}
			unset($angle_marker);
			
		   
			foreach ($this->objects->angle->marker_none as &$angle_marker_none)
			{
				$angle_marker_none_angle = $angle_marker_none->angle();
			   
				if (0 <= $angle_marker_none_angle && $angle_marker_none_angle < M_PI)
				{
					 if ($angle_marker_none->interactive || $angle_marker_none->color)
					 {
						 $angle_marker_none->set_height($angle_height_standard);
					 }
					 else 
					 {
						 $angle_marker_none->set_height($angle_marker_none_height_standard);   
						  
					 }
				}
				else
				{
					$angle_marker_none->set_height($angle_height_standard);
					
				}
			}
			unset($angle_marker_none);

			//Initial angle label positions
			foreach ($this->objects->angle->angles as &$angle)
			{
				if ($angle->label)
				{
					$interval_angle = new M_Interval_angle($angle->angle_start(),$angle->angle());
					$label_coord = $angle->label->polygon()->center_between_halflines($angle->center,$interval_angle,$angle->height->value);
					$angle_label->coord = $label_coord;
				}
			}
			unset($angle);
		   
			//Label positions and heights of angles which are arc forms
			usort($this->objects->angle->arc,'$this->angle_ascending');
			  
			$angle_height_increment = 0.15;
			$angle_arc_size = sizeof($this->objects->angle->arc);
			for ($i = 0; $i < $angle_arc_size; $i++)
			{
				if ($this->objects->angle->arc[$i]->label)
				{
					$start_angle = $this->objects->angle->arc[$i]->angle_start();
					$angle_angle = $this->objects->angle->arc[$i]->angle();
					$end_angle = $this->objects->angle->arc[$i]->angle_end();
					
					$angles_arc_i_label_polygon = $this->objects->angle->arc[$i]->label->polygon();
					$angles_arc_i_label_center = $angles_arc_i_label_polygon->center_between_halflines($this->objects->angle->arc[$i]->center,new M_Interval_angle($start_angle,$angle_angle),$this->objects->angle->arc[$i]->height->value);
					$angles_arc_i_label_polygon = $angles_arc_i_label_polygon->translation($angles_arc_i_label_center);
					$angles_arc_i_label_distance_max = $this->objects->angle->arc[$i]->center->points_distance_max($angles_arc_i_label_polygon->vertices);
					
				   
					$radii_arc = [];
					$radii_not_arc = [];
					$point_angles = [];
					$label_angles = [];
					  
					foreach ($this->objects->angle->not_arc as $angle_not_arc)
					{
					   
						if ($angle_arc->is_overlap($angle_not_arc))
						{
							if (!$angle_not_arc->label)
							{  
								$radii_not_arc[] = $angle_not_arc->height->value;
							}
							else
							{
								$angle_not_arc_start_angle = $angle_not_arc->angle_start();
								$angle_not_arc_end_angle = $angle_not_arc->angle_end();
								$angle_not_arc_angle = $angle_not_arc->angle();
								$point_angle = M_math::angle_polar($angle_not_arc_start_angle-$start_angle);            
								if ($point_angle <= $angle_angle)
								{
									$point_angles[] = $point_angle;    
								}
								$point_angle = M_math::angle_polar($angle_not_arc_end_angle-$start_angle);
								if ($point_angle <= $angle_angle)
								{
									$point_angles[] = $point_angle;    
								}
								$label_angle = M_math::angle_polar($angle_not_arc->center->vector_angle($angle_not_arc->label->coord)-$start_angle);
								if ($label_angle <= $angle_angle)
								{
									$label_angles[] = $label_angle;    
								}
								$angle_not_arc_label_polygon = $angle_not_arc->label->polygon();
								$angle_not_arc_label_center = $angle_not_arc_label_polygon->center_between_halflines($angle_not_arc->center,new M_Interval_angle($angle_not_arc_start_angle,$angle_not_arc_angle),$angle_not_arc->height->value);
								$angle_not_arc_label_distance_max = 0;
								foreach ($angle_not_arc_label_vertices as $vertex)
								{
									$angle_not_arc_label_distance_max = max($angle_not_arc_label_distance_max,$angle_not_arc->center->distance($angle_not_arc_label_center->addition($vertex)));
								}
								
								if (($angle_not_arc->height->value <= $this->objects->angle->arc[$i]->height->value && $this->objects->angle->arc[$i]->height->value <= $angle_not_arc_label_distance_max) ||
									($angle_not_arc->height->value <= $angles_arc_i_label_distance_max && $angles_arc_i_label_distance_max <= $angle_not_arc_label_distance_max))  
								{
									$radii_not_arc[] = $angle_not_arc_label_distance_max;
								}     
							}
						}
					}
					for ($j = 0; $j < $i; $j++)
					{
						
						if ($this->objects->angle->arc[$i]->is_overlap($this->objects->angle->arc[$j]))
						{
							if ($this->objects->angle->arc[$j]->label)
							{
								$angles_arc_j_start_angle = $this->objects->angle->arc[$j]->angle_start();
								$angles_arc_j_end_angle = $this->objects->angle->arc[$j]->angle_end();
								$point_angle = M_math::angle_polar($angles_arc_j_start_angle-$source_angle);
								if ($point_angle <= $angle_angle)
								{
									$point_angles[] = $point_angle;    
								}
								
								$point_angle = M_math::angle_polar($angles_arc_j_end_angle-$source_angle);
								if ($point_angle <= $angle_angle)
								{
									$point_angles[] = $point_angle;    
								}
								$label_angle = M_math::angle_polar($this->objects->angle->arc[$j]->center->vector_angle($this->objects->angle->arc[$j]->label->coord)-$source_angle);
								if ($label_angle <= $angle_angle)
								{    
									$label_angles[] = $label_angle;    
								}
							}
							
							$angles_arc_j_label_distance_max = $this->objects->angle->arc[$j]->center->points_distance_max($angles_arc_i_label_vertices_translated);
							if (($this->objects->angle->arc[$j]->height->value <= $this->objects->angle->arc[$i]->height->value && $this->objects->angle->arc[$i]->height->value <= $angles_arc_j_label_distance_max) ||
								($this->objects->angle->arc[$j]->height->value <= $angles_arc_i_label_distance_max && $angles_arc_i_label_distance_max <= $angles_arc_j_label_distance_max))  
							{
								$radii_arc[] = $angles_arc_j_label_distance_max; 
							}
						}
					}
					
					if ($radii_arc)
					{  
						$this->objects->angle->arc[$i]->set_height(max($angles_arc_i_height,max($radii_not_arc),max($radii_arc)+$angle_height_increment));
					}
					
					$angle_part_label = $this->objects->angle->arc[$i];
					$angle_part_label->set_height(max($this->objects->angle->arc[$i]->height->actual,max($radii_not_arc)+$angle_height_increment,max($radii_arc)+$angle_height_increment));
						
					if ($point_angles)
					{
						$point_angles = array_unique(array_merge($point_angles,[0,$angles_arc_i_angle]));
						
						sort($point_angles);
						sort($label_angles);
						$label_angles_keys = [];
						$point_angles_size = sizeof($point_angles);
						$label_angles_size = sizeof($label_angles);
						for ($k = 0; $k < $point_angles_size-1; $k++)
						{ 
							$is_label_occupied = false;
							$point_angle = M_math::angle_polar($point_angles[$k+1],$point_angles[$k]);
							for ($l = 0; $l < $label_angles_size; $l++)
							{
								
								if (M_math::angle_polar($label_angles[$l]-$point_angles[$k]) <= $point_angle)
								{
									$is_label_occupied = true;
									break;
								}
							}
							if (!$is_label_occupied)
							{
								$label_angles_keys[$point_angle] = $k;    
							}
						}
						
						if ($label_angles_keys)
						{
							krsort($label_angles_keys);
							$label_key = array_shift($label_angles_keys);
						}
						else 
						{
							$label_key = 0;
						}
						
						$start_angle = M_math::angle_polar($start_angle+$point_angles[$label_key]);
						$angle_angle = M_math::angle_polar($point_angles[$label_key+1]-$point_angles[$label_key]);
					   
					   
					}
					$this->objects->angle->arc[$i]->label->coord = $angles_arc_i_label_polygon->center_between_halflines($angle_part_label->center,new M_Interval_angle($start_angle,$angle_angle),$angle_part_label->height->value));               
				   
				}
			}
			 
		
		
			
			if (sizeof($angles_interactive)+sizeof($angles_color) >= sizeof($angles))
			{
				$angle = deg2rad(40);
				for ($i = 0; $i < $angles_arc_size; $i++)
				{
				   $this->objects->angle->arc[$i]->set_height($this->objects->angle->arc[$i]->height->value+max(0,($angle-$angles_arc_i_angle)/$angle));  
				}    
			}
		}
		
		//segment의 measure height 결정
		$segment_measure_height_initial = 0.001;
		$segment_measure_height_initial_marker = $this->ratio;
		$increment = 0.3;
		foreach ($this->objects->segment->measure as &$segment)
		{
			if ($segment->measure->marker == 'none') 
			{
				$segment->measure->height = $segment_measure_height_initial;
			}
			else 
			{
				$segment->measure->height = $segment_measure_height_initial_marker;
			}
			
			
			
			$segment_length = $segment->length();
			$angle = M_PI/4;
			$radius = ($segment_length/2)/sin(M_PI/8);
					   
			
			foreach ($this->objects->segment->measure as $segment_1)
			{
				
				if ($segment->id != $segment_1->id &&
					$segment_1->is_contained($segment))
				{
					$segment->measure->height = M_math::sign($segment->measure->height)*($radius-sqrt(pow($radius,2)-pow($segment_length/2,2))+$increment);
					break;
				}
			}
		}
		unset($segment);
		
		
		
		
		
		/*
		@ 내용
			Measure2D의 height의 부호 결정
		@ 규칙
			1. 
		*/
	   
		foreach ($this->objects->segment->measure as &$segment)
		{
			
			//segment의 기본 정보
			
			$segment_measure_height_abs = abs($segment->measure->height);
			$segment_measure_height_sign = M_math::sign($segment->measure);
			$segment_measure_height_sign_initial = $segment_measure_height_sign;
				   
			$segment_start_angle = $segment->angle();
			$segment_end_angle = $segment->angle(-1);
				   
			// Segment2D를 지나는 object의 angle 수집
						   
			$set_interval_angle_start = new M_Set_interval_angle; // coords-start를 지나는 Segment2D의 angle array
			$set_interval_angle_end = new M_Set_interval_angle; // coords-end를 지나는 Segment2D의 angle array
			
			// object == Segment2D
			 
			foreach ($this->objects->segment->segments as $segment_1)  
			{
				
				if ($segment->id != $segment_1->id &&
					!$segment->is_parallel($segment_1) &&
					$segment->is_contained($segment_1) &&
					$segment_1->is_contained($segment))
				{
					$segment_1_start_angle = $segment_1->angle();
					$segment_1_end_angle = $segment_1->angle(-1);
						
					if ($segment->start->is_equal_approximately($segment_1->start)) // segment의 coords-start와 segment_1의 coords-start가 일치 
					{   
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment_1_start_angle,0); 
					}
					else if ($segment->start->is_equal_approximately($segment_1->end)) // segment의 coords-start와 segment_1의 coords-end가 일치
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment_1_end_angle,0);
					}
					
					else if ($segment->start->is_contained_strictly($segment_1)) // segment의 coords-start가 segment_1에 strict하게 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment_1_start_angle,0);  
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment_1_end_angle,0);
					}
				  
					if ($segment->end->is_equal_approximately($segment_1->start)) // segment의 coords-end와 segment_1의 coords-start가 일치 
					{   
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment_1_start_angle,0); 
					}
					else if ($segment->end->is_equal_approximately($segment_1->end)) // segment의 coords-end와 segment_1의 coords-end가 일치
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment_1_end_angle,0);
					}
					else if ($segment->end->is_contained_strictly($segment_1)) // segment의 coords-end가 segment_1에 strict하게 포함됨
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment_1_start_angle,0);  
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment_1_end_angle,0);
					}
				}
			}   
					  
			//object == Arc2D
							
			foreach ($this->objects->arc->arcs as $arc)
			{
				$arc_end = $arc->end();
				if ($segment->start->is_contained($arc))
				{
					if ($segment->start->is_equal_approximately($arc->center)) // segment의 coords-start와 arc의 coords-start가 일치 
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle+M_PI/2),0);
					}
					else if ($segment->start->is_equal_approximately($arc_end)) // segment의 coords-start와 arc의 coords-end가 일치
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle-M_PI/2),0);
					}
					else if ($segment->start->is_contained_strictly($arc)) // segment의 coords-start가 arc에 strict하게 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle+M_PI/2),0);
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle-M_PI/2),0);
					}
				}
					
				if ($segment-end->is_contained($arc))
				{    
					if ($segment->end->is_equal_approximately($arc->start)) // segment의 coords-end와 arc의 coords-start가 일치
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_end_angle+M_PI/2),0);
					}
					else if ($segment->end->is_equal_approximately($arc_end)) // segment의 coords-end와 arc의 coords-end가 일치
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_end_angle-M_PI/2),0);
					}
					else if ($segment->end->is_contained_strictly($arc)) // segment의 coords-end가 arc에 strict하게 포함됨
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_end_angle+M_PI/2),0);
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_end_angle-M_PI/2),0);
					}
				}
			} 
					
			// object == Angle2D 중에서 Label2D가 있는 것
						
			
			foreach ($this->objects->angle->label as $angle)
			{
				$angle_angle_start = $angle->angle_start();
				if ($segment->start->is_equal_approximately($angle->end)) 
				{
					if (M_math::is_equal_approximately_angle($segment_start_angle,$angle_start_angle))
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($angle_angle_start,$angle->angle());
					}
					else if (M_math::is_equal_approximately_angle($segment_start_angle,$angle_end_angle))  
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($angle_angle_start-$angle_angle),$angle->angle());
					}
				}
				else if ($segment->is_equal_approximately($angle->center)) 
				{
					if (M_math::is_equal_approximately_angle($segment_end_angle,$angle_start_angle))
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($angle_angle_start,$angle->angle());
					}
					else if (M_math::is_equal_approximately_angle($segment_start_angle,$angle_end_angle))
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($angle_angle_start-$angle_angle),$angle->angle());
					}
				}
			}
			
			
			// object == Path2D
			
			foreach ($this->objects->path->paths as $path)
			{
				$path_vertices_size = sizeof($path->vertices);
				for ($i = 0; $i < $path_vertices_size-1; $i++)
				{
					if ($path->vertices[$i]->is_equal_approximately($segment->start)) // segment의 coords-start와 path의 i번째 vertex가 일치
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($path->vertices[$i+1]),0);
						break;
					}
					if ($path->vertices[$i]->is_equal_approximately($segment->end)) // segment의 coords-end와 path의 i번째 vertex가 일치
					{
						$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment->end->vector_angle($path->vertices[$i+1]),0);
						break;
					}
					$edge_i = new M_Segment($path->vertices[$i],$path->vertices[$i+1]]);
					if ($segment->start->is_contained($edge_i)) // segment의 coords-start가 path의 i번째 edge에 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($path->vertices[$i]),0);
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($path->vertices[$i+1]),0);
						break;
					}
					if ($segment->end->is_contained($edge_i)) // segment의 coords-end가 path의 i번째 edge에 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->end->vector_angle($path->vertices[$i]),0);
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->end->vector_angle($path->vertices[$i+1]),0);
						break;
					}
				}
				if ($path->vertices[$path_vertices_size-1]->is_equal_approximately($segment->start)) // segment의 coords-start와 path의 마지막 vertex가 일치
				{
					$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($path->vertices[$path_vertices_size-1]),0);
				}
				else ($path->vertices[$path_vertices_size-1]->is_equal_approximately($segment->end)) // segment의 coords-end와 path의 마지막 vertex가 일치
				{
					$set_interval_angle_end->intervals_angle[] = new M_Interval_angle($segment->end->vector_angle($path->vertices[$path_vertices_size-1]),0);
				} 
			}
			
			
			// object == Face2D
			foreach ($this->objects->polygon->polygons as $polygon)
			{
				$polygon_vertices = $polygon->vertices;
				$polygon_vertices_size = sizeof($polygon_vertices);
				array_push($polygon_vertices,$polygon_vertices[0]);
				for ($i = 0; $i < $polygon_vertices_size; $i++)
				{
					if ($polygon_vertices[$i]->is_equal_approximately($segment->start)) // segment의 coords-start와 polygon의 한 vertex가 일치
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($polygon_vertices[$i+1]),0);
						break;
					}
					if ($polygon_vertices[$i]->is_equal_approximately($segment->end)) // segment의 coords-end와 polygon의 한 vertex가 일치
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->end->vector_angle($polygon_vertices[$i+1]),0);
						break;
					}
					$edge_i = new M_Segment($polygon_vertices[$i],$polygon_vertices[$i+1]);
					if ($segment->start->is_contained($edge_i)) // segment의 coords-start가 polygon의 한 edge에 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($polygon_vertices[$i]),0);
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($polygon_vertices[$i+1]),0);
						break;
					}
					if ($segment->end->is_contained($edge_i)) // segment의 coords-end가 polygon의 한 edge에 포함됨
					{
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($polygon_vertices[$i]),0);
						$set_interval_angle_start->intervals_angle[] = new M_Interval_angle($segment->start->vector_angle($polygon_vertices[$i+1]),0);
						break;
					}
				}
			}
			
		   
			$set_interval_angle_start = $set_interval_angle_start->union();
			$set_interval_angle_end = $set_interval_angle_end->union();
				
			
			   
			if (!$set_interval_angle_start->intervals_angle && !$set_interval_angle_start->intervals_angle) // $start_angles와 $end_angles가 없는 경우
			{   
				$segment_angle = $segment->angle();
				if (0 <= $segment_angle && $segment_angle <= M_PI/2) || (3*M_PI/2 < $segment_angle && $segment_angle <= 2*M_PI))
				{
					$segment_measure_height_sign = 1;
					
				}    
				else
				{
					$segment_measure_height_sign = -1;
				   
				}
			}
			else
			{ 
				$start_angle_left = [0]; //segment의 coord-start를 기준으로 left에 있는 angle의 array 
				$start_angle_right = [0]; //segment의 coord-start를 기준으로 right에 있는 angle의 array 
					
				foreach ($set_interval_angle_start->intervals_angle as $interval_angle_start)
				{
					if (M_math::angle_polar($interval_angle_start->start-$segment_start_angle) <= M_PI-$this->error_angle)
					{
						$start_angle_left[] = M_math::angle_polar($interval_angle_start->start-$segment_start_angle);
					}
					if (M_math::angle_polar($interval_angle_start->size-$segment_start_angle) <= M_PI-$this->error_angle)
					{
						$start_angle_left[] = M_math::angle_polar($interval_angle_start->size-$segment_start_angle);
					}
					if (M_math::angle_polar($segment_start_angle-$interval_angle_start->start) <= M_PI-$this->error_angle)
					{    
						$start_angle_right[] = M_math::angle_polar($segment_start_angle-$interval_angle_start->start);
					}
					if (M_math::angle_polar($segment_start_angle-$interval_angle_start->size) <= M_PI-$this->error_angle)
					{    
						$start_angle_right[] = M_math::angle_polar($segment_start_angle-$interval_angle_start->size);
					}    
				}
				
				$start_angle_left = array_unique($start_angle_left);
				$start_angle_right = array_unique($start_angle_right);
							 
				$end_angle_left = [0]; //segment의 coord-end를 기준으로 left에 있는 angle의 array 
				$end_angle_right = [0]; //segment의 coord-end를 기준으로 right에 있는 angle의 array 
			
				foreach ($set_interval_angle_end->intervals_angle as $interval_angle_end)
				{
					if (M_math::angle_polar($interval_angle_end->start-$segment_start_angle) <= M_PI-$this->error_angle)
					{
						$end_angle_left[] = M_math::angle_polar($interval_angle_end->start-$segment_start_angle);
					}
					if (M_math::angle_polar($interval_angle_end->size-$segment_start_angle) <= M_PI-$this->error_angle)
					{
						$end_angle_left[] = M_math::angle_polar($interval_angle_end->size-$segment_start_angle);
					}
					if (M_math::angle_polar($segment_start_angle-$interval_angle_end->start) <= M_PI-$this->error_angle)
					{    
						$end_angle_right[] = M_math::angle_polar($segment_start_angle-$interval_angle_end->start);
					}
					if (M_math::angle_polar($segment_start_angle-$interval_angle_end->size) <= M_PI-$this->error_angle)
					{    
						$end_angle_right[] = M_math::angle_polar($segment_start_angle-$interval_angle_end->size);
					}
				}
							
				$end_angle_left = array_unique($end_angle_left);
				$end_angle_right = array_unique($end_angle_right);
								
				$start_angle_left_max = max($start_angle_left);
				$start_angle_right_max = max($start_angle_right);
				$end_angle_left_max = max($end_angle_left);
				$end_angle_right_max = max($end_angle_right);
					   
				$left_angle_max = max($start_angle_right_max,$end_angle_left_max); // segment를 기준으로 left에 있는 angle의 최대값
				$right_angle_max = max($start_angle_left_max,$end_angle_right_max); // segment를 기준으로 right에 있는 angle의 최대값 
				   
				if ($left_angle_max < $right_angle_max-$this->error_angle) 
				{
					$segment_measure_height_sign = 1;
					
				}
				else if ($left_angle_max > $right_angle_max+$this->error_angle)
				{
					$segment_measure_height_sign = -1;
				   
				}
				else if (M_math::is_equal_approximately_angle($left_angle_max,$right_angle_max))
				{
					if ((M_math::is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
						 M_math::is_equal_approximately_angle($start_right_angle_max,$left_angle_max)) &&
						(!M_math::is_equal_approximately_angle($end_left_angle_max,$left_angle_max) ||
						 !M_math::is_equal_approximately_angle($end_right_angle_max,$right_angle_max)))
					{
						if ($end_left_angle_max <= $end_right_angle_max-$this->error_angle)
						{
							$segment_measure_height_sign = 1;
							
						}
						else if ($end_left_angle_max >= $end_right_angle_max+$this->error_angle)
						{
							$segment_measure_height_sign = -1;
							
						}
					}
					else if ((!M_math::is_equal_approximately_angle($start_left_angle_max,$right_angle_max) ||
							  !M_math::is_equal_approximately_angle($start_right_angle_max,$left_angle_max)) &&
							 (M_math::is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
							  M_math::is_equal_approximately_angle($end_right_angle_max,$right_angle_max)))
					{
						if ($start_left_angle_max <= $start_right_angle_max-$this->error_angle)
						{
							$segment_measure_height_sign = -1;
							
						}
						else if ($start_left_angle_max >= $start_right_angle_max+$this->error_angle)
						{
							$segment_measure_height_sign = 1;
						   
						}    
					}
					else if (M_math::is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
							 !M_math::is_equal_approximately_angle($start_right_angle_max,$left_angle_max) &&
							 M_math::is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
							 !M_math::is_equal_approximately_angle($end_right_angle_max,$right_angle_max))
					{
						if ($start_right_angle_max <= $end_right_angle_max-$this->error_angle)
						{
							$segment_measure_height_sign = 1;
							
						}
						else if ($start_right_angle_max >= $end_right_angle_max+$this->error_angle)
						{
							$segment_measure_height_sign = -1;
							
						}    
					}
					else if (!M_math::is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
							 M_math::is_equal_approximately_angle($start_right_angle_max,$left_angle_max) &&
							 !M_math::is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
							 M_math::is_equal_approximately_angle($end_right_angle_max,$right_angle_max))
					{
						if ($start_left_angle_max <= $end_left_angle_max-$this->error_angle)
						{
							$segment_measure_height_sign = -1;
							
						}
						else if ($start_left_angle_max >= $end_left_angle_max+$this->error_angle)
						{
							$segment_measure_height_sign = 1;
							
						}    
					}    
				}             
				
				
				/*
				  @ 내용
					Angle2D의 center가 segment의 start나 end와 일치하고 Angl2D의 한 edge가 segment와 평행한 경우 Angle2D가 전체적으로 향하는 방향 결정
				*/
				
				if ($this->objects->angle->angles &&
					min($start_angle_left_max,$start_angle_right_max,$end_angle_left_max,$end_angle_right_max) >= $this->error_angle &&
					M_math::is_equal_approximately_angle($start_angle_left_max,$start_angle_right_max) &&
					M_math::is_equal_approximately_angle($start_angle_left_max+$start_angle_right_max,M_PI) &&
					M_math::is_equal_approximately_angle($end_angle_left_max,$end_angle_right_max) &&
					M_math::is_equal_approximately_angle($end_angle_left_max+$end_angle_right_max,M_PI))
				{
					$start_angle_left_visible = false;
					$start_angle_right_visible = false;
					$end_angle_left_visible = false;
					$end_angle_right_visible = false;
					  
					foreach ($this->objects->angle->angles as $angle)
					{
						
						$angle_start_angle = $angle->angle_start();
						$angle_end_angle = $angle->angle_end();
						if ($segment->start->is_equal_approximately($angle->center)) 
						{
							if (M_math::is_equal_approximately_angle($segment_end_angle,$angle_end_angle) &&
								M_math::is_equal_approximately_angle($segment_start_angle+$start_angle_left_max,$angle_start_angle))
								//angle이 segment의 start를 기준으로 left 쪽으로 기울어 졌을 때
							{
								$start_angle_left_visible = true;
							}    
							else if (M_math::is_equal_approximately_angle($segment_end_angle,$angle_start_angle) &&
									 M_math::is_equal_approximately_angle($segment_start_angle-$start_angle_right_max,$angle_end_angle))
									 //angle이 segment의 start를 기준으로 right 쪽으로 기울어 졌을 때   
							{
								$start_angle_right_visible = true;
							}    
						}    
						else if ($segment->end->is_equal_approximately($angle->center))
						{
							if (M_math::is_equal_approximately_angle($segment_start_angle,$angle_end_angle) &&
								M_math::is_equal_approximately_angle($segment_end_angle+$end_angle_left_max,$angle_start_angle))
								//angle이 segment의 end를 기준으로 left 쪽으로 기울어 졌을 때
							{
								$end_angle_left_visible = true;
							}    
							else if (M_math::is_equal_approximately_angle($segment_start_angle,$angle_start_angle) &&
									 M_math::is_equal_approximately_angle($segment_end_angle-$end_angle_right_max,$angle_end_angle))
									 //angle이 segment의 end를 기준으로 right 쪽으로 기울어 졌을 때
							{
								$end_angle_right_visible = true;
							}
						}
					}   
					
					if (($start_angle_left_visible || $end_angle_right_visible) &&
						(!$start_angle_right_visible && !$end_angle_left_visible))
					{
						$segment_measure_height_sign = 1;
						
					}
					else if ((!$start_angle_left_visible && !$end_angle_right_visible) &&
							 ($start_angle_right_visible || $end_angle_left_visible))
					{
						$segment_measure_height_sign = -1;
						
					}   
				} 
			}
				
			
			
			// segment에 arm이 있는 경우 (coords-start => coords-end 기준)
			$segment_arm_direction = $segment->arm_direction($segment,$this->objects->objects);
			if ($segment_arm_direction == 'left') // left 방향에만 arm이 있는 경우
			{
				$segment_measure_height_sign = -1;
			   
			}    
			else if ($segment_arm_direction == 'right') // right 방향에만 arm이 있는 경우
			{
				$segment_measure_height_sign = 1;
				
			}    
			
			
			// segment가 polygon의 segment에 속하는 경우
			if ($this->objects->polygon->polygons)    
			{
				// segment의 start나 end에 object에 걸치거나 segment에 arm이 있는 경우는 고려 대상 제외 (이미 고려되었음)
				$is_point_contained = false;
				
				foreach ($this->objects->point->points as $point) 
				{
					if ($point->is_contained_strictly($segment))
					{
						$is_point_contained = true;
						break;
					}
				}
				
				// segment가 polygon의 segment에 strict하게 포함되는 경우    
				if (!$is_point_contained)
				{
					foreach ($this->objects->polygon->polygons as $polygon)
					{
						$polygon_vertices = $polygon->vertices;
						$polygon_vertices_size = sizeof($polygon_vertices);
						$polygon_center = $polygon->centroid_vertices();
						array_push($polygon_vertices,$polygon_vertices[0]);
											
						for ($i = 0; $i < $polygon_vertices_size; $i++)
						{
							if ($segment->is_contained_strictly(new Segment($polygon_vertices[$i],$polygon_vertices[$i+1])))
							{
								$angle_difference = M_math::angle_polar($polygon_center->vector_angle($segment->end)-$polygon_interior_point->vector_angle($segment->start));
								if ($angle_difference <= M_PI-$this->error_angle)
								{
									$segment_measure_height_sign = -1;
									
								}
								else if (M_PI+$this->error_angle <= $angle_difference)
								{
									$segment_measure_height_sign = 1;
									
								}
								break 2;
							}    
						}   
					}
				}
			}           
			
								   
			//segment가 원에 포함되고 한 점이 원의 중심인 삼각형일 경우  measure height sign 결정
			foreach ($this->objects->angle->angles as $angle)
			{
				foreach ($this->objects->arc->arcs as $arc)
				{
					
					if ($angle->center->is_equal_approximately($arc->center))
					{
						$arc_angle = $arc->angle();
						if ($segment->start->is_equal_approximately($angle->center) &&
							$segment->end->is_equal_approximately($angle->start))
						
						{
							if ($arc_angle < M_PI/2)
							{
								$segment_measure_height_sign = 1;
							
							}
							else
							{
								$segment_measure_height_sign = -1;
							}
					   
						}    
						else if ($segment->end->is_equal_approximately($angle->center) &&
								  $segment->start->is_equal_approximately($angle->start))
						{
							if ($arc_angle < M_PI/2)
							{
								$segment_measure_height_sign = -1;
							}
							else
							{
								$segment_measure_height_sign = 1;
							}
						}
					}
				}                    
			}    
		   
				
				
			//segment의 양끝점이 두 평행선 위에 있을 경우 measure height sign 결정
				
			$segment_line_size = sizeof($this->objects->segment->line);	
			if ($segment_line_size >= 2)
			{
				$parallel_line_pairs = [];
				for ($i = 0; $i < $segment_line_size-1; $i++)
				{
					
					for ($j = $i+1; $j < $segment_line_size; $j++)
					{
						
						if ($this->objects->segment->line[$i]->is_parallel($this->objects->segment->line[$j]))
						{
							$parallel_line_pairs[] = [$this->objects->segment->line[$i],$this->objects->segment->line[$j]];
						}    
					}
				} 
				
				if ($parallel_line_pairs)
				{
					$segment_angle_start = $segment->angle_start();
					
					foreach ($parallel_line_pairs as $parallel_line_pair)
					{
						
						if(($segment->start->is_contained($parallel_line_pair[0]) &&
							$segment->end->is_contained($parallel_line_pair[1]) ||
						   ($segment->start->is_contained($parallel_line_pair[1]) &&
							$segment->end->is_contained($parallel_line_pair[0])))
						{
							$is_height_sign_changed = true;
							if (0 <= $segment_angle_start && $segment_angle_start < M_PI)
							{
								$segment_measure_height_sign = -1;
								
							}
							else 
							{
								$segment_measure_height_sign = 1;
							   
							}
						}
					}    
				}
			}
			   
			if ($segment_measure_height_sign !== $segment_measure_height_sign_initial)
			{
				$segment->measure->height = $segment_measure_height_sign*$segment_measure_height_abs;
				
			}
			
			//segment위에 한 끝점이 있는 다른 segment measure가 visible이고 그런 모든 segment의 방향이 같은 경우
			if ($this->objects->segment->measure)
			{
				$segment_angle = $sement->angle();
				$is_left_segmented = false;
				$is_right_segmented = false;
							
				foreach ($this->objects->segment->measure as $segment_1)
				{
					
					if ($segment->id != $segment_1->id &&
						!$segment->is_contained($segment_1) &&
						!$segment_1->is_contained($segment) &&
						!$segment->is_overlap($segment_1))
					{
						if ($segment_1->start->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_1->angle()-$segment_angle);
							
							if (0 < $angle_difference && $angle_difference < M_PI)
							{
								$is_left_segmented = true;
							}
							else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
							{
								$is_right_segmented = true;
							}
						}
						else if ($segment_1->end->is_contained_strictly($segment))
						{
							$angle_difference = M_math::angle_polar($segment_1->angle(-1)-$segment_angle);
								
							if (0 < $angle_difference && $angle_difference < M_PI)
							{
								$is_left_segmented = true;
							}
							else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
							{
								$is_right_segmented = true;
							}
						}    
					}
					if ($is_left_segmented && $is_right_segmented)
					{
						break;
					}
				}        
				
				
				if ($is_left_segmented xor $is_right_segmented)    
				{
					
					if ($is_left_segmented)
					{
						$segment_measure_height_sign = -1;
						
					}
					else
					{
						$segment_measure_height_sign = 1;
						
					}
				}
			}
			
			if ($segment_measure_height_sign !== $segment_measure_height_sing_initial)
			{
				$segment->measure->height = $segment_measure_height_sign*abs($segment->measure->height);
					 
			}
		}
		unset($segment);
		
		
		//segment의 measure가 나타나는 경우 measure에 label이 겹칠 때  height 조정
	   
		//$segment_measure_height_initial = 0.001;
		
		
		foreach ($this->objects->segment->measure as &$segment)
		{
			$segment_measure_height_abs = abs($segment->measure->height));
			$segment_center = $segment->center();
			$segment_measure_height_sign = M_math::sign($segment->measure->height);
			$segment_length = $segment->length();
			$segment_angle = $segment->angle();
			if ($segment_measure_height_abs < $this->error)
			{
				
				
				foreach ($this->objects->segment->measure_label as $segment_1)
				{
					if ($segment->id != $segment_1->id) &&
						$segment_1->is_contained($segment))
					{  
						$segment_1_angle = $segment_1->angle();
						$segment_1_measure_height_sign = M_math::sign($segment_1->measure->height);
						if ((M_math::is_equal_approximately_angle($segment_1_angle-$segment_angle,M_PI) &&
							 $segment_measure_height_sign == $segment_1_measure_height_sign) ||
							(M_math::is_equal_approximately_angle($segment_1_angle-$segment_angle,M_PI) &&
							 $segment_measure_height_sign != $segment_1_measure_height_sign))
						{ 
							$segment_measure_radius = (pow($segment_measure_height,2)+pow($segment_length/2,2))/(2*$segment_measure_height);
							$distance_centers = $segment_measure_radius-$segment_measure_height;
							$segment_measure_center = $segment_center->addition(new M_Point_polar($distance_centers,$segment_angle-$segment_measure_height_sign*M_PI/2));
								
							$segment_1_length = $segment_1->length();
							$segment_1_center = $segment_1->center();
							  
								
							$segment_1_label_radius = $segment_1->label->size->norm()/2;
							$measure_1_angle = $segment_1_angle+$segment_1_measure_height_sign*M_PI/2;
							$segment_1_measure_label_boundary = $segment_1_center->addition(new M_Point_polar($segment_measure_height_abs+1+$segment_1_label_radius,$measure_1_angle));
							
							$segment_measure_height = max($segment_measure_height,$segment_measure_center->distance($segment_1_measure_label_boundary)-$distance_centers);   
							
						}
					}
				}
			} 
			
			
			
			$segment_start_angle = $segment_center->vector_angle($segment->start);
			$segment_end_angle = $segment_center->vector_angle($segment->end);
			if ($segment_measure_height_sign < 0)
			{
				$segment_angle_initial = $segment_start_angle;
				$segment_angle_terminal = $segment_end_angle;
			}
			else 
			{
				$segment_angle_initial = $segment_end_angle;
				$segment_angle_terminal = $segment_start_angle;
			}
			foreach ($this->objects->label->labels as $label)
			{
				$segment_measure_radius = (pow($segment_measure_height,2)+pow($segment_length/2,2))/(2*$segment->measure->height);
				$distance_centers = $segment_measure_radius-$segment->measure->height;
				$segment_measure_center = $segment_center->addition(new M_Point_polar($distance_centers,$segment_angle-$segment_measure_height_sign*M_PI/2));
				
				$label_angle = $segment_measure_center->vector_angle($label->coord);
				if (M_math::is_between_angles($label_angle,$segment_angle_initial,$segment_angle_terminal))
				{
					$label_length = $segment_measure_center->distance($labe->coord);
					if (abs($segment_measure_radius-$label_length) < 1)
					{
						$segment_measure_height = max($segment_measure_height,$label_length-$distance_centers);
					   
					}
				}
			}
				
			$segment->measure->height = $segment_measure_height_sign*$segment_measure_height);
		}
    
		
		 /*
        segment measure의 height의 변화가 없을 때 segment와 segment measure의 color를 일치시킴
		*/
		if ($this->objects->segment->measure)
		{
			foreach ($this->objects->segment->measure as &$segment)
			{
				if ($segment->measure->height == $segment_measure_height_initial)
				{
					$segment->measure->color = $segment->color;
				}
			}   
		}  
		
		
		//segment measure가 포함관계를 가질 때 measure height의 방향 결정
		foreach ($this->objects->segment->measure as &$segment)
		{
			
			$segment_angle = $segment->angle();
			$segment_measure_height_sign = M_math::sign($segment->measure->height); 
			foreach ($this->objects->segment->segments as $segment_1)  
			{
				if ($segment->id != $segment_1->id)
				{
					
					$segment_1_angle = $segment_1->angle();
					$segment_1_measure_height_sign = M_math::sign($segment_1->measure->height); 
				
					if (((M_math::is_equal_approximately_angle($segment_angle,$segment_1_angle) &&
						  $segment_measure_height_sign == $segment_1_measure_height_sign) ||
						 (M_math::is_equal_approximately_angle($segment_angle-$segment_1_angle,M_PI)
						  && $segment_measure_height_sign != $segment_1_measure_height_sign)) &&
						$segment->is_contained($segment_1))
					{
						$segment->measure->height *= -1;
					}
				}
			}
		}
		
		
		
		
		
		
		/*
     * 내용
       coords가 없는 Label들의 coords 결정
     
		*/
		
		$label_distance = 0.25; // labedl이 지정하는 정에서 label rectangle까지의 기본거리
		$label_radius = 0.5; // label이 지칭하는 점에서 label 중심까지의 기본거리
		$label_margin = new M_Tuple(0.2,0.2); // Label2D의 Rectangle의 margin
		$rectangle_margin = new M_Tuple(0.25,0.25); // Rectangle의 margin
		
		
		
		
		
		foreach ($this->objects->angle->label as &$angle)
		{
			
			$angle->label->coord = $angle->label->polygon()->center_between_halflines($angle->center,new M_Interval_angle($angle->angle_start(),$angle->angle()),$angle->height->value);
			
			
		}
		unset($angle);
		
		foreach ($this->objects->arc->label as &$arc)	
		{
			$label_angle = M_math::angle_polar($arc->angle_start()+$arc->angle()/2);
			$arc->label->coord = $arc->center->addition(new M_Point_polar($arc->radius(),$label_angle));
			
		}
		unset($arc);
			
		foreach ($this->objects->arc->measure_labeled as &$arc)		
		{		
					
			$label_radius = $arc->measure->height;
			$label_angle = $arc->angle_start()+$arc->angle/2;
			$arc->measure->label->coord = $arc->center()->addition(new M_Point_polar($label_radius,$label_angle));
			break;
		}
		unset($arc);
		
		
				
				
				  
		foreach ($this->objects->polygon->label as &$polygon)	
		{
			$polygon->label->coord = $polygon->centroid_vertices();
			$polygon_angles = [];
			$incidence_number = 0;
			foreach ($polygon->vertices as $point)
			{
				if ($label->coord->is_equal_approximately($point))
				{
					++$incidence_number;
				   
				}
				else if ($label->coord->distance($point) < 1)
				{
					$polygon_angles[] = $label->coord->vector_angle($point);
				}    
			}
			
			foreach ($this->objects->label->labels as $label_1)
			{
				if ($polygon->label->id != $label_1->id)
				{
					if ($polygon->label->coord->is_equal_approximately($label_1->coord))
					{
						++$incidence_number;
						
					}
					else if ($label->coord->distance($label_1->coord) < 1)
					{
						$polygon_angles[] = $polygon->label->coord->vector_angle($label_1->coord);
					}    
				}                       
			}
				  
			if ($incidence_number)
			{
				if ($polygon_angles)
				{
					$polygon->label->coord->addition(new M_Point_polar(1,$this->angle_mid_max($polygon_angles)));
				   
				}
				else 
				{
					$polygon->label->coord->addition(new M_Point(0,1));
					
				}    
			}
		} 
		unset($polygon);
		
		
		/*
		 * 내용: Label이 지정하는 object가 Point인 경우
		 * 원리: point를 지나는 object들이 형성하는 각을 수집한 후 가장 적합한 부분 선택
		 */
		foreach ($this->objects->point->label as &$point)
		{
			$label_radius = 0.5;
			$label_angle = M_PI/2;
							
			$set_interval_angle_forbidden = new M_Set_interval_angle; //label이 위치할 수 없는 angle
			$segments_measure_direction_number = $point->segments_measure_direction_number($this->objects->segment->segments);
						
						
			foreach ($this->objects->segment->segments as $segment)
			{
				if ($point->is_contained($segment))
				{
					if ($point->is_equal_approximately($segment->start))
					{    
						$segment_start_angle = $segment->angle();
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($segment_start_angle,0);
								
						if ($segment->measure)
						{
							$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle+$segment->measure->angles()->start),0);
						}    
					}
					else if ($point->is_equal_approximately($segment))
					{
						$segment_end_angle = $segment->angle(-1);
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($segment_end_angle,0);
								
						if ($segment->measure)
						{
							$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($segment_start_angle+$segment->measure->angles()->end),0);
						}    
					}
					else if ($point->is_contained($segment))
					{    
						$start_angle = $segment->angle();
						$end_angle = $segment->angle(-1);
									
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($start_angle,0);
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($end_angle,0);
					 
								
						if ($segment->measure)
						{
							if ($segments_measure_direction_number == 1)//point를 포함하는 meausre를 가진 (다른 방향의) segment의 갯수가 1개
							{
								if ($segment->measure->height > 0)
								{
									$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($end_angle,M_PI);
								}
								else if ($segment->measure->height < 0)
								{
									$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($start_angle,M_PI);    
								}    
							}
							else if ($segments_measure_direction_number >= 2)//point를 포함하는 meausre를 가진 (다른 방향의) segment의 갯수가 2개 이상
							{
								/*
								 * 방법
								 $label_distance+$label_rectangle_radius+$label_margin과 $point['coord']에서 segment measure 까지의 거리의 최대 최소값을 비교     
								 */
								
									
								$label_rectangle_radius = $label->size->norm()/2;
								$label_margin = 0.25;
								$distance_measure = $points->segment_measure_distance($segment);
								$length = $label_distance+$label_rectangle_radius+$label_margin;
								if ($length <= $distance_measure)
								{
									$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($end_angle-M_PI/4),M_PI/2);
								}
								else 
								{
									$segment_measure_height_abs = abs($segment->measure->height);
									$segment_measure_height_sign = M_math::sign($segment->measure->height);
								
									$segment_length = $segment->length();
									$segment_start_length = $point->distance($segment->start);
									$segment_end_length = $segment_length-$segment_start_length;        
									$length_min = min($segment_start_length,$segment_end_length);
									$coefficients = new M_Class('a','b','c');
									$coefficients->a =  $segment_length+4*$segment_measure_height_abs;
									$coefficients->b = -4*$segment_measure_height_abs;
									$coefficients->c = $length_min;
									$solutions = $this->solutions_quadratic($coefficients);
									foreach ($solutions as $solution)
									{
										if (0 <= $solution && $solution <= 1)
										{
											$t = $solution;
											break;
										}
									}
									
									$width = 4*$t*(1-$t)*$segment_measure_height_abs-$length_min;
									$height = $segment_length*pow($t,2);
									$length_diagonal = sqrt(pow($width,2)+pow($height,2));
									if ($length <= $length_diagonal)
									{
										$angles_number = ceil(M_PI/2/deg2rad(5));
										$interval_angle = M_PI/2/$angles_number;
										if ($segment_measure_height_sign > 0)
										{
											if ($segment_start_length <= $segment_end_length)
											{
												$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($start_angle-M_PI/2),M_PI/2);
											}
											else
											{
												$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($end_angle,M_PI/2);
											}
										}
										else if ($segment_measure_height_sign < 0)
										{
											if ($segment_start_length <= $segment_end_length)
											{
												$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($start_angle,M_PI/2);
											}
											else
											{
												$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($end_angle-M_PI/2),M_PI/2);
											}
										}
									}
									else
									{
										$angles_number = ceil(M_PI/deg2rad(5));
										$interval_angle = M_PI/$angles_number;
										if ($segment_measure_height_sign > 0)
										{
											$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($end_angle,M_PI);
										}
										else if ($segment_measure_height_sign < 0)
										{
											$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($end_angle-M_PI),M_PI);
										}
									}
								}    
							}
						}
					}    
				}
			}    
								   
				   
			foreach ($this->objects->polygon->polygons as $polygon)
			{
				foreach ($polygon->vertices as $vertex)
				{
					if ($label->id_object == $polygon->id &&
						$point->is_equal_approximately($vertex) &&
						$point->distance($label->coord) <= 3*$this->size)
					{
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($point->vector_angle($label->coord),0);
						break;
					}
				} 
			}
		
			
			$angle_5 = deg2rad(5);
			foreach ($this->objects->arc->arcs as $arc)
			{
				$point_angle = $arc->center->vector_angle($point);
				if ($point->is_equal_approximately($arc->start)) 
				{
					if ($arc_measyre_type == $type_measure_segment)
					{
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($point_angle,M_PI/2);
					}
					else
					{
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($point_angle+M_PI/2),0);
					}
				}
				else if ($point->is_equal_approximately($arc->end()))
				{
					$angle = M_math::angle_polar($point_angle-M_PI/2);
					if ($arc->measure)
					{
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($angle,M_PI/2);
					}
					else
					{
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($angle,0);
					 
					}
				}
			
				if ($point->is_contained($point,$arc))
				{
					
					if ($arc->measure)
					{
						   
					   $set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($point_angle-M_PI/2),M_PI);
					   
					}
					else
					{
						
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($point_angle-M_PI/2-$angle_5),$angle_5);
						$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($point_angle+M_PI/2),$angle_5);
					}
				}
			}        
			
				   
			$set_interval_angle_forbidden_angle = new M_Set_interval_angle;
			$intervals_angle_forbidden_angle_center = [];
			foreach ($this->objects->angle->angles as $angle)
			{
				
				$angle_start_angle = $angle->angle_start();                        
				//label과 angle이 겹치는 경우            
				
											 
				if ($point->is_equal_approximately($angle->center)) //point와 angle center가 일치
				{
					$set_interval_angle_forbidden_angle->intervals_angle[] = new M_Interval_angle($angle_start_angle,M_math::angle_polar($angle_start_angle+$angle->angle()));
				}
				else if ($point->is_contained_strictly(new M_Segment($angle->center,$angle->start)))
				{
					$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle($angle_start_angle,M_PI);
				}
				else if ($point->is_contained_strictly(new M_Segment($angle->center,$angle->end)))
				{
					$set_interval_angle_forbidden->intervals_angle[] = new M_Interval_angle(M_math::angle_polar($angle_start_angle-M_PI),M_PI);
				}
			}                              
			
					
			if (!$point->is_surrounded_by_set_interval_angle($intervals_angle_forbidden_angle))                                                       
			{
				$set_interval_angle_forbidden->intervals_angle = array_merge($set_interval_angle_forbidden->intervals_angle,$set_interval_angle_forbidden_angle->intervals_angle);
				$intervals_angle_max = $set_interval_angle_forbidden->complement()->max();
			   
			}
			else
			{
				$label_distance = 0.25;
				$intervals_angle_max = $set_interval_angle_forbidden->complement()->max();
				
			   
			}
			$point->label->coord = $label_polygon->center_between_halflines($point,$intervals_angle_max,$label_distance);
			
			
		}
		/*
		* Label이 지정하는 object가 Segment인 경우
		* 원리
		  segment의 한 끝점에서 출발해서 label rectangle과 segment의 접점을 거친후 label 중심에 도달 
		*/   
		
				   
		
		foreach ($this->objects->segment->label as &$segment)
		{
			$segment_angle = $segment->angle();
			$label_radius = $label->size->norm();
			$rectangle_angle = $label->size->angle();
						   
			if ((0 <= $segment_angle && $segment_angle <= M_PI/2) ||
				(3*M_PI/2 < $segment_angle && $segment_angle < 2*M_PI))
			{
				$start = $segment->start;
			}    
			else
			{
				$start = $segment->start;       
				$segment_angle = M_math::angle_polar($segment_angle+M_PI);
			}   
					
			$translation_radius = 0.5;
			$translation_angle = M_math::angle_polar($segment_angle+M_PI);
			$start_translated = $start->addition(new M_Point_polar($translation_radius,$translation_angle));
			
			if (M_math::is_equal_approximately_angle($segment_angle,0))
			{
				$label_angle = M_PI-$rectangle_angle;
				if ($bounds->y->max-$start_translated->y < $label->size->y)
				{
					$label_angle = M_PI+$rectangle_angle;
				}
			}
			else if (M_math::is_equal_approximately_angle($segment_angle,M_PI/2))
			{
				$label_angle = 2*M_PI-$rectangle_angle;
				if ($bounds->x->max-$start_translated->x < $label->size->x)
				{
					$label_angle = M_PI+$rectangle_angle;
				}
			}
			else if ($this->error_angle < $segment_angle && $segment_angle < M_PI/2-$this->error_angle)
			{
				$label_angle = 2*M_PI-$rectangle_angle;
				$width_visible = $bounds->x->max-$start_translated->x;
				if ($width_visible < $label->size->x)
				{
					$x_addition = $label->size->x-$width_visible;
					$y_addition = $x_addition/tan($segment_angle);
					if ($start_translated->y-$y_addition-$label->size->y < $bounds->y->min)
					{
						$label_angle = M_PI-$rectangle_angle;
						$height_visible = $bounds->y->max-$start_translated->x;
						if ($height_visible < $label->size->y)
						{
							$x_addition = $label->size->y-$height_visible;
							$y_addition = $x_addition/tan($segment_angle);
						}
					}
					$start_translated->x -= $x_addition;
					$start_translated->y -= $y_addttion;
				}
			}
			else 
			{
				$label_angle = $rectangle_angle;
				$width_visible = $bounds->x->max-$start_translated->x;
				if ($width_visible < $label->size->x)
				{
					$x_addition = $label->_size->x-$width_visible;
					$y_addition = $x_addition/tan(2*M_PI-$segment_angle);
					if ($start_translated->y+$y_addition+$label->size->y > $bounds->y->min)
					{
						$label_angle = M_PI-$rectangle_angle;
						$height_visible = $bounds->y->max-$start_translated->y;
						if ($height_visible < $label->size->y)
						{
							$x_addition = $label->size->y-$height_visible;
							$y_addition = $x_addition/tan(2*M_PI-$segment_angle);
						}
					}
					$start_translated->x -= $x_addition;
					$start_translated->y -= $y_addttion;
				}    
			}
			
			$segment->label->coord = $start_translated->addition(new M_Point_polar($label_radius,$label_angle));
			
			
		}  
	
			
		/*
		 * 내용: Label이 지정하는 obejct가 Segment measure인 경우
		 * 원리: segment measure의 중심에 위치
		 */
		foreach ($this->objects->segment->label as &$segment)
		{
			$segment_angle = $segment->angle();
			
			if ($segment->measure->height >= 0)
			{
				$angle = M_math::angle_polar($segment_angle+M_PI/2);        
			}
			else
			{
				$angle = M_math::angle_polar($segment_angle-M_PI/2);
			}
			
			$segment->measure->label->coord = $segment->center()->addition(new M_Point_polar(abs($segment->measure->height),$angle));
			
		}
					
			
		
		
		// curve label
	
		$set_rectangle_forbidden = new M_Set_rectangle(array_merge($this->set_rectangle_axis()->rectangles,$this->set_rectangle_axis_label()->rectangles,$this->set_rectangle_grid_label()->rectangles));
		foreach ($this->objects->curve->label as &$curve)
		{
			
			$curve_label_set_rectangle = $curve->label_set_rectangle();
			$curve_label_set_rectangle_allowed = $curve_label_set_rectangle->difference($set_rectangle_forbidden);
			foreach ($this->objects->objects as $object)
			{	
				if ($object->type == 'Curve' && $object->id = $curve->id )
				{
					$curve_label_set_rectangle_allowed = $curve_label_set_rectangle_allowed->difference($object->set_rectangle());	
				}
				else if ($object->type != 'Region')
				else 
				{
					$region = $object;
					foreach ($region->curves as $curve_region)
					{
						$curve_label_set_rectangle_allowed = $curve_label_set_rectangle_allowed->difference($curve_region->set_rectangle());
					}
				}
			}
			$curve->label->coord = $curve_label_set_rectangle_allowed->rectangles[0]->center;
			$set_rectangle_forbidden->rectangles[] = $curve_label_set_rectangle_allowed->rectangles[0];        
		}
		unset($curve);
		
		foreach ($this->objects->region->curve_label as &$curve)
		{
			
			$curve_label_set_rectangle_allowed = $curve_label_set_rectangle->difference($set_rectangle_forbidden);
			foreach ($this->objects->objects as $object)
			{	
				if ($object->type != 'Region')
				{
					$curve_label_set_rectangle_allowed = $curve_label_set_rectangle_allowed->difference($object->set_rectangle());	
				}
				else 
				{
					$region = $object;
					foreach ($region->curves as $curve_region)
					{
						if ($curve_region->id != $curve->id)
						{
							$curve_label_set_rectangle_allowed = $curve_label_set_rectangle_allowed->difference($curve_region->set_rectangle());
						}
					}
				}
			}
			$curve->label->coord = $curve_label_set_rectangle_allowed->rectangles[0]->center;
			$set_rectangle_forbidden->rectangles[] = $curve_label_set_rectangle_allowed->rectangles[0];          
		}
		unset($region);
		
		
		
		return $this;
		
    }      
	
	
	public function algorithm_json()
	{
		$Geo2D_object_algorithm = $this->algorithm();
		foreach ($Geo2D_object_algorithm->objects->objects as $object)
		{
			$this->Geo2D_elements_key_id[$object->id] = $object->json();
			
		}
		return $this->Geo2D;
	}

	/*
	1. 기능
		angle들을 크기순으로 나열한 후 최대 사이각의 중간값 출력
	2. 입력
		angles: angle들
	3. 출력
		쵀대 사이각의 중간값-위오른쪽에 위치한 각을 우선으로 선택
	*/
	public function angle_mid_max($angles)
	{
		$angles_size = sizeof($angles);

		if ($angles_size == 1)
		{
			return M_math::angle_polar($angles[0]+M_PI);
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
				$angles_difference[$i] = M_math::angle_polar($angles[$i+1]-$angles[$i]);
				$angles_mid[$i] = M_math::angle_polar($angles[$i]+$angles_difference[$i]/2);
				$angles_position[$i] = new M_Point(cos($angles_mid[$i]),sin($angles_mid[$i]);
			}

			$angles_difference_max = max($angles_difference);
			$angle_position = [0,-2];
			for ($i = 0; $i < $angles_size; $i++)
			{
				if (M_math::is_equal_approximately_angle($angles_difference[$i],$angles_difference_max))
				{
					if ($angles_position[$i][1] > $angle_position[1]+$error)
					{
						$angle_position = $angles_position[$i];
						$result = $angles_mid[$i];
					}
					else if (M_math::is_equal_approximately_angle($angles_position[$i][1],$angle_position[1]) && $angles_position[$i][0] > $angle_position[0]+$error)
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
	
		
	public function set_rectangle_axis()
	{
		$set_rectangle_axis = new M_Set_rectangle;
		if ($this->Geo2D['axis']) 
		{
			$interval2D_x = new M_Interval2D($this->bounds->x,new M_Interval(0,0))
			$set_rectangle_axis->rectangles[] = new M_Rectangle_interval2D($interval2D_x,0);
			$interval2D_y = new M_Interval2D(new M_Interval(0,0),$this->bounds->y)
			$set_rectangle_axis->rectangles[] = new M_Rectangle_interval2D(new M_Interval2D(new M_Interval(0,0),$this->bounds->y),0);
			
			
		}
		return $set_rectangle_axis;
	}

	public function set_rectangle_axis_label()
	{
		$set_rectangle_axis_label = new M_Set_rectangle;
		if ($this->Geo2D['axis'])
		{
			$interval2D_x = new M_Interval2D(new M_Interval($this->bounds->x->max-1,$this->bounds->x->max),new M_Interval(0,1));
			$set_rectangle_axis_label->rectangles[] = new M_Rectangle_interval2D($interval2D_x,0);
			$interval2D_y = new M_Interval2D(new M_Interval(-1,0),new M_Interval($this->bounds->y->max-1,$this->bounds->y->max));
			$set_rectangle_axis_label->rectangles[] = new M_Rectangle_interval2D($interval2D_y,0);
			
			
		}
		return $set_rectangle_axis_label;
	}
	
	public function set_rectangle_grid_label()
	{
		$set_rectangle_grid_label = new M_Set_rectangle;
			
		if ($this->Geo2D['grid'])
		{
			$x_min = floor($this->bounds->x->min/$this->scaling->x);
			$x_max = ceil($this->bounds->x->max/$this->scaling->x);
			$interval_x = new M_Interval(-1,0);
			for ($i = $x_min; $i < 0; $i++)
			{
				$interval2D = new M_Interval2D(new M_Interval($i-1,$i+0.5),$interval_x);
				$set_rectangle_grid_label->rectangles[] = new M_Rectangle_interval2D($interval2D,0);
			}
			for ($i = 0; $i <= $x_max; $i++)
			{
				$interval2D = new M_Interval2D(new M_Interval($i-0.5,$i+0.5),$interval_x);
				$set_rectangle_grid_label->rectangles[] = new M_Rectangle_interval2D($interval2D,0);
			}
			
			$y_min = floor($this->bounds->y->min/$this->scaling->y);
			$y_max = ceil($this->bounds->y->max/$this->scaling->y);
			$interval_y_negative = new M_Interval(-1.5,0);
			for ($i = $y_min; $i < 0; $i++)
			{
				$interval2D = new M_Interval2D($interval_y_negative,new M_Interval($i-0.5,$i+0.5));
				$set_rectangle_grid_label->rectangles[] = new M_Rectangle_interval2D($interval2D,0);
			}
			$interval_y_positive = new M_Interval(-1,0);
		    for ($i = 0; $i <= $y_max; $i++)
			{
				$interval2D = new M_Interval2D($interval_y_positive,new M_Interval($i-0.5,$i+0.5));
				$set_rectangle_grid_label->rectangles[] = new M_Rectangle_interval2D($interval2D,0);
			}
			
			
			
		}
		return $set_rectangle_grid_label;
		
		
	}	
	
	
	/*
	1. Function
		Compute solutions of quadratic equation ax^2+bx+c=0
	2. Input
		$coefficients: [a,b,c]
	3. Output
		Solutions
	*/
	public function solutions_quadratic($coefficients)
	{
		
		$D = pow($coefficients->b,2)-4*$coefficients->a*$coefficients->c;

		if ($D == 0)
		{
			return [-$coefficients->b/(2*$coefficients->a)];
		}
		if ($D >= 0)
		{
			return [(-$b+sqrt($D))/(2*$coefficients->a),(-$coefficients->b-sqrt($D))/(2*$coefficients->a)];
		}
		return [];
	}
	
	
	/*
	1. 기능
		두 angle object의 angle을 비교해 usort에 쓰기 위한 function (usort 참조)
	2. 입력
		angle_1,angle_2: angle object
	3. 출력

	*/

	public function angle_ascending($angle_1,$angle_2)
	{
		$angle_1_angle = $angle_1->angle();
		$angle_2_angle = $angle_2->angle();

		if ($angle_1_angle < $angle_2_angle)
		{
			return 1;
		}
		if ($angle_1_angle == $angle_2_angle)
		{
			return 0;
		}
		if ($angle_1_angle > $angle_2_angle)
		{
			return -1;
		}
	}
		
}











































