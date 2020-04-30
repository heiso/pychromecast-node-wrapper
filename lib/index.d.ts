import { Service } from '@type/mdns'

declare namespace pychromecastWrapper {

  interface Chromecast {
    isPlaying: boolean
    isMuted: boolean
    volume: number
    refreshedAt: number
    setVolume(args: { volume: number }): Promise<Chromecast>
    toggleMute(): Promise<Chromecast>
    playPause(): Promise<Chromecast>
    rewind(args: { time: number }): Promise<Chromecast>
  }

  interface ChromecastStatic {
    (service: Service): Chromecast
    refreshStatus(): Promise<Array<Chromecast>>
    setVolume(args: { volume: number }): Promise<Array<Chromecast>>
    toggleMute(): Promise<Array<Chromecast>>
    playPause(): Promise<Array<Chromecast>>
    rewind(args: { time: number }): Promise<Array<Chromecast>>
  }
}

export as namespace pychromecastWrapper;