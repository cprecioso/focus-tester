import range from "lodash/range"
import { observer } from "mobx-react"
import { MouseEvent, SFC } from "react"
import css from "styled-jsx/css"

import Model from "./models"
import { Index } from "./util"

declare namespace PointingTable {
  interface Events {
    onHover?: (n: Index, evt: MouseEvent<HTMLTableDataCellElement>) => void
    onLeaveHover?: () => void
  }
  interface Props extends Events {
    cellWidth: number
    cellHeight: number
    model: Model
    className?: string
  }
}

const style = css`
  table {
    border-collapse: collapse;
  }
  table :global(td) {
    border: 1px dashed rgba(255, 255, 255, 0.3);
    transition: background-color 100ms ease-in-out;
  }
  table :global(td):hover {
    background-color: rgba(98, 198, 255, 0.5) !important;
  }
`

const Cell = observer<
  SFC<{
    model: Model
    n: number
    onMouseEnter: PointingTable.Events["onHover"]
  }>
>(({ model, n, onMouseEnter, ...props }) => (
  <td
    onMouseEnter={onMouseEnter && onMouseEnter.bind(null, n)}
    style={{
      backgroundColor: `rgba(255, 255, 255, ${model.percentagedTimers[n]}`
    }}
  />
))

const Row = observer<
  SFC<{
    range: number[]
    i: number
    model: Model
    onHover: PointingTable.Events["onHover"]
  }>
>(({ range, i, model, onHover }) => (
  <tr>
    {range.map((cell, j) => {
      const n = i * model.startInfo.subdivisions + j
      return <Cell key={j} n={n} model={model} onMouseEnter={onHover} />
    })}
  </tr>
))

const Rows = observer<
  SFC<{
    model: Model
    onHover: PointingTable.Events["onHover"]
  }>
>(({ model, onHover }) => {
  const r = range(0, model.startInfo.subdivisions)
  return (
    <tbody>
      {r.map((row, i) => (
        <Row key={i} i={i} range={r} model={model} onHover={onHover} />
      ))}
    </tbody>
  )
})

const PointingTable = observer<SFC<PointingTable.Props>>(
  ({ model, cellWidth, cellHeight, onHover, onLeaveHover, className }) => (
    <table className={className} onMouseLeave={onLeaveHover}>
      <Rows model={model} onHover={onHover} />
      <style jsx>{style}</style>
      <style jsx>{`
        table :global(td) {
          width: ${cellWidth}px;
          height: ${cellHeight}px;
        }
      `}</style>
    </table>
  )
)

export default PointingTable
