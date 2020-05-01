[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![](https://github.com/heiso/pychromecast-node-wrapper/workflows/Test/badge.svg?branch=master)
![](https://github.com/heiso/pychromecast-node-wrapper/workflows/Publish/badge.svg?branch=master)

# pychromecast-node-wrapper

You're probably asking yourself "why not rewrite pychromecast in node ?". Heh well..., the interface protocol for Google Chromecast devices isn't that well documented and the folks behind [pychromecast](https://github.com/home-assistant-libs/pychromecast) made a great work at reverse engineering the Chromecast protocol. Pychromecast is popular and well maintained, so my library's purpose is only to expose some actions from pychromecast to the js world.

## Install

```bash
npm i pychromecast-wrapper
pip install -r node_modules/pychromecast-wrapper/requirement.txt
```

If something goes wrong during installation, something around mdns and node-gyp, take a look at [mdns#installation](https://github.com/agnat/node_mdns#installation) and install missing system package.

## Usage and Exemple

```javascript
const { Chromecast } = require('pychromecast-wrapper')

(async () => {

  // Wait for discovery to do its work
  await new Promise(resolve => setTimeout(resolve, 1000))

  // Set all dsicovered chromecast volume
  await Chromecast.setVolume({ volume: 0.5 })

  // Find chromecast with a given name and toggle mute status
  const chromecast = Chromecast.findOne({ name: 'My Chromecast' })
  await chromecast.toggleMute()

})()
```

## API Reference

| Method | Arguments | Default | Returns | Description |
| :--- | :---: | :---: | :---: | :--- |
| `Chromecast.findAll()` | `{ [key: string]: any }` | - | [Chromecast] | Get all devices where predicate return true |
| `Chromecast.findOne()` | `{ [key: string]: any }` | - | [Chromecast] | Get first device where predicate return true |
| `async Chromecast.refreshStatus()` | - | - | [Chromecast] | Refresh all devices status (isPlaying, isMuted, isActive, volume) |
| `async Chromecast.setVolume()` | `{ volume: float }` | `{ volume = 1 }` | [Chromecast] | Set volume for all devices (between 0 and 1) |
| `async Chromecast.toggleMute()` | - | - | [Chromecast] | Toggle mute for all devices. Refresh all devices status |
| `async Chromecast.playPause()` | - | - | [Chromecast] | Toggle play or pause for all devices. Refresh all devices status |
| `async Chromecast.rewind()` | `{ time: number }` | `{ time = 30 }` | [Chromecast] | Rewind played media fo a given time in second for all active devices. Refresh all devices status |

| Method | Arguments | Default | Returns | Description |
| :--- | :---: | :---: | :---: | :--- |
| `chromecast#setVolume()` | `{ volume: float }` | `{ volume = 1 }` | [Chromecast] | Set volume for current instance (between 0 and 1) |
| `chromecast#toggleMute()` | - | - | [Chromecast] | Toggle mute for current instance. Refresh current instance status |
| `chromecast#playPause()` | - | - | [Chromecast] | Toggle play or pause for current instance. Refresh current instance status |
| `chromecast#rewind()` | `{ time: number }` | `{ time = 30 }` | [Chromecast] | Rewind played media fo a given time in second for current instance. Refresh current instance status |

| Attribute | Type | Description |
| :--- | :---: | :--- |
| `chromecast#isPlaying` | `boolean` | `true` if a media is playing on chromecast |
| `chromecast#isMuted` | `boolean` | `true` if volume is muted on chromecast |
| `chromecast#isActive` | `boolean` | `true` if an app is active on chromecast (ex: true if Netflix running) |
| `chromecast#volume` | `float` | Return a float between 0 and 1 |
| `chromecast#refreshedAt` | `timestamp` | Date of last status refresh |
| `chromecast#name` | `string` | Chromecast friendly name |
| `chromecast#uuid` | `string` | Chromecast uuid |
| `chromecast#modelName` | `string` | Chromecast model name |
| `chromecast#castType` | `cast | audio | group` | Chromecast type |
| `chromecast#port` | `number` | Chromecast port |
| `chromecast#ip` | `string` | Chromecast ip address |
