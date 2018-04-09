import { types } from "mobx-state-tree"

export const integer = types.refinement("integer", types.number, n =>
  Number.isInteger(n)
)

export const float = types.refinement(
  "float",
  types.number,
  n => !Number.isInteger(n)
)
