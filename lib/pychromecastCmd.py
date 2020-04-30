import click
import json
import pychromecast

TIMEOUT = 0.5

def get_chromecast_from_host(str_host):
    raw = json.loads(str_host)
    host = [
      raw['ip_address'],
      raw['port'],
      raw['uuid'],
      raw['model_name'],
      raw['friendly_name']
    ]
    return pychromecast.get_chromecast_from_host(host)


def echo_status(cast):
    cast.media_controller.block_until_active(TIMEOUT)
    click.echo(json.dumps({
        'volume_level': cast.status.volume_level,
        'volume_muted': cast.status.volume_muted,
        'is_playing': cast.media_controller.is_playing,
        'is_active': cast.media_controller.is_active
    }))


@click.group()
def cli():
    pass


@click.command()
@click.option("--host")
def infos(host):
    cast = get_chromecast_from_host(host)
    click.echo(json.dumps({
      'name': cast.name,
      'uuid': cast.uuid,
      'model_name': cast.model_name,
      'cast_type': cast.cast_type,
      'port': cast.port,
      'ip': cast.host
    }))


@click.command()
@click.option("--host")
def refreshstatus(host):
    cast = get_chromecast_from_host(host)
    cast.wait()
    cast.media_controller.block_until_active(TIMEOUT)
    echo_status(cast)


@click.command()
@click.option("--host")
def playpause(host):
    cast = get_chromecast_from_host(host)
    cast.wait()
    cast.media_controller.block_until_active(TIMEOUT)
    if cast.media_controller.is_paused:
        cast.media_controller.play()

    if cast.media_controller.is_playing:
        cast.media_controller.pause()
    
    echo_status(cast)


@click.command()
@click.option("--host")
@click.option("--volume", default=1)
def setvolume(host, volume):
    cast = get_chromecast_from_host(host)
    cast.wait()
    cast.set_volume(float(volume))
    echo_status(cast)


@click.command()
@click.option("--host")
def togglemute(host):
    cast = get_chromecast_from_host(host)
    cast.wait()
    cast.set_volume_muted(not cast.status.volume_muted)
    echo_status(cast)


@click.command()
@click.option("--host")
@click.option("--time", default=30)
def rewind(host, time):
    cast = get_chromecast_from_host(host)
    cast.wait()
    cast.media_controller.block_until_active(TIMEOUT)
    if (cast.media_controller.is_active):
      cast.media_controller.seek(cast.media_controller.status.adjusted_current_time - float(time))
    
    echo_status(cast)


cli.add_command(infos)
cli.add_command(playpause)
cli.add_command(setvolume)
cli.add_command(togglemute)
cli.add_command(rewind)

if __name__ == '__main__':
    cli()