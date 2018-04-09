import { Component, ComponentClass } from "react"

declare namespace ResizeListener {
  interface Events {
    onResize?: (
      newSize: { width: number; height: number },
      evt?: UIEvent
    ) => void
  }
  interface Props extends Events {
    sizeOnMount?: boolean
  }
}

const ResizeListener: ComponentClass<
  ResizeListener.Props
> = class ResizeListener extends Component<ResizeListener.Props> {
  componentDidMount() {
    if (window) {
      window.addEventListener("resize", this.handleResize)
      if (this.props.sizeOnMount) this.handleResize()
    }
  }

  componentWillUnmount() {
    if (window) window.removeEventListener("resize", this.handleResize)
  }

  handleResize = (evt?: UIEvent) => {
    if (this.props.onResize) {
      const { clientWidth, clientHeight } = document.documentElement
      const { innerWidth, innerHeight } = window
      this.props.onResize(
        {
          width: Math.max(clientWidth, innerWidth || 0),
          height: Math.max(clientHeight, innerHeight || 0)
        },
        evt
      )
    }
  }

  render() {
    return null
  }
}

export default ResizeListener
