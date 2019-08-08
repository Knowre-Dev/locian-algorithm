<?php
             
                   
    
//Cartesian2D algorithm KR

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
*/
/*    Genral Rules
Angle
 1. Acute angles should have name or degree as close to angle as possible. don’t show arc
 2. Obtuse angles should have arc.
 3. Show arc if angle has a color
 4. Show arc if angle has any type of tick
 5.Show arc if selectable or clickable is true
 6. Show arc if an angle is overlapping another angle (inner angle label should lie below outer angle arc)
 7. Right angle marks should always be on the inside if overlapping occurs.
 8. Angless clssasification
     -arc form: none, double, dash, dbldash, tpldash
     -nonarc form: right, dot, circle
 9. Show arc if angle >= pi
 10. Angles with the same radius should have difference measure height
 
Line
 1. Arrows should be on ends of all lines. 
 2. Only lowercase [a-z] letters used for names
 3. Show names at the end of lines

Segment
 1. Segment measures should stay central and as close to the segment as possible. 
 2. Do not show dashed arc only if there are no overlaping segment.
*/
     


function Cartesian2D_algorithm_US(&$Cartesian2D) 
{
    
    $bound = Cartesian2D_bound($Catesian2D);
    $Cartesian2D_axis = $Cartesian2D['axis'];
    $Cartesian2D_grid = $Cartesian2D['grid'];
    $Cartesian2D_ratio = $Cartesian2D['ratio'];//y길이/x길이
    $Cartesian2D_rotation = $Cartesian2D['rotation']; // 평면 회전각
    $Cartesian2D_size = $Cartesin2D['size']; // Grid의 정사각형의 한 변 크기
    
    
    
    $scaling = {'x':$Cartesian2D_size,'y':$Cartesian2D_size/$Cartesian2D_ratio}; //기준 크기에 대한 x,y 비율
    
    $error = 0.01; // 길이나 크기 비교시 error의 최대값    
    $error_angle = deg2rad(1); // angle의 크기 비교시 error의 최대값  
    $font_sizes_unit = D_Rectangle_size(0.5/$scaling['x'],0.5/$scaling['y']);//Font 크기 기본단위
    $unit_length = 0.5; // 기본 단위 길이
    
    
    
    //names
    
    $type_angle = 'Angle2D';
    $type_arc = 'Arc2D';
    $type_measure_arc = 'MeasureArc2D';
    $type_axis = 'Axis2D';
    $type_curve = 'Curve2D';
    $type_face = 'Face2D';
    $type_grid = 'Grid2D';
    $type_label = 'Label2D';
    $type_path = 'Path2D';
    $type_point = 'Point2D';
    $type_region = 'Region2D';
    $type_segment = 'Segment2D';
    $type_measure_segment = 'Measure2D';
    
    $Angle2D_markers_arc = ['none','single','double','triple'];
        
    
    
    //$Cartesian2D['flip']; // x축, y축 axis label이 붙는 순서
    //$Cartesin2D['font']['size']: font 크기
    //$Cartesian2D['ratio']: y 길이 / x 길이
    
    $objects = &Cartesian2D_datas($Cartesian2D);//전체 object
    $objects_key_label = []; //key: label id, value: object
    $objects_key_measure = []; //key: measure id, value: meausre's object (arc or segment)
    
    $arcs = []; // Arc들의 array
    $arcs_dash = []; // dash를 가지는 Arc
    $arcs_data = []; //arc data
    $arcs_end = [];
    $arcs_measure = []; // Measure를 가지는 Arc
    $arcs_radius = [];
    
    
    $angles = []; // Angle
    $angles_color = []; // color를 가지는 Angle
    $angles_data = [];
    $angles_interactive = []; // interactive인 Angle (old: selectable)
    $angles_marker = []; //marker가 있는 angle
    $angles_marker_none = []; //marker가 없는 angle (right angle 제외)
    $angles_arc = []; //각을 나타나는 형태가 arc인 angle
    $angles_nonarc = []; //각을 나타내는 형태가 arc가 아닌 angle
    $angles_right = []; //직각인 angle
    
    
       
    $curves = []; // Curve
        
    $faces = []; // Face
    $faces_center = [];
    $faces_data = [];
    
	
	$labels_vertices = []; // vertices of label polygon
	
    $labels = []; // Label
    $labels_curve = []; //curve label
    $labels_noncurve = []; //noncurve label
    $labels_key_data = []; //key: object id, value: label
    $labels_size = []; // Label size (key: label id, value: label size)
        
    $paths = []; // Path
    $paths_data = [];
      
    $points = []; // Points
    $points_data = [];
        
          
    $segments = []; // Segment
    $segments_dash = []; // dash를 가지는 Segment
    $segments_data = [];
    $segments_length = [];
    $segments_measure = []; // Mesausre 가지는 Segment
    $segments_parallel = []; //parallel을 가지는 Segment
    $segments_line = []; //Segment중 start와 end가 bound에 위치한 것들
    
    
    //angle values
    $angles_angle_angle = [];
    $angles_angle_start = [];   // angle center -> start 방향 angle
    $angles_angle_end = []; //angle center -> end 방향 angle
    $angles_arc_start = [];   // arc center -> start 방향 angle
    $angles_arc_end = []; //arc center -> end 방향 angle
    $angles_segment_start = []; //segment start -> end 방향 angle
    $angles_segment_end = []; //segment end -> start 방향 angle
    
    
    
    
    
    
    
    foreach ($objects as &$object) // 각 object를 type에 따라 분류
    {
        $object_type = object_type($object);
        $object_id = object_id($object);
        if ($object_type != $type_label)
        {
            $labels_key_data[$object_id] = null;
        }
        switch ($object_type)
        {
            case $type_angle:
            {
                $angles[] = $object;
                $Angle2D_data = Angle2D_data($object);
                $angles_data[$object_id] = $Angle2D_data;
                $angles_angle_start[$object_id] = M_vector_angle($Angle2D_data['center'],$Angle2D_data['start']);
                $angles_angle_end[$object_id] = M_vector_angle($Angle2D_data['center'],$Angle2D_data['end']);
                $angles_angle_angle[$object_id] = Angle2D_angle($Angle2D_data);
                if (object_color($object))
                {
                    $angles_color[] = &$object;
                }    
                if (object_interactive($object))
                {
                    $angles_interactive[] = &$object;
                }
                
                
                if (Angle2D_right_angle($object))
                {
                         $angles_right[] = &$object;
                }
                else
                {
                    $Angle2D_marker = object_marker($object);
                    
                    if ($Angle2D_marker == 'none')
                    {
                        $angles_marker_none[] = &$object;
                    }
                    else 
                    {
                        $angles_marker[] = &$object;    
                    }
                    
                    if (in_array($Angle2D_marker,$Angle2D_markers_arc))
                    {
                        $angles_arc[] = &$object;
                    }
                    else
                    {
                        $angles_nonarc[] = &$object;
                    }
                }
                
                
                          
                break;
            }
            case $type_arc:
            {
                $arcs[] = $object;
                $arc_data = Arc2D_data($object);
                $arcs_data[$object_id] = Arc2D_data($object);
                $arcs_end[$object_id] = Arc2D_end($arc);
                $arcs_radius[$object_id] = M_diatance($arc_data['center'],$arc_data['start']);
                $angles_arc_start[$object_id] = M_vector_angle($arc_data['center'],$arc_data['start']);
                $angles_arc_end[$object_id] = M_vector_angle($arc_data['center'],Arc2D_end($arc_data));
                if (object_dash($object))
                {
                    $arcs_dash[] = &$object;
                }    
                
                $object_measure = object_measure($object);
                if (object_type($object_measure) == $type_measure_arc)
                {
                    $arcs_measure[] = &$object;
                    $objects_key_measure[object_id($object_measure)] = &$object;
                }
                
                break;
            }
            case $type_curve:
            {
                $curves[] = &$object;    
                break;
            }
            case $type_face:
            {
                $faces[] = &$object;
                $Face2D_data = Face2D_data($object);
                $faces_center[$object_id] = M_mean_arithmetic($Face2D_data);
                $faces_data[$object_id] = $Face2D_data;
                break;
            }
            
            case $type_label:
            {
                $labels[] = &$object;
                $labeled_object_id = labeled_object_id($object)
                $labeled_object = &find_object($labeled_object_id,$objects);
                $labels_key_object[$labeled_object_id] = &$object;
                $objects_key_label[$object_id] = &$labeled_object;
                if (object_type($labeled_object) == $type_curve)
                {
                    $labels_curve[] = &$object;
                }
                else
                {
                    $labels_noncurve[] = &$object;
                }
				$labels_vertices[$object_id] = S_latex_vertices($object);
                $labels_size[$object_id] = Label2D_size(label_label($object),$scaling)));
                break;
            }
            case $type_path:
            {
                $paths[] = &$object;
                $paths_data[$object_id] = Path2D_data($object);
                break;
            }
            case $type_point:
            {
                $points[] = &$object;
                $points_data[$object_id] = Point2D_data($object)
                break;
            }
            case $type_region:
            {
                $curves = array_merge($curves,Region2D_curves($object));
                break;
            }
            case $type_segment:
            {
                $segments[] = &$object;
                $segment_data = Segment2D_data($object);
                $segments_data[$object_id] = $segment_data;
                $segments_length[$object_id] = M_distance($segment_data['start'],$segment_data['end']);
                $angles_segment_start[$object_id] = M_vector_angle($segment_data['start'],$segment_data['end']);
                $angles_segment_end[$object_id] = M_vector_angle($segment_data['end'],$segment_data['start']);
                
                if (object_dash($object))
                {
                    $segments_dash[] = &$object;
                }
                
                $object_measure = object_measure($object);    
                if (objet_type($object_measure) == $type_measure_segment && object_measure_height($object))
                {
                    $segments_measure[] = &$object;
                    $objects_key_measure[object_id($object_measure)] = $object;
                }
                    
                if (Segment2D_parallel($object))
                {   
                    $segments_parallel[] = &$object;
                }
                
                if (is_Segment2D_line(Segment2D_data($object),$bound))
                {
                    $segments_line[] = &$object;
                }
                    
                break;
            }
        }
    }
    unset ($object);
    
    
    
    
 
    
    
    
    
    
    
    
    


           
    
    
    
    
    
    
    
    /*
      @ 내용
        Segment2D에 parallel을 표현할 경우 source, target에 상관없이 parallel 표현이 한쪽으로 정렬되도록 하는 것
      @ 규칙
        1. Segment2D의 angle a가 0 <= a < M_PI가 되도록 한다.
        2. angle을 조정할 때 measure-style-arrow가 존재하면 measure-style-arrow-start와 measure-style-arrow-end를 교환한다.
    */

    foreach ($segments_parallel as &$segment)
    {
        $segment_angle = $angles_segment_start[object_id($segment)];            
        if (M_PI <= $segment_angle && $segment_angle <= 2*M_PI) // 규칙 1
        {
            Segment2D_swap_start_end($segment);
        }
    }
    unset($segment);

    
    
    
     /*
      @ 내용
        겹쳐있는 parallel 표시들이 같을 경우에 가장 큰 segment의 표현 하나만 남기는 것
    */
    foreach ($segments_parallel as &$segment)
    {
        $segment_id = object_id($segment);
        $segment_data = $segments_data[$segment_id];
        
        foreach ($segments_parallel as $segment_1)
        {
            $segment_1_id = object_id($segment_1);
            $segment_1_data = $segments_data[$segment_1_id];
            if ($segment_id != $segment_1_id &&
                is_contained_Segment2D_Segment2D($segment_data,$segment_1_data))
            {
                $segment['parallel'] = 'none';
                    
                replace_data($segment_1,&$segments,&$segments_dash,&$segments_label,&$segments_measure,&$segments_measure_label,&$segments_parallel,&$segments_line,&$objects);   
            }
        }
    }
    unset($segment);    
    
    
    //measure의 height 결정
       
    
    //arc의 measure - arc를 포함하는 원의 반지름에 따라 measure의 height 결정
    
    if ($arcs_measure)
    {
        foreach ($arcs_measure as &$arc)
        {
            object_measure_height_change($arc,0.5*min($arcs_radius[object_id($arc)])*0.2,2);
        }    
    } 
    unset($arc);
    
    //겹치는 arc의 measure height 결정
   
    if ($arcs_measure)
    {
        $height_increment_overlap = 0.125;
        $height_increment_contained = 0.125;
        $height_increment_contained_label = 0.5;
        $arcs_measure_size = sizeof($arcs_measure);
        
        for ($i = 1; $i < $arcs_measure_size; $i++)
        {
            $arcs_measure_i_id = object_id($arcs_measure[$i];
            $arcs_measure_i_data = $arcs_data[$arcs_measure_i_id];
            $arcs_measure_j_measure_height = object_measure_height($arcs_measure[$j]);
            
            for ($j = 0; $j < $i; $j++)
            {
                $arcs_measure_j_id = object_id($arcs_measure[$j]);
                $arcs_measure_j_data = $arcs_data[$arcs_measure_j_id];
                if (!is_contained_arc_arc($arcs_measure_j_data,$arcs_measure_i_data) &&
                    !is_contained_arc_arc($arcs_measure_i_data,$arcs_measure_j_data) &&
                    is_overlap_Arc2D_Arc2D($arcs_measure_j_data,$arcs_measure_i_data)&&
                    abs($arcs_measure_j_measure_height-object_measure_height($arcs_measure[$j])) < $error)
                {
                    object_measure_height_change($arcs_measure[$i],$arcs_measure_j_measure_height+$height_increment_overlap);
                } 
            }
        }
        
        foreach ($arcs_measure as &$arc)
        {
            $arc_id = object_id($arc)
            $arc_data = $arcs_data[$arc_id];
            foreach ($arcs_measure as $arc_1)
            {
                $arc_1_id = object_id($arc_1);
                if ($arc_id != $arc_1_id)
                {
                    if (is_contained_arc_arc($arcs_data[$arc_1_id],$arc_data))
                    {
                        if ($objects_label_key[$arc_1_id])
                        {
                            object_measure_height_change($arc,object_measure_height($arc_1)+$height_increment_contained_label);
                        }
                        else 
                        {
                            object_measure_height_change($arc,object_meausre_height($arc_1)+$height_increment_contained);
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
    
         
    if ($angles)
    {
        $angle_height_standard = $unit_length*$Cartesian2D_size; // angle height 기준값
        $Angle2D_marker_none_height_standard = 0; // Angle marker == none인 경우 height의 기준값
        $angle_right_height_standard = $angle_height_standard*sqrt(2); // Angle2D의 rightAngle == true인 경우 height의 기준값
        
        
        //Initial angle height
        foreach ($angles_right as &$angle_right)
        {
            Angle2D_height_change($angle_right,$angle_right_height_standard);  
        }
        unset($angle_right);
        
        foreach ($angles_marker as &$Angle2D_marker)
        {
            Angle2D_height_change($Angle2D_marker,$angle_height_standard);
        }
        unset($Angle2D_marker);
        
       
        foreach ($angles_marker_none as &$Angle2D_marker_none)
        {
            $Angle2D_marker_none_angle = $angles_angle_angle[object_id($Angle2D_marker_none)];
           
            if (0 <= $Angle2D_marker_none_angle && $Angle2D_marker_none_angle < M_PI)
            {
                 if (object_interactive($Angle2D_marker_none) || object_color($Angle2D_marker_none))
                 {
                     Angle2D_height_change($Angle2D_marker_none,$angle_height_standard);
                 }
                 else 
                 {
                     Angle2D_height_change($Angle2D_marker_none,$Angle2D_marker_none_height_standard);   
                      
                 }
            }
            else
            {
                Angle2D_height_change($Angle2D_marker_none,$angle_height_standard);
                
            }
        }
        unset($Angle2D_marker_none);

        //Initial angle label positions
        foreach ($angles as $angle)
        {
            $angle_id = object_id($angle);
            $angle_label = &$labels_key_data[$angle_id];
            $Angle2D_data = $angles_data[$angle_id];
            if ($angle_label)
            {
				$interval_angle = [$angles_angle_start[$object_id],$angles_angle_angle[$object_id]];
				$label_coord = M_polygon_center_distance_between_halflines($Angle2D_data['center'],$labels_vertices[$angle_id],$angle_inveral,$Angle2D_data['height']);
				Label2D_coord_change($angle_label,$label_coord);
            }
        }
       
        //Label positions and heights of angles which are arc forms
        usort($angles_arc,'usort_angle_ascending');
        
        $angles_not_arc = array_merge($angles_nonarc,$angles_right);
        
        $angle_height_increment = 0.15;
        $angles_arc_size = sizeof($angles_arc);
        for ($i = 0; $i < $angles_arc_size; $i++)
        {
            $angles_arc_i_id = object_id($angles_arc[$i]);
            
            $angles_arc_i_label = &$labels_key_data[$angles_arc_i_id];
            if ($angles_arc_i_label)
            {
                $angles_arc_i_data = $angles_data[$angles_arc_i_id];
                
                            
                $start_angle = $angles_arc_start[$angles_arc_i_id];
                $angle_angle = $angles_angle_angle[$angles_arc_i_id];
                $end_angle = $angles_arc_end[$angles_arc_i_id];
                
                //$angles_arc_i_label_size = $labels_size[object_id($angles_arc_i_label)];
                $angles_arc_i_label_vertices = $labels_vertices[object_id($angles_arc_i_label)];
				$angles_arc_i_label_center = polygon_center_between_halflines($angles_arc_i_data['center'],$angles_arc_i_label_vertices,[$start_angle,$angle_angle],
				    $angles_arc_i_data['height']);
                $angles_arc_i_label_vertices_translated = D_Point2Ds_translation($angles_arc_i_label_vertices,$angles_arc_i_label_center);
				$angles_arc_i_label_distance_max = M_Point2D_Point2Ds_distance_max($angles_arc_i_data['center'],$angles_arc_i_label_vertices_translated);
                
               
                $radii_arc = [];
                $radii_not_arc = [];
                $point_angles = [];
                $label_angles = [];
                  
                foreach ($angles_not_arc as $angle_not_arc)
                {
                    $angle_not_arc_id = object_id($angle_not_arc);
                    $angle_not_arc_data = $angles_data[$angle_not_arc_id];
                    if (is_overlap_Angle2D_Angle2D($angles_arc_i_data,$angle_not_arc_data))
                    {
                        $angle_not_arc_label = $labels_key_data[$angles_not_arc_id];
                        if (!$angle_not_arc_label)
                        {  
                            $radii_not_arc[] = $angle_not_arc_data['height'];
                        }
                        else
                        {
                            $angle_not_arc_start_angle = $angles_angle_start[$angle_not_arc_id];
                            $angle_not_arc_end_angle = $angles_angle_end[$angle_not_arc_id]
                            $point_angle = M_angle_polar($angle_not_arc_start_angle-$start_angle);            
                            if ($point_angle <= $angle_angle)
                            {
                                $point_angles[] = $point_angle;    
                            }
                            $point_angle = M_angle_polar($angle_not_arc_end_angle-$start_angle);
                            if ($point_angle <= $angle_angle)
                            {
                                $point_angles[] = $point_angle;    
                            }
                            $label_angle = M_angle_polar(M_vector_angle($angle_not_arc_data['center'],label_coord($angle_not_arc_label))-$start_angle);
                            if ($label_angle <= $angle_angle)
                            {
                                $label_angles[] = $label_angle;    
                            }
							$angle_not_arc_label_vertices = $labels_vertices[object_id($angle_not_arc_label)];
                            //$angle_not_arc_label_size = $labels_size[object_id($angle_not_arc_label)];
                            $angle_not_arc_label_center = polygon_center_between_halflines($angle_not_arc_data['center'],$angle_not_arc_label_vertices,[$angle_not_arc_start_angle,$angles_angle_angle[$angle_not_arc_id]],$angle_not_arc_data['height']);
							$angle_not_arc_label_distance_max = 0;
							foreach ($angle_not_arc_label_vertices as $vertex)
							{
								$angle_not_arc_label_distance_max = max($angle_not_arc_label_distance_max,M_distance($angle_not_arc_data['center'],addition($angle_not_arc_label_center,$vertex)));
							}
                            
                            if (($angle_not_arc_data['height'] <= $angles_arc_i_data['height'] && $angles_arc_i_data['height'] <= $angle_not_arc_label_distance_max) ||
                                ($angle_not_arc_data['height'] <= $angles_arc_i_label_distance_max && $angles_arc_i_label_distance_max <= $angle_not_arc_label_distance_max))  
                            {
                                $radii_not_arc[] = $angle_not_arc_label_distance_max;
                            }     
                        }
                    }
                }
                for ($j = 0; $j < $i; $j++)
                {
                    $angles_arc_j_id = object_id($angles_arc[$j]);
                    $angles_arc_j_data = $angles_data($angles_arc_j_id);
                    if (is_overlap_Angle2D_Angle2D($angles_arc_i_data,$angles_arc_j_data))
                    {
                        $angles_arc_j_label = $labels_key_data[$angles_arc_j_id];
                        if ($angles_arc_j_label)
                        {
                            $angles_arc_j_start_angle = $angles_angle_start[$angles_arc_j_id];
                            $angles_arc_j_end_angle = $angles_angle_end[$angles_arc_j_id];
                            $point_angle = M_angle_polar($angles_arc_j_start_angle-$source_angle);
                            if ($point_angle <= $angle_angle)
                            {
                                $point_angles[] = $point_angle;    
                            }
                            
                            $point_angle = M_angle_polar($angles_arc_j_end_angle-$source_angle);
                            if ($point_angle <= $angle_angle)
                            {
                                $point_angles[] = $point_angle;    
                            }
                            $label_angle = M_angle_polar(M_vector_angle($angles_arc_j_data['center'],label_coord($label_$angles_arc_j)-$source_angle);
                            if ($label_angle <= $angle_angle)
                            {    
                                $label_angles[] = $label_angle;    
                            }
                        }
                        
                        $angles_arc_j_label_distance_max = M_Point2D_Point2Ds_distance_max($angles_arc_j_data['center'],$angles_arc_i_label_vertices_translated);
                        if (($angles_arc_j_data['height'] <= $angles_arc_i_data['height'] && $angles_arc_i_data['height'] <= $angles_arc_j_label_distance_max) ||
                            ($angles_arc_j_data['height'] <= $angles_arc_i_label_distance_max && $angles_arc_i_label_distance_max <= $angles_arc_j_label_distance_max))  
                        {
                            $radii_arc[] = $angles_arc_j_label_distance_max; 
                        }
                    }
                }
                
                if ($radii_arc)
                {  
                    Angle2D_height_change($angles_arc[$i],max($angles_arc_i_height,max($radii_not_arc),max($radii_arc)+$angle_height_increment));
                }
                
                $angle_part_label_data = $angles_arc_i_data;
                $angle_part_label_data['height'] = max(Angle2D_height_actual($angles_arc[$i],max($radii_not_arc)+$angle_height_increment,max($radii_arc)+$angle_height_increment));
                    
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
                        $point_angle = M_angle_polar($point_angles[$k+1],$point_angles[$k]);
                        for ($l = 0; $l < $label_angles_size; $l++)
                        {
                            
                            if (M_angle_polar($label_angles[$l]-$point_angles[$k]) <= $point_angle)
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
                    
                    $start_angle = M_angle_polar($start_angle+$point_angles[$label_key]);
                    $angle_angle = M_angle_polar($point_angles[$label_key+1]-$point_angles[$label_key]);
                   
                   
                }
                Label2D_coord_change($angles_arc_i_label,polygon_center_between_halflines($angle_part_label_data['center'],$angles_arc_i_label_vertices,[$start_angle,$angle_angle],$angle_part_label_data[3]));               
               
            }
        }
         
    
    
        
        if (sizeof($angles_interactive)+sizeof($angles_color) >= sizeof($angles))
        {
            $angle = deg2rad(40);
            for ($i = 0; $i < $angles_arc_size; $i++)
            {
               Angle2D_height_change($angles_arc[$i],$angles_arc[$i]['height']+max(0,($angle-$angles_arc_i_angle)/$angle));  
            }    
        }
    }       
   
   
   
   //segment의 measure height 결정
    $segment_measure_height_initial = 0.001;
    $segment_measure_height_initial_marker = $Cartesian2D_ratio;
    $increment = 0.3;
    foreach ($segments_measure as &$segment)
    {
        if (object_measure_marker($segment) == 'none') 
        {
            object_measure_height_change($segment,$segment_measure_height_initial);
        }
        else 
        {
            object_measure_height_change($segment,$segment_measure_height_initial_marker);
        }
        
        
        $segment_id = object_id($segment);
        $segment_data = $segments_data[$segment_id];
        $segment_measure_height = object_measure_height($segment);
        $segment_length = $segments_length[$segment_id];
        $angle = M_PI/4;
        $radius = ($segment_length/2)/sin(M_PI/8);
                   
        
        foreach ($segments_measure as $segment_1)
        {
            $segment_1_id = object_id($segment_1);
            $segment_1_data = $segments_data[$segment_1_id];
            if ($segment_id != $segment_1_id &&
                is_contained_Segment2D_Segment2D($segment_1_data,$segment_data))
            {
                object_measure_height_change($segment,sign($segment_measure_height)*($radius-sqrt(pow($radius,2)-pow($segment_length/2,2))+$increment);
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
   
    foreach ($segments_measure as &$segment)
    {
        
        //segment의 기본 정보
        $segment_id = object_id($segment);
        $segment_data = $segments_data[$segment_id];
        $segment_measure_height = object_measure_height($segment);
        $segment_measure_height_abs = abs($segment_meausre_height);
        $segment_measure_height_sign = M_sign($segment_measure_height);
        $segment_measure_height_sign_initial = $segment_measure_height_sign;
               
        $segment_start_angle = $angles_segment_start[$segment_id];
        $segment_end_angle = $angles_segment_end[$segment_id];
               
        // Segment2D를 지나는 object의 angle 수집
                       
        $intervals_angle_start = []; // coords-start를 지나는 Segment2D의 angle array
        $intervals_angle_end = []; // coords-end를 지나는 Segment2D의 angle array
        
        
        // object == Segment2D
         
        foreach ($segments as $segment_1)  
        {
            $segment_1_id = object_id($segment_1);
            $segments_1_data = $segments_data[$segment_1_id];
            if ($segment_id != $segment_1_id &&
                !is_parallel_Segment2D_Segment2D($segment_data,$segment_1_data) &&
                is_contained_Segment2D_Segment2D($segment_data,$segment_1_data) &&
                is_contained_Segment2D_Segment2D($segment_1_data,$segment_data))
            {
                $segment_1_start_angle = $angles_segment_start[$segment_1_id];
                $segment_1_end_angle = $angles_segment_end[$segment_id];
                    
                if (M_is_equal_approximately($segment_data['start'],$segment_1_data['start'])) // segment의 coords-start와 segment_1의 coords-start가 일치 
                {   
                    $intervals_angle_start[] = D_interval_angle($segment_1_start_angle,0); 
                }
                else if (M_is_equal_approximately($segment_data['start'],$segment_1_data['end'])) // segment의 coords-start와 segment_1의 coords-end가 일치
                {
                    $intervals_angle_start[] = D_interval_angle($segment_1_end_angle,0);
                }
                
                else if (is_contained_strictly_Point2D_Segment2D($segment_data['start'],$segment_1_data)) // segment의 coords-start가 segment_1에 strict하게 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle($segment_1_start_angle,0);  
                    $intervals_angle_start[] = D_interval_angle($segment_1_end_angle,0);
                }
              
                if (M_is_equal_approximately($segment_data['end'],$segment_1_data['start'])) // segment의 coords-end와 segment_1의 coords-start가 일치 
                {   
                    $intervals_angle_end[] = D_interval_angle($segment_1_start_angle,0); 
                }
                else if (M_is_equal_approximately($segment_data['end'],$segment_1_data['end'])) // segment의 coords-end와 segment_1의 coords-end가 일치
                {
                    $intervals_angle_end[] = D_interval_angle($segment_1_end_angle,0);
                }
                else if (is_contained_strictly_Point2D_Segment2D($segment_data['end'],$segment_1_data)) // segment의 coords-end가 segment_1에 strict하게 포함됨
                {
                    $intervals_angle_end[] = D_interval_angle($segment_1_start_angle,0);  
                    $intervals_angle_end[] = D_interval_angle($segment_1_end_angle,0);
                }
            }
        }   
                  
        //object == Arc2D
                        
        foreach ($arcs as $arc)
        {
            $arc_id = object_id($arc);
            $arc_data = $arcs_data[$arc_id];
            if (is_contained_Point2D_Arc2D($segment_data['start'],$arc_data))
            {
                if (M_is_equal_approximately($segment_data['start'],$arc_data['center'])) // segment의 coords-start와 arc의 coords-start가 일치 
                {
                    $intervals_angle_start[] = D_interval_angle(M_angle_polar($segment_start_angle+M_PI/2),0);
                }
                else if (M_is_equal_approximately($segment_data['start'],$arcs_end[$ard_id])) // segment의 coords-start와 arc의 coords-end가 일치
                {
                    $intervals_angle_start[] = D_interval_angle(M_angle_polar($segment_start_angle-M_PI/2),0);
                }
                else if (is_contained_strictly_Point2D_Arc2D($segment_data['start'],$arc_data)) // segment의 coords-start가 arc에 strict하게 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle(M_angle_polar($segment_start_angle+M_PI/2),0);
                    $intervals_angle_start[] = D_interval_angle(M_angle_polar($segment_start_angle-M_PI/2),0);
                }
            }
                
            if (is_contained_Point2D_Arc2D($segment_data['end'],$arc_data))
            {    
                if (M_is_equal_approximately($segment_data['end'],$arc_data['start'])) // segment의 coords-end와 arc의 coords-start가 일치
                {
                    $intervals_angle_end[] = D_interval_angle(M_angle_polar($segment_end_angle+M_PI/2),0);
                }
                else if (M_is_equal_approximately($segment_data['end'],$arcs_end[$ard_id])) // segment의 coords-end와 arc의 coords-end가 일치
                {
                    $intervals_angle_end[] = D_interval_angle(M_angle_polar($segment_end_angle-M_PI/2),0);
                }
                else if (is_contained_strictly_Point2D_Arc2D($segment_data['end'],$arc_data)) // segment의 coords-end가 arc에 strict하게 포함됨
                {
                    $intervals_angle_end[] = D_interval_angle(M_angle_polar($segment_end_angle+M_PI/2),0);
                    $intervals_angle_end[] = D_interval_angle(M_angle_polar($segment_end_angle-M_PI/2),0);
                }
            }
        } 
                
        // object == Angle2D 중에서 Label2D가 있는 것
                    
        
        foreach ($angles_label as $angle)
        {
            $angle_id = object_id($angle);
            $Angle2D_data = $angles_data[$angle_id];          
            if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['end'])) 
            {
                if (M_is_equal_approximately_angle($segment_start_angle,$angle_start_angle))
                {
                    $intervals_angle_start[] = D_interval_angle($angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]);
                }
                else if (M_is_equal_approximately_angle($segment_start_angle,$angle_end_angle))  
                {
                    $intervals_angle_start[] = D_interval_angle(M_angle_polar($angles_angle_start[$angle_id]-$angles_angle_angle[$angle_id]),$angles_angle_angle[$angle_id]);
                }
            }
            else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['center'])) 
            {
                if (M_is_equal_approximately_angle($segment_end_angle,$angle_start_angle))
                {
                    $intervals_angle_start = D_interval_angle($angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]);
                }
                else if (M_is_equal_approximately_angle($segment_start_angle,$angle_end_angle))
                {
                    $intervals_angle_start = D_interval_angle(M_angle_polar($angles_angle_start[$angle_id]-$angles_angle_angle[$angle_id]),$angles_angle_angle[$angle_id]);
                }
            }
        }
        
        
        // object == Path2D
        
        foreach ($paths as $path)
        {
            $path_data = $paths_data[object_id($path)];
            $path_data_size = sizeof($path_data);
            for ($i = 0; $i < $path_data_size-1; $i++)
            {
                if (M_is_equal_approximately($path_data[$i],$segment_data['start'])) // segment의 coords-start와 path의 i번째 vertex가 일치
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i+1]),0);
                    break;
                }
                if (M_is_equal_approximately($path_data[$i],$segment_data['end'])) // segment의 coords-end와 path의 i번째 vertex가 일치
                {
                    $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$path_data[$i+1]),0);
                    break;
                }
				$segment = D_Segment2D([$path_data[$i],$path_data[$i+1]]);
                if (is_contained_Point2D_Segment2D($segment_data['start'],$segment)) // segment의 coords-start가 path의 i번째 edge에 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i]),0);
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i+1]),0);
                    break;
                }
                if (is_contained_Point2D_Segment2D($segment_data['end'],$segment)) // segment의 coords-end가 path의 i번째 edge에 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data[1],$path_data[$i]),0);
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data[1],$path_data[$i+1]),0);
                    break;
                }
            }
            if (M_is_equal_approximately($path_data[$path_data_key-1],$segment_data['start'])) // segment의 coords-start와 path의 마지막 vertex가 일치
            {
                $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$path_data_key_end]),0);
            }
            else (M_is_equal_approximately($path_data[$path_data_key-1],$segment_data['end'])) // segment의 coords-end와 path의 마지막 vertex가 일치
            {
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$path_data[$path_data_key_end]),0);
            } 
        }
        
        
        // object == Face2D
        foreach ($faces as $face)
        {
            $Face2D_data = $faces_data[object_id($face)];
            $Face2D_data_size = sizeof($Face2D_data);
            array_push($Face2D_data,$Face2D_data[0]);
            for ($i = 0; $i < $Face2D_data_size; $i++)
            {
                if (M_is_equal_approximately($Face2D_data[$i],$segment_data['start'])) // segment의 coords-start와 face의 한 vertex가 일치
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i+1]),0);
                    break;
                }
                if (M_is_equal_approximately($Face2D_data[$i],$segment_data['end'])) // segment의 coords-end와 face의 한 vertex가 일치
                {
                    $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$i+1]),0);
                    break;
                }
				$segment = D_Segment2D($Face2D_data[$i],$Face2D_data[$i+1]);
                if (is_contained_Point2D_Segment2D($segment_data['start'],$segment)) // segment의 coords-start가 face의 한 edge에 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i]),0);
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i+1]),0);
                    break;
                }
                if (is_contained_Point2D_Segment2D($segment_data['end'],$segment)) // segment의 coords-end가 face의 한 edge에 포함됨
                {
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i]),0);
                    $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i+1]),0);
                    break;
                }
            }
        }
        
       
        $intervals_angle_start = Intervals_angle_union($intervals_angle_start);
        $intervals_angle_end = Intervals_angle_union($intervals_angle_end);
            
        $intervals_angle_start_size = sizeof($intervals_angle_start);
        $intervals_angle_end_size = sizeof($intervals_angle_end);
           
        if (!$intervals_angle_start_size && !$intervals_angle_end_size) // $start_angles와 $end_angles가 없는 경우
        {   
            $segment_angle = $angles_segment_start[$segment_id];
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
                
            foreach ($intervals_angle_start as $interval_angle_start)
            {
                if (M_angle_polar($interval_angle_start['start']-$segment_start_angle) <= M_PI-$error_angle)
                {
                    $start_angle_left[] = M_angle_polar($interval_angle_start['start']-$segment_start_angle);
                }
                if (M_angle_polar($interval_angle_start['angle']-$segment_start_angle) <= M_PI-$error_angle)
                {
                    $start_angle_left[] = M_angle_polar($interval_angle_start['angle']-$segment_start_angle);
                }
                if (M_angle_polar($segment_start_angle-$interval_angle_start['start']) <= M_PI-$error_angle)
                {    
                    $start_angle_right[] = M_angle_polar($segment_start_angle-$interval_angle_start['start']);
                }
                if (M_angle_polar($segment_start_angle-$interval_angle_start['angle']) <= M_PI-$error_angle)
                {    
                    $start_angle_right[] = M_angle_polar($segment_start_angle-$interval_angle_start['angle']);
                }    
            }
            
            $start_angle_left = array_unique($start_angle_left);
            $start_angle_right = array_unique($start_angle_right);
                         
            $end_angle_left = [0]; //segment의 coord-end를 기준으로 left에 있는 angle의 array 
            $end_angle_right = [0]; //segment의 coord-end를 기준으로 right에 있는 angle의 array 
        
            foreach ($intervals_angle_end as $interval_angle_end)
            {
                if (M_angle_polar($interval_angle_end['start']-$segment_start_angle) <= M_PI-$error_angle)
                {
                    $end_angle_left[] = M_angle_polar($interval_angle_end['start']-$segment_start_angle);
                }
                if (M_angle_polar($interval_angle_end['angle']-$segment_start_angle) <= M_PI-$error_angle)
                {
                    $end_angle_left[] = M_angle_polar($interval_angle_end['angle']-$segment_start_angle);
                }
                if (M_angle_polar($segment_start_angle-$interval_angle_end['start']) <= M_PI-$error_angle)
                {    
                    $end_angle_right[] = M_angle_polar($segment_start_angle-$interval_angle_end['start']);
                }
                if (M_angle_polar($segment_start_angle-$interval_angle_end['angle']) <= M_PI-$error_angle)
                {    
                    $end_angle_right[] = M_angle_polar($segment_start_angle-$interval_angle_end['angle']);
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
               
            if ($left_angle_max < $right_angle_max-$error_angle) 
            {
                $segment_measure_height_sign = 1;
                
            }
            else if ($left_angle_max > $right_angle_max+$error_angle)
            {
                $segment_measure_height_sign = -1;
               
            }
            else if (M_is_equal_approximately_angle($left_angle_max,$right_angle_max))
            {
                if ((M_is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
                     M_is_equal_approximately_angle($start_right_angle_max,$left_angle_max)) &&
                    (!M_is_equal_approximately_angle($end_left_angle_max,$left_angle_max) ||
                     !M_is_equal_approximately_angle($end_right_angle_max,$right_angle_max)))
                {
                    if ($end_left_angle_max <= $end_right_angle_max-$error_angle)
                    {
                        $segment_measure_height_sign = 1;
                        
                    }
                    else if ($end_left_angle_max >= $end_right_angle_max+$error_angle)
                    {
                        $segment_measure_height_sign = -1;
                        
                    }
                }
                else if ((!M_is_equal_approximately_angle($start_left_angle_max,$right_angle_max) ||
                          !M_is_equal_approximately_angle($start_right_angle_max,$left_angle_max)) &&
                         (M_is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
                          M_is_equal_approximately_angle($end_right_angle_max,$right_angle_max)))
                {
                    if ($start_left_angle_max <= $start_right_angle_max-$error_angle)
                    {
                        $segment_measure_height_sign = -1;
                        
                    }
                    else if ($start_left_angle_max >= $start_right_angle_max+$error_angle)
                    {
                        $segment_measure_height_sign = 1;
                       
                    }    
                }
                else if (M_is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
                         !M_is_equal_approximately_angle($start_right_angle_max,$left_angle_max) &&
                         M_is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
                         !M_is_equal_approximately_angle($end_right_angle_max,$right_angle_max))
                {
                    if ($start_right_angle_max <= $end_right_angle_max-$error_angle)
                    {
                        $segment_measure_height_sign = 1;
                        
                    }
                    else if ($start_right_angle_max >= $end_right_angle_max+$error_angle)
                    {
                        $segment_measure_height_sign = -1;
                        
                    }    
                }
                else if (!M_is_equal_approximately_angle($start_left_angle_max,$right_angle_max) &&
                         M_is_equal_approximately_angle($start_right_angle_max,$left_angle_max) &&
                         !M_is_equal_approximately_angle($end_left_angle_max,$left_angle_max) &&
                         M_is_equal_approximately_angle($end_right_angle_max,$right_angle_max))
                {
                    if ($start_left_angle_max <= $end_left_angle_max-$error_angle)
                    {
                        $segment_measure_height_sign = -1;
                        
                    }
                    else if ($start_left_angle_max >= $end_left_angle_max+$error_angle)
                    {
                        $segment_measure_height_sign = 1;
                        
                    }    
                }    
            }             
            
            
            /*
              @ 내용
                Angle2D의 center가 segment의 start나 end와 일치하고 Angl2D의 한 edge가 segment와 평행한 경우 Angle2D가 전체적으로 향하는 방향 결정
            */
            
            if ($angles &&
                min($start_angle_left_max,$start_angle_right_max,$end_angle_left_max,$end_angle_right_max) >= $error_angle &&
                M_is_equal_approximately_angle($start_angle_left_max,$start_angle_right_max) &&
                M_is_equal_approximately_angle($start_angle_left_max+$start_angle_right_max,M_PI) &&
                M_is_equal_approximately_angle($end_angle_left_max,$end_angle_right_max) &&
                M_is_equal_approximately_angle($end_angle_left_max+$end_angle_right_max,M_PI))
            {
                $start_angle_left_visible = false;
                $start_angle_right_visible = false;
                $end_angle_left_visible = false;
                $end_angle_right_visible = false;
                  
                foreach ($angles as $angle)
                {
                    $angle_id = object_id($angle);
                    $Angle2D_data = $angles_data[$angle_id];
                    $angle_start_angle = $angles_angle_start[$angle_id];
                    $angle_end_angle = $angles_angle_end[$angle_id];
                    if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['center'])) 
                    {
                        if (M_is_equal_approximately_angle($segment_end_angle,$angle_end_angle) &&
                            M_is_equal_approximately_angle($segment_start_angle+$start_angle_left_max,$angle_start_angle))
                            //angle이 segment의 start를 기준으로 left 쪽으로 기울어 졌을 때
                        {
                            $start_angle_left_visible = true;
                        }    
                        else if (M_is_equal_approximately_angle($segment_end_angle,$angle_start_angle) &&
                                 M_is_equal_approximately_angle($segment_start_angle-$start_angle_right_max,$angle_end_angle))
                                 //angle이 segment의 start를 기준으로 right 쪽으로 기울어 졌을 때   
                        {
                            $start_angle_right_visible = true;
                        }    
                    }    
                    else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['center']))
                    {
                        if (M_is_equal_approximately_angle($segment_start_angle,$angle_end_angle) &&
                            M_is_equal_approximately_angle($segment_end_angle+$end_angle_left_max,$angle_start_angle))
                            //angle이 segment의 end를 기준으로 left 쪽으로 기울어 졌을 때
                        {
                            $end_angle_left_visible = true;
                        }    
                        else if (M_is_equal_approximately_angle($segment_start_angle,$angle_start_angle) &&
                                 M_is_equal_approximately_angle($segment_end_angle-$end_angle_right_max,$angle_end_angle))
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
        $segment_arm_direction = Segment2D_arm_direction($segment,$objects);
        if ($segment_arm_direction == 'left') // left 방향에만 arm이 있는 경우
        {
            $segment_measure_height_sign = -1;
           
        }    
        else if ($segment_arm_direction == 'right') // right 방향에만 arm이 있는 경우
        {
            $segment_measure_height_sign = 1;
            
        }    
        
        
        // segment가 face의 segment에 속하는 경우
        if ($faces)    
        {
            // segment의 start나 end에 object에 걸치거나 segment에 arm이 있는 경우는 고려 대상 제외 (이미 고려되었음)
            $is_point_contained = false;
            
            foreach ($points as $point) 
            {
                if (is_contained_strictly_Point2D_Segment2D($points_data[object_id($point)],$segment_data))
                {
                    $is_point_contained = true;
                    break;
                }
            }
            
            // segment가 face의 segment에 strict하게 포함되는 경우    
            if (!$is_point_contained)
            {
                foreach ($faces as $face)
                {
                    $face_id = object_id($face);
                    $Face2D_data = $faces_data[$face_id];
                    $Face2D_data_size = sizeof($Face2D_data);
                    $face_center = $faces_center[$face_id];
                    array_push($Face2D_data,$Face2D_data[0]);
                                        
                    for ($i = 0; $i < $Face2D_data_size; $i++)
                    {
                        if (is_contained_strictly_Segment2D_Segment2D($segment_data,D_Segment2D($Face2D_data[$i],$Face2D_data[$i+1])))
                        {
                            $angle_difference = M_angle_polar(M_vector_angle($face_interior_point,$segment_data['end'])-M_vector_angle($face_interior_point,$segment_data['start']));
                            if ($angle_difference <= M_PI-$error_angle)
                            {
                                $segment_measure_height_sign = -1;
                                
                            }
                            else if (M_PI+$error_angle <= $angle_difference)
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
        foreach ($angles as $angle)
        {
            $angle_id = object_id($angle);
            $Angle2D_data = $angles_data[$angle_id];
            foreach ($arcs as $arc)
            {
                $arc_id = object_id($arc);
                $Angle2D_data = $angles_data[$arc_id];
                $arc_angle = Arc2D_angle($arc);
                if (M_is_equal_approximately($Angle2D_data['center'],$arc_data['center']))
                {
                    if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['center']) &&
                        M_is_equal_approximately($segment_data['end'],$Angle2D_data['start']))
                    
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
                    else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['center']) &&
                             M_is_equal_approximately($segment_data['start'],$Angle2D_data['start']))
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
            
        if ($segments_line)
        {
            $segments_line_size = sizeof($segments_line);
            $parallel_line_pairs_id = [];
            for ($i = 0; $i < $segments_line_size-1; $i++)
            {
                $segments_line_i_id = object_id($segments_line[$i])];
                $segments_line_i_data = $segments_data[$segments_line_i_id];
                for ($j = $i+1; $j < $segments_line_size; $j++)
                {
                    $segments_line_j_id = object_id($segments_line[$j]);
                    $segments_line_j_data = $segments_data[$segments_line_j_id];
                
                    if (is_parallel_Segment2D_Segment2D($segments_line_i_data,$segments_line_j_data))
                    {
                        $parallel_line_pairs[] = [$segments_line_i_id,$segments_line_j_id];
                    }    
                }
            } 
            
            if ($parallel_line_pairs)
            {
                $segment_angle = $angles_segment_start[$segment_id];
                
                foreach ($parallel_line_pairs_id as $parallel_line_pair_id)
                {
                    $segment_0_data = $segments_data[$parallel_line_pair_id[0]];
                    $segment_1_data = $segments_data[$parallel_line_pair_id[1]];
                    if((is_contained_Point2D_Segment2D($segment_data['start'],$segment_0_data) &&
                        is_contained_Point2D_Segment2D($segment_data['end'],$segment_1_data) ||
                       (is_contained_Point2D_Segment2D($segment_data['start'],$segment_1_data) &&
                        is_contained_Point2D_Segment2D($segment_data['end'],$segment_0_data)))
                    {
                        $is_height_sign_changed = true;
                        if (0 <= $segment_angle && $segment_angle < M_PI)
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
            object_measure_height_change($segment,$segment_measure_height_sign*$segment_measure_height_abs);
            //replace_data($segment,&$segments,&$segments_dash,&$segments_label,&$segments_measure,&$segments_measure_label,&$segments_parallel,&$segments_line,&$objects);
        }
        
        //segment위에 한 끝점이 있는 다른 segment measure가 visible이고 그런 모든 segment의 방향이 같은 경우
        if ($segments_measure)
        {
            $segment_angle = $angles_segment_start[$segment_id];
            $is_left_segmented = false;
            $is_right_segmented = false;
                        
            foreach ($segments_measure as $segment_1)
            {
                $segment_1_id = object_id($segment_1);
                $segment_1_data = $segments_data[$segment_1_id];
                if ($segment_id != $segment_1_id &&
                    !is_contained_Segment2D_Segment2D($segment_data,$segment_1_data) &&
                    !is_contained_Segment2D_Segment2D($segment_1_data,$segment_data) &&
                    !is_overlap_Segment2D_Segment2D($segment_data,$segment_1_id))
                {
                    if (is_contained_strictly_Point2D_Segment2D($segment_1_data['start'],$segment_data))
                    {
                        $angle_difference = M_angle_polar($angles_segment_start[$segment_1_id]-$segment_angle);
                        
                        if (0 < $angle_difference && $angle_difference < M_PI)
                        {
                            $is_left_segmented = true;
                        }
                        else if (M_PI < $angle_difference && $angle_difference < 2*M_PI)
                        {
                            $is_right_segmented = true;
                        }
                    }
                    else if (is_contained_strictly_Point2D_Segment2D($segment_1_data['end'],$segment_data))
                    {
                        $angle_difference = M_angle_polar($angles_segment_end[$segment_1_id]-$segment_angle);
                            
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
            object_measure_height_change($segment,$segment_measure_height_sign*abs(object_measure_height($segment)));
            //replace_data($segment,&$segments,&$segments_dash,&$segments_label,&$segments_measure,&$segments_measure_label,&$segments_parallel,&$segments_line,&$objects);     
        }
    }
    unset($segment);
    
    
    //segment의 measure가 나타나는 경우 measure에 label이 겹칠 때  height 조정
   
    //$segment_measure_height_initial = 0.001;
    
    
    foreach ($segments_measure as &$segment)
    {
        $segment_measure_height = segment_measure_height($segment);
        $segment_measure_height_sign = M_sign($segment_measure_height);
        if (!abs($segment_measure_height) < $error)
        {
            $segment_measure_height_abs = abs($segment_meausre_height));
            $segment_id = object_id($segment);
            $segment_data = $segments_data[$segment_id]
            $segment_length = $segments_length[$segment_id];
            $segment_angle = $angles_segment_start[$segment_id];
            $segment_center = M_multiplication_scalar(1/2,M_addition($segment_data['start'],$segment_data['end']));
            foreach ($segments_measure_label as $segment_1)
            {
                $segment_1_id = object_id($segment_1);
                $segment_1_data = $segments_data[$segment_1_id];
                if ($segment_id != $segment_1_id) &&
                    is_contained_Segment2D_Segment2D($segment_1_data,$segment_data))
                {  
                    $segment_1_angle = $angles_segment_start[$segment_1_id];
                    $segment_1_measure_height = segment_measure_height($segment_1);
                    $segment_1_measure_height_sign = M_sign($segment_1_measure_height);
                    if ((M_is_equal_approximately_angle($segment_1_angle-$segment_angle,M_PI) &&
                         M_sign($segment_measure_height) == M_sign($segment_1_measure_height)) ||
                        (M_is_equal_approximately_angle($segment_1_angle-$segment_angle,M_PI) &&
                         M_sign($segment_measure_height) != M_sign($segment_1_measure_height)))
                    { 
                        $segment_measure_radius = (pow($segment_measure_height,2)+pow($segment_length/2,2))/(2*$segment_measure_height);
                        $distance_centers = $segment_measure_radius-$segment_measure_height;
                        $segment_measure_center = M_addition($segment_center,M_polar_to_cartesian($distance_centers,$segment_angle-$segment_measure_height_sign*M_PI/2));
                            
                        $segment_1_length = segment_length($segment_1);
                        $segment_1_center = M_addition($segment_1_data['start'],$segment_1_data['end']);
                        $segment_1_center = M_multiplication_scalar(1/2,$segment_1_center);
                        
                        $segment_1_label_id = object_id($labels_key_data[$segment_1_id]);
                        $segment_1_label_size = $labels_size[$segment_1_label_id];
                            
                        $segment_1_label_radius = $labels_raidus[$segment_1_label_id]/2;
                        $measure_1_angle = $segment_1_angle+$segment_1_measure_height_sign*M_PI/2;
                        $segment_1_measure_label_boundary = M_addition($segment_1_center,M_polar_to_cartesian($segment_measure_height_abs+1+$segment_1_label_radius,$measure_1_angle));
                        
                        $segment_measure_height = max($segment_measure_height,M_distance($segment_measure_center,$segment_1_measure_label_boundary)-$distance_centers);   
                        
                    }
                }
            }
        } 
        
        
        
        $segment_source_angle = M_vector_angle($segment_measure_center,$segment_data['start']);
        $segment_target_angle = M_vector_angle($segment_measure_center,$segment_data['end']);
        if ($segment_measure_height_sign < 0)
        {
            $segment_angle_initial = $segment_source_angle;
            $segment_angle_terminal = $segment_target_angle;
        }
        else 
        {
            $segment_angle_initial = $segment_target_angle;
            $segment_angle_terminal = $segment_source_angle;
        }
        foreach ($labels as $label)
        {
            $segment_measure_radius = (pow($segment_measure_height,2)+pow($segment_length/2,2))/(2*$segment_measure_height);
            $distance_centers = $segment_measure_radius-$segment_measure_height;
            $segment_measure_center = M_addition($segment_center,M_polar_to_cartesian($distance_centers,$segment_angle-$segment_measure_height_sign*M_PI/2));
            
            $label_angle = M_vector_angle($segment_measure_center,label_coord($label));
            if (M_is_between_angles($label_angle,$segment_angle_initial,$segment_angle_terminal))
            {
                $label_length = M_distance($segment_measure_center,label_coord($label));
                if (abs($segment_measure_radius-$label_length) < 1)
                {
                    $segment_measure_height = max($segment_measure_height,$label_length-$distance_centers);
                   
                }
            }
        }
            
        object_measure_height_change($segment,$segment_measure_height_sign*$segment_measure_height);
    }
    
    
    
    
     /*
        segment measure의 height의 변화가 없을 때 segment와 segment measure의 color를 일치시킴
    */
    if ($segments_measure)
    {
        foreach ($segments_measure as &$segment)
        {
            if (segment_measure_height($segment) == $segment_measure_height_initial)
            {
                $segment['measure']['color'] = object_color($segment);
            }
        }   
    }  
    
    
    //segment measure가 포함관계를 가질 때 measure label height의 방향 결정
    foreach ($segments_measure as &$segment)
    {
        $segment_id = object_id($segment);
        $segment_angle = $angles_segment_start[$segment_id];
        $segment_data = $segments_data[$segment_id];
        $segment_measure_height = segment_measure_height($segment);
        $segment_measure_height_sign = M_sign($segment_measure_height); 
        foreach ($segments as $segment_1)  
        {
            $segment_1_id = object_id($segment_1);
            if ($segment_id != $segment_1_id)
            {
                $segment_data = $segments_data[$segment_1_id];
                $segment_1_angle = $angles_segment_start[$segment_1_id];
                $segment_1_measure_height_sign = segment_measure_height($segment_1);
            
                if (((M_is_equal_approximately_angle($segment_angle,$segment_1_angle) &&
                      $segment_measure_height_sign == $segment_1_measure_height_sign) ||
                     (M_is_equal_approximately_angle($segment_angle-$segment_1_angle,M_PI)
                      && $segment_measure_height_sign != $segment_1_measure_height_sign)) &&
                    is_contained_Segment2D_Segment2D($segment_data,$segment_1_data))
                {
                    object_measure_height_change($segment,-$segment_measure_height);
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
    $label_margin = [0.2,0.2]; // Label2D의 Rectangle의 margin
    $rectangle_margin = [0.25,0.25]; // Rectangle의 margin
    
    
    
    
    //noncurve label
    foreach ($labels_noncurve as &$label)
    {
        $label_id = object_id($label);
        $label_size = $labels_size[$label_id];
		$label_vertices = $label_vertices[$label_id];
        $labeled_data_id = object_id($labeled_data);
        $labeled_data = $objects_key_label[$label_id];
        $labeled_data_type = object_type($labeled_data);
        
        switch ($labeled_data_type)
        {
            case $type_arc:
            {
                $arc_data = $arcs_data[$labeled_data_id];
                $label_angle = M_angle_polar($angles_arc_start[$labeled_data_id]+Arc2D_angle($arc)/2);
                $label_coord = M_addition($arc_data['center'],M_polar_to_cartesian($arcs_radius[$labeled_data_id]+1,$label_angle));
                break;
            }
                       
            case $type_angle: //Label이 지정하는 object가 Angle인 경우  
            {
                $Angle2D_data = $angles_data[$labeled_data_id];
                $label_coord = polygon_center_between_halflines($Angle2D_data['center'],$labels_vertices[$label_id],[$angles_angle_start[$labeled_data_id],$angles_angle_angle[$labeled_data_id])],$Angle2D_data['height']);
                break;
            }
                       
            /*
             * 내용: Label이 지정하는 obejct가 Segment measure인 경우
             * 원리: segment measure의 중심에 위치
             */
            case $type_measure_segment:
            {
                $segment = $objects_key_measure[$labeled_data_id];
                $segment_id = object_id($segment);
                $segment_data = $segments_data[$segment_id];
                $segment_angle = $angles_segment_start[$segment_id];
                if (segment_measure_height($segment) >= 0)
                {
                    $angle = M_angle_polar($segment_angle+M_PI/2);        
                }
                else
                {
                    $angle = M_angle_polar($segment_angle-M_PI/2);
                }
                
                $label_coord = M_addition(M_multiplication_scalar(1/2,M_addtion($segment_data['start'],$segment_data['end'])),
                                          M_polar_to_cartesian(abs(segment_measure_height($segment)),$angle));
                break;
            }
            case $type_measure_arc//Label이 지정하는 object가 Arc measure인 경우
            {
                $arc = $objects_key_measure[$labeled_data_id];
                $label_radius = Arc2D_measure_height($arc);
                $arc_data = $arcs_data[object_id($arc)];
                $label_angle = $angles_arc_start[$labeled_data_id]+$arc_data['angle']/2;
                $label_coord = M_addition($arc_data['center'],M_polar_to_cartesian($label_radius,$label_angle));
                break;
            }
              
            case $type_face: //Label이 지정하는 object가 Face인 경우
            {
                $label_coord = $faces_data[$labeled_data_id];                
                        
                $face_angles = [];
                $incidence_number = 0;
                foreach ($points as $point)
                {
                    if (M_is_equal_approximately($label_coord,$point_data))
                    {
                        ++$incidence_number;
                       
                    }
                    else if (M_is_within($label_coord,$point_data,1))
                    {
                        $face_angles[] = M_vector_angle($label_coord,$point_data);
                    }    
                }
                
                foreach ($labels as $label_1)
                {
                    $label_1_coord = label_coord($label_1);
                    if (object_id($label) != object_id($label_1))
                    {
                        if (M_is_equal_approximately($label_coord,$label_1_coord))
                        {
                            ++$incidence_number;
                            
                        }
                        else if (M_is_within($label_coord,$label_1_coord,1))
                        {
                            $face_angles[] = M_vector_angle($label_coord,$label_1_coord);
                        }    
                    }                       
                }
                      
                if ($incidence_number)
                {
                    if ($face_angles)
                    {
                        $label_coord = M_addition($label_coord,M_polar_to_cartesian(1,angle_mid_max($face_angles)));
                       
                    }
                    else 
                    {
                        $label_coord = M_addition($label_coord,D_Point2D(0,1)));
                        
                    }    
                
                    Label2D_coord_change($label,$label_coord);
                    break 2;
                }
                break;
            } 
            /*
             * 내용: Label이 지정하는 object가 Point인 경우
             * 원리: point를 지나는 object들이 형성하는 각을 수집한 후 가장 적합한 부분 선택
             */
            case $type_point:
            {
                $point_data = $points_data[$labeled_data_id];
                $label_radius = 0.5;
                $label_angle = M_PI/2;
                                
                $intervals_angle_forbidden = []; //label이 위치할 수 없는 angle
                $segments_measure_direction_number = Segment2Ds_measure_direction_number($labeled_data,$segments);
                            
                foreach ($segments as $segment)
                {
                    $segment_id = object_id($segment);
                    $segment_data = $segments_data[$segment_id];
                    if (is_contained_Point2D_Segment2D($point_data,$segment_data))
                    {
                        if (M_is_equal_approximately($point_data,$segment_data['start']))
                        {    
                            $segment_angle = $angles_segment_start[$segment_id];
                            $intervals_angle_forbidden[] = D_interval_angle($segment_angle,0);
                                    
                            if (object_measure_type($segment) == $type_measure_segment)
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($segment_angle+Segment2D_measure_angles($segment_data,segment_measure_height($segment))['start']),0);
                            }    
                        }
                        else if (M_is_equal_approximately($point_data,$segment_data['end']))
                        {
                            $segment_angle = $angles_segment_end[$segment_id];
                            $intervals_angle_forbidden[] = D_interval_angle($segment_angle,0);
                                    
                            if (object_measure_type($segment) == $type_measure_segment)
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($segment_angle+Segment2D_measure_angles($segment_data,segment_measure_height($segment))['end']),0);
                            }    
                        }
                        else if (is_contained_strictly_Point2D_Segment2D($point_data,$segment_data))
                        {    
                            $start_angle = $angles_segment_end[$segment_id];
                            $end_angle = $angles_segment_start[$segment_id];
                                        
                            $intervals_angle_forbidden[] = D_interval_angle($start_angle,0);
                            $intervals_angle_forbidden[] = D_interval_angle($end_angle,0);
                         
                                    
                            if (object_measure_type($segment) == $type_measure_segment)
                            {
                                if ($segments_measure_direction_number == 1)//point를 포함하는 meausre를 가진 (다른 방향의) segment의 갯수가 1개
                                {
                                    if (segment_measure_height($segment) > 0)
                                    {
                                        $intervals_angle_forbidden[] = D_interval_angle($end_angle,M_PI);
                                    }
                                    else if (segment_measure_height($segment) < 0)
                                    {
                                        $intervals_angle_forbidden[] = D_interval_angle($start_angle,M_PI);    
                                    }    
                                }
                                else if ($segments_measure_direction_number >= 2)//point를 포함하는 meausre를 가진 (다른 방향의) segment의 갯수가 2개 이상
                                {
                                    /*
                                     * 방법
                                     $label_distance+$label_rectangle_radius+$label_margin과 $point['coord']에서 segment measure 까지의 거리의 최대 최소값을 비교     
                                     */
                                    
                                        
                                    $label_rectangle_radius = $labels_diagonal[$label_id]/2;
                                    $label_margin = 0.25;
                                    $distance_measure = point_segment_measure_distance($point_data,$segment_data,abs(object_measure_height($segment)));
                                    $length = $label_distance+$label_rectangle_radius+$label_margin;
                                    if ($length <= $distance_measure)
                                    {
                                        $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($end_angle-M_PI/4),M_PI/2);
                                    }
                                    else 
                                    {
                                        $segment_measure_height = segment_measure_height($segment);
                                        $segment_measure_height_abs = abs($segment_measure_height);
                                        $segment_measure_height_sign = M_sign($segment_measure_height);
                                    
                                        $segment_length = $segments_length[$segment_id];
                                        $segment_start_length = M_distance($point_data,$segment_data['start']);
                                        $segment_end_length = $segment_length-$segment_start_length;        
                                        $length_min = min($segment_start_length,$segment_end_length);
                                        $coefficients = [];
                                        $coefficients[0] = $segment_length+4*$segment_measure_height_abs;
                                        $coefficients[1] = -4*$segment_measure_height_abs;
                                        $coefficients[2] = $length_min;
                                        $solutions = solutions_quadratic($coefficients);
                                        foreach ($solutions as $solution)
                                        {
                                            if (0 <= $solution && $solution <= 1)
                                            {
                                                $t = $solution;
                                                break;
                                            }
                                        }
                                        
                                        $length_diagonal = rectangle_diagonal(4*$t*(1-$t)*$segment_measure_height_abs-$length_min,$segment_length*pow($t,2));
                                        if ($length <= $length_diagonal)
                                        {
                                            $angles_number = ceil(M_PI/2/deg2rad(5));
                                            $interval_angle = M_PI/2/$angles_number;
                                            if ($segment_measure_height_sign > 0)
                                            {
                                                if ($segment_start_length <= $segment_end_length)
                                                {
                                                    $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($start_angle-M_PI/2),M_PI/2);
                                                }
                                                else
                                                {
                                                    $intervals_angle_forbidden[] = D_interval_angle($end_angle,M_PI/2);
                                                }
                                            }
                                            else if ($segment_measure_height_sign < 0)
                                            {
                                                if ($segment_start_length <= $segment_end_length)
                                                {
                                                    $intervals_angle_forbidden[] = D_interval_angle($start_angle,M_PI/2);
                                                }
                                                else
                                                {
                                                    $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($end_angle-M_PI/2),M_PI/2);
                                                }
                                            }
                                        }
                                        else
                                        {
                                            $angles_number = ceil(M_PI/deg2rad(5));
                                            $interval_angle = M_PI/$angles_number;
                                            if ($segment_measure_height_sign > 0)
                                            {
                                                $intervals_angle_forbidden[] = D_interval_angle($end_angle,M_PI);
                                            }
                                            else if ($segment_measure_height_sign < 0)
                                            {
                                                $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($end_angle-M_PI),M_PI);
                                            }
                                        }
                                    }    
                                }
                            }
                        }    
                    }
                }    
                                       
                       
                foreach ($faces as $face)
                {
                    $face_id = object_id($face);
                    $Face2D_data = Face2D_data($face)
                    foreach ($labels as $label_1)
                    {
                        $label_1_coord = label_coord($label_1);
                        if (labeled_data_id($label_1) == $face_id &&
                            M_is_equal_approximately_one_of($point_data,$Face2D_data) &&
                            M_distance($point_data,$label_1_coord) <= 3*$Cartesian2D_size)
                        {
                            $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$label_1_coord),0);
                            break;
                        }
                    } 
                }
            
                
                $angle_5 = deg2rad(5);
                foreach ($arcs as $arc)
                {
                    $arc_id = object_id($arc);
                    $arc_data = $arcs_data[$arc_id];
                    $arc_measyre_type = object_measure_type($arc);
                    $point_angle = M_vector_angle($arc_data['center'],$point_data);
                    if (M_is_equal_approximately($point_data,$arc_data['start'])) 
                    {
                        if ($arc_measyre_type == $type_measure_segment)
                        {
                            $intervals_angle_forbidden[] = D_interval_angle($point_angle,M_PI/2);
                        }
                        else
                        {
                            $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($point_angle+M_PI/2),0);
                        }
                    }
                    else if (M_is_equal_approximately($point_data,$arcs_end[$arc_id]))
                    {
                        $angle = M_angle_polar($point_angle-M_PI/2);
                        if ($arc_measyre_type == $type_measure_segment)
                        {
                            $intervals_angle_forbidden[] = D_interval_angle($angle,M_PI/2);
                        }
                        else
                        {
                            $intervals_angle_forbidden[] = D_interval_angle($angle,0);
                         
                        }
                    }
                
                    if (is_contained_Point2D_Arc2D($point_data,$arc_data))
                    {
                        
                        if ($arc_measyre_type == $type_measure_segment)
                        {
                               
                           $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($point_angle-M_PI/2),M_PI);
                           
                        }
                        else
                        {
                            
                            $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($point_angle-M_PI/2-$angle_5),$angle_5);
                            $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($point_angle+M_PI/2),$angle_5);
                        }
                    }
                }        
                
                       
                $intervals_angle_forbidden_angle = [];
                $intervals_angle_forbidden_angle_center = [];
                foreach ($angles as $angle)
                {
                    $angle_id = object_id($angle);
                    $Angle2D_data = $angles_data[$angle_id];
                    $angle_start_angle = $angles_angle_start[$angle_id];                        
                    //label과 angle이 겹치는 경우            
                    
                                                 
                    if (M_is_equal_approximately($point_data,$Angle2D_data['center'])) //point와 angle center가 일치
                    {
                        $intervals_angle_forbidden_angle[] = D_interval_angle($angle_start_angle,M_angle_polar($angle_start_angle+$angles_angle_angle[$angle_id]));
                    }
                    else if (is_contained_strictly_Point2D_Segment2D($point_data,D_Segment2D($Angle2D_data['center'],$Angle2D_data['start'])))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle($angle_start_angle,M_PI);
                    }
                    else if (is_contained_strictly_Point2D_Segment2D($point_data,D_Segment2D($Angle2D_data['cennter'],$Angle2D_data['end'])))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(angle_polar($angle_start_angle-M_PI),M_PI);
                    }
                }                              
                
                        
                if (!is_surrounded_by_Angle2Ds($point,$intervals_angle_forbidden_angle))                                                       
                {
                    $intervals_angle_forbidden = array_merge($intervals_angle_forbidden,$intervals_angle_forbidden_angle);
                    $intervals_angle_max = Intervals_angle_max(Intervals_angle_complement($intervals_angle_forbidden));
                   
                }
                else
                {
                    $label_distance = 0.25;
                    $intervals_angle_max = Intervals_angle_max(Intervals_angle_complement($intervals_angle_forbidden));
                    
                   
                }
                $label_coord = polygon_center_between_halflines($point_data,$labels_vertices[$label_id],$intervals_angle_max,$label_distance);
                
                break;
            }
            /*
            * Label이 지정하는 object가 Segment인 경우
            * 원리
              segment의 한 끝점에서 출발해서 label rectangle과 segment의 접점을 거친후 label 중심에 도달 
            */   
            case $type_segment:
            {
                $segment_data = $segments_data[$labeled_data_id];
                $segment_angle = $angles_segment_start[$labeled_data_id];
                $label_radius = $labels_diagonal[$label_id];
                $rectangle_angle = M_atan2_polar($label_size[1],$label_size[0]);
                               
                if ((0 <= $segment_angle && $segment_angle <= M_PI/2) ||
                    (3*M_PI/2 < $segment_angle && $segment_angle < 2*M_PI))
                {
                    $start = $segment_data['start'];
                }    
                else
                {
                    $start = $segment_data['start'];       
                    $segment_angle = M_angle_polar($segment_angle+M_PI);
                }   
                        
                $translation_radius = 0.5;
                $translation_angle = M_angle_polar($segment_angle+M_PI);
                $start_translated = M_addition($start,M_polar_to_cartesian($translation_angle,$translation_radius));
                
                if (M_is_equal_approximately_angle($segment_angle,0))
                {
                    $label_angle = M_PI-$rectangle_angle;
                    if ($bound['y']['max']-$start_translated['y'] < $label_size['y'])
                    {
                        $label_angle = M_PI+$rectangle_angle;
                    }
                }
                else if (M_is_equal_approximately_angle($segment_angle,M_PI/2))
                {
                    $label_angle = 2*M_PI-$rectangle_angle;
                    if ($bound['x']['max']-$start_translated['x'] < $label_size['x'])
                    {
                        $label_angle = M_PI+$rectangle_angle;
                    }
                }
                else if ($error_angle < $segment_angle && $segment_angle < M_PI/2-$error_angle)
                {
                    $label_angle = 2*M_PI-$rectangle_angle;
                    $width_visible = $bound['x']['max']-$start_translated['x'];
                    if ($width_visible < $label_size['x'])
                    {
                        $x_addition = $label_size['x']-$width_visible;
                        $y_addition = $x_addition/tan($segment_angle);
                        if ($start_translated['y']-$y_addition-$label_size['y'] < $bound['y']['min'])
                        {
                            $label_angle = M_PI-$rectangle_angle;
                            $height_visible = $bound['y']['max']-$start_translated['x'];
                            if ($height_visible < $label_size['y'])
                            {
                                $x_addition = $label_size['y']-$height_visible;
                                $y_addition = $x_addition/tan($segment_angle);
                            }
                        }
                        $start_translated['x'] = $start_translated['x']-$x_addition;
                        $start_translated['y'] = $start_translated['y']-$y_addttion;
                    }
                }
                else 
                {
                    $label_angle = $rectangle_angle;
                    $width_visible = $bound['x']['max']-$start_translated['x'];
                    if ($width_visible < $label_size['x'])
                    {
                        $x_addition = $label_size['x']-$width_visible;
                        $y_addition = $x_addition/tan(2*M_PI-$segment_angle);
                        if ($start_translated['y']+$y_addition+$label_size['y'] > $bound['y']['min'])
                        {
                            $label_angle = M_PI-$rectangle_angle;
                            $height_visible = $bound['y']['max']-$start_translated['y'];
                            if ($height_visible < $label_size['y'])
                            {
                                $x_addition = $label_size['y']-$height_visible;
                                $y_addition = $x_addition/tan(2*M_PI-$segment_angle);
                            }
                        }
                        $start_translated['x'] = $start_translated['x']-$x_addition;
                        $start_translated['y'] = $start_translated['y']+$y_addttion;
                    }    
                }
                
                $label_coord = M_addition($start_translated,M_polar_to_cartesian($label_radius,$label_angle));
                
                break;
            }  
        }
        
        Label2D_coord_change($label,$label_coord);
        //replace_data($label,&$labels,&$labels_noncurve,&$objects);
                
        
    }
    
    
  // curve label
	
	if ($labels_curve)
    {
		$rectangles_forbidden = [];
		if (object_type($Cartesian2D_axis) == $type_axis)
		{   
			$center = D_Point2D(($bounds['x']['min']+$bounds['x']['max'])/2,0);
			$size = Rectangle_size($bounds['x']['max']-$bounds['x']['min'],0);
			$rectangles_forbidden[] = D_Rectangle($center,$size,0);
			
			$center = D_Point2D(0,($bounds['y']['min']+$bounds['y']['max'])/2,0);
			$size = Rectangle_size(0,$bounds['y']['max']-$bounds['y']['min']));
			$rectangles_forbidden[] = D_Rectangle($center,$size,0);        
		}
		
		$rectangles_forbidden = [];
		if (object_type($Cartesian2D_grid) == $type_grid)
		{   
			$center = D_Point2D(($bounds['x']['min']+$bounds['x']['max'])/2,-$font_sizes_unit['y']/2);
			$size = Rectangle_size($bounds['x']['max']-$bounds['x']['min'],$font_sizes_unit['y']);
			$rectangles_forbidden[] = D_Rectangle($center,$size,0);
			
			$center = D_Point2D(-$font_sizes_unit['x']/2,($bounds['y']['min']+$bounds['y']['max'])/2,0);
			$size = Rectangle_size($font_sizes_unit['x'],$bounds['y']['max']-$bounds['y']['min']));
			$rectangles_forbidden[] = D_Rectangle($center,$size,0);  
			
		}
		
		foreach ($labels_curve as $label)
		{
			$label_id = object_id($label);
			$curve = $objects_key_label[$label_id];
			$curve_label_rectangles = Curve2D_Label2D_Rectangles($curves_data[object_id($curve)],$labels_size[$label_id],$bounds,$Cartesian2D_rotation);
			
			$curve_label_rectangles_allowed = [];
			foreach ($curve_label_rectangles as $rectangle)
			{
				$is_overlap = false;
				foreach ($rectangles_forbidden as $rectangle_forbidden)
				{
					if (is_overlap_Rectangle_Rectangle($rectangle,$rectangle_forbidden))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($angles as $angle)
				{
					if (is_overlap_Rectangle_Angle2D($rectangle,Angle2D_data($angle)))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($arcs as $arc)
				{
					if (is_overlap_Rectangle_Arc2D($rectangle,Arc2D_data($angle)))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($faces as $face)
				{
					if (is_overlap_Rectangle_Face2D($rectangle,Face2D_data($face)))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($paths as $path)
				{
					if (is_overlap_Rectangle_Path2D($rectangle,Path2D_data($path)))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($points as $point)
				{
					if (is_contained_Point2D_Rectangle(Point2D_data($point),$rectangle))
					{
						$is_overlap = true;
						break;
					}
				}
				foreach ($segments as $segment)
				{
					if (is_overlap_Rectangle_Segment2D($rectangle,Segment2D_data($segment)))
					{
						$is_overlap = true;
						break 2;
					}
				}
				if (!$is_overlap)
				{
					$curve_label_rectangles_allowed[] = $rectangle;
				}
			}
			
			Label2D_coord_change($label,Rectangle_center($curve_label_rectangles[0]));
            $rectangles_forbidden[] = $curve_label_rectangles[0];        
			
			
			
            
        }
        
    }
    unset($label);
    
    
    return $Cartesian2D;
}




























