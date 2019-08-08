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
/*
 요청사항
 1. 각 object의 id
*/
     


function Cartesian2D_algorithm_KR(&$Cartesian2D) 
{
    
    $bound = Cartesian2D_bound($Catesian2D);
    $Cartesian2D_rotation = $Cartesian2D['rotation']; // 평면 회전각
    $Cartesian2D_size = $Cartesian2D['size']; // 기준 == 1
    $Cartesian2D_ratio = $Cartesian2D['ratio'];
    $scaling = {'x':$Cartesian2D_size,'y':$Cartesian2D_size/$Cartesian2D_ratio}; //기준 크기에 대한 x,y 비율
    
    $error = 0.01; // 길이나 크기 비교시 error의 최대값    
    $error_angle = deg2rad(1); // angle의 크기 비교시 error의 최대값  
    $font_sizes_unit = D_Rectangle_size(0.5/$scaling['x'],0.5/$scaling['y']);
    $unit_length = 0.5; // 기본 단위 길이
    
    //names
    
    $type_angle = 'Angle2D';
    $type_arc = 'Arc2D';
    $type_axis = 'Axis2D';
    $type_curve = 'Curve2D';
    $type_face = 'Face2D';
    $type_grid = 'Grid2D';
    $type_label = 'Label2D';
    $type_measure_arc = 'MeasureArc2D';
    $type_measure_segment = 'Measure2D';
    $type_path = 'Path2D';
    $type_point = 'Point2D';
    $type_region = 'Region2D';
    $type_segment = 'Segment2D';
    
    
    $Angle2D_markers_arc = ["none","single","double","triple"];//arc형 angle의 marker
        
    
    
    //$Cartesian2D['flip']; // x축, y축 axis label이 붙는 순서
    //$Cartesin2D['font']['size']: font 크기
   
    
    $objects = &Cartesian2D_datas($Cartesian2D);//전체 object
    
    $arcs = []; // Arc2D들의 array
    $arcs_dash = []; // dash를 가지는 Arc
    $arcs_data = []; //arc data
    $arcs_end = []; // arc end
    $arcs_measure = []; // MeasureArc2D를 가지는 Arc
    $arcs_radius = []; // arc radius
    
    $angles = []; // Angle
    $angles_arc = []; //arc인 angle
    $angles_color = []; // color를 가지는 Angle
    $angles_data = []; //angle data
    $angles_interactive = []; // interaction-interactive인 Angle
    $angles_interval_angle = []; // [angle start angle, angle size]
    $angles_nonarc = []; //arc가 아닌 angle
    $angles_right = []; // right angle
    
       
    $curves = []; // Curve
    
    $faces = []; // Face
    $faces_data = []; //face data
    $faces_center = []; //face center (arithmetic mean)
       
    $labels = []; // Label
    $labels_curve = []; //curve label array
    $labels_diagonal = []; // label 영역 정사각형의 diagonal 크기
    $labels_noncurve = []; //noncurve label array
    $labels_size = []; // Label2D들의 size의 array (key: label의 content, value: label size)
    $labels_vertices = []; // Label2D의 polygon의 vertices
    
    $paths = []; // Path
    $paths_data = []; // path data
    
    $points = []; // Points
    $points_data = []; //point data
        
         
    $segments = []; // Segment
    $segments_dash = []; // dash를 가지는 Segment
    $segments_data = []; // segment data
    $segments_label = []; // Label을 가지는 Segment
    $segments_length = []; // segment length
    $segments_measure = []; // Mesausre를 가지는 Segment
    $segments_parallel = []; //paralle을 가지는 Segment
    $segments_line = []; //Segment중 start와 end가 bound에 위치한 segment
    
    
    //angle values
    $angles_angle_angle = [];   // angle angle 크기
    $angles_angle_start = [];   // angle center -> start 방향 angle (angle start angle)
    $angles_angle_end = []; //angle center -> end 방향 angle (angle end angle)
    $angles_arc_start = [];   // arc center -> start 방향 angle
    $angles_arc_end = []; //arc center -> end 방향 angle
    $angles_segment_start = []; //segment start -> end 방향 angle
    $angles_segment_end = []; //segment end -> start 방향 angle
       
    foreach ($objects as &$object) // 각 object를 type에 따라 분류
    {
        $object_type = object_type($object);
        $object_id = object_id($object);
        switch ($object_type)
        {
            case $type_angle:
            {
                $angles[] = &$object;
                $Angle2D_data = Angle2D_data($object);
                $angles_data[$object_id] = $Angle2D_data;
                $angle_start_angle = M_vector_angle($Angle2D_data['center'],$Angle2D_data['start']);
                $angles_angle_start[$object_id] = $angle_start_angle
                $angles_angle_end[$object_id] = M_vector_angle($Angle2D_data['center'],$Angle2D_data['end']);
                $angle_angle = Angle2D_angle($Angle2D_data);
                $angles_angle_angle[$object_id] = $angle_angle;
                $angles_interval_angle[$object_id] = [$angle_start_angle,$angle_angle];
            
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
                else if (in_array(object_marker($object),$Angle2D_markers_arc))
                {
                    $angles_arc[] = &$object;
                }
                else
                {
                    $angles_nonarc[] = &$object;
                }
                break;
            }
            case $type_arc:
            {
                $arcs[] = $object;
                $arc_data = Arc2D_data($arc);
                $arcs_data[$object_id] = $arc_data;
                $arc_end = Arc2D_end($arc_data);
                $arcs_end[$object_id] = $arc_end;
                $arcs_radius[$object_id] = M_distance($arc_data['center'],$arc_data['start']);
                $angles_arc_start[$object_id] = M_vector_angle($arc_data['center'],$arc_data['start']);
                $angles_arc_end[$object_id] = M_vector_angle($arc_data['center'],$arc_end);
                if (object_dash($object))
                {
                    $arcs_dash[] = &$object;
                }    
            
                if (object_measure_type($object) == $type_measure_arc)
                {
                    $arcs_measure[] = &$object;
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
                $faces_data[$object_id] = $Face2D_data;
                $faces_center[$object_id] = M_mean_arithmetic($Face2D_data);
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
                $label_size = Label2D_size(label_label($object),$scaling);
				$labels_vertices[$object_id] = S_latex_vertices(label_label($object));
                $labels_size[$object_id] = $label_size;
                $labels_diagonal[$object_id] = rectangle_diagonal($label_size['x'],$label_size['y']);
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
                $points_data[$object_id] = Point2D_data($object);
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
                $segments_length[$object_id] = M_diatance($segment_data['start'],$segment_data['end']);
                $angles_segment_start[$object_id] = M_vector_angle($segment_data['start'],$segment_data['end']);
                $angles_segment_end[$object_id] = M_vector_angle($segment_data['end'],$segment_data['start']);
            
                if (object_dash($object))
                {
                    $segments_dash[] = &$object;
                }
                    
                if (object_measure_type($object) == $type_measure_segment && object_measure_height($object))
                {
                    $segments_measure[] = &$object;
                }
                    
                if (Segment2D_parallel($object))
                {   
                    $segments_parallel[] = &$object;
                }
                
                if (is_Segment2D_line($segment_data,$bound))
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
        $segment_start_angle = $angles_segment_start[object_id($segment)];            
        if (M_PI <= $segment_start_angle && $segment_start_angle < 2*M_PI) // 규칙 1
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
                    
            }
        }
    }
    unset($segment);
    
    
    
    /*
     @ 내용
       angle height와 angle의 label 위치 결정
     @ 규칙
       1. $angles_right의 Angle의 height와 markerHeight는 기본값으로 설정
       2. $angles_arc의 Angle의 height와 markerHeight는 기본값으로 설정
       3. $angles_nonarc의 angle의 height와 markerHeight는 기본값으로 설정
       3. $angles_arc에 있는 Angle을 angle의 크기가 작은 순으로 정렬
       4. $angles_arc에 있는 angle_1과 $angles_nonarc에 있는 angle_2가 겹치면 angle_1의 height와 markerHeight를 증가 시킴
       5. $angles_arc에 있는 두 Angle2D가이 겹치면 크기가 큰 Angle의 height와 markerHeight를 증가 시킴
       
    */
    
         
    if ($angles)
    {
        $angle_arc_height_standard = $unit_length*$Cartesian2D_size; // arc형 Angle의 height의 기준
        $angle_nonarc_height_standard = 0; // nonarc형 angle의 기준값
        $angle_right_height_standard = $angle_arc_height_standard*sqrt(2); // Angle2D의 style-rightAngle == true인 경우 style-height의 기준값
                
        //Initial angle height
               
        foreach ($angles_arc as &$angle_arc)
        {
            Angle2D_height_change($angle_arc,$angle_height_standard);
        }
        unset($angle_arc);
        
       
        foreach ($angles_nonarc as &$angle_nonarc)
        {
            Angle2D_height_change($angle_nonarc,$angle_nonarc_height_standard);
        }
        unset($angle_nonarc);
        
        foreach ($angles_right as &$angle_right)
        {
            Angle2D_height_change($angle_right,$angle_right_height_standard);  
        }
        unset($angle_right);
        
    

        //Initial angle label positions
        foreach ($angles as $angle)
        {
            $angle_id = object_id($angle);
            $angle_label = &$labels_key_data[$angle_id];
            
            if ($angle_label)
            {
                $Angle2D_data = $angles_data[$angle_id];
                Label2D_coord_change($angle_label,polygon_center_between_halflines($Angle2D_data['center'],$labels_vertices[object_id($angle_label)],[$angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]],$Angle2D_data['height'])));
            }
        }
       
        //Label positions and heights of angles which are arc forms
        if ($angles_arc)
        {
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
                    $angles_arc_i_angle = $angles_angle_angle[$angles_arc_i_id];
                            
                    $angle_start_angle = $angles_angle_start[$angles_arc_i_id];
                    $angle_end_angle = $angles_angle_end[$angles_arc_i_id];
                    $angle_angle = $angles_arc_i_angle;
                
                    //$angles_arc_i_label_size = $labels_size[object_id($angles_arc_i_label)];
					$angles_arc_i_label_vertices = $labels_vertices[object_id($angles_arc_i_label)];
                    //$angles_arc_i_label_center = polygon_center_between_halflines($angles_arc_i_data[0],$angles_arc_i_label_size,[$angle_start_angle,$angle_angle],$angles_arc_i_data[3]);
					$angles_arc_i_label_vertices_translated = D_Point2Ds_translation($angles_arc_i_label_vertices,$angles_arc_idata['center']);
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
                            $angle_not_arc_label = $labels_key_data[$angle_not_arc_id];
                            if (!$angle_not_arc_label)
                            {  
                                $radii_not_arc[] = $angle_not_arc_data['height'];
                            }
                            else
                            {
                                $angle_not_arc_start_angle = $angles_arc_start[$angle_not_arc_id];
                                $angle_not_arc_end_angle = $angles_arc_end[$angle_not_arc_id];
                                $point_angle = M_angle_polar($angle_not_arc_start_angle-$angle_start_angle);            
                                if ($point_angle <= $angles_arc_i_angle)
                                {
                                    $point_angles[] = $point_angle;    
                                }
                                $point_angle = M_angle_polar($angle_not_arc_end_angle-$angle_start_angle);
                                if ($point_angle <= $angles_arc_i_angle)
                                {
                                    $point_angles[] = $point_angle;    
                                }
                                $label_angle = M_angle_polar(M_vector_angle($angle_not_arc_data['center'],label_coord($angle_not_arc_label))-$angle_start_angle);
                                if ($label_angle <= $angles_arc_i_angle)
                                {
                                    $label_angles[] = $label_angle;    
                                }
                                //$angle_not_arc_label_size = $labels_size[object_id($angle_not_arc_label)];
								$angle_not_arc_label_vertices = $labels_vertices[object_id($angle_not_arc_label)];
                                $angle_not_arc_label_center = polygon_center_between_halflines($angle_not_arc_data,$angle_not_arc_label_vertices,[		 $angle_not_arc_start_angle,$angles_angle_angle[$angle_not_arc_id]),$angle_not_arc_data['height']);
								$angle_not_arc_label_vertices_tranlated = D_Point2Ds_translated($angle_not_arc_label_vertices,$angle_not_arc_data['center']);
                                $angle_not_arc_label_distance_max = M_Point2D_Point2Ds_distance_max($angle_not_arc_data['center'],$angle_not_arc_label_vertices); 
                                
                                if (($angle_not_arc_height <= $angles_arc_data['height'] && $angles_arc_data['height'] <= $angle_not_arc_label_distance_max) ||
                                    ($angle_not_arc_height <= $angles_arc_i_label_distance_max && $angles_arc_i_label_distance_max <= $angle_not_arc_label_distance_max))  
                                {
                                    $radii_not_arc[] = $angle_not_arc_label_distance_max;
                                }     
                            }
                        }
                    }
                    for ($j = 0; $j < $i; $j++)
                    {
                        $angles_arc_j_id = object_id($angles_arc[$j]);
                        $angles_arc_j_data = $angles_data[$angles_arc_j_id];   
                        if (is_overlap_Angle2D_Angle2D($angles_arc_i_data,$angles_arc_j_data))
                        {
                            $angles_arc_j_label = $labels_key_data[$angles_arc_j_id];
                            if ($angles_arc_j_label)
                            {
                                $point_angle =  M_angle_polar($angles_angle_start[$angles_arc_j_id]-$angle_start_angle);
                                if ($point_angle <= $angles_arc_i_angle)
                                {
                                    $point_angles[] = $point_angle;    
                                }
                                
                                $point_angle =  M_angle_polar($angles_angle_end[$angles_arc_j_id]-$angle_start_angle);
                                if ($point_angle <= $angles_arc_i_angle)
                                {
                                    $point_angles[] = $point_angle;    
                                }
                                $label_angle = M_angle_polar(M_vector_angle($angles_arc_j_data['center'],label_coord($angles_arc_j_label))-$angle_start_angle);
                                if ($label_angle <= $angles_arc_i_angle)
                                {    
                                    $label_angles[] = $label_angle;    
                                }
                            }
                        
                            $angles_arc_j_label_distance_max = point_rectangle_distance_max($angles_arc_j_data,$angles_arc_i_label_size,$angles_arc_i_label_center);
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
                    $angle_part_label_data['height'] = max($angles_arc_i_data['height'],max($radii_not_arc)+$angle_height_increment,max($radii_arc)+$angle_height_increment));
                    
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
                            $point_angle = M_angle_polar($point_angles[$k+1]-$point_angles[$k]);
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
                    
                        $angle_start_angle = M_angle_polar($angle_start_angle+$point_angles[$label_key]);
                        $angle_angle = M_angle_polar($point_angles[$label_key+1]-$point_angles[$label_key]);
                    
                   
                    }
                    Label2D_coord_change($angles_arc_i_label,polygon_center_between_halflines($angle_part_label_data['center'],$angles_arc_i_label_vertices,[$angle_start_angle,$angle_angle],$angle_part_label_data['height']));               
                   
                }
            }
        } 
    
    
        
        if (sizeof($angles_interactive)+sizeof($angles_color) >= sizeof($angles))
        {
            $angle = deg2rad(40);
            for ($i = 0; $i < $angles_arc_size; $i++)
            {
               Angle2D_height_change($angles_arc[$i],$angles_arc_i['height']+max(0,($angle-$angles_arc_i_angle)/$angle));  
            }    
        }
    } 
    
    
    
    
        
        
        
   
    //measure의 height 결정
       
    
    /*
      @ 내용
        Measure2D의 style-height 결정
      @ 규칙
        1. Measure2D를 포함하는 Segment2D의 길이로 height
   */
    $segment_measure_height_min = $unit_length;
    $segment_measure_height_max = 2*$unit_length;
    $segment_measure_height_ratio = 1/8;
    foreach ($segments_measure as &$segment)
    {
        segment_measure_height_change($segment,M_value_bounds($segment_measure_height_ratio*$segments_length[object_id($segment)],$segment_measure_height_min,$segmeint_measure_height_max));
    }    
    unset($segment);
    
    
    /*
      @ 내용
        MeasureArc2D의 style-height 결정
      @ 규칙
        1. MeasureArc2D를 포함하는 Arc2D의 radius*0.2와 1중 작은 값을 style-height로 결정
    */
    $arc_measure_height_min = $unit_length;
    $arc_measure_height_max = 2*$unit_length;
    $arc_measure_height_ratio = 1/8;
    foreach ($arcs_measure as &$arc)
    {
        arc_measure_height_change($arc,M_value_bounds($arc_measure_height_ratio*$arcs_radius[object_id($arc)],$arc_measure_height_min,$arc_measure_height_max)); 
    }    
    unset($arc); 
    
    
    
    
    /*
      @ 내용
        Measure2D의 style-height의 부호 결정
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
        $intervals_angle_start = [];
        $intervals_angle_end = [];
        
              
        foreach ($angles as $angle)
        {
            $angle_id = object_id($angle);
            $Angle2D_data = $angels_data[$angle_id];
            
            if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['center']))
            {
                $intervals_angle_start[] = D_interval_angle($angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]);
                    
            }
            else if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['start']))
            {
                $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Angle2D_data['center'],0);
            }
            else if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['end']))
            {
                $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Angle2D_data['center']),0);
            }
            else if (is_contained_Point2D_Segment2D($segment_data['start'],D_Segment2D($Angle2D_data['center'],$Angle2D_data['start')))
            {
                $intervals_angle_start[] = D_interval_angle($angles_angle_start[$angle_id],M_PI);                       
            }
            else if (is_contained_Point2D_Segment2D($segment_data['start'],D_Segment2D($Angle2D_data['center'],$Angle2D_data['end'])))
            {
                $intervals_angle_start[] = D_interval_angle(M_angle_polar($angles_angle_start[$angle_id]-M_PI),M_PI);
            }
                
            if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['center']))
            {
                $intervals_angle_end[] = D_interval_angle($angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]);
                
            }
            else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['start']))
            {
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Angle2D_data['center']),0);
            }
            else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['end']))
            {
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Angle2D_data['center']),0);
            }
            else if (is_contained_Point2D_Segment2D($segment_data['end'],D_Segment2D($Angle2D_data['center'],$Angle2D_data['start')))
            {
                $intervals_angle_end[] = D_interval_angle($angles_angle_start[$angle_id],M_PI);                       
            }
            else if (is_contained_Point2D_Segment2D($segment_data['end'],D_Segment2D($Angle2D_data['center'],$Angle2D_data['end'])))
            {
                $intervals_angle_end[] = D_interval_angle(M_angle_polar($angles_angle_start[$angle_id]-M_PI),M_PI);
            }
        }
        
        foreach ($arcs as $arc)
        {
            $arc_id = object_id($arc);
            $arc_data = $arcs_data[$arc_id];
            if (M_is_equal_approximately($segment_data['start'],$arc_data['start']))
            {
                $intervals_angle_start[] = D_interval_angle(M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['start'])+M_PI/2),0);
            }
            else if (M_is_equal_approximately($segment_data['start'],Arc2D_end($arc)))
            {
                $intervals_angle_start[] = D_interval_angle(M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['start'])-M_PI/2),0);
            }
            else if (is_contained_Point2D_Arc2D($segment_data['start'],$arc_data))
            {
                $angle = M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['start'])-M_PI/2);
                $intervals_angle_start[] = D_interval_angle($angle,0);
                $intervals_angle_start[] = D_interval_angle(M_angle_polar($angle+M_PI),0);
                        
            }
            
            if (M_is_equal_approximately($segment_data['end'],$arc_data['start']))
            {
                $intervals_angle_end[] = D_interval_angle(M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['end'])+M_PI/2),0);
            }
            else if (M_is_equal_approximately($segment_data['end'],$arcs_end[object_id($arc)))
            {
                $angle = ;
                $intervals_angle_end[] = D_interval_angle(M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['end'])-M_PI/2),0);
                        
            }
            else if (is_contained_Point2D_Arc2D($segment_data['end'],$arc_data))
            {
                $angle = M_angle_polar(M_vector_angle($arc_data['center'],$segment_data['start'])-M_PI/2);
                $intervals_angle_end[] = D_interval_angle($angle,0);
                $intervals_angle_end[] = D_interval_angle(M_angle_polar($angle+M_PI),0);
                        
            }
                
        }
        
        foreach ($paths as $path)
        {
            $path_data = $paths_data[object_id($path)];
            
            if (M_is_equal_approximately($segment_data['start'],$path_data[0]))
            {
                $angle = M_vector_angle($segment_data['start'],$path_data[1]);
                $intervals_angle_start[] = D_interval_angle($angle,0);
            }
            else
            {
                $path_data_size = sizeof($path_data);
                for ($i = 1; $i < $path_data_size; $i++)
                {
                    if (M_is_equal_approximately($segment_data['start'],$path_data[$i]))
                    {
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i]),0);
                        break;
                    }
                    else if (is_contained_Point2D_Segment2D($segment_data['start'],D_Segment2D($path_data[$i-1],$path_data[$i])))
                    {
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i-1]),0);
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$path_data[$i]),0);
                        break;
                    }
                }
            }
            
            if (M_is_equal_approximately($segment_data['end'],$path_data[0]))
            {
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$path_data[1]),0);
            }
            else
            {
                $path_data_size = sizeof($path_data);
                for ($i = 1; $i < $path_data_size; $i++)
                {
                    if (M_is_equal_approximately($segment_data['end'],$path_data[$i]))
                    {
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$path_data[$i]),0);
                        break;
                    }
                    else if (is_contained_Point2D_Segment2D($segment_data['end'],D_Segment2D($path_data[$i-1],$path_data[$i])))
                    {
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data[1],$path_data[$i-1]),0);
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data[1],$path_data[$i]),0);
                        break;
                    }
                }
            }
        }
        
        
        foreach ($faces as $face)
        {
            $Face2D_data = $faces_data[object_id($face)];
            $Face2D_data_size = sizeof($Face2D_data);
            array_push($Face2D_data,$Face2D_data[0]);
                    
            if (M_is_equal_approximately($segment_data['start'],$Face2D_data[0]))
            {
                $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[1]),0);
                $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$Face2D_data_size-1]),0);
            }
            else
            {
                $Face2D_data_size = sizeof($path_data);
                for ($i = 1; $i < $Face2D_data_size; $i++)
                {
                    if (M_is_equal_approximately($segment_data['start'],$Face2D_data[$i]))
                    {
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i-1]),0);
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i+1]),0);
                        break;
                    }
                    else if (is_contained_Point2D_Segment2D($segment_data['start'],D_Segment2D($Face2D_data[$i-1],$Face2D_data[$i])))
                    {
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i-1]),0);
                        $intervals_angle_start[] = D_interval_angle(M_vector_angle($segment_data['start'],$Face2D_data[$i]),0);
                        break;
                    }
                }
            }
            
            if (M_is_equal_approximately($segment_data['end'],$Face2D_data[0]))
            {
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[1]),0);
                $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$Face2D_data_size-1]),0);
            }
            else
            {
                $Face2D_data_size = sizeof($path_data);
                for ($i = 1; $i < $Face2D_data_size; $i++)
                {
                    if (M_is_equal_approximately($segment_data['end'],$Face2D_data[$i]))
                    {
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$i-1]),0);
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$i+1]),0);
                        break;
                    }
                    else if (is_contained_Point2D_Segment2D($segment_data['end'],D_Segment2D($Face2D_data[$i-1],$Face2D_data[$i])))
                    {
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$i-1]),0);
                        $intervals_angle_end[] = D_interval_angle(M_vector_angle($segment_data['end'],$Face2D_data[$i]),0);
                        break;
                    }
                }
            }
        }
               
                  
        
        
        
        
        
        foreach ($segments as $segment_1)
        {
            $segment_1_id = object_id($segment_1);
            if ($segment_id != $segment_1_id)
            {
                $segment_1_data = $segments_data[$segment_1_id];
                if (M_is_equal_approximately($segment_data['start'],$segment_1_data['start']))
                {
                    $intervals_angle_start[] = D_interval_angle($angles_segment_start[$segment_1_id],0);
                }
                else if (M_is_equal_approximately($segment_data['start'],$segment_1_data['end']))
                {
                    $intervals_angle_start[] = D_interval_angle($angles_segment_end[$segment_1_id],0);
                }
                else if (is_contained_Point2D_Segment2D($segment_data['start'],$segment_1_data))
                {
                    $intervals_angle_start[] = D_interval_angle($angles_segment_start[$segment_1_id],0);
                    $intervals_angle_start[] = D_interval_angle($angles_segment_end[$segment_1_id],0);
                }
        
                if (M_is_equal_approximately($segment_data['end'],$segment_1_data['start']))
                {
                    $intervals_angle_end[] = D_interval_angle($angles_segment_start[$segment_1_id],0D_interval_angle(;
                }
                else if (M_is_equal_approximately($segment_data['end'],$segment_1_data['end']))
                {
                    $intervals_angle_end[] = D_interval_angle($angles_segment_end[$segment_1_id],0);
                }
                else if (is_contained_Point2D_Segment2D($segment_data['end'],$segment_1_data))
                {
                    $intervals_angle_end[] = D_interval_angle($angles_segment_start[$segment_1_id],0);
                    $intervals_angle_end[] = D_interval_angle($angles_segment_end[$segment_1_id],0);
                }
            }
        }
        
        
            
        
        
        
        
                       
        $intervals_angle_start = Intervals_angle_union($intervals_angle_start); // start를 지나는 object의 angle 
        $intervals_angle_end = Intervals_angle_union($intervals_angle_end); // end를 지나는 object의 angle 
        
        $intervals_angle_start_size = sizeof($intervals_angle_start);
        $intervals_angle_end_size = sizeof($intervals_angle_end);
           
        if (!$intervals_angle_start_size && !$intervals_angle_end) // $start_angles와 $end_angles가 없는 경우
        {
            if (0 <= $segment_start_angle && $segment_start_angle <= M_PI/2) || (3*M_PI/2 < $segment_start_angle && $segment_start_angle <= 2*M_PI))
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
                     !M_is_equal_approximately_angle($end_right_angle_max-$right_angle_max)))
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
                        if (M_is_equal_approximately_angle($segment_start_angle,$angle_end_angle) &&
                            M_is_equal_approximately_angle($segment_end_angle+$start_angle_left_max,$angle_start_angle))
                            //angle이 segment의 start를 기준으로 left 쪽으로 기울어 졌을 때
                        {
                            $start_angle_left_visible = true;
                        }    
                        else if (M_is_equal_approximately_angle($segment_start_angle,$angle_start_angle) &&
                                 M_is_equal_approximately_angle($segment_end_angle-$start_angle_right_max,$angle_end_angle))
                                 //angle이 segment의 start를 기준으로 right 쪽으로 기울어 졌을 때   
                        {
                            $start_angle_right_visible = true;
                        }    
                    }    
                    else if (M_is_equal_approximately($segment_data['end'],$Angle2D_data['center']))
                    {
                        if (M_is_equal_approximately_angle($segment_end_angle,$angle_end_angle) &&
                            M_is_equal_approximately_angle($segment_start_angle+$end_angle_left_max,$angle_start_angle))
                            //angle이 segment의 end를 기준으로 left 쪽으로 기울어 졌을 때
                        {
                            $end_angle_left_visible = true;
                        }    
                        else if (M_is_equal_approximately_angle($segment_end_angle,$angle_start_angle) &&
                                 M_is_equal_approximately_angle($segment_start_angle-$end_angle_right_max,$angle_end_angle))
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
        foreach ($faces as $face)
        {
            $face_id = object_id($face);
            $Face2D_data = $faces_data[$face_id];
            $Face2D_data_size = sizeof($Face2D_data);
            $face_center = $faces_center[$face_id];
            array_push($Face2D_data,$Face2D_data[0]);
                                        
            for ($i = 0; $i < $Face2D_data_size; $i++)
            {
                if (is_contained_strictly_Segment2D_Segment2D($segment_data,[$Face2D_data[$i],$Face2D_data[$i+1]]))
                {
                    $angle_difference = M_angle_polar(M_vector_angle($face_center,$segment_data['end'])-M_vector_angle($face_center,$segment_data['start']));
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
                   
        
                               
        //segment가 원에 포함되고 한 점이 원의 중심인 삼각형일 경우  measure height sign 결정
        foreach ($angles as $angle)
        {
            $Angle2D_data = $angles_data[object_id($angle)];
            foreach ($arcs as $arc)
            {
                $arc_data = $arcs_data[object_id($arc)];
                if (M_is_equal_approximately($angles_data['center'],$arc_data[0])
                {
                    if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['center']) &&
                        M_is_equal_approximately($segment_data['end'],$Angle2D_data['start']))
                    {
                        if ($arc_data['angle'] < M_PI/2)
                        {
                            $segment_measure_height_sign = 1;
                        }
                        else
                        {
                            $segment_measure_height_sign = -1;
                        }
                    }
                    else if (M_is_equal_approximately($segment_data['start'],$Angle2D_data['start']) &&
                             M_is_equal_approximately($segment_data['end'],$Angle2D_data['center']))
                    {
                        if ($arc_data[2] < M_PI/2)
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
                $segments_line_i_id = object_id($segments_line[$i]);
                $segments_line_i_data = $segments_data[$segments_line_i_id];
                for ($j = $i+1; $j < $segments_line_size; $j++)
                {
                    $segments_line_j_id = object_id($segments_line[$j]);
                    $segments_line_j_data = $segments_data[$segments_line_j_id];
                    if (is_parallel_Segment2D_Segment2D($segments_line_i_data,$segments_line_j_data))
                    {
                        $parallel_line_pairs_id[] = [$segments_line_i_id,$segments_line_j_id];
                    }    
                }
            } 
            
            foreach ($parallel_line_pairs_id as $parallel_line_pair_id)
            {
                $segment_0_data = $segments_data[$parallel_line_pair_id[0]];
                $segment_1_data = $segments_data[$parallel_line_pair_id[1]];
                if((is_contained_Point2D_Segment2D($segment_data['start'],$segment_0_data) &&
                    is_contained_Point2D_Segment2D($segment_data['end'],$segment_0_data)) ||
                   (is_contained_Point2D_Segment2D($segment_data['start'],$segment_1_data) &&
                    is_contained_Point2D_Segment2D($segment_data['end'],$segment_1_data)))
                {
                    if (0 <= $segment_start_angle && $segment_start_angle < M_PI)
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
           
        if ($segment_measure_height_sign !== $segment_measure_height_sign_initial)
        {
            segment_measure_height_change($segment,$segment_measure_height_sign*$segment_measure_height_abs);
           
        }
        
        //segment위에 한 끝점이 있는 다른 segment measure가 visible이고 그런 모든 segment의 방향이 같은 경우
        if ($segments_measure)
        {
            $is_left_segmented = false;
            $is_right_segmented = false;
                        
            foreach ($segments_measure as $segment_1)
            {
                $segment_1_id = object_id($segment_1);
                $segment_1_data = $segments_data[$segment_1_id];
                if ($segment_id != $segment_1_id &&
                    !is_contained_Segment2D_Segment2D($segment_data,$segment_1_data) &&
                    !is_contained_Segment2D_Segment2D($segment_1_data,$segment_data) &&
                    !is_overlap_Segment2D_Segment2D($segment_data,$segment_1_data))
                {
                    if (is_contained_strictly_Point2D_Segment2D($segment_1_data['start'],$segment_data))
                    {
                        $angle_difference = M_angle_polar($angles_segment_start[$segment_1_id]-$segment_start_angle);
                        
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
                        $angle_difference = M_angle_polar($angles_segment_end[$segment_1_id]-$segment_start_angle);
                            
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
        
        if ($segment_measure_height_sign !== $segment_measure_height_sign_initial)
        {
            segment_measure_height_change($segment,$segment_measure_height_sign*abs(object_measure_height($segment)));
        }
    }
    unset($segment);
    
    /*
     * 내용
       coords가 없는 Label들의 coords 결정
     
    */
    
    $label_distance = 0.25; // label이 지정하는 점에서 label rectangle까지의 기본거리
    $label_radius = 0.5; // label이 지칭하는 점에서 label 중심까지의 기본거리
    $label_margin = [0.2,0.2]; // Label2D의 Rectangle의 margin
    //$rectangle_margin = [0.25,0.25]; // Rectangle의 margin
    
    //noncurve label
    foreach ($labels_noncurve as &$label)
    {
        $label_id = object_id($label);
        $label_size = $labels_size[$label_id];
        $labeled_data_id  = labeled_data_id($label);
        $labeled_data = $objects_key_label[$label_id];
        $labeled_data_type = object_type($labeled_data);
        
        switch ($labeled_data_type)
        {
            case $type_arc://Label이 지정하는 object가 Arc인 경우
            {
                $arc_data = $arcs_data[$labeled_data_id];
                $arc_radius = $arcs_radius[$labeled_data_id];
                $label_angle = M_angle_polar($angles_arc_start[$labeled_data_id]+Arc2D_angle($arc)/2);
                $label_coord = M_addition($arc_data['center'],M_polar_to_cartesian($arc_radius+1,$label_angle));
                break;
            }    
            case $type_angle: //Label이 지정하는 object가 Angle인 경우  
            {
                $Angle2D_data = $angles_data[$labeled_data_id];
                $label_coord = polygon_center_between_halflines($Angle2D_data['center'],$labels_vertices[$label_id],$angles_interval_angle[$labeled_data_id],$Angle2D_data['height']);
                break;
            }
                       
            /*
             * 내용: Label이 지정하는 obejct가 Segment measure인 경우
             * 원리: segment measure의 중심에 위치
             */
            case $type_measure_segment:
            {
                $segment = measured_data($measure,$objects);
                $segment_id = object_id($segment);
                $segment_data = $segments_data[$segment_id];
                $segment_start_angle = $angles_segment_start[$segment_id];
                $segment_measure_height = segment_measure_height($segment);
                if ($segment_measure_height >= 0)
                {
                    $angle = M_angle_polar($segment_start_angle+M_PI/2);        
                }
                else
                {
                    $angle = M_angle_polar($segment_start_angle-M_PI/2);
                }
                
                $label_coord = M_addition(M_multiplication_scalar(1/2,M_addtion($segment_data['end'],$segment_data['start'])),M_polar_to_cartesian(abs($segment_measure_height),$angle));
                break;
            }
            case $type_measure_arc//Label이 지정하는 object가 Arc measure인 경우
            {
                $arc = measured_data($measure,$objects);
                $arc_id = object_id($arc);
                $label_radius = Arc2D_measure_height($arc);
                $arc_data = $arcs_data[$arc_id];
                $label_angle = $angles_arc_start[$arc_id]+$arcs_angle[$arc_id]/2;
                $label_coord = M_addition($arc_data['center'],M_polar_to_cartesian($label_radius,$label_angle));
                break;
            }
              
            case $type_face: //Label이 지정하는 object가 Face인 경우
            {
                $label_coord = $faces_center[$labeled_data_id];                
                        
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
                        $label_coord = M_addition($label_coord,D_Point2D(0,1));
                        
                    }    
                }
                Label2D_coord_change($label,$label_coord);
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
                                
                $intervals_angle_forbidden = [];
                $intervals_angle_forbidden_angle = [];
        
                foreach ($angles as $angle)
                {
                   $angle_id = object_id($angle);
                   $Angle2D_data = $angels_data[$angle_id];
            
                    if (M_is_equal_approximately($point_data,$Angle2D_data['center']))
                    {
                        $intervals_angle_forbidden_angle[] = D_interval_angle($angles_angle_start[$angle_id],$angles_angle_angle[$angle_id]);
                        
                    }
                    else if (M_is_equal_approximately($point_data,$Angle2D_data['start']))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Angle2D_data['center']),0);
                        
                    }
                    else if (M_is_equal_approximately($point_data,$Angle2D_data['end']))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Angle2D_data['center']),0);
                    }
                    else if (is_contained_Point2D_Segment2D($point_data,D_Segment2D($Angle2D_data['center'],$Angle2D_data['start'])))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle($angles_angle_start[$angle_id],M_PI);
                    }
                    else if (is_contained_Point2D_Segment2D($point_data,D_Segment2D($Angle2D_data['center'],$Angle2D_data['end'])))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($angles_angle_start[$angle_id]-M_PI),M_PI);
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
                
        
                               
                            
        
                foreach ($paths as $path)
                {
                    $path_data = $paths_data[object_id($path)];
                
                    if (M_is_equal_approximately($point_data,$path_data[0]))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$path_data[1]),0);
                    }
                    else
                    {
                        $path_data_size = sizeof($path_data);
                        for ($i = 1; $i < $path_data_size; $i++)
                        {
                            if (M_is_equal_approximately($point_data,$path_data[$i]))
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$path_data[$i]),0);
                                break;
                            }
                            else if (is_contained_Point2D_Segment2D($point_data,D_Segment2D($path_data[$i-1],$path_data[$i])))
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$path_data[$i-1]),0);
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$path_data[$i]),0);
                                break;
                            }
                        }
                    }
                }
            
                foreach ($faces as $face)
                {
                    $Face2D_data = $faces_data[object_id($face)];
                    $Face2D_data_size = sizeof($Face2D_data);
                    array_push($Face2D_data,$Face2D_data[0]);
                    if (M_is_equal_approximately($point_data,$Face2D_data[0]))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[1]),0);
                        $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[$Face2D_data_size-1]),0);
                    }
                    else
                    {
                        $path_data_size = sizeof($path_data);
                        for ($i = 1; $i < $path_data_size; $i++)
                        {
                            if (M_is_equal_approximately($point_data,$Face2D_data[$i]))
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[$i-1]),0);
                                
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[$i+1]),0);
                                break;
                            }
                            if (is_contained_Point2D_Segment2D($point_data,D_Segment2D($Face2D_data[$i-1],$Face2D_data[$i])))
                            {
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[$i-1]),0];
                                
                                $intervals_angle_forbidden[] = D_interval_angle(M_vector_angle($point_data,$Face2D_data[$i]),0);
                                break;
                            }
                        }
                    }
                    $face_id = obejct_id($face);
                    $Face2D_data = $faces_data[$face_id];
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
                
                
                
                $is_surrounded_by_segment_measures = is_surrounded_by_Segment2D_measures($point,$segments_measure);
                foreach ($segments as $segment)
                {
                    $segment_id = object_id($segment);
                    $segment_data = $segments_data[$segment_id];
                    if (M_is_equal_approximately($point_data,$segment_data['start']))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle($angles_segment_start[$segment_id],$angles_segment_start[$segment_id]);
                        
                        {
                            $segment_measure_height = object_measure_height($segment);
                            $segment_measure_angles = Segment2D_measure_angles($segemnt_data,abs(object_measure_height($segment)));
                            if ($segment_measure_height > 0)
                            {
                                $intervals_angle_forbidden[] = D_interval_angle($angles_segment_start[$segment_id],M_angle_polar($segment_measure_angles['start']-$angles_segment_start[$segment_id]));
                            }
                            else if ($segment_measure_height < 0)
                            {
                                $intervals_angle_forbidden[] = D_interval_angle($segment_measure_angles['start'],M_angle_polar($angles_segment_start[$segment_id]-$segment_measure_angles['start']));
                            }
                        }
                    }
                    else if (M_is_equal_approximately($point_data,$segment_data[1]))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle($angles_segment_end[$segment_id],0);
                    
                        $segment_measure_height = object_measure_height($segment);
                        $segment_measure_angles = Segment2D_measure_angles($segemnt_data,abs(object_measure_height($segment)));
                        if ($segment_measure_height > 0)
                        {
                            $intervals_angle_forbidden[] = D_interval_angle($segment_measure_angles['end'],M_angle_polar($angles_segment_start[$segment_id]-$segment_measure_angles['end']));
                        }
                        else if ($segment_measure_height < 0)
                        {
                            $intervals_angle_forbidden[] = D_interval_angle($angles_segment_start[$segment_id],M_angle_polar($segment_measure_angles['start']-$angles_segment_start[$segment_id]));
                        }
                    }
                    
                    else if (is_contained_Point2D_Segment2D($point_data,$segment_data))
                    {
                        $intervals_angle_forbidden[] = D_interval_angle($angles_segment_start[$segment_id],0);
                        $intervals_angle_forbidden[] = D_interval_angle($angles_segment_end[$segment_id],0);
                    }
                       
                }
                
                if ($is_surrounded_by_segment_measures)
                {
                        
                    /*
                    * 방법
                      $label_distance+$label_rectangle_radius+$label_margin과 $point['coord']에서 segment measure 까지의 거리의 최대 최소값을 비교     
                    */
                    foreach ($segments_measure as $segment)
                    {
                        $segment_id = object_id($segment);
                        $segment_data = $segments_data[$segment_id];
                        if (is_contained_Point2D_Segment2D($point_data,$segment_data))                
                        {              
                            $label_rectangle_radius = $labels_diagonal[$label_id]/2;
                            $label_margin = 0.25;
                            $segment_measure_height = object_measure_height($segment);
                            $segment_measure_height_abs = abs($segment_measure_height);
                            $distance_measure = point_segment_measure_distance($point_data,$segment_data,$segment_measure_height_abs);
                            $length = $label_distance+$label_rectangle_radius+$label_margin;
                            if ($length <= $distance_measure)
                            {
                                $intervals_angle_forbidden[] = D_interval_angle($end_angle,M_PI/4);
                                $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($start_angle-M_PI/4),M_PI/4);
                            }
                            else 
                            {
                                $segment_measure_height_sign = sign($segment_measure_height);
                            
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
                                            $intervals_angle_forbidden[] = [$start_angle,M_PI/2];
                                            
                                        }
                                        else
                                        {
                                            $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($end_angle-M_PI/2),M_PI/2);
                                        }
                                    }
                                }
                                else
                                {
                                    if ($segment_measure_height_sign > 0)
                                    {
                                        $intervals_angle_forbidden[] = D_interval_angle(M_angle_polar($end_angle-M_PI),M_PI);
                                    }
                                    else if ($segment_measure_height_sign < 0)
                                    {
                                        $intervals_angle_forbidden[] = D_interval_angle($end_angle,M_PI);
                                    }
                                    
                                }
                            }
                        }    
                    }   
                }
                   
                if (!is_surrounded_by_Angle2Ds($intervals_angle_forbidden_angle))                                                       
                {
                    $intervals_angle_forbidden = Intervals_angle_union(array_merge($intervals_angle_forbidden,$intervals_angle_forbidden_angle));
                    $intervals_angle_max = Intervals_angle_max(Intervals_angle_complement($intervals_angle_forbidden));
                    
                }
                else
                {
                    $label_distance = 0.25;
                    $intervals_angle_max = angles_intervals_max(Intervals_angle_complement(Intervals_angle_union($intervals_angle_forbidden)));
                    
                   
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
                $rectangle_angle = M_atan2_polar($label_size['x'],$label_size['y']);
                               
                if ((0 <= $segment_angle && $segment_angle <= M_PI/2) ||
                    (3*M_PI/2 < $segment_angle && $segment_angle < 2*M_PI))
                {
                    $start = $segment_data['end'];
                }    
                else
                {
                    $start = $segment_data['start'];       
                    $segment_angle = M_angle_polar($segment_angle+M_PI);
                }   
                        
                $translation_radius = 0.5;
                $translation_angle = M_angle_polar($segment_angle+M_PI);
                $start_translated = M_addition($start,M_polar_to_cartesian($translation_radius,$translation_angle));
                
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
                            $height_visible = $bound['y']['max']-$start_translated['y'];
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
                    $width_visible = $bound['x']['max']-$start_translated['x'];
                    if ($width_visible < $label_size['x'])
                    {
                        $x_addition = $label_size['x']-$width_visible;
                        $y_addition = $x_addition/tan(2*M_PI-$segment_angle);
                        if ($start_translated['x']+$y_addition+$label_size['y'] > $bound['y']['min'])
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






   




























