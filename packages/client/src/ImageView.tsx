import classnames from "classnames"
import { observer } from "mobx-react"
import { SFC } from "react"

import Image from "./models/Image"
import { Index, indexToCoord } from "./util"

declare namespace ImageView {
  interface Props {
    image: Image
    width: number
    height: number
    subdivisions: number
    n: Index
    hide?: boolean
    duration?: number
    className?: string
  }
}

const ImageView = observer<SFC<ImageView.Props>>(
  ({
    image,
    width,
    height,
    subdivisions,
    n,
    hide = false,
    duration = 200,
    className,
    ...props
  }) => {
    const { i, j } = indexToCoord(n, subdivisions)
    const x = width * (subdivisions - j)
    const y = height * (subdivisions - i)

    return (
      <div
        {...props}
        className={classnames("image", { hidden: hide }, className)}
      >
        <style jsx>{`
          .image {
            background-position: ${x}px ${y}px;
          }
        `}</style>
        <style jsx>{`
          .image {
            display: block;
            opacity: 1;
            width: ${width}px;
            height: ${height}px;
            background-size: ${width * subdivisions}px
              ${height * subdivisions}px;
            background-image: url(${image.imageUrl});
            transition: background-position ${duration}ms ease-in-out,
              opacity ${duration}ms ease-in-out;
          }
          .image.hidden {
            opacity: 0;
            transition: background-position ${duration}ms ease-in-out
                ${duration}ms,
              opacity ${duration}ms ease-in-out;
          }
        `}</style>
      </div>
    )
  }
)

export default ImageView
