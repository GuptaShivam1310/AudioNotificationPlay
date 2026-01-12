import TrackPlayer from 'react-native-track-player';

module.exports = async function () {
  TrackPlayer.addEventListener(
    TrackPlayer.Event.RemotePlay,
    () => {
      TrackPlayer.play();
    }
  );

  TrackPlayer.addEventListener(
    TrackPlayer.Event.RemotePause,
    () => {
      TrackPlayer.pause();
    }
  );

  TrackPlayer.addEventListener(
    TrackPlayer.Event.RemoteStop,
    () => {
      TrackPlayer.stop();
    }
  );

  TrackPlayer.addEventListener(
    TrackPlayer.Event.RemoteNext,
    () => {
      console.log('Next');
      TrackPlayer.skipToNext();
    }
  );

  TrackPlayer.addEventListener(
    TrackPlayer.Event.RemotePrevious,
    () => {
      console.log('Previous');
      TrackPlayer.skipToPrevious();
    }
  );
};
