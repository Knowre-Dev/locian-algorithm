package Cartesian2D

type MeasureArc2D struct {
	center Coord
	start_segment Coord
	angle float64
	height float64
	

	id float64
	
}

func (measure_arc2d MeasureArc2D) figure() Arc {
	arc := Arc{}
	arc.center = measure_arc2d.center
	
	radius := measure_arc2d.center.distance(measure_arc2d.start_segment)+measure_arc2d.height
	angle := measure_arc2d.center.vector_angle(measure_arc2d.start_segment)
	vector := Coord{radius*cos(angle), radius*sin(angle)}
	arc.start = measure_arc2d.center.addition(vector)
	arc.angle = measure_arc2d.angle
	return arc
}

func (measurearc2d MeasureArc2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if measurearc2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}

func (measure_arc2d MeasureArc2D) label_center(label2d Label2D) Coord {
	arc := measure_arc2d.figure()
	rectangle := label2d.figure()
	angle_chord := arc.center.vector_angle(arc.start)+arc.angle/2
	rectangle.angle = -angle_chord
	distance := 0.5
	vector_center := rectangle.center_with_distance(distance).rotation(angle_chord,Coord{0,0})
	return arc.center_on().addition(vector_center)
}






