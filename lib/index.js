const { EventEmitter } = require('events')
const { PythonShell } = require('python-shell')
const mdns = require('mdns')

const METHODS = [
  'refreshStatus',
  'setVolume',
  'toggleMute',
  'playPause',
  'rewind'
]

const browser = mdns.createBrowser(mdns.tcp('googlecast'))

browser.on('serviceUp', service => {
  if (!Chromecast._map.has(service.name)) {
    Chromecast._map.set(service.name, new Chromecast(service))
  }
})

browser.on('serviceDown', service => {
  if (Chromecast._map.has(service.name)) {
    Chromecast._map.delete(service.name)
  }
})

browser.start()

class Chromecast extends EventEmitter {
  static getAll () {
    return Array.from(Chromecast._map.values())
  }

  static findOne (where = {}) {
    return Array.from(Chromecast._map.values()).find(chromecast =>
      Object
        .keys(where)
        .every(key => chromecast[key] === where[key])
    )
  }

  static findAll (where = {}) {
    return Array.from(Chromecast._map.values()).filter(chromecast =>
      Object
        .keys(where)
        .every(key => chromecast[key] === where[key])
    )
  }

  constructor (service) {
    super()
    this._host = {
      ip_address: service.addresses[0],
      port: service.port,
      uuid: service.txtRecord.id,
      model_name: service.txtRecord.md,
      friendly_name: service.txtRecord.fn
    }
    this.isPlaying = false
    this.isMuted = false
    this.volume = 0
    this.refreshedAt = 0
    this.name = this._host.friendly_name
    this.uuid = this._host.uuid
    this.modelName = null
    this.castType = null
    this.port = this._host.port
    this.ip = this._host.ip_address
    this._init()
  }

  async _init () {
    try {
      const infos = await this._cmd('infos')
      this.name = infos.name
      this.uuid = infos.uuid
      this.modelName = infos.model_name
      this.castType = infos.cast_type
      this.port = infos.port
      this.ip = infos.ip
      this.emit('ready')
    } catch (error) {
      this.emit('error', error)
    }
  }

  async _cmd (cmd, customArgs = []) {
    const args = [cmd.toLowerCase(), '--host', JSON.stringify(this._host), ...customArgs]
    return new Promise((resolve, reject) => {
      PythonShell.run(`${__dirname}/pychromecastCmd.py`, { args }, (err, data) => {
        if (err) reject(err)
        resolve(data && data[0] && JSON.parse(data[0]))
      })
    })
  }

  _updateStatus (status) {
    this.refreshedAt = Date.now()
    this.volume = status.volume_level
    this.isMuted = status.volume_muted
    this.isPlaying = status.is_playing
    this.isActive = status.is_active
  }
}

Chromecast._map = new Map()

METHODS.forEach(methodName => {
  Chromecast.prototype[methodName] = async function (namedArguments = {}) {
    const args = Object.keys(namedArguments).flatMap((name) => [`--${name}`, namedArguments[name]])
    const status = await this._cmd(methodName, args)
    this._updateStatus(status)
    return this
  }

  Chromecast[methodName] = async function (...args) {
    return Promise.all(Array.from(Chromecast._map.values()).map(cast => cast[methodName](...args)))
  }
})

module.exports = {
  Chromecast
}
