export type Diff<T extends string, U extends string> = ({ [P in T]: P } &
  { [P in U]: never } & { [x: string]: never })[T]

export type Omit<U, K extends keyof U> = Pick<U, Diff<keyof U, K>>

export type Index = number
export type Coord = { i: number; j: number }

export const indexToCoord = (n: Index, subdivisions: number): Coord => ({
  i: Math.floor(n / subdivisions),
  j: n % subdivisions
})

export const coordToIndex = ({ i, j }: Coord, subdivisions: number): Index =>
  i * subdivisions + j
