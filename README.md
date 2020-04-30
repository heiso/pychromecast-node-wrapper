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

## Usage

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

## Examples

🚧

## API Reference

🚧
