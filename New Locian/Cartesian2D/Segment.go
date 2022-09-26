package Cartesian2D

import (
	"math"
)

type Segment struct {
	start Coord
	end Coord
}



func (segment Segment) angle() float64 {
	vector := segment.vector()
	return atan2_polar(vector.y, vector.x)
}

func (segment Segment) center() Coord {
	return segment.start.addition(segment.end).multiplication_scalar(1/2)
}

func (segment Segment) coefficients() []float64 {
	a := segment.end.y-segment.start.y
	b := -(segment.end.x-segment.start.x)
	c := -a*segment.start.x-b*segment.start.y
	return []float64{a, b, c}
}

func (segment Segment) coord_division(a float64, b float64) Coord {
	coord := Coord{}
	coord.x = (b*segment.start.x+a*segment.end.x)/(a+b)
	coord.y = (b*segment.start.y+b*segment.end.y)/(a+b)
	return coord
}

func (segment Segment) is_contained(segment_1 Segment) bool {
	if segment.start.is_contained(segment_1) == true && segment.end.is_contained(segment_1) == true {
		return true
	}
	return false
}


func (segment Segment) is_crossing(object interface{}) bool {
	switch object.(type) {
		case Arc: {
			arc := object.(Arc)
			coord_1 := segment.start.subtract(segment.end)
			coord_2 := segment.end.subtract(arc.center)
			a := pow(coord_1.x, 2)+pow(coord_1.y, 2)
			b := 2*coord_1.inner_product(coord_2)
			c := pow(coord_2.x, 2)+pow(coord_2.y, 2)-pow(arc.radius(), 2)
			D := pow(b,2)-4*a*c
			if D < 0.0 {
				return false
			}
			var ts []float64
			if D == 0.0 {
				ts = append(ts, -b/2*a)
			} else {
				ts = append(ts, (-b+sqrt(D))/2)
				ts = append(ts, (-b-sqrt(D))/2)
			}
			interval_angle := arc.interval_angle()
			for _, t := range ts {
				angle := atan2_polar(t*coord_1.y+coord_2.y, t*coord_1.x+coord_2.x)
				if interval_angle.is_containing(angle) == true {
					return false
				}
			}

			return true
		}
		case Path2D: {
			path := object.(Path2D).figure()
			for i := 0; i < len(path.vertices); i++ {
				edge := Segment{path.vertices[i], path.vertices[i+1]}
				if segment.is_crossing(edge) == true {
					return true
				}
			}
			return false
		}
		case Polygon: {
			polygon := object.(Polygon)
			center := polygon.centroid_vertices()
			vertices := append(polygon.vertices, polygon.vertices[0])
			for i := 0; i < len(polygon.vertices); i++ {
				a := vertices[i+1].y-vertices[i].y
				b := -(vertices[i+1].x-vertices[i].x)
				c := vertices[i].x*a-vertices[i].y*b
				if a*center.x+b*center.y > c {
					a = -a
					b = -b
					c = -c
				}
				d := a*(segment.start.x-segment.end.x)+b*(segment.start.y-segment.end.y)
				e := -a*segment.end.x-b*segment.end.y+c
				if d == 0.0 {
					if c < 0.0 {
						return false
					}
				} else if d < 0.0 {
					if -d/e > 1.0 {
						return false
					}
				} else if d > 0.0 {
					if d/e < 0.0 {
						return false
					}
				}
			}
			return true

		}
		case Segment: {
			segment_1 := object.(Segment)
			vector := segment.vector()
			vector_1 := segment_1.vector()
			
			var matrix Matrix
			matrix.entries[0][0] = vector.x
			matrix.entries[0][1] = vector.y
			matrix.entries[1][0] = vector_1.x
			matrix.entries[1][1] = vector_1.y
			constants := []float64{segment_1.end.x-segment.end.x, segment_1.end.y-segment.end.y}
			solution := matrix.solution(constants)
			if 0.0 <= min(solution[0], solution[1]) && max(solution[0], solution[1]) <= 1.0 {
				return true
			} 
			return false

		}
	}
	return false
}
 


