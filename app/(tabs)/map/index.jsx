import MapMarker from "@/components/MapMarker";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import MapView, { PROVIDER_DEFAULT, PROVIDER_GOOGLE } from "react-native-maps";

export default function Map() {
  const [posts, setPosts] = useState([]);
  const { EXPO_PUBLIC_API_URL } = process.env;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    getPosts();
  }, []);

  useEffect(() => {
    async function requestLocationPersmissions() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync();
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.15,
        longitudeDelta: 0.04
      });
    }
    requestLocationPersmissions();
  }, []);

  // Sometimes we want to run side-effects when a screen is focused.
  // https://reactnavigation.org/docs/use-focus-effect/
  useFocusEffect(
    // If you don't wrap your effect in React.useCallback, the effect will run every render if the screen is focused.
    useCallback(() => {
      getPosts();
    }, [])
  );

  async function getPosts() {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/posts.json`);
    const dataObj = await response.json();
    const postsArray = Object.keys(dataObj).map(key => ({
      id: key,
      ...dataObj[key]
    })); // from object to array
    setPosts(postsArray);
  }

  return (
    <View style={styles.container}>
      <MapView
        provider={Platform.OS === "ios" ? PROVIDER_DEFAULT : PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={location}
        region={location}
        showsUserLocation={true}
        showsMyLocationButton={true}>
        {posts.map(post => (
          <MapMarker post={post} key={post.id} />
        ))}
      </MapView>
    </View>
  );
}

// styling

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    width: "100%",
    height: "100%"
  }
});
