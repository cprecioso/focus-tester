import { types } from "mobx-state-tree"

import { integer } from "./util"

const Image = types
  .model("Image", {
    url: types.string,
    width: integer,
    height: integer
  })
  .volatile(self => ({
    blobUrl: undefined as string | undefined
  }))
  .extend(self => ({
    actions: {
      setBlob(blobUrl: string | undefined) {
        self.blobUrl = blobUrl
      }
    },
    views: {
      get imageUrl() {
        return self.blobUrl || self.url
      }
    }
  }))
  .actions(self => ({
    requestBlob() {
      if (self.blobUrl) return Promise.resolve(self.blobUrl)
      return fetch(self.url)
        .then(res => res.blob())
        .then(blob => self.setBlob(URL.createObjectURL(blob)))
    },
    revokeBlob() {
      if (self.blobUrl) self.setBlob(void URL.revokeObjectURL(self.blobUrl))
    }
  }))

type _Model = typeof Image
type _Type = typeof Image.Type
type _Snapshot = typeof Image.SnapshotType

declare namespace Image {
  interface Model extends _Model {}
  interface Type extends _Type {}
  interface Snapshot extends _Snapshot {}
}

type Image = Image.Type

export default Image
