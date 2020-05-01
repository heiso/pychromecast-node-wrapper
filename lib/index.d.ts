import { Service } from 'mdns'

export class Chromecast {
  static findAll(where?: { [key: string]: any }): Array<Chromecast>

  static findOne(where?: { [key: string]: any }): Array<Chromecast>

  static refreshStatus(): Promise<Array<Chromecast>>

  static setVolume(opts?: { volume: number }): Promise<Array<Chromecast>>

  static toggleMute(): Promise<Array<Chromecast>>

  static playPause(): Promise<Array<Chromecast>>

  static rewind(opts?: { time: number }): Promise<Array<Chromecast>>

  constructor(service: Service)
  
  isPlaying: boolean
  
  isMuted: boolean

  isActive: boolean
  
  volume: number
  
  refreshedAt: number

  name: string

  uuid: string

  modelName: string

  castType: string

  port: number

  ip: string

  setVolume(opts?: { volume: number }): Promise<Chromecast>

  toggleMute(): Promise<Chromecast>

  playPause(): Promise<Chromecast>

  rewind(opts?: { time: number }): Promise<Chromecast>
}
