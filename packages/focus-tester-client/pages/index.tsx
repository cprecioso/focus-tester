import { createElement } from "react"

import IndexPage from "../src/IndexPage"

function IndexPageWrapper(props: IndexPage.Props) {
  return createElement(IndexPage, props)
}

namespace IndexPageWrapper {
  export async function getInitialProps({
    query
  }: {
    query: { [name: string]: string }
  }): Promise<IndexPage.Props> {
    return {
      image: "/static/pic.jpg",
      width: 7609,
      height: 8157,
      multiplier: 0.9,
      subdivisions: 6,
      isDev: !!query.dev
    }
  }
}

export default IndexPageWrapper
