package Cartesian2D

type Arc2D struct {
	center Coord
	start Coord
	angle float64
	dash string
	measure MeasureArc2D
	
	id float64
	
}



func (arc2d Arc2D) figure() Arc {
	arc := Arc{}
	arc.center = arc2d.center
	arc.start = arc2d.start
	arc.angle = arc2d.angle
	return arc
}

func (arc2d Arc2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if arc2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}

func (arc2d Arc2D) label_center(label2d Label2D) Coord {
	interval_angle := arc2d.figure().interval_angle()
	rectangle := label2d.figure()
	return rectangle.center_between_halflines(arc2d.center, interval_angle, arc2d.figure().radius())

}



type Set_Arc2D struct {
	elements map[float64]Arc2D

	dash map[float64]Arc2D
	label map[float64]Arc2D
	measure map[float64]Arc2D
	measure_label map[float64]Arc2D

}

func (set_arc2d Set_Arc2D) initialization() {
	increment_overlap := 0.125
	increment_contained := 0.125
	increment_contained_label := 0.5
	for _, arc2d := range set_arc2d.measure {
		arc := arc2d.figure()
		for _, arc2d_1 := range set_arc2d.measure {
			arc_1 := arc2d_1.figure()
			if arc2d.id != arc2d_1.id {
				if arc_1.is_overlap(arc) == true && arc.is_contained(arc_1) == false && arc_1.is_contained(arc) == false && is_equal(arc2d.measure.height, arc2d_1.measure.height) == true && arc.angle > arc_1.angle {
					arc2d.measure.height += increment_overlap
					
				}
			}
		}
		set_arc2d.update(arc2d)
	}

	for _, arc2d := range set_arc2d.measure_label {
		arc := arc2d.figure()
		for _, arc2d_1 := range set_arc2d.measure_label {
			arc_1 := arc2d_1.figure()
			if arc2d.id != arc2d_1.id && arc_1.is_contained(arc) == true && arc_1.angle < arc.angle {
				if is_null(arc2d.label) == false {
					arc2d.measure.height += increment_contained_label
					
				} else {
					arc2d.measure.height += increment_contained
				}
				set_arc2d.update(arc2d)
			} 
		}
	}
	
}

func (set_arc2d Set_Arc2D) setup_label(set_label2d Set_Label2D) Set_Label2D {
	for _, arc2d := range set_arc2d.label {
		label2d := arc2d.label(set_label2d)
		label2d.center = arc2d.label_center(label2d)
		set_label2d.update(label2d)
	}
	return set_label2d
}

func (set_arc2d Set_Arc2D) setup_measure_label(set_label2d Set_Label2D) Set_Label2D {
	for _, arc2d := range set_arc2d.measure_label {
		label2d := arc2d.measure.label(set_label2d)
		label2d.center = arc2d.label_center(label2d)
		set_label2d.update(label2d)
	}
	return set_label2d
}




func (set_arc2d Set_Arc2D) sort(set_label2d Set_Label2D) {
	for _, arc2d := range set_arc2d.elements {
		if arc2d.dash != "" {
			set_arc2d.dash[arc2d.id] = arc2d
		}
		if is_null(arc2d.label(set_label2d)) == false {
			set_arc2d.label[arc2d.id] = arc2d
		}
		if is_null(arc2d.measure) == false {
			set_arc2d.measure[arc2d.id] = arc2d
			if is_null(arc2d.measure.label(set_label2d)) == false {
				set_arc2d.measure_label[arc2d.id] = arc2d
			}
		}
	}

	

}

func (set_arc2d Set_Arc2D) update(arc2d Arc2D) {
	set_arc2d.elements[arc2d.id] = arc2d

	set_arc2d.dash[arc2d.id] = arc2d
	set_arc2d.label[arc2d.id] = arc2d
	set_arc2d.measure[arc2d.id] = arc2d
	set_arc2d.measure[arc2d.id] = arc2d
}