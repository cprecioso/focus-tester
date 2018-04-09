import { action, computed, observable } from "mobx"
import { observer } from "mobx-react"
import { Component } from "react"

import ImageView from "../ImageView"
import Model from "../models"
import PointingTable from "../PointingTable"
import Reporting from "../Reporting"
import ResizeListener from "../ResizeListener"
import Uploading from "../Uploading"
import { style } from "./styles"

declare namespace IndexPage {
  interface Props {
    model: Model
    isDev?: boolean
  }
}

@observer
class IndexPage extends Component<IndexPage.Props> {
  @observable isIn = false

  @observable tableIndex = 0

  @computed
  get imageIndex() {
    return this.tableIndex
  }

  @computed
  get currentIndex() {
    return this.isIn && this.tableIndex != null ? this.tableIndex : undefined
  }

  @observable
  windowSize = {
    width: 0,
    height: 0
  }

  componentDidMount() {
    this.props.model.startInfo.image.requestBlob()
  }

  @action
  updateWindowSize: ResizeListener.Events["onResize"] = ({ width, height }) => {
    this.windowSize.width = width
    this.windowSize.height = height
  }

  @computed
  get pictureDimensions() {
    const { image } = this.props.model.startInfo
    const { height, width } = this.windowSize
    return height < width
      ? {
          height: height * this.props.model.startInfo.multiplier,
          width:
            image.width *
            height /
            image.height *
            this.props.model.startInfo.multiplier
        }
      : {
          height:
            image.height *
            width /
            image.width *
            this.props.model.startInfo.multiplier,
          width: width * this.props.model.startInfo.multiplier
        }
  }

  @computed
  get cellDimensions() {
    return {
      height:
        this.pictureDimensions.height / this.props.model.startInfo.subdivisions,
      width:
        this.pictureDimensions.width / this.props.model.startInfo.subdivisions
    }
  }

  @action
  handleHover: PointingTable.Events["onHover"] = n => {
    this.isIn = true
    this.tableIndex = n
  }

  @action
  handleLeaveHover = () => {
    this.isIn = false
  }

  render() {
    return (
      <div className="root">
        <ResizeListener onResize={this.updateWindowSize} sizeOnMount />
        <Reporting focused={this.currentIndex} model={this.props.model} />
        <Uploading model={this.props.model} />
        <div className="controls">
          <PointingTable
            cellWidth={this.cellDimensions.width * 0.3}
            cellHeight={this.cellDimensions.height * 0.3}
            onHover={this.handleHover}
            onLeaveHover={this.handleLeaveHover}
            model={this.props.model}
          />
        </div>
        <ImageView
          image={this.props.model.startInfo.image}
          width={this.pictureDimensions.width}
          height={this.pictureDimensions.height}
          subdivisions={this.props.model.startInfo.subdivisions}
          n={this.imageIndex}
          hide={!this.isIn}
        />
        <style jsx>{style}</style>
      </div>
    )
  }
}

export default IndexPage
