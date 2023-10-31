export default class VideoProcessor {
  #mp4Demuxer
  /**
   *
   *  @param {object} options
   *  @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   */
  constructor({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer
  }
  async mp4Decoder(enconderConfig, stream) {
    this.#mp4Demuxer.run(stream, {
      onConfig(config) {
        debugger
      },
      onChunck(chuck) {
        debugger
      }
    })
  }

  async start({ file, encoderConfig, message }) {
    const stream = file.stream()
    const fileName = file.name.splti('/').pop().replace('.mp4', '')
    await this.mp4Decoder(encoderConfig, stream)
  }
}
