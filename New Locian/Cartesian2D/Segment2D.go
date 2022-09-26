package Cartesian2D

import (
	"math"
)

type Segment2D struct {
	start Coord
	end Coord
	color string
	dash string
	measure Measure2D
	parallel string

	id float64

	
}

func (segment2d Segment2D) figure() Segment {
	segment := Segment{}
	segment.start = segment2d.start
	segment.end = segment2d.end
	return segment
}

func (segment2d Segment2D) arm_sign(set_arc2d Set_Arc2D, set_face2d Set_Face2D, set_path2d Set_Path2D, set_segment2d Set_Segment2D) float64 {
	var arm_sign float64
	segment := segment2d.figure()
	angle_segment := segment.angle()
	for _, arc2d := range set_arc2d.elements {
		arc := arc2d.figure()
		if segment.is_crossing(arc) == true {
			return 0.0
		}
		intersections := segment.intersections(arc)
		if len(intersections) == 1 {
			if intersections[0].is_equal(segment.start) == false && intersections[0].is_equal(segment.end) == false {
				if segment.is_tangent(arc) == true {
					angle := angle_polar(intersections[0].vector_angle(arc.center)-angle_segment)
					arm_sign = sign(arm_sign+sign_angle(angle))
				} else {
					if intersections[0].is_equal(arc.start) == true {
						angle := angle_polar(angle_polar(arc.center.vector_angle(intersections[0])+math.Pi/2)-angle_segment)
						arm_sign = sign(arm_sign+sign_angle(angle))
					} else if intersections[0].is_equal(arc.end()) == true {
						angle := angle_polar(angle_polar(arc.start.vector_angle(intersections[0])-math.Pi/2)-angle_segment)
						arm_sign = sign(arm_sign+sign_angle(angle))
					}
				}
				if arm_sign == 0.0 {
					return 0.0
				}
			}
		}
		if arm_sign == 0.0 {
			return 0.0
		}
	}

	for _, face2d := range set_face2d.elements {
		if segment.is_crossing(face2d.figure()) == true {
			return 0.0
		}
		vertices := append(face2d.vertices, face2d.vertices[0])
		if vertices[0].is_contained_strictly(segment) == true {
			angle := angle_polar(angle_segment-segment.start.vector_angle(vertices[1]))
			arm_sign = sign(arm_sign+sign_angle(angle))
			if arm_sign == 0.0 {
				return 0.0
			}
		}
		for i := 1; i < len(vertices)-1; i++ {
			if vertices[i].is_contained_strictly(segment) == true {
				angle_1 := angle_polar(angle_segment-segment.start.vector_angle(vertices[i-1]))
				arm_sign = sign(arm_sign+sign_angle(angle_1))
				if arm_sign == 0.0 {
					return 0.0
				}
				angle_2 := angle_polar(angle_segment-segment.start.vector_angle(vertices[i+1]))
				arm_sign = sign(arm_sign+sign_angle(angle_2))
				if arm_sign == 0.0 {
					return 0.0
				}
			}
		}
		if vertices[len(vertices)-1].is_contained_strictly(segment) == true {
			angle := angle_polar(angle_segment-segment.start.vector_angle(vertices[len(vertices)-2]))
			arm_sign = sign(arm_sign+sign_angle(angle))
			if arm_sign == 0.0 {
				return 0.0
			}
		}
		
	}

	for _, path2d := range set_path2d.elements {
		path := path2d.figure()
		if segment.is_crossing(path) == true {
			return 0.0
		}
		vertices := path.vertices
		if vertices[0].is_contained_strictly(segment) == true {
			angle := angle_polar(angle_segment-segment.start.vector_angle(vertices[1]))
			arm_sign = sign(arm_sign+sign_angle(angle))
			if arm_sign == 0.0 {
				return 0.0
			}
		}
		
		for i := 1; i < len(vertices)-1; i++ {
			if vertices[i].is_contained_strictly(segment) == true {
				angle_1 := angle_polar(angle_segment-segment.start.vector_angle(vertices[i-1]))
				arm_sign = sign(arm_sign+sign_angle(angle_1))
				if arm_sign == 0.0 {
					return 0.0
				}
				angle_2 := angle_polar(angle_segment-segment.start.vector_angle(vertices[i+1]))
				arm_sign = sign(arm_sign+sign_angle(angle_2))
				if arm_sign == 0.0 {
					return 0.0
				}
				
			}
		
		}

		if vertices[len(vertices)-1].is_contained_strictly(segment) == true {
			angle := angle_polar(angle_segment-segment.start.vector_angle(vertices[len(vertices)-2]))
			arm_sign = sign(arm_sign+sign_angle(angle))
			if arm_sign == 0.0 {
				return 0.0
			}
		}
	}

	for _, segment2d_1 := range set_segment2d.elements {
		if segment2d.id != segment2d_1.id {
			segment_1 := segment2d_1.figure()
			if segment.is_overlap(segment_1) == true {
				return 0.0
			}
			angle_segment_1 := segment_1.angle()
			if segment.is_parallel(segment_1) == true {
				if segment_1.start.is_contained_strictly(segment) == true {
					angle := angle_polar(angle_segment_1-angle_segment)
					arm_sign = sign(arm_sign+sign_angle(angle))
				}
				if arm_sign == 0.0 {
					return 0.0
				}
			}
		}
	}

	return arm_sign
	
	

}


