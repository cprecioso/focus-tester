import "cross-fetch/polyfill"

import { createElement, SFC } from "react"

import { server } from "../src/config"
import IndexPage from "../src/IndexPage"
import Model from "../src/models"
import { Omit } from "../src/util"

type _Props = Omit<IndexPage.Props, "model"> & { snapshot: Model.Snapshot }
declare namespace IndexPageWrapper {
  interface Props extends _Props {}
}

const IndexPageWrapper: SFC<IndexPageWrapper.Props> = ({
  snapshot,
  ...props
}) => {
  const model = Model.create(snapshot)
  return createElement(IndexPage, { ...props, model: Model.create(snapshot) })
}

IndexPageWrapper.getInitialProps = async ({ query }) => ({
  isDev: !!query.dev,
  snapshot: await fetch(`${server}/db/`).then(res => res.json())
})

export default IndexPageWrapper
