package Cartesian2D

import (
	"math"
)

type Angle2D struct {
	center Coord
	start Coord
	end Coord
	height float64
	color string
	interactive bool
	marker string
	

	id float64
	
}




func (angle2d Angle2D) figure() Asector {
	var asector Asector
	asector.center = angle2d.center
	asector.start = angle2d.start
	asector.end = angle2d.end
	if angle2d.marker != "right" {
		asector.height = angle2d.height
	} else {
		asector.height = 2*angle2d.height*abs(cos(angle2d.figure().angle()))
	}
	return asector
}





func (angle2d Angle2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if angle2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}


func (angle2d Angle2D) label_center(label2d Label2D) Coord {
	interval_angle := angle2d.figure().interval_angle()
	rectangle := label2d.figure()
	return rectangle.center_between_halflines(angle2d.center, interval_angle, angle2d.height)
}

type Set_Angle2D struct {
	elements map[float64]Angle2D
	
	arc map[float64]Angle2D
	nonarc map[float64]Angle2D
	not_arc map[float64]Angle2D
	color map[float64]Angle2D
	interactive map[float64]Angle2D
	label map[float64]Angle2D
	marker map[float64]Angle2D
	marker_none map[float64]Angle2D
	right map[float64]Angle2D
}


func (set_angle2d Set_Angle2D) sort(set_label2d Set_Label2D) {

	markers_arc := []string{"none","single","double","triple"}
	for _, angle2d := range set_angle2d.elements {
		if angle2d.color != "" {
			set_angle2d.color[angle2d.id] = angle2d
		}
		if angle2d.interactive == true {
			set_angle2d.interactive[angle2d.id] = angle2d
		}

		if is_null(angle2d.label(set_label2d)) == false {
			set_angle2d.label[angle2d.id] = angle2d
		}
		if angle2d.marker == "right" {
			set_angle2d.right[angle2d.id] = angle2d
			set_angle2d.not_arc[angle2d.id] = angle2d
		} else {
			if angle2d.marker == "none" {
				set_angle2d.marker_none[angle2d.id] = angle2d
			} else {
				set_angle2d.marker[angle2d.id] = angle2d
			}

			if in_array(angle2d.marker, markers_arc) == true {
				set_angle2d.arc[angle2d.id] = angle2d
			} else {
				set_angle2d.nonarc[angle2d.id] = angle2d
				set_angle2d.not_arc[angle2d.id] = angle2d
			}
		}
	}
}

func (set_angle2d Set_Angle2D) setup_height() {

	height := 1.0
	height_marker_none := 0.0
	height_right := height*sqrt(2)

	for _, angle2d := range set_angle2d.right {
		angle2d.height = height_right
		set_angle2d.update(angle2d)
	}

	for _, angle2d := range set_angle2d.marker {
		set_angle2d.update(angle2d)
	}

	for _, angle2d := range set_angle2d.marker_none {
		if angle2d.figure().angle() < math.Pi {
			if angle2d.interactive == true || angle2d.color != "" {
				angle2d.height = height
			} else {
				angle2d.height = height_marker_none
			}
		} else {
			angle2d.height = height
		}
		set_angle2d.update(angle2d)
	}
}

func (set_angle2d Set_Angle2D) setup_label(set_label2d Set_Label2D) Set_Label2D {
	for _, angle2d := range set_angle2d.label {
		label2d := angle2d.label(set_label2d) 
		label2d.center = label2d.figure().center_between_halflines(angle2d.center,angle2d.figure().interval_angle(),angle2d.height)
		set_label2d.update(label2d)

	}
	return set_label2d
}