func (segment2d Segment2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if segment2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}


func (segment2d Segment2D) label_center(label2d Label2D) Coord {
	sign_measure_height := sign(segment2d.measure.height)	
	segment := segment2d.figure()
	angle_segment := segment.angle()
	distance := 0.5
	rectangle := label2d.figure()
	center_with_distance := rectangle.center_with_distance(distance)
	angle_rotation := angle_polar(math.Pi-(angle_segment+sign_measure_height*math.Pi))
	center_segment := segment.center()
	return center_with_distance.rotation(angle_rotation).addition(center_segment)

}


type Set_Segment2D struct {
	elements map[float64]Segment2D
	dash map[float64]Segment2D
	line map[float64]Segment2D
	label map[float64]Segment2D
	measure map[float64]Segment2D
	measure_label map[float64]Segment2D
	parallel map[float64]Segment2D
}



func (set_segment2d Set_Segment2D) setup_label(set_label2d Set_Label2D) Set_Label2D {
	for _, segment2d := range set_segment2d.label {
		label2d := segment2d.label(set_label2d)
		label2d.center = segment2d.label_center(label2d)
		set_label2d.update(label2d)
	}
	return set_label2d
}

func (set_segment2d Set_Segment2D) setup_measure_label(set_label2d Set_Label2D) Set_Label2D {
	for _, segment2d := range set_segment2d.measure_label {
		label2d := segment2d.measure.label(set_label2d)
		label2d.center = segment2d.measure.label_center(label2d)
		set_label2d.update(label2d)
	}
	return set_label2d
}





