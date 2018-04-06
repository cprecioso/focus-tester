import "cross-fetch/polyfill"

import { createElement } from "react"

import { image, server } from "../src/config"
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
    const isDev = !!query.dev
    const response = await fetch(`${server}/startInfo/`)
    const json = (await response.json()) as {
      multiplier: number
      subdivisions: number
    }
    return { ...image, ...json, isDev }
  }
}

export default IndexPageWrapper
