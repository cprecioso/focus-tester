import { autorun, computed, IReactionDisposer, observable } from "mobx"
import { observer } from "mobx-react"
import { Component } from "react"

import Model from "./models"
import { Index } from "./util"

const now = ((process as any) as { browser: boolean }).browser
  ? require("mobx-utils").now
  : () => {}

declare namespace Reporting {
  interface Props {
    model: Model
    focused: Index | undefined
  }
}

@observer
class Reporting extends Component<Reporting.Props> {
  @observable lastTimestamp = Date.now()
  disposer?: IReactionDisposer

  @computed
  get timeElapsed() {
    return this.props.focused != null ? now("frame") - this.lastTimestamp : 0
  }

  componentDidMount() {
    this.disposer = autorun(
      () => {
        if (this.props.focused != null) {
          this.props.model.timers[this.props.focused].addExtraTime(
            now("frame") - this.lastTimestamp
          )
        }
        this.lastTimestamp = Date.now()
      },
      { fireImmediately: true, delay: 100 }
    )
  }

  componentWillUnmount() {
    if (this.disposer) this.disposer()
  }

  render() {
    return null
  }
}

export default Reporting