func (set_segment2d Set_Segment2D) setup_measure(set_angle2d Set_Angle2D, set_arc2d Set_Arc2D, set_face2d Set_Face2D, set_label2d Set_Label2D, set_path2d Set_Path2D, set_point2d Set_Point2D) {
	height_none := 0.0
	height_marker := 1.0
	//increment := 0.3
	for _, segment2d := range set_segment2d.measure {
		if segment2d.measure.marker == "none" {
			segment2d.measure.height = height_none
		} else {
			segment2d.measure.height = height_marker
		}
		set_segment2d.update(segment2d)
	}

	for _, segment2d := range set_segment2d.measure {
		height := abs(segment2d.measure.height)
		sign_height := sign(segment2d.measure.height)
		sign_height_initial := sign_height
		segment := segment2d.figure()
		angle_start := segment.angle()
		angle_end := angle_polar(-angle_start)
		var set_interval_angle_start Set_Interval_angle
		var set_interval_angle_end Set_Interval_angle

		for _, segment2d_1 := range set_segment2d.elements {
			segment_1 := segment2d_1.figure()
			if segment2d.id != segment2d_1.id && segment.is_contained(segment_1) == false && segment_1.is_contained(segment) == false {
				angle_start_1 := segment_1.angle()
				angle_end_1 := angle_polar(-angle_start_1)

				if segment.start.is_equal(segment_1.start) == true {
					set_interval_angle_start.append(Interval_angle{angle_start_1, 0.0})
				} else if segment.start.is_equal(segment_1.end) == true {
					set_interval_angle_start.append(Interval_angle{angle_end_1, 0.0})
				} else if segment.start.is_contained(segment_1) == true {
					set_interval_angle_start.append(Interval_angle{angle_start_1, 0.0})
					set_interval_angle_start.append(Interval_angle{angle_end_1, 0.0})
				}

				if segment.end.is_equal(segment_1.start) == true {
					set_interval_angle_end.append(Interval_angle{angle_start_1, 0.0})
				} else if segment.end.is_equal(segment_1.end) == true {
					set_interval_angle_end.append(Interval_angle{angle_end_1, 0.0})
				} else if segment.end.is_contained(segment_1) == true {
					set_interval_angle_end.append(Interval_angle{angle_start_1, 0.0})
					set_interval_angle_end.append(Interval_angle{angle_end_1, 0.0})
				}
			}

		}

		for _, arc2d := range set_arc2d.elements {
			arc := arc2d.figure()
			end_arc := arc.end()
			
			if segment.start.is_contained(arc) == true {
				if segment.start.is_equal(arc.center) == true {
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_start+math.Pi/2), 0.0})
				} else if segment.start == end_arc {
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_start-math.Pi/2), 0.0})
				} else if segment.start.is_contained(arc) == true {
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_start+math.Pi/2), 0.0})
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_start-math.Pi/2), 0.0})
				}
			}

			if segment.end.is_contained(arc) == true {
				if segment.end.is_equal(arc.center) == true {
					set_interval_angle_end.append(Interval_angle{angle_polar(angle_end+math.Pi/2), 0.0})
				} else if segment.end == end_arc {
					set_interval_angle_end.append(Interval_angle{angle_polar(angle_end-math.Pi/2), 0.0})
				} else if segment.end.is_contained(arc) == true {
					set_interval_angle_end.append(Interval_angle{angle_polar(angle_end+math.Pi/2), 0.0})
					set_interval_angle_end.append(Interval_angle{angle_polar(angle_end-math.Pi/2), 0.0})
				}
			}
		} 

		for _, angle2d := range set_angle2d.label {
			asector := angle2d.figure()
			angle_start_1 := asector.angle_start()
			angle_end_1 := asector.angle_end()
			angle_1 := asector.angle()
			if segment.start.is_equal(asector.center) == true {
				if is_equal_angle(angle_start, angle_start_1) == true {
					set_interval_angle_start.append(Interval_angle{angle_start, angle_1})
				} else if is_equal_angle(angle_start, angle_end_1) == true {
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_start-angle_1), angle_1})
				}
			} else if segment.end.is_equal(angle2d.center) == true {
				if is_equal_angle(angle_end, angle_start_1) == true {
					set_interval_angle_start.append(Interval_angle{angle_end, angle_end_1})
				} else if is_equal_angle(angle_end, angle_end_1) == true {
					set_interval_angle_start.append(Interval_angle{angle_polar(angle_end-angle_1), angle_1})
				} 
			}
		}
		for _, path2d := range set_path2d.elements {
			vertices := path2d.vertices
			for i := 0; i < len(vertices)-1; i++ {
				edge := Segment{vertices[i], vertices[i+1]}
				if vertices[i].is_equal(segment.start) == true {
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i+1]), 0.0})
				} else if vertices[i].is_equal(segment.end) == true {
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i+1]), 0.0})
				} else if segment.start.is_contained(edge) == true  && segment.start.is_equal(vertices[i+1]) == false {
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i]), 0.0})
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i+1]), 0.0})
				} else if segment.end.is_contained(edge) == true  && segment.end.is_equal(vertices[i+1]) == false {
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i]), 0.0})
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i+1]), 0.0})
				}
			}
			if vertices[len(path2d.vertices)-1].is_equal(segment.start) == true {
				set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[len(vertices)-1]), 0.0})
			} else if vertices[len(vertices)-1].is_equal(segment.end) == true {
				set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[len(vertices)-1]), 0.0})
			}
		}
		for _, face2d := range set_face2d.elements {
			vertices := append(face2d.vertices, face2d.vertices[0])
			for i := 0; i < len(vertices)-1; i++ {
				edge := Segment{vertices[i], vertices[i+1]}
				if vertices[i].is_equal(segment.start) == true {
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i+1]), 0.0})
				} else if vertices[i].is_equal(segment.end) == true {
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i+1]), 0.0})
				} else if segment.start.is_contained(edge) == true && segment.start.is_equal(vertices[i+1]) == false {
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i]), 0.0})
					set_interval_angle_start.append(Interval_angle{segment.start.vector_angle(vertices[i+1]), 0.0})
				} else if segment.end.is_contained(edge) == true && segment.end.is_equal(vertices[i+1]) == false {
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i]), 0.0})
					set_interval_angle_end.append(Interval_angle{segment.end.vector_angle(vertices[i+1]), 0.0})
				}
			}
		}

		set_interval_angle_start.union()
		set_interval_angle_end.union()
		
		if len(set_interval_angle_start.elements) !=0 && len(set_interval_angle_end.elements) != 0 {
			if angle_start <= math.Pi/2 || 3*math.Pi/2 < angle_start {
				sign_height = 1.0
			} else {
				sign_height = -1.0
			}
		} else {
			angle_start_left := []float64{0.0}
			angle_start_right := []float64{0.0}
			for _, interval_angle := range set_interval_angle_start.elements {
				if angle_polar(interval_angle.start-angle_start) <= math.Pi {
					angle_start_left = append(angle_start_left,angle_polar(interval_angle.start-angle_start))
				}
				if angle_polar(interval_angle.size-angle_start) <= math.Pi {
					angle_start_left = append(angle_start_left, angle_polar(interval_angle.size-angle_start))
				}
				if angle_polar(angle_start-interval_angle.start) <= math.Pi {
					angle_start_right = append(angle_start_right, angle_polar(angle_start-interval_angle.start))
				}
				if angle_polar(angle_start-interval_angle.size) <= math.Pi {
					angle_start_right = append(angle_start_right, angle_polar(angle_start-interval_angle.size))
				}
			}
			angle_start_left = array_unique(angle_start_left)
			angle_start_right = array_unique(angle_start_right)

			angle_end_left := []float64{0}
			angle_end_right := []float64{0}
			for _, interval_angle := range set_interval_angle_end.elements {
				if angle_polar(interval_angle.start-angle_start) <= math.Pi {
					angle_start_left = append(angle_end_left,angle_polar(interval_angle.start-angle_start))
				}
				if angle_polar(interval_angle.size-angle_start) <= math.Pi {
					angle_start_left = append(angle_start_left, angle_polar(interval_angle.size-angle_start))
				}
				if angle_polar(angle_start-interval_angle.start) <= math.Pi {
					angle_start_right = append(angle_start_right, angle_polar(angle_start-interval_angle.start))
				}
				if angle_polar(angle_start-interval_angle.size) <= math.Pi {
					angle_start_right = append(angle_start_right, angle_polar(angle_start-interval_angle.size))
				}
			}
			angle_end_left = array_unique(angle_end_left)
			angle_end_right = array_unique(angle_end_right)

			angle_start_left_max := max(angle_start_left)
			angle_start_right_max := max(angle_start_right)
			angle_end_left_max := max(angle_end_left)
			angle_end_right_max := max(angle_end_right)

			angle_left_max := max(angle_start_left_max, angle_end_left_max)
			angle_right_max := max(angle_start_right_max, angle_end_right_max)

			if angle_left_max < angle_right_max {
				sign_height = 1.0
			} else if angle_left_max > angle_right_max {
				sign_height = -1.0
			} else {
				if is_equal_angle(angle_start_left_max, angle_right_max) == true && is_equal_angle(angle_start_right_max, angle_left_max) == true && (is_equal(angle_end_left_max, angle_left_max) == false || is_equal_angle(angle_end_right_max, angle_right_max) == false) {
					if angle_end_left_max < angle_end_right_max {
						sign_height = 1.0
					} else if angle_end_left_max > angle_end_right_max {
						sign_height = -1.0
					}
				} else if (is_equal_angle(angle_start_left_max, angle_right_max) == false || is_equal_angle(angle_start_right_max, angle_left_max) == false) && is_equal_angle(angle_end_left_max, angle_left_max) == true && is_equal_angle(angle_end_right_max, angle_right_max) == true {
					if angle_start_left_max < angle_start_right_max {
						sign_height = 1.0
					} else if angle_start_left_max > angle_start_right_max {
						sign_height = -1.0
					} 
				} else if is_equal_angle(angle_start_left_max, angle_right_max) == true && is_equal_angle(angle_start_right_max, angle_left_max) == false && is_equal_angle(angle_end_left_max, angle_left_max) == true && is_equal_angle(angle_end_right_max, angle_right_max) == false {
					if angle_start_right_max < angle_end_right_max {
						sign_height = 1.0
					} else if angle_start_right_max > angle_end_right_max {
						sign_height = -1.0
					}
				} else if is_equal_angle(angle_start_left_max, angle_right_max) == false && is_equal_angle(angle_start_right_max, angle_left_max) == true && is_equal_angle(angle_end_left_max, angle_left_max) == false && is_equal_angle(angle_end_right_max, angle_right_max) == true {
					if angle_start_left_max < angle_end_left_max {
						sign_height = 1.0
					} else if angle_start_left_max > angle_end_left_max {
						sign_height = -1.0
					}

				}
			}

			if len(set_angle2d.elements) != 0 && min(angle_start_left_max, angle_start_right_max, angle_end_left_max, angle_end_right_max) > 0 && is_equal_angle(angle_start_left_max, angle_start_right_max) == true && is_equal_angle(angle_start_left_max, -angle_start_right_max) == true && is_equal_angle(angle_end_left_max, angle_end_right_max) == true && is_equal_angle(angle_end_left_max, -angle_end_right_max) == true {
				is_visible_start_left := false
				is_visible_start_right := false
				is_visible_end_left := false
				is_visible_end_right := false
				for _, angle2d := range set_angle2d.elements {
					asector := angle2d.figure()
					angle_start_1 := asector.angle_start()
					angle_end_1 := asector.angle_end()
					if segment.start.is_equal(asector.center) == true {
						if is_equal_angle(angle_end, angle_end_1) == true && is_equal_angle(angle_start+angle_start_left_max, angle_start_1) == true {
							is_visible_start_left = true
						} else if is_equal_angle(angle_end, angle_start_1) == true && is_equal_angle(angle_start-angle_start_right_max, angle_end_1) == true {
							is_visible_start_right = true
						}
					} else if segment.end.is_equal(asector.center) == true {
						if is_equal_angle(angle_start, angle_end_1) == true && is_equal_angle(angle_end+angle_end_left_max, angle_start_1) == true {
							is_visible_end_left = true
						} else if is_equal_angle(angle_start,angle_start_1) == true && is_equal_angle(angle_end-angle_end_right_max, angle_end_1) == true {
							is_visible_end_right = true
						}
					}
				}

				if (is_visible_start_left == true || is_visible_end_right == true) && is_visible_start_right == false && is_visible_end_left == false {
					sign_height = 1.0
				} else if is_visible_start_left == false && is_visible_end_right == false && (is_visible_start_right == true || is_visible_end_left == true) {
					sign_height = -1.0
				}
			}
		}
	
		sign_height = segment2d.arm_sign(set_arc2d, set_face2d, set_path2d, set_segment2d)
	
		if len(set_face2d.elements) > 0 {
			
			//polygon := face2d.polygon()
			is_point_contained := false
			for _, point2d := range set_point2d.elements {
				if point2d.coord.is_contained_strictly(segment) == true {
					is_point_contained = true
					break
				}
			}
			if is_point_contained == false {
				For:
				for _, face2d := range set_face2d.elements {
					vertices := append(face2d.vertices, face2d.vertices[0])
					center := face2d.figure().centroid_vertices()
					for i := 0; i < len(face2d.vertices); i++ {
						if segment.is_contained(Segment{vertices[i], vertices[i+1]}) == true {
							angle := angle_polar(center.vector_angle(segment.end)-center.vector_angle(segment.start))
							if angle < math.Pi {
								sign_height = -1.0
							} else if math.Pi < angle {
								sign_height = 1.0
							}
							break For

						}
					}

				}
			}
		}
		
	


		//segment가 원에 포함되고 한 점이 원의 중심인 삼각형일 경우  measure height sign 결정
				
		for _, angle2d := range set_angle2d.elements {
			for _, arc2d := range set_arc2d.elements {
				arc := arc2d.figure()
				if angle2d.center.is_equal(arc.center) == true {
					if segment.start.is_equal(angle2d.center) == true && segment.end.is_equal(angle2d.start) {
						if arc.angle < math.Pi {
							sign_height = 1.0
						} else {
							sign_height = -1.0
						}
					} else if segment.end.is_equal(angle2d.center) == true && segment.start.is_equal(angle2d.start) == true {
						if arc.angle < math.Pi {
							sign_height = -1.0
						} else {
							sign_height = 1.0
						}
					}
				}	
			}
		}
		//segment의 양끝점이 두 평행선 위에 있을 경우 measure height sign 결정
		if len(set_segment2d.line) >= 2 {
			var pairs [][]Segment
			var lines []Segment
			for _, segment2d_1 := range set_segment2d.line {
				lines = append(lines, segment2d_1.figure())
			}
			
			for i := 0; i < len(lines); i++ {
				for j := i+1; j < len(lines); j++ {
					if lines[i].is_parallel(lines[j]) == true {
						pairs = append(pairs, []Segment{lines[i], lines[j]})
					}
				}
			}

			if len(pairs) > 0 {
				angle_start := segment.angle()
				for _, pair := range pairs {
					if (segment.start.is_contained(pair[0]) == true && segment.end.is_contained(pair[1]) == true) || (segment.start.is_contained(pair[1]) == true && segment.end.is_contained(pair[0]) == true) {
						sign_height = sign(math.Pi-angle_start)
					
					}
				}
			}
		}

		if sign_height != sign_height_initial {
			segment2d.measure.height = sign_height*height
		}


		//segment위에 한 끝점이 있는 다른 segment measure가 visible이고 그런 모든 segment의 방향이 같은 경우
		if len(set_segment2d.measure) > 0 {
			angle_segment := segment.angle()
			var sign_measure float64
			for _, segment2d_1 := range set_segment2d.measure {
				segment_1 := segment2d_1.figure()
				angle_segment_1 := segment_1.angle()
				if segment2d.id != segment2d_1.id && segment.is_contained(segment_1) == false && segment_1.is_contained(segment) == false && segment.is_overlap(segment_1) == false {
					if segment_1.start.is_contained_strictly(segment) == true {
						angle := angle_polar(angle_segment_1-angle_segment)
						sign_measure = sign_angle(angle)
						
					} else if segment_1.end.is_contained_strictly(segment) == true {
						angle := angle_polar(-angle_segment_1-angle_segment)
						sign_measure = sign_angle(angle)
					}
				}
				if sign_measure == 0.0 {
					break
				}
			}
			sign_height = -sign_measure
			
		}

		if sign_height != sign_height_initial {
			segment2d.measure.height = sign_height*height
			set_segment2d.update(segment2d)
		}
	}

	//segment measure가 포함관계를 가질 때 measure height의 방향 결정
		

	for _, segment2d := range set_segment2d.measure {
		segment := segment2d.figure()
		angle := segment.angle()
		sign_height := sign(segment2d.measure.height)
		for _, segment2d_1 := range set_segment2d.measure {
			segment_1 := segment2d_1.figure()
			angle_1 := segment.angle()
			sign_height_1 := sign(segment2d_1.measure.height)
			if segment2d.id != segment2d_1.id {
				
				if segment.is_contained(segment_1) == true && ((is_equal_angle(angle, angle_1) == true && sign_height == sign_height_1) || (is_equal_angle(angle, -angle_1) == true && sign_height == -sign_height_1)) {
					segment2d.measure.height *= -1.0
				}
			}
		}
		set_segment2d.update(segment2d)
	}

	//segment의 measure가 나타나는 경우 measure에 label이 겹칠 때  height 조정

	for _, segment2d := range set_segment2d.measure {
		height := abs(segment2d.measure.height)
		segment := segment2d.figure()
		center := segment.center()
		sign_height := sign(segment2d.measure.height)
		length := segment.length()
		angle := segment.angle()
		radius_measure := (pow(height,2)+pow(length/2,2))/(2*height)
		radius_center := radius_measure-height 
		angle_center := angle-sign_height*math.Pi/2
		center_measure := Coord{radius_center*cos(angle_center), radius_center*sin(angle_center)}
						
						
		if height == 0.0 {
			for _, segment2d_1 := range set_segment2d.measure_label {
				segment_1 := segment2d_1.figure()
				if segment2d.id != segment2d_1.id && segment_1.is_contained(segment) == true {
					angle_1 := segment_1.angle()
					sign_height_1 := sign(1.0)
					if (is_equal_angle(angle_1,angle) == true && sign_height == sign_height_1) || (is_equal_angle(angle_1-angle,math.Pi) == true && sign_height != sign_height_1) {
						//length_1 := segment_1.length()
						center_1 := segment_1.center()
						label2d_1 := segment2d_1.label(set_label2d)
						radius_addition_1 := height+1+label2d_1.size().norm()/2 
						angle_addition_1 := angle_1+sign_height_1*math.Pi/2
						boundary_1 := center_1.addition(Coord{radius_addition_1*cos(angle_addition_1), radius_addition_1*sin(angle_addition_1)})
						height = max(height, center_measure.distance(boundary_1)-radius_center) 
					}
				}
			}
		}
		var interval_angle Interval_angle
		if sign_height < 0 {
			interval_angle.start = center.vector_angle(segment.start)
		} else {
			interval_angle.start = center.vector_angle(segment.end)
		}
		interval_angle.size = math.Pi
		
		for _, label2d := range set_label2d.elements {
			angle_label := center_measure.vector_angle(label2d.center)
			if interval_angle.is_containing(angle_label) == true {
				length_label := center_measure.vector_angle(label2d.center)
				if abs(radius_measure-length_label) < 1 {
					height = max(height, length_label-radius_center)
				}
			}
		}
		segment2d.measure.height = sign_height*height
		set_segment2d.update(segment2d)

		
	}

	for _, segment2d := range set_segment2d.measure {
		if segment2d.measure.height == 0.0 {
			segment2d.measure.color = segment2d.color
			set_segment2d.update(segment2d)
		}
		
	}
}



