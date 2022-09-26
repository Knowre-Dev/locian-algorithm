package Cartesian2D 

import (
	"math"
)

type Point2D struct {
	coord Coord
	
	id float64
	
}

func (point2d Point2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if point2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}


func (point2d Point2D) segments_measure_direction_number(set_segment2d Set_Segment2D) int {
	var segment2ds []Segment2D
	for _, segment2d := range set_segment2d.measure {
		if point2d.coord.is_contained_strictly(segment2d.figure()) == true {
			segment2ds = append(segment2ds, segment2d)
		}
	}
	number := 0
	if len(segment2ds) >= 2 {
		number++
		for i := 0; i < len(segment2ds); i++ {
			segment := segment2ds[i].figure()
			angle := segment.angle()
			sign_height := sign(segment2ds[i].measure.height)
			number_different := 0
			for j := 0; j < i; j++ {
				segment_1 := segment2ds[j].figure()
				angle_1 := segment_1.angle()
				sign_height_1 := sign(segment2ds[j].measure.height)
				if (is_equal_angle(angle, angle_1) == false && is_equal_angle(angle, -angle_1) == false) || (is_equal_angle(angle, angle_1) == true && sign_height == sign_height_1) || (is_equal_angle(angle, -angle_1) == true && sign_height == sign_height) {
					number_different++
				}
			}
			if number_different == i-1 {
				number++
			}
		}
	}

	return number

		

	

}


type Set_Point2D struct {
	elements map[float64]Point2D
	label map[float64]Point2D
}





