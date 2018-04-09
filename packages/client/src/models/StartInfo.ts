import { types } from "mobx-state-tree"

import Image from "./Image"
import { float, integer } from "./util"

const StartInfo = types.model("StartInfo", {
  subdivisions: integer,
  multiplier: float,
  image: Image
})

type _Model = typeof StartInfo
type _Type = typeof StartInfo.Type
type _Snapshot = typeof StartInfo.SnapshotType

declare namespace StartInfo {
  interface Model extends _Model {}
  interface Type extends _Type {}
  interface Snapshot extends _Snapshot {}
}

type StartInfo = StartInfo.Type

export default StartInfo
