import { IncomingMessage, ServerResponse } from "http"
import { GetInitialPropsContext } from "next"
import "react"

type _GetInitialPropsContext = GetInitialPropsContext.Base &
  Partial<GetInitialPropsContext.Client & GetInitialPropsContext.Server>

declare module "next" {
  namespace GetInitialPropsContext {
    interface Base {
      pathname: string
      query: { [name: string]: string }
      asPath: string
      err?: any
    }

    interface Client extends Base {
      jsonPageRes: Response
    }

    interface Server extends Base {
      req: IncomingMessage
      res: ServerResponse
    }
  }

  interface GetInitialPropsContext extends _GetInitialPropsContext {}
}

declare module "react" {
  interface ComponentClass<P = {}> {
    getInitialProps?(context: GetInitialPropsContext): Promise<P>
  }
  interface StatelessComponent<P = {}> {
    getInitialProps?(context: GetInitialPropsContext): Promise<P>
  }
}
