/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Import the external library
import {
  SafeAreaProvider,
  SafeAreaView,
} from 'react-native-safe-area-context';

// Import the local files
import {
  requestUserPermission,
  createNotificationChannel,
  registerForegroundHandler,
  registerNotificationClickHandler,
} from './src/service/requestNotification';
import { addTrack, setupPlayer, stopTrack } from './src/service/player';
function App() {
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      await setupPlayer();
      // Sound.setCategory('Playback', true);
    };
    init();
  }, []);
  useEffect(() => {
    let unsubscribe: undefined | (() => void);

    const init = async () => {
      const token = await requestUserPermission();
      setFcmToken(token);

      await createNotificationChannel();
      registerNotificationClickHandler();

      unsubscribe = registerForegroundHandler();
    };

    init();

    return () => unsubscribe?.();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={'light-content'} />
      <AppContent fcmToken={fcmToken} />
    </SafeAreaProvider>
  );
}

function AppContent({ fcmToken }: { fcmToken: string | null }) {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🔥 FCM Token</Text>

      <Text selectable style={styles.token}>
        {fcmToken ?? 'Fetching token...'}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: "space-between" }}>
        <TouchableOpacity onPress={() => addTrack('https://air.pc.cdn.bitgravity.com/air/live/pbaudio001/playlist.m3u8')} style={styles.stopStartBtn}>
          <Text style={styles.token}>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => stopTrack()} style={styles.stopStartBtn}>
          <Text style={styles.token}>Stop</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    flex: 1,
    backgroundColor: "#fff"
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  token: {
    color: '#fff'
  },
  stopStartBtn:{
    padding: 10, backgroundColor: '#333', borderRadius: 5 
  }
});

export default App;
