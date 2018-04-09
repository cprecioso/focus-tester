import sortBy from "lodash/sortBy"
import { types } from "mobx-state-tree"

import StartInfo from "./StartInfo"
import Timer from "./Timer"

const Model = types
  .model("Model", {
    startInfo: StartInfo,
    timers: types.optional(types.array(Timer), [])
  })
  .actions(self => ({
    resetExtraTimers() {
      self.timers.forEach(timer => timer.resetExtraTime())
    }
  }))
  .views(self => ({
    get rankedTimers() {
      return sortBy(self.timers, "value").reverse()
    },
    get extraTimers(): Timer.Snapshot[] {
      return self.timers.map(timer => ({
        id: timer.id,
        serverValue: timer.extraTime
      }))
    }
  }))
  .views(self => ({
    get maxScore() {
      return self.rankedTimers[0].value
    }
  }))
  .views(self => ({
    get percentagedTimers() {
      const { maxScore } = self
      return self.timers.map(timer => timer.value / maxScore)
    }
  }))
  .views(self => ({
    get rankedPercentagedTimers() {
      return self.percentagedTimers.sort().reverse()
    }
  }))

type _Model = typeof Model
type _Type = typeof Model.Type
type _Snapshot = typeof Model.SnapshotType

declare namespace Model {
  interface Model extends _Model {}
  interface Type extends _Type {}
  interface Snapshot extends _Snapshot {}
}

type Model = Model.Type

export default Model