func (set_segment2d Set_Segment2D) setup_parallel() {
	for _, segment2d := range set_segment2d.parallel {
		for _, segment2d_1 := range set_segment2d.parallel {
			if segment2d.id != segment2d_1.id && segment2d.figure().is_contained(segment2d_1.figure()) == true {
				segment2d.parallel = "none"
				set_segment2d.update(segment2d)
				break
			}
		}
	}
}

func (set_segment2d Set_Segment2D) sort(set_label2d Set_Label2D, bounds Bounds) {
	for _, segment2d := range set_segment2d.elements {
		if segment2d.dash != "" {
			set_segment2d.dash[segment2d.id] = segment2d
		}
		if is_null(segment2d.label(set_label2d)) == false {
			set_segment2d.label[segment2d.id] = segment2d
		}
		if is_null(segment2d.measure) == false {
			set_segment2d.measure[segment2d.id] = segment2d
			if is_null(segment2d.measure.label(set_label2d)) == false {
				set_segment2d.measure_label[segment2d.id] = segment2d
			}
		}
		if segment2d.parallel != "none" {
			set_segment2d.parallel[segment2d.id] = segment2d
		}
		if segment2d.figure().is_line(bounds) == true {
			set_segment2d.line[segment2d.id] = segment2d
		}
	}

} 

func (set_segment2d Set_Segment2D) update(segment2d Segment2D) {
	set_segment2d.elements[segment2d.id] = segment2d
	set_segment2d.dash[segment2d.id] = segment2d
	set_segment2d.line[segment2d.id] = segment2d
	set_segment2d.label[segment2d.id] = segment2d
	set_segment2d.measure[segment2d.id] = segment2d
	set_segment2d.measure_label[segment2d.id] = segment2d
	set_segment2d.parallel[segment2d.id] = segment2d
}