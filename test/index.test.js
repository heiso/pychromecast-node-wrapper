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
    jest.spyOn(this.Chromecast.prototype, '_init').mockImplementation(() => {})
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

  describe('Methods', () => {
    beforeEach(() => {
      this.mockBrowser.emit('serviceUp', mockMDNSService)
      this.mockBrowser.emit('serviceUp', mockMDNSService2)
    })

    afterEach(() => {
      this.mockBrowser.emit('serviceDown', mockMDNSService)
      this.mockBrowser.emit('serviceDown', mockMDNSService2)
    })

    it('should findAll 1 chromecast', () => {
      const all = this.Chromecast.findAll({ uuid: mockMDNSService2.txtRecord.id })
      expect(all).toHaveLength(1)
      expect(all[0].uuid).toBe(mockMDNSService2.txtRecord.id)
    })

    it('should findAll 2 chromecasts', () => {
      const all = this.Chromecast.findAll({ name: 'Chromecast' })
      expect(all).toHaveLength(2)
    })

    it('should findAll chromecast', () => {
      const all = this.Chromecast.findAll()
      expect(all).toHaveLength(2)
    })

    it('should findAll no chromecast', () => {
      const all = this.Chromecast.findAll({ kwak: true })
      expect(all).toHaveLength(0)
    })

    it('should findOne first chromecast', () => {
      const one = this.Chromecast.findOne({ uuid: mockMDNSService.txtRecord.id })
      expect(one).toBeInstanceOf(this.Chromecast)
      expect(one.uuid).toBe(mockMDNSService.txtRecord.id)
    })

    it('should findOne second chromecast', () => {
      const one = this.Chromecast.findOne({ ip: mockMDNSService2.addresses[0] })
      expect(one).toBeInstanceOf(this.Chromecast)
      expect(one.uuid).toBe(mockMDNSService2.txtRecord.id)
    })

    it('should findOne first find chromecast', () => {
      const one = this.Chromecast.findOne({ name: 'Chromecast' })
      expect(one).toBeInstanceOf(this.Chromecast)
      expect(one.uuid).toBe(mockMDNSService.txtRecord.id)
    })
  })
})
