import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import { Component, Fragment } from "react"

import ImageView from "../ImageView"
import PointingTable from "../PointingTable"
import { style } from "./styles"
import timers from "../timers"

declare namespace IndexPage {
  interface Props {
    image: string
    width: number
    height: number
    subdivisions?: number
    multiplier?: number
    isDev?: boolean
  }
}

type ChangeEvent = JSX.IntrinsicElements["input"]["onChange"]

@observer
class IndexPage extends Component<IndexPage.Props> {
  @observable subdivisions = this.props.subdivisions || 1
  @observable multiplier = this.props.multiplier || 0.9

  currentIndex = observable({
    i: undefined as number | undefined,
    j: undefined as number | undefined
  })
  windowSize = observable({
    width: 0,
    height: 0
  })

  @action
  updateWindowSize = () => {
    this.windowSize.width = Math.max(
      document.documentElement.clientWidth,
      window.innerWidth || 0
    )
    this.windowSize.height = Math.max(
      document.documentElement.clientHeight,
      window.innerHeight || 0
    )
  }

  componentDidMount() {
    this.updateWindowSize()
    timers.setupReporting()
  }

  @computed
  get pictureDimensions() {
    if (this.windowSize.height < this.windowSize.width) {
      return {
        height: this.windowSize.height * this.multiplier,
        width:
          this.props.width *
          this.windowSize.height /
          this.props.height *
          this.multiplier
      }
    } else {
      return {
        height:
          this.props.height *
          this.windowSize.width /
          this.props.width *
          this.multiplier,
        width: this.windowSize.width * this.multiplier
      }
    }
  }

  @computed
  get cellDimensions() {
    return {
      height: this.pictureDimensions.height / this.subdivisions,
      width: this.pictureDimensions.width / this.subdivisions
    }
  }

  @action
  handleHover: PointingTable.Events["onHover"] = (i, j) => {
    this.currentIndex.i = i
    this.currentIndex.j = j
    timers.startTimer(i * this.subdivisions + j)
  }

  @action
  handleLeaveHover = () => {
    this.currentIndex.i = undefined
    this.currentIndex.j = undefined
    timers.stopTimer()
  }

  @action
  handleSubdivisions: ChangeEvent = evt => {
    this.subdivisions = +evt.target.value
  }

  @action
  handleMultiplier: ChangeEvent = evt => {
    this.multiplier = +evt.target.value
  }

  render() {
    return (
      <div className="root" onClick={this.updateWindowSize}>
        <div className="controls">
          <PointingTable
            subdivisions={this.subdivisions}
            cellWidth={this.cellDimensions.width * 0.3}
            cellHeight={this.cellDimensions.height * 0.3}
            onHover={this.handleHover}
            onLeaveHover={this.handleLeaveHover}
          />
          {this.props.isDev && (
            <Fragment>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={this.subdivisions}
                onChange={this.handleSubdivisions}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={this.multiplier}
                onChange={this.handleMultiplier}
              />
            </Fragment>
          )}
        </div>
        <ImageView
          width={this.pictureDimensions.width}
          height={this.pictureDimensions.height}
          src={this.props.image}
          n={this.subdivisions}
          i={this.currentIndex.i || 0}
          j={this.currentIndex.j || 0}
          hide={this.currentIndex.i == null}
        />
        <style jsx>{style}</style>
      </div>
    )
  }
}

export default IndexPage
