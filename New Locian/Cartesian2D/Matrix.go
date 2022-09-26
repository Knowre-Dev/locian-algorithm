package Cartesian2D

type Matrix struct {
	entries [][]float64
}

func (matrix Matrix) determinant() float64 {
	return matrix.entries[0][0]*matrix.entries[1][1]-matrix.entries[0][1]*matrix.entries[1][0]
}

func (matrix Matrix) inverse() Matrix {
	determinant := matrix.determinant()
	entries_inverse := [][]float64{[]float64{matrix.entries[1][1]/determinant,-matrix.entries[0][1]/determinant},[]float64{matrix.entries[1][0]/determinant,matrix.entries[0][0]/determinant}}
	return Matrix{entries_inverse}
}

func (matrix Matrix) solution(constants []float64) []float64 {
	if matrix.determinant() == 0.0 {
		return []float64{}
	}
	inverse := matrix.inverse()
	x := inverse.entries[0][0]*constants[0]+inverse.entries[0][1]*constants[0]
	y := inverse.entries[1][0]*constants[0]+inverse.entries[1][1]*constants[1]
	return []float64{x, y}

}