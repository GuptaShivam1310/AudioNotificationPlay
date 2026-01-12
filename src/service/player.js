import TrackPlayer, { Capability } from 'react-native-track-player';

let setupPromise = null;

export async function setupPlayer() {
  if (setupPromise) {
    return setupPromise;
  }

  setupPromise = (async () => {
    try {
      await TrackPlayer.setupPlayer({
        iosCategory: 'playback',
        iosCategoryMode: 'default',
        iosCategoryOptions: ['allowBluetooth', 'defaultToSpeaker'],
      });
      await TrackPlayer.updateOptions({
        stopWithApp: false,
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
          Capability.Stop,
        ],
        compactCapabilities: [Capability.Play, Capability.Pause],
      });

      console.log('✅ TrackPlayer initialized');
    } catch (e) {
      if (
        typeof e?.message === 'string' &&
        e.message.includes('already been initialized')
      ) {
        console.log('⚠️ TrackPlayer already initialized, ignoring');
        return;
      }
      throw e;
    }
  })();

  return setupPromise;
}

export async function addTrack(url) {
  console.log("dklsdlksd", url)
  // if (!url) return;
  await setupPlayer();   
  await TrackPlayer.reset();

  await TrackPlayer.add({
    id: Date.now().toString(),
    url,
    title: 'AIR Live',
    artist: 'Live Stream',
    isLiveStream: true, // IMPORTANT for HLS
  });

  await TrackPlayer.play();
}

export async function stopTrack() {
  await TrackPlayer.stop();
}