import "cross-fetch/polyfill"

import { server } from "./config"

type Timestamp = number

interface LastStartObject {
  i?: number
  timestamp?: Timestamp
}

class Timers {
  private _accumulators: number[] = []
  private _lastStart: LastStartObject = {}
  private _isWaitingProcess = false

  setupReporting() {
    setInterval(this.processQueue, 5000)
  }

  getTimestamp() {
    return Date.now()
  }

  startTimer(i: number) {
    const lastStart = this._lastStart
    if (lastStart.i === i) return
    this.stopTimer()
    lastStart.i = i
    lastStart.timestamp = Date.now()
  }

  stopTimer() {
    const { i, timestamp } = this._lastStart
    if (i != null && timestamp) {
      this._accumulators[i] =
        (this._accumulators[i] || 0) + (this.getTimestamp() - timestamp)
      this._lastStart = {}
    }
  }

  processQueue = () => {
    if (this._isWaitingProcess) return
    this._isWaitingProcess = true
    this._processQueue()
  }

  private async _processQueue() {
    const currentTimestamps = (await fetch(`${server}/counter`, {
      credentials: "include"
    })
      .then(res => res.json() as Promise<{ timers: number[] }>)
      .then(json => json.timers)).slice(0)

    this._accumulators.forEach(
      (timestamp, i) =>
        (currentTimestamps[i] = currentTimestamps[i] || 0 + timestamp)
    )

    this._accumulators = []
    this._isWaitingProcess = false

    await fetch(`${server}/counter`, {
      method: "PUT",
      body: JSON.stringify({ timers: currentTimestamps }),
      headers: { "Content-Type": "application/json" },
      credentials: "include"
    })
  }
}

const timers = new Timers()
export default timers
