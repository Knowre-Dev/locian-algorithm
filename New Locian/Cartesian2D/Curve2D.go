package Cartesian2D

import (
	"strings"
	"math"
)

type Curve2D struct {
	equation string//js form
	bounds Bounds
	type_curve string
	coords []Coord
	
	id float64
}



func (curve2d Curve2D) figure() Curve {
	var replacements map[string]string
	replacements["Math.E"] = "math.E"
	replacements["Math.LN2"] = "math.Ln2"
	replacements["Math.LN10"] = "math.Ln10"
	replacements["Math.LOG2E"] = "math.Log2E"
	replacements["Math.LOG10E"] = "math.Log10E"
	replacements["Math.PI"] = "math.Pi"
	replacements["Math.SQRT1_2"] = "sqrt(1/2)"
	replacements["Math.SQRT2"] = "math.Sqrt2"
	replacements["NaN"] = "math.Nan()"
	replacements["POSITIVE_INFINITY"] = "math.Inf(1)"
	replacements["NEGATIVE_INFINITY"] = "math.Inf(-1)"
	var curve Curve
	curve.domain = curve2d.bounds
	equation := curve2d.equation
	for key, value := range replacements {
		equation = strings.ReplaceAll(equation,key,value)
	}

	equation = strings.ReplaceAll(equation,"Math.","")
	curve.equation = equation
	return curve
}

func (curve2d Curve2D) curve_type() Curve {
	var curve Curve
	coords := curve2d.coords
	curve.domain = curve2d.bounds
	switch curve2d.type_curve {
		case "absolute": {
			a := to_string((coords[1].y-coords[0].y)/abs(coords[1].x-coords[0].x))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"*abs(x-"+x_0+")+"+y_0
			return curve
		}
		case "cubic": {
			a := to_string((coords[1].y-coords[0].y)/pow(coords[1].x-coords[0].x,3))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"*pow(x-"+x_0+", 3)+"+y_0
			return curve
		}
		case "exponential": {
			x_0 := to_string(coords[0].x)
			r := (coords[1].y-coords[2].y)/(coords[0].y-coords[1].y)
			if r < 0 {
				curve.equation = "x="+to_string(coords[1].x)
				return curve
			}
			a := to_string(coords[0].y-coords[2].y)
			b := to_string(pow(r,1/(coords[1].x-coords[0].x)))
			c := to_string(coords[2].y)
			curve.equation = "y="+a+"*pow("+b+",x-"+x_0+")+"+c
			return curve
		}
		case "inverse_proportion": {
			a := to_string((coords[1].x-coords[0].x)*(coords[1].y-coords[0].y))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"/(x-"+x_0+")+"+y_0
			return curve
		}
		case "linear": {
			a := to_string((coords[1].y-coords[0].y)/(coords[1].x-coords[0].x))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"*(x-"+x_0+")+"+y_0
			return curve
		}
		case "logarithmic": {
			if coords[2].y == coords[1].y {
				curve.equation = to_string(coords[1].y)
				return curve
			}
			x_0 := to_string(coords[0].x)
			a := to_string(pow(coords[1].x-coords[0].x,coords[2].y/(coords[2].y-coords[1].y))/pow(coords[2].x-coords[0].x,coords[1].y/(coords[2].y-coords[1].y)))
			b := to_string(pow((coords[2].x-coords[0].x)/(coords[1].x-coords[0].x),1/(coords[2].y-coords[1].y)))
			curve.equation = "y=log((x-"+x_0+")/"+a+")/log("+b+")"
			return curve
		}
		case "quadratic": {
			a := to_string((coords[1].y-coords[0].y)/pow(coords[1].x-coords[0].x,2))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"*pow(x-"+x_0+",2)"+y_0
			return curve
		}
		case "rational": {
			a := to_string((coords[1].x-coords[0].x)/(coords[1].y-coords[0].y))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"/(x-"+x_0+")+"+y_0
			return curve
		}
		case "sine": {
			a := to_string(coords[1].y-coords[0].y)
			b := to_string(math.Pi/2/(coords[1].x-coords[0].x))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"sin("+b+"*(x-"+x_0+")+"+y_0
			return curve
		}
		case "square_root": {
			if coords[0].x < coords[1].x {
				a := to_string((coords[1].y-coords[0].y)/sqrt(coords[1].x-coords[0].x))
				x_0 := to_string(coords[0].x)
				y_0 := to_string(coords[0].y)
				curve.equation = "y="+a+"sqrt(x-"+x_0+")+"+y_0
				return curve
			}
			a := to_string((coords[0].y-coords[1].y)/sqrt(coords[0].x-coords[1].x))
			x_0 := to_string(coords[1].x)
			y_0 := to_string(coords[1].y)
			curve.equation = "y="+a+"sqrt(x-"+x_0+")+"+y_0
			return curve
		}
		case "tangent": {
			if coords[0].x == coords[1].x || mod(coords[1].x-coords[0].x,coords[2].x-coords[0].x) == 0 {
				curve.equation = "y="+to_string(coords[0].x)
				return curve
			}
			a := to_string((coords[1].y-coords[0].y)/tan(math.Pi/2/(coords[2].x-coords[0].x))*(coords[1].x-coords[0].x))
			b := to_string(math.Pi/2/(coords[2].x-coords[0].x))
			x_0 := to_string(coords[0].x)
			y_0 := to_string(coords[0].y)
			curve.equation = "y="+a+"*tan("+b+"(x-"+x_0+"))+"+y_0
			return curve
		}
	}
	return curve
}

