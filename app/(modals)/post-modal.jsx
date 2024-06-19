import StyledButton from "@/components/StyledButton";
import {
  borderRadius,
  labelFontSize,
  primary,
  secondary,
  tintColorDark,
  tintColorLight
} from "@/constants/ThemeVariables";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import { Stack, router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
import Toast from "react-native-root-toast";
import { auth } from "../../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";

export default function PostModal() {
  const { id } = useLocalSearchParams();
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState("");
  const [location, setLocation] = useState({});
  const { EXPO_PUBLIC_API_URL, EXPO_PUBLIC_OPEN_CAGE_API_KEY } = process.env;

  useEffect(() => {
    async function getPost() {
      const response = await fetch(`${EXPO_PUBLIC_API_URL}/posts/${id}.json`);
      const data = await response.json();
      setImage(data.image);
      setCaption(data.caption);
    }
    if (id) {
      getPost();
    }
  }, [id]);

  useEffect(() => {
    async function requestLocationPersmissions() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }
    }

    async function loadLocation() {
      await requestLocationPersmissions();
      setLocation(await getLocation());
    }

    loadLocation();
  }, []);

  async function getLocation() {
    const currentLocation = await Location.getCurrentPositionAsync();
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${currentLocation.coords.latitude}+${currentLocation.coords.longitude}&key=${EXPO_PUBLIC_OPEN_CAGE_API_KEY}`
    );
    const data = await response.json();
    return {
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
      city:
        data.results[0].components.city ||
        data.results[0].components.postal_city ||
        data.results[0].components.town,
      country: data.results[0].components.country
    };
  }

  function handleSave() {
    if (id) {
      updatePost();
    } else {
      createPost();
    }
  }

  async function updatePost() {
    const post = {
      caption: caption,
      image: image
    };
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/posts/${id}.json`, {
      method: "PATCH",
      body: JSON.stringify(post)
    });
    if (response.ok) {
      Toast.show("Post successfully updated");
      router.back();
    } else {
      Toast.show("Sorry, something went wrong. Please try again.");
    }
  }

  async function createPost() {
    const createdAt = new Date().getTime();
    const post = {
      caption: caption,
      image: image,
      createdAt: createdAt,
      location: location,
      uid: auth.currentUser.uid
    };

    const response = await fetch(`${EXPO_PUBLIC_API_URL}/posts.json`, {
      method: "POST",
      body: JSON.stringify(post)
    });
    if (response.ok) {
      Toast.show("Post successfully created");
      router.back();
    } else {
      Toast.show("Sorry, something went wrong. Please try again.");
    }
  }

  async function chooseImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.3
    });

    if (!result.canceled) {
      // Convert image to blob
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      // Create a reference to the file in Cloud Storage
      const storage = getStorage();
      const storageRef = ref(storage, `images/${uuid.v4()}`);

      // Upload the file to Cloud Storage
      const snapshot = await uploadBytes(storageRef, blob);

      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
      // Save the download URL to React state
      setImage(downloadURL);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Stack.Screen
            options={{
              title: id ? "Update Post" : "Create Post",
              headerLeft: () => (
                <Button
                  title="Cancel"
                  color={Platform.OS === "ios" ? tintColorLight : tintColorDark}
                  onPress={() => router.back()}
                />
              ),
              headerRight: () => (
                <Button
                  title={id ? "Update" : "Create"}
                  color={Platform.OS === "ios" ? tintColorLight : tintColorDark}
                  onPress={handleSave}
                />
              )
            }}
          />

          <Text style={styles.label}>Image</Text>
          <TouchableOpacity onPress={chooseImage}>
            <Image
              style={styles.image}
              source={{
                uri:
                  image ||
                  "https://cederdorff.com/race/images/placeholder-image.webp"
              }}
            />
          </TouchableOpacity>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.input}
            onChangeText={setCaption}
            value={caption}
            placeholder="Type your caption"
          />
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="Type your city"
            value={
              location.city
                ? `${location.city}, ${location.country}`
                : "Loading your current location..."
            }
            editable={false}
          />
          <StyledButton
            text={id ? "Update Post" : "Create Post"}
            onPress={handleSave}
            style="primary"
          />
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: secondary
  },
  image: {
    aspectRatio: 1,
    borderRadius: borderRadius,
    borderColor: primary,
    borderWidth: 2
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 30,
    marginBottom: 5
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: tintColorLight,
    borderRadius: borderRadius,
    borderColor: primary,
    borderWidth: 2
  }
});
