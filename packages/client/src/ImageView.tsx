import { Fragment, SFC } from "react"

declare namespace ImageView {
  interface Props {
    width: number
    height: number
    src: string
    n: number
    i: number
    j: number
    hide: boolean
  }
}

const DURATION = 200

const ImageView: SFC<ImageView.Props> = ({
  width,
  height,
  src,
  n,
  i,
  j,
  hide,
  ...props
}) => (
  <Fragment>
    <div {...props} className={`image ${(hide && "hidden") || ""}`} />
    <style jsx>{`
      .image {
        display: block;
        opacity: 1;
        width: ${width}px;
        height: ${height}px;
        background-image: url('${src}');
        background-size: ${width * n}px ${height * n}px;
        background-position: ${width * (n - j)}px ${width * (n - i)}px;
        transition: background-position ${DURATION}ms ease-in-out, opacity ${DURATION}ms ease-in-out ${DURATION}ms;
      }
      .image.hidden {
        opacity: 0;
        transition: background-position ${DURATION}ms ease-in-out ${DURATION}ms, opacity ${DURATION}ms ease-in-out;
      }
    `}</style>
  </Fragment>
)

export default ImageView
