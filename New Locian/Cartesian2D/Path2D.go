package Cartesian2D

type Path2D struct {
	vertices []Coord
	
	id float64

	
}

func (path2d Path2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if path2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}

func (path2d Path2D) figure() Path {
	return Path{path2d.vertices}
}



type Set_Path2D struct {
	elements map[float64]Path2D
	label map[float64]Path2D
}

func (set_path2d Set_Path2D) sort(set_label2d Set_Label2D) {
	for _, path2d := range set_path2d.label {
		if is_null(path2d.label(set_label2d)) == false {
			set_path2d.label[path2d.id] = path2d
		}
	}
}

func (set_path2d Set_Path2D) update(path2d Path2D) {
	set_path2d.elements[path2d.id] = path2d
	set_path2d.label[path2d.id] = path2d
}


