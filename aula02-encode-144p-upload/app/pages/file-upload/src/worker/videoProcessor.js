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

  /** @returns {ReadableStream} */
  mp4Decoder(stream) {
    return new ReadableStream({
      start: async (controller) => {
        const decoder = new VideoDecoder({
          /** @param {VideFrame} frame */
          output(frame) {
            controller.enqueue(frame)
          },
          error(e) {
            console.error('error at mp4Decoder', e)
            controller.error(e)
          }
        })

        return this.#mp4Demuxer
          .run(stream, {
            async onConfig(config) {
              const { supported } = await VideoDecoder.isConfigSupported(config)

              if (!supported) {
                console.error('mp3Muxer VideoDecoder config not supported!')
                controller.close()
                return
              }

              decoder.configure(config)
            },
            /** @param {EncondedVideoChunk} chunk */
            onChunk(chuck) {
              decoder.decode(chuck)
            }
          })
          .then(() => {
            setTimeout(() => {
              controller.close()
            }, 3000)
          })
      }
    })
  }

  enconde144p(encoderConfig) {
    let _encoder
    const readable = new ReadableStream({
      start: async (controller) => {
        const { supported } = await VideoEncoder.isConfigSupported(
          encoderConfig
        )

        if (!supported) {
          const message = 'enconde144p VideoEncoder config not supported!'
          console.error(message, encoderConfig)
          controller.error(message)
          return
        }

        _encoder = new VideoEncoder({
          output: (frame, config) => {
            debugger
            controller.enqueue(frame)
          },
          error: (err) => {
            console.error('VideoEnconder 144p', err)
            controller.error(err)
          }
        })

        await _encoder.configure(encoderConfig)
      }
    })

    const writable = new WritableStream({
      async write(frame) {
        _encoder.encode(frame)
        frame.close()
      }
    })

    return {
      readable,
      writable
    }
  }

  async start({ file, encoderConfig, renderFrame }) {
    const stream = file.stream()
    const fileName = file.name.split('/').pop().replace('.mp4', '')
    await this.mp4Decoder(stream)
      .pipeThrough(this.enconde144p(encoderConfig))
      .pipeTo(
        new WritableStream({
          write(frame) {
            // renderFrame(frame)
          }
        })
      )
  }
}

// parei no 19:14 da aula 3
