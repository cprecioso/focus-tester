import { autorun, IReactionDisposer } from "mobx"
import { Component } from "react"

import { server } from "./config"
import Model from "./models"

declare namespace Uploading {
  interface Props {
    model: Model
  }
}

class Uploading extends Component<Uploading.Props> {
  disposer?: IReactionDisposer
  inProcess = Promise.resolve()

  componentDidMount() {
    this.disposer = autorun(
      () => {
        this.props.model.timers
          .filter(timer => timer.extraTime > 0)
          .map(timer => timer.sync(server))
      },
      { delay: 1500 }
    )
  }

  componentWillUnmount() {
    if (this.disposer) this.disposer()
  }

  render() {
    return null
  }
}

export default Uploading
