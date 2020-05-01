/* eslint-env jest */
const { EventEmitter } = require('events')
const mdns = require('mdns')

const mockMDNSService = {
  addresses: ['192.168.0.20'],
  port: 8009,
  name: 'randomName-3324108a6f33ac8187be533c491b4b9a',
  txtRecord: {
    id: '3324108a6f33ac8187be533c491b4b9a',
    md: 'Chromecast Ultra',
    fn: 'Chromecast'
  }
}

const mockMDNSService2 = {
  addresses: ['192.168.0.21'],
  port: 8009,
  name: 'randomName-3324108a6f33ac8187be533c491b4b9b',
  txtRecord: {
    id: '3324108a6f33ac8187be533c491b4b9b',
    md: 'Chromecast Ultra',
    fn: 'Chromecast'
  }
}

class MockMDNSBrowser extends EventEmitter {
  start () {
    return true
  }
}

describe('Chromecast', () => {
  beforeAll(() => {
    this.mockBrowser = new MockMDNSBrowser()
    jest.spyOn(mdns, 'createBrowser').mockImplementation(() => this.mockBrowser)
    const { Chromecast } = require('../lib/index')
    this.Chromecast = Chromecast
  })

  it('should instanciate a Chromecast instance when device is found', () => {
    expect(this.Chromecast._map).toBeInstanceOf(Map)
    expect(this.Chromecast._map.size).toBe(0)
    this.mockBrowser.emit('serviceUp', mockMDNSService)
    expect(this.Chromecast._map.size).toBe(1)
    expect(this.Chromecast._map.get(mockMDNSService.name)).toBeInstanceOf(this.Chromecast)
    this.mockBrowser.emit('serviceUp', mockMDNSService2)
    expect(this.Chromecast._map.size).toBe(2)
    expect(this.Chromecast._map.get(mockMDNSService2.name)).toBeInstanceOf(this.Chromecast)
    this.mockBrowser.emit('serviceDown', mockMDNSService)
    expect(this.Chromecast._map.size).toBe(1)
    this.mockBrowser.emit('serviceDown', mockMDNSService2)
    expect(this.Chromecast._map.size).toBe(0)
  })

  it('should findAll chromecast', async () => {
    this.mockBrowser.emit('serviceUp', mockMDNSService)
    this.mockBrowser.emit('serviceUp', mockMDNSService2)

    expect(
      this.Chromecast.findAll({ uuid: '3324108a6f33ac8187be533c491b4b9b' })
    ).toHaveLength(1)

    expect(
      this.Chromecast.findAll({ name: 'Chromecast' })
    ).toHaveLength(2)

    expect(
      this.Chromecast.findAll({ ip: '192.168.0.20' })
    ).toHaveLength(1)

    expect(
      this.Chromecast.findAll()
    ).toHaveLength(2)

    this.mockBrowser.emit('serviceDown', mockMDNSService)
    this.mockBrowser.emit('serviceDown', mockMDNSService2)
  })

  it('should findOne chromecast', async () => {
    this.mockBrowser.emit('serviceUp', mockMDNSService)
    this.mockBrowser.emit('serviceUp', mockMDNSService2)

    expect(
      this.Chromecast.findOne({ uuid: '3324108a6f33ac8187be533c491b4b9b' })
    ).toBeInstanceOf(this.Chromecast)

    expect(
      this.Chromecast.findOne({ name: 'Chromecast' })
    ).toBeInstanceOf(this.Chromecast)

    expect(
      this.Chromecast.findOne({ ip: '192.168.0.20' })
    ).toBeInstanceOf(this.Chromecast)

    this.mockBrowser.emit('serviceDown', mockMDNSService)
    this.mockBrowser.emit('serviceDown', mockMDNSService2)
  })
})
