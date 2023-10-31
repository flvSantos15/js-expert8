import { createFile } from '../deps/mp4box.0.5.2'

export default class MP4Demuxer {
  #onConfig
  #onChunck
  #file
  /**
   *
   * @param {Readable} stream
   * @param {object} options
   * @param {(config: object) => void} options.onConfig
   *
   * @returns {Promise<void>}
   */
  async run(stream, { onConfig, onChunk }) {
    this.#onChunck = onChunk
    this.#onConfig = onConfig

    this.#file = createFile()
    this.#file.onReady = (args) => {}

    this.#file.onError = (error) => console.error('Deu ruim mp4Demuxer', error)

    this.#init(stream)
  }

  #init(stream) {
    const consumerFile = new WritableStream({
      write: (chunk) => {
        debugger
      },
      close: () => {
        debugger
      }
    })

    return
  }
}

// parei em 1:05:41