func (curve2d Curve2D) label(set_label2d Set_Label2D) Label2D {
	var label2d_not_found Label2D
	for _, label2d := range set_label2d.elements {
		if curve2d.id == label2d.id_object {
			return label2d
		}
	}
	return label2d_not_found
}




func (curve2d Curve2D) rectangles_label(label2d Label2D) Set_Rectangle {
	curve := Curve{curve2d.equation, curve2d.bounds}
	coords := curve.coords()
	rectangle := label2d.figure()
	var rectangle_domain Rectangle
	rectangle_domain.center = Coord{0, 0}
	rectangle_domain.size = Coord{curve.domain.x.length(), curve.domain.y.length()}
	rectangle_domain.angle = 0.0
	var vectors []Coord
	radius := rectangle.size.norm()
	angle := rectangle.size.angle()
	vector := Coord{radius*cos(angle), radius*sin(angle)}
	for i := 0; i < 2; i++ {
		for j := 0; j < 2; j++ {
			vectors = append(vectors, Coord{pow(-1,i)*vector.x,pow(-1,j)*vector.y})
		}
	}
	var rectangles_label Set_Rectangle
	for _, coord := range coords {
		for _, vector := range vectors {
			rectangle.center = coord.addition(vector)
			if rectangle.is_contained(rectangle_domain) == true  && curve.is_overlap(rectangle) == false {
				rectangles_label.elements = append(rectangles_label.elements, rectangle)
			}
		}
	}
	return rectangles_label
}





type Set_Curve2D struct {
	elements map[float64]Curve2D
	label map[float64]Curve2D
	
}

func (set_curve2d Set_Curve2D) setup_label(set_label2d Set_Label2D, set_rectangle_forbidden Set_Rectangle) Set_Label2D {
	for _, curve2d := range set_curve2d.label {
		label2d := curve2d.label(set_label2d)
		set_rectangle := curve2d.rectangles_label(label2d)
		for _, rectangle := range set_rectangle.elements {
			is_overlap := false
			for _, rectangle_1 := range set_rectangle.elements {
				if rectangle.is_overlap(rectangle_1) == true {
					break
				}
			}
			if is_overlap == false {
				label2d.center = rectangle.center
				set_label2d.update(label2d)
				set_rectangle_forbidden.elements = append(set_rectangle_forbidden.elements, rectangle)
			}
		}
	}
	return set_label2d
}

func (set_curve2d Set_Curve2D) sort(set_label2d Set_Label2D) {
	for _, curve2d := range set_curve2d.elements {
		if is_null(curve2d.label(set_label2d)) == false {
			set_curve2d.label[curve2d.id] = curve2d
		}
	}

}

func (set_curve2d Set_Curve2D) update(curve2d Curve2D) {
	set_curve2d.elements[curve2d.id] = curve2d
	set_curve2d.label[curve2d.id] = curve2d
}