func (set_angle2d Set_Angle2D) setup_angle2d_arc(set_label2d Set_Label2D) Set_Label2D {
	var angle2ds_arc []Angle2D
	increment := 0.15
	for _, angle2d := range set_angle2d.arc {
		asector := angle2d.figure()
		index := 0
		for _, angle2d_1 := range set_angle2d.arc {
			asector_1 := angle2d.figure()
			if angle2d.id != angle2d_1.id && (asector.angle_start() > asector_1.angle_start() || asector.angle_start() == asector_1.angle_start() && asector.angle() > asector_1.angle()) {
				index++
			}

		}
		angle2ds_arc[index] = angle2d

	}

	

	for i := 0; i < len(angle2ds_arc); i++ {
		angle2d := angle2ds_arc[i]
		asector := angle2d.figure()
		label2d := angle2d.label(set_label2d)
		if is_null(label2d) == false {
			angle := asector.angle()
			angle_start := asector.angle_start()
			angle_end := asector.angle_end()
			rectangle := label2d.figure()
			label2d.center = rectangle.center_between_halflines(asector.center, asector.interval_angle(), asector.height)
			vertices := rectangle.vertices()
			distance_max := 0.0
			for _, vertex := range vertices {
				distance_max = max(distance_max, asector.center.distance(vertex))
			}

			radii_arc := []float64{0}
			radii_not_arc := []float64{0}
			var angles_point []float64
			var angles_label []float64
			for _, angle2d_1 := range set_angle2d.not_arc {
				asector_1 := angle2d_1.figure()
				if asector.is_overlap(asector_1) == true {
					
					label2d_1 := angle2d_1.label(set_label2d)
					if is_null(label2d_1) == true {
						radii_not_arc = append(radii_not_arc, angle2d_1.height)
					} else {
						angle_start_1 := asector_1.angle_start()
						angle_end_1 := asector_1.angle_end()
						angle_point := angle_polar(angle_start_1-angle_start)
						if angle_point <= angle {
							angles_point = append(angles_point, angle_point)
						}
						angle_point = angle_polar(angle_end_1-angle_end)
						if angle_point <= angle {
							angles_point = append(angles_point, angle_point)
						}
						angle_label := angle_polar(asector_1.center.vector_angle(label2d_1.center)-angle_start)
						if angle_label <= angle {
							angles_label = append(angles_label, angle_label)
						}
						rectangle_1 := label2d_1.figure()
						label2d_1.center = rectangle_1.center_between_halflines(asector_1.center, asector_1.interval_angle(), asector_1.height)
						vertices_1 := rectangle_1.vertices()
						distance_max_1 := 0.0
						for _, vertex_1 := range vertices_1 {
							distance_max_1 = max(distance_max_1, angle2d_1.center.distance(label2d_1.center.addition(vertex_1)))
						}
						if (asector_1.height <= asector.height && asector.height <= asector_1.height) || (asector_1.height <= distance_max && distance_max <= distance_max_1) {
							radii_not_arc = append(radii_not_arc, distance_max_1)
					
						}
					}
				}
			}

			for j := 0; j < i; j++ {
				angle2d_1 := angle2ds_arc[j]
				asector_1 := angle2d_1.figure()
				if asector.is_overlap(asector_1) == true {
					label2d_1 := angle2d_1.label(set_label2d)
					if is_null(label2d_1) == false {
						angle_start_1 := asector_1.angle_start()
						angle_end_1 := asector_1.angle_end()
						angle_point := angle_polar(angle_start_1-angle_start)
						if angle_point <= angle {
							angles_point = append(angles_point, angle_point)
						}
						angle_point = angle_polar(angle_end_1-angle_end)
						if angle_point <= angle {
							angles_point = append(angles_point, angle_point)
						}
						angle_label := angle_polar(asector_1.center.vector_angle(label2d_1.center)-angle_start)
						if angle_label <= angle {
							angles_label = append(angles_label, angle_label)
						}
						rectangle_1 := label2d_1.figure()
						label2d_1.center = rectangle_1.center_between_halflines(asector_1.center, asector_1.interval_angle(), asector_1.height)
						vertices_1 := rectangle_1.vertices()
						distance_max_1 := 0.0
						for _, vertex_1 := range vertices_1 {
							distance_max_1 = max(distance_max_1, asector_1.center.distance(label2d_1.center.addition(vertex_1)))
						}
						if (asector_1.height <= asector.height && asector.height <= asector_1.height) || (asector_1.height <= distance_max && distance_max <= distance_max_1) {
							radii_arc = append(radii_not_arc, distance_max_1)
						}
						
					}
				}
			}
			if len(radii_arc) != 0 {
				angle2d.height = max(angle2d.height,max(radii_not_arc),max(radii_arc)+increment)
			}
			angle2d_part := angle2d
			angle2d_part.height = max(angle2d.height, max(radii_not_arc)+increment, max(radii_arc)+increment)
			if len(angles_point) != 0 {
				angles_point = append(angles_point, 0.0)
				angles_point = append(angles_point, angle)
				angles_point = array_sort(angles_point)
				angles_label = array_sort(angles_label)

				var angles_point_occupied []float64
				for j := 0; j < len(angles_point); j++ {
					is_label_occupied := false
					angle_point := angle_polar(angles_point[j+1] - angles_point[j]) 
					for k := 0; k < len(angles_label); k++ {
						if angle_polar(angles_label[k]-angles_point[j]) <= angle_point {
							is_label_occupied = true
							break
						}
					}
					if is_label_occupied == false {
						angles_point_occupied = append(angles_point_occupied, angle_point)
					} else {
						angles_point_occupied = append(angles_point_occupied, 0.0)
					}
				}
				key := 0
				if len(angles_point_occupied) != 0 {
					key_start := 1
					for j := 0; j < len(angles_point_occupied); j++ {
					
						for k := key_start; k < len(angles_point_occupied); k++ {
							if angles_point_occupied[j] < angles_point_occupied[k] {
								key = k
								key_start = k+1
								break
							}
						}
					}
				}

				angle_start = angle_polar(angle_start+angles_point[key])
				angle = angle_polar(angles_point[key+1]-angles_point[key])

			}

			label2d.center = rectangle.center_between_halflines(angle2d_part.center, Interval_angle{angle_start, angle}, angle2d_part.height)
			set_label2d.update(label2d)
		}
		
	}

	if len(set_angle2d.interactive)+len(set_angle2d.color) >= len(set_angle2d.elements) {
		angle := deg2rad(40)
		for _, angle2d := range set_angle2d.arc {
			angle2d.height = angle2d.height+max(0, (angle-angle2d.figure().angle())/angle)
			set_angle2d.update(angle2d)
		}
	}

	return set_label2d
}

func (set_angle2d Set_Angle2D) update(angle2d Angle2D) {
	set_angle2d.elements[angle2d.id] = angle2d
	set_angle2d.arc[angle2d.id] = angle2d
	set_angle2d.nonarc[angle2d.id] = angle2d
	set_angle2d.not_arc[angle2d.id] = angle2d
	set_angle2d.color[angle2d.id] = angle2d
	set_angle2d.interactive[angle2d.id] = angle2d
	set_angle2d.label[angle2d.id] = angle2d
	set_angle2d.marker[angle2d.id] = angle2d
	set_angle2d.marker_none[angle2d.id] = angle2d
	set_angle2d.right[angle2d.id] = angle2d
}