import StyledButton from "@/components/StyledButton";
import * as ImagePicker from "expo-image-picker";
import { Stack, router } from "expo-router";
import { signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import {
  Button,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-root-toast";
import {
  borderRadius,
  labelFontSize,
  primary,
  secondary,
  tintColorLight
} from "../../constants/ThemeVariables";
import { auth } from "../../firebase-config";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import uuid from "react-native-uuid";
import { ERROR_TOAST_CONFIG } from "../../constants/toast-configurations";

export default function Profile() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [mail, setMail] = useState("");
  const [image, setImage] = useState("");
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  const url = `${EXPO_PUBLIC_API_URL}/users/${auth.currentUser?.uid}.json`;

  useEffect(() => {
    setMail(auth.currentUser.email);

    async function getUser() {
      const response = await fetch(url);
      const userData = await response.json();

      if (userData) {
        // if userData exists set states with values from userData (data from firebase)
        setName(userData?.name);
        setTitle(userData?.title);
        setImage(userData?.image);
      }
    }
    getUser();
  }, []);

  async function handleSignOut() {
    await signOut(auth);
    router.replace("/sign-in");
  }

  async function chooseImage() {
    try {
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
        const storageRef = ref(
          storage,
          `avatars/${name?.toLowerCase()?.replaceAll(" ", "-")}-${uuid.v4()}`
        );

        // Upload the file to Cloud Storage
        const snapshot = await uploadBytes(storageRef, blob);

        // Get the download URL
        const downloadURL = await getDownloadURL(snapshot.ref);
        // Save the download URL to React state
        setImage(downloadURL);
      }
    } catch (error) {
      console.error("Error choosing image:", error);
      Toast.show(
        "Sorry, something went wrong:\n" + error.message,
        ERROR_TOAST_CONFIG
      );
    }
  }

  async function handleSaveUser() {
    const userToUpdate = { name: name, mail: mail, title, image }; // create an object to hold the user to update properties

    const response = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(userToUpdate)
    });
    if (response.ok) {
      Toast.show("Your profile has been updated");
    } else {
      const data = await response.json();
      const errorMessage = data?.error;
      Toast.show(
        "Sorry, something went wrong:\n" + (errorMessage || response.status),
        ERROR_TOAST_CONFIG
      );
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}>
      <ScrollView style={styles.container}>
        <Stack.Screen
          options={{
            headerRight: () => (
              <Button
                title="Sign Out"
                color={Platform.OS === "ios" ? tintColorLight : primary}
                onPress={handleSignOut}
              />
            )
          }}
        />
        <View style={styles.innerContainer}>
          <TouchableOpacity onPress={chooseImage} style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{
                uri:
                  image ||
                  "https://www.pulsecarshalton.co.uk/wp-content/uploads/2016/08/jk-placeholder-image.jpg"
              }}
            />
          </TouchableOpacity>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            onChangeText={setName}
            value={name}
            placeholder="Type your name"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Type your title"
            autoCapitalize="none"
          />
          <Text style={styles.label}>Mail</Text>
          <TextInput
            style={styles.input}
            onChangeText={setMail}
            value={mail}
            placeholder="Type your mail"
            autoCapitalize="none"
            editable={false}
          />
          <View style={styles.buttonContainer}>
            <StyledButton
              text="Save"
              style="primary"
              onPress={handleSaveUser}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondary
  },
  innerContainer: {
    padding: 24
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 24,
    marginBottom: 5
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: tintColorLight,
    borderRadius: borderRadius,
    borderColor: primary,
    borderWidth: 2
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 200,
    padding: 2,
    backgroundColor: tintColorLight
  },
  image: {
    aspectRatio: 1,
    borderRadius: 200
  },
  buttonContainer: {
    marginBottom: 50,
    marginTop: 20
  }
});
