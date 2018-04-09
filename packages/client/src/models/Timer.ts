import { flow, types } from "mobx-state-tree"

const Timer = types
  .model("Timer", {
    id: types.identifier(types.number),
    serverTime: types.optional(types.number, 0)
  })
  .volatile(self => ({ extraTime: 0 }))
  .views(self => ({
    get value() {
      return self.serverTime + self.extraTime
    }
  }))
  .actions(self => ({
    addExtraTime(ms: number) {
      self.extraTime = Math.max(self.extraTime + ms, 0)
    },
    resetExtraTime() {
      self.extraTime = 0
    },
    sync: flow(function*(server: string) {
      const res = yield fetch(`${server}/timers/${self.id}`, {
        credentials: "include"
      })
      const json = (yield res.json()) as Timer.Snapshot

      // Update serverValue locally
      const serverTime = json.serverTime || 0
      self.serverTime = serverTime

      // Maybe we're finished?
      if (self.extraTime === 0) return

      // Cache extraTime and add
      const { extraTime } = self
      json.serverTime = serverTime + extraTime

      yield fetch(`${server}/timers/${self.id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(json)
      })

      // All went right, reflect locally
      self.serverTime = json.serverTime
      self.extraTime = Math.max(self.extraTime - extraTime, 0)
    })
  }))

type _Model = typeof Timer
type _Type = typeof Timer.Type
type _Snapshot = typeof Timer.SnapshotType

declare namespace Timer {
  interface Model extends _Model {}
  interface Type extends _Type {}
  interface Snapshot extends _Snapshot {}
}

type Timer = Timer.Type

export default Timer
