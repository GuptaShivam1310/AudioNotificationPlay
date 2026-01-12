import Sound from 'react-native-sound';

export function playSoundFromUrl(url: string) {
  console.log('playSoundFromUrl', url);
  const sound = new Sound(url, undefined, error => {
    console.log("error", JSON.stringify(error), error)
    if (!error) {
      sound.play();
    }
  });
}