import range from "lodash/range"
import { Component, MouseEvent } from "react"
import css from "styled-jsx/css"

declare namespace PointingTable {
  interface Events {
    onHover?: (i: number, j: number) => void
    onLeaveHover?: () => void
  }
  interface Props extends Events {
    subdivisions: number
    cellWidth: number
    cellHeight: number
    className?: string
  }
}

const style = css`
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px dashed rgba(255, 255, 255, 0.3);
    transition: background-color 100ms ease-in-out;
  }
  td:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`

type MouseEventHandler = JSX.IntrinsicElements["td"]["onMouseEnter"]

class PointingTable extends Component<PointingTable.Props> {
  extractIndex(evt: MouseEvent<HTMLElement>): [number, number] {
    const dataset = (evt.target as any).dataset as { i: string; j: string }
    return [parseInt(dataset.i), parseInt(dataset.j)]
  }

  handleHover: MouseEventHandler = evt => {
    if (this.props.onHover) {
      ;(this.props.onHover as any)(...this.extractIndex(evt))
    }
  }

  render() {
    const {
      subdivisions,
      cellWidth,
      cellHeight,
      onHover,
      onLeaveHover,
      className
    } = this.props

    const r = range(0, subdivisions)

    return (
      <table className={className} onMouseLeave={onLeaveHover}>
        <tbody>
          {r.map((row, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td
                  key={j}
                  data-i={i}
                  data-j={j}
                  onMouseEnter={this.handleHover}
                />
              ))}
            </tr>
          ))}
        </tbody>
        <style jsx>{style}</style>
        <style jsx>{`
          td {
            width: ${cellWidth}px;
            height: ${cellHeight}px;
          }
        `}</style>
      </table>
    )
  }
}

export default PointingTable