func (segment Segment) is_line(bounds Bounds) bool {
	if min(segment.start.x, segment.end.x) > bounds.x.min {
		return false
	} 
	if max(segment.start.x, segment.end.x) < bounds.x.max {
		return false
	}
	if min(segment.start.y, segment.end.y) > bounds.y.min {
		return false
	}
	if max(segment.start.y, segment.end.y) < bounds.y.max {
		return false
	}
	return true

}

func (segment Segment) is_overlap(segment_1 Segment) bool {
	angle := segment.angle()
	angle_1 := segment_1.angle()
	if is_equal_angle(angle, angle_1) == false && is_equal_angle(angle, -angle_1) == false {
		return false
	}
	if segment.start.is_contained(segment_1) == true || segment.end.is_contained(segment_1) == true || segment_1.start.is_contained(segment) == true || segment_1.end.is_contained(segment) == true {
		return true
	}
	return false
}

func (segment Segment) is_parallel(segment_1 Segment) bool {
	return is_equal_angle(mod(segment.angle()-segment_1.angle(), math.Pi),0)
}


func (segment Segment) length() float64 {
	return segment.start.subtraction(segment.end).norm()
}


func (segment Segment) intersections(arc Arc) []Coord {
	
	vector_1 := segment.start.subtraction(segment.end)
	vector_2 := arc.center.subtraction(segment.end)
	a := pow(segment.length(),2)
	b := vector_1.inner_product(vector_2)
	c := pow(vector_2.norm(),2)-pow(arc.radius(),2)
	D := pow(b,2)-a*c
	t_1 := (-b-sqrt(D))/a
	t_2 := (-b+sqrt(D))/a

	if D == 0.0 && 0.0 <= t_1 && t_2 <= 1.1 {
		return []Coord{vector_1.multiplication_scalar(t_1).addition(vector_2)}
	}
	var intersections []Coord
	if D > 0.0 {
		if 0.0 <= t_1 && t_1 <= 1.0 {
			intersections = append(intersections, vector_1.multiplication_scalar(t_1).addition(vector_2))
		}
		if 0.0 <= t_2 && t_2 <= 1.0 {
			intersections = append(intersections, vector_1.multiplication_scalar(t_2).addition(vector_2))
		}
	}
	return intersections
}


func (segment Segment) is_tangent(arc Arc) bool {
	intersections := segment.intersections(arc)
	if len(intersections) == 1 {
		angle := segment.angle()-arc.center.vector_angle(intersections[0])
		if is_equal_angle(angle, math.Pi/2) == true || is_equal_angle(angle,3*math.Pi/2) == true {
			return true
		}
	}
	return false
}

func (segment Segment) line() Line {
	var line Line
	line.a = segment.end.y-segment.start.y
	line.b = -(segment.end.x-segment.start.x)
	line.c = -segment.start.x*segment.end.y+segment.end.y*segment.end.x
	return line
}

func (segment Segment) rotation(angle float64, coord ...Coord) Segment {
	center := Coord{0, 0}
	if len(coord) == 1 {
		center = coord[0]
	}
	var segment_rotation Segment
	segment_rotation.start = segment.start.rotation(angle, center)
	segment_rotation.end = segment.end.rotation(angle, center)
	return segment_rotation
}

func (segment Segment) translation(coord Coord) Segment {
	var segment_translation Segment
	segment_translation.start = segment.start.addition(coord)
	segment_translation.end = segment.end.addition(coord)
	return segment_translation
}

func (segment Segment) union(segment_1 Segment) Segment {
	union := Segment{}
	if segment.is_overlap(segment_1) == false {
		return union
	}
	angle := segment.angle()
	center := Coord{0, 0}
	segment_rotation := segment.rotation(-angle,center)
	segment_1_rotation := segment.rotation(-angle,center)
	union_rotation := Segment{}
	union_rotation.start.x = min(segment_rotation.start.x, segment_rotation.end.x, segment_1_rotation.start.x, segment_1_rotation.end.x)
	union_rotation.start.y = segment_rotation.start.y
	union_rotation.end.x = max(segment_rotation.start.x, segment_rotation.end.x, segment_1_rotation.start.x, segment_1_rotation.end.x)
	union_rotation.end.y = segment_rotation.end.y
	union = union_rotation.rotation(angle, center)
	return union

}


func (segment Segment) vector() Coord {
	return segment.end.subtraction(segment.start)
	
}