
package Cartesian2D

type Cartesian2D struct {
	objects []interface{}
	bounds Bounds
	rotation float64
	size float64
	

	set_arc2d Set_Arc2D
	set_angle2d Set_Angle2D
	set_curve2d Set_Curve2D
	set_face2d Set_Face2D
	set_label2d Set_Label2D
	set_path2d Set_Path2D
	set_point2d Set_Point2D
	set_region2d Set_Region2D
	set_segment2d Set_Segment2D

	
}





func (cartesian2d Cartesian2D) setup() {


	
	for _, object := range cartesian2d.objects {
		switch object.(type) {
			case Angle2D: {
				cartesian2d.set_angle2d.elements[object.(Angle2D).id] = object.(Angle2D)
			}
			case Arc2D: {
				cartesian2d.set_arc2d.elements[object.(Arc2D).id] = object.(Arc2D)
			}
			
			case Curve2D: {
				cartesian2d.set_curve2d.elements[object.(Curve2D).id] = object.(Curve2D)
			}
			case Face2D: {
				cartesian2d.set_face2d.elements[object.(Face2D).id] = object.(Face2D)
			}
			case Label2D: {
				cartesian2d.set_label2d.elements[object.(Label2D).id] = object.(Label2D)
			}
			case Path2D: {
				cartesian2d.set_path2d.elements[object.(Path2D).id] = object.(Path2D)
			}
			case Point2D: {
				cartesian2d.set_point2d.elements[object.(Point2D).id] = object.(Point2D)
			}
			case Segment2D: {
				cartesian2d.set_segment2d.elements[object.(Segment2D).id] = object.(Segment2D)
			}
		}
	}
	for _, label2d := range cartesian2d.set_label2d.elements {
		is_object_found := true
		for _, object := range cartesian2d.objects {
			switch object.(type) {
				case Angle2D: {
					if label2d.id_object == object.(Angle2D).id {
						label2d.type_object = "Angle2D"
						is_object_found = true
					}
				}
				case Arc2D: {
					if label2d.id_object == object.(Angle2D).id {
						label2d.type_object = "Arc2D"
						is_object_found = true
					}	
				}
				case Curve2D: {
					if label2d.id_object == object.(Curve2D).id {
						label2d.type_object = "Curve2D"
						is_object_found = true
					}		
				}
				case Face2D: {
					if label2d.id_object == object.(Face2D).id {
						label2d.type_object = "Face2D"
						is_object_found = true
					}
				}
				case Path2D: {
					if label2d.id_object == object.(Path2D).id {
						label2d.type_object = "Path2D"
						is_object_found = true
					}
				}
				case Point2D :{
					if label2d.id_object == object.(Point2D).id {
						label2d.type_object = "Point2D"
						is_object_found = true
					}
				}
				case Segment2D: {
					if label2d.id_object == object.(Segment2D).id {
						label2d.type_object = "Segment2D"
						is_object_found = true
					}
				}
			}
			if is_object_found == true {
				break
			}
		}
		
	}
	
	
	cartesian2d.set_arc2d.sort(cartesian2d.set_label2d)
	cartesian2d.set_angle2d.sort(cartesian2d.set_label2d)
	cartesian2d.set_curve2d.sort(cartesian2d.set_label2d)
	cartesian2d.set_face2d.sort(cartesian2d.set_label2d)
	cartesian2d.set_path2d.sort(cartesian2d.set_label2d)
	cartesian2d.set_segment2d.sort(cartesian2d.set_label2d, cartesian2d.bounds)


	
	
}

func (cartesian2d Cartesian2D) algorithm() {
	cartesian2d.set_label2d = cartesian2d.set_angle2d.setup_label(cartesian2d.set_label2d)
	cartesian2d.set_label2d = cartesian2d.set_arc2d.setup_label(cartesian2d.set_label2d)
	cartesian2d.set_label2d = cartesian2d.set_arc2d.setup_measure_label(cartesian2d.set_label2d)
	cartesian2d.set_label2d = cartesian2d.set_face2d.setup_label(cartesian2d.set_label2d)
	cartesian2d.set_label2d = cartesian2d.set_point2d.setup_label(cartesian2d.set_angle2d, cartesian2d.set_arc2d, cartesian2d.set_face2d, cartesian2d.set_label2d, cartesian2d.set_segment2d)
	cartesian2d.set_segment2d.setup_parallel()

	cartesian2d.set_label2d = cartesian2d.set_segment2d.setup_label(cartesian2d.set_label2d)
	cartesian2d.set_segment2d.setup_label(cartesian2d.set_label2d)
	cartesian2d.set_segment2d.setup_measure(cartesian2d.set_angle2d, cartesian2d.set_arc2d, cartesian2d.set_face2d, cartesian2d.set_label2d, cartesian2d.set_path2d, cartesian2d.set_point2d)
	cartesian2d.set_label2d = cartesian2d.set_segment2d.setup_measure_label(cartesian2d.set_label2d)
}