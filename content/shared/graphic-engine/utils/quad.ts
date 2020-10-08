
export function quad () : Mesh {
  const vertices: Float32Array = Float32Array.of(
    -0.5, -0.5, 0.0,
    -0.5, 0.5, 0.0,
    0.5, -0.5, 0.0,
    0.5, 0.5, 0.0
  )
  const triangles: Uint16Array = Uint16Array.of(
    3, 1, 0,
    2, 3, 0
  )
  const uv: Float32Array = Float32Array.of(
    0.0, 0.0,
    0.0, 1.0,
    1.0, 0.0,
    1.0, 1.0
  )
  return { vertices, triangles, uv }
}