func (set_point2d Set_Point2D) setup_label(set_angle2d Set_Angle2D, set_arc2d Set_Arc2D, set_face2d Set_Face2D, set_label2d Set_Label2D, set_segment2d Set_Segment2D) Set_Label2D {
	for _, point2d := range set_point2d.elements {
		label2d := point2d.label(set_label2d)
		distance_label := 0.25
		//radius_label := 0.5
		//angle_label := math.Pi/2
		var intervals_angle_forbidden Set_Interval_angle
		number_direction := point2d.segments_measure_direction_number(set_segment2d)
		for _, segment2d := range set_segment2d.elements {
			segment := segment2d.figure()
			if point2d.coord.is_contained(segment) == true {
				if point2d.coord.is_equal(segment.start) == true {
					angle_start := segment.angle()
					intervals_angle_forbidden.append(Interval_angle{angle_start, 0.0})
					if is_null(segment2d.measure) == false {
						intervals_angle_forbidden.append(Interval_angle{segment2d.measure.figure().angle_start(), 0.0})
					}
				} else if point2d.coord.is_equal(segment.end) == true {
					angle_end := angle_polar(-segment.angle())
					intervals_angle_forbidden.append(Interval_angle{angle_end, 0.0})
					if is_null(segment2d.measure) == false {
						intervals_angle_forbidden.append(Interval_angle{segment2d.measure.figure().angle_end(), 0.0})
					}
				} else {
					angle_start := segment.angle()
					angle_end := angle_polar(-angle_start)

					intervals_angle_forbidden.append(Interval_angle{angle_start, 0.0})
					intervals_angle_forbidden.append(Interval_angle{angle_end, 0.0})
					if is_null(segment2d.measure) == false {
						if number_direction == 1 {
							if segment2d.measure.height > 0.0 {
								intervals_angle_forbidden.append(Interval_angle{angle_end, math.Pi})
							} else if segment2d.measure.height < 0.0 {
								intervals_angle_forbidden.append(Interval_angle{angle_start, math.Pi})
							}
						} else if number_direction >= 2 {
							diagonal_half := label2d.size().norm()/2
							margin := 0.25
							distance := point2d.coord.distance_bezier(segment2d.measure.figure())
							length := distance+diagonal_half+margin
							if length <= distance {
								intervals_angle_forbidden.append(Interval_angle{angle_polar(angle_end-math.Pi/4), math.Pi/2})
							} else {
								height := abs(segment2d.measure.height)
								sign_height := sign(segment2d.measure.height)
								length_segment := segment.length()
								length_start := point2d.coord.distance(segment.start)
								length_end := length_segment-length_start
								length_min := min(length_start, length_end)
								a := length_segment+4*height
								b := -4*height
								c := length_min
								solutions := solutions_quadratic(a, b, c)
								var t float64
								for _, solution := range solutions {
									if 0 <= solution && solution <= 1 {
										t = solution
										break
									}
								}

								var size Coord
								size.x = 4*t*(1-t)*height-length_min
								size.y = length_segment*pow(t, 2)
								if length <= size.norm() {
									if sign_height > 0.0 {
										if length_start <= length_end {
											intervals_angle_forbidden.append(Interval_angle{angle_polar(angle_start-math.Pi/2), math.Pi/2})
										} else {
											intervals_angle_forbidden.append(Interval_angle{angle_end, math.Pi/2})
										}
									} else if sign_height < 0 {
										if length_start <= length_end {
											intervals_angle_forbidden.append(Interval_angle{angle_start, math.Pi/2})
										} else {
											intervals_angle_forbidden.append(Interval_angle{angle_polar(angle_end-math.Pi/2), math.Pi/2})
										}
									}

								} else {
									if sign_height > 0 {
										intervals_angle_forbidden.append(Interval_angle{angle_end, math.Pi})
									} else if sign_height < 0 {
										intervals_angle_forbidden.append(Interval_angle{angle_polar(-angle_end), math.Pi})
									}
								}


							}
						}
					}
				}
			}
		}

		for _, face2d := range set_face2d.elements {
			for _, vertex := range face2d.vertices {
				if label2d.id_object == face2d.id && point2d.coord.is_equal(vertex) == true && point2d.coord.distance(label2d.center) < 3 {
					intervals_angle_forbidden.append(Interval_angle{point2d.coord.vector_angle(label2d.center), 0.0})
					break
				}
			}
		}


		angle_1 := deg2rad(5)
		for _, arc2d := range set_arc2d.elements {
			arc := arc2d.figure()
			angle := arc2d.center.vector_angle(point2d.coord)
			if point2d.coord.is_equal(arc.center) {
				if is_null(arc2d.measure) == false {
					intervals_angle_forbidden.append(Interval_angle{angle, math.Pi/2})
				} else {
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle+math.Pi/2), 0.0})
				}
			} else if point2d.coord.is_equal(arc.end()) {
				if is_null(arc2d.measure) == false {
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle-math.Pi/2), math.Pi/2})
				} else {
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle-math.Pi/2), 0.0})
				}
			}

			if point2d.coord.is_contained(arc) == true {
				if is_null(arc2d.measure) == false {
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle-math.Pi/2), math.Pi})
				} else {
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle-math.Pi/2-angle_1), angle_1})
					intervals_angle_forbidden.append(Interval_angle{angle_polar(angle+math.Pi/2), angle_1})
				}
			}
		}

		var intervals_angle_forbidden_angle2d Set_Interval_angle 
		for _, angle2d := range set_angle2d.elements {
			asector := angle2d.figure()
			if point2d.coord.is_equal(asector.center) == true {
				intervals_angle_forbidden_angle2d.append(Interval_angle{asector.angle_start(), asector.angle()})
			} else if point2d.coord.is_contained_strictly(Segment{asector.center, asector.start}) {
				intervals_angle_forbidden.append(Interval_angle{asector.angle_start(), math.Pi})
			} else if point2d.coord.is_contained_strictly(Segment{asector.center, asector.end}) {
				intervals_angle_forbidden.append(Interval_angle{asector.angle_start()-math.Pi, math.Pi})
			}
		}

		var interval_angle_max Interval_angle
		if intervals_angle_forbidden_angle2d.is_full() == true {
			intervals_angle_forbidden.elements = append(intervals_angle_forbidden.elements, intervals_angle_forbidden_angle2d.elements...)
			interval_angle_max = intervals_angle_forbidden.complement().max()
		} else {
			distance_label = 0.25
			interval_angle_max = intervals_angle_forbidden.complement().max()
		}
		label2d.center = label2d.figure().center_between_halflines(point2d.coord, interval_angle_max, distance_label)
		set_label2d.update(label2d)
	}
	return set_label2d
}

func (set_point2d Set_Point2D) sort(set_label2d Set_Label2D) {
	for _, point2d := range set_point2d.label {
		if is_null(point2d.label(set_label2d)) == false {
			set_point2d.label[point2d.id] = point2d
		}
	}

}



func (set_point2d Set_Point2D) update(point2d Point2D) {
	set_point2d.elements[point2d.id] = point2d
	set_point2d.label[point2d.id] = point2d
}