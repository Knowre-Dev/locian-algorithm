package Cartesian2D

type Line struct {
	a float64
	b float64
	c float64
}

func (line Line) evaluation(coord Coord) float64 {
	return line.a*coord.x+line.b*coord.y+line.c
}