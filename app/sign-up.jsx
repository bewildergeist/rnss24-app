import {
  borderRadius,
  labelFontSize,
  placeholderTextColor,
  primary,
  secondary,
  tintColorLight
} from "@/constants/ThemeVariables";
import { Stack, router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, ScrollView } from "react-native";
import Toast from "react-native-root-toast";
import StyledButton from "../components/StyledButton";

export default function SignUp() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();

  function handleSignUp() {
    if (password !== confirmPassword) {
      // Check if passwords match
      setMessage("Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, mail, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        Toast.show("Account created — please fill out your profile");
        router.replace("/profile");
      })
      .catch(error => {
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }
  return (
    <ScrollView
      style={styles.container}
      automaticallyAdjustKeyboardInsets={true}>
      <Stack.Screen
        options={{
          title: "Create new account",
          headerTintColor: tintColorLight,
          headerStyle: {
            backgroundColor: primary
          }
        }}
      />
      <Image
        source={require("@/assets/images/logo.png")}
        style={styles.image}
      />
      <Text style={styles.label}>Mail</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMail}
        value={mail}
        placeholder="Type your mail"
        placeholderTextColor={placeholderTextColor}
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Type your password"
        placeholderTextColor={placeholderTextColor}
      />
      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        secureTextEntry={true}
        placeholder="Confirm your password"
        placeholderTextColor={placeholderTextColor}
      />
      <Text style={styles.errorMessage}>{message}</Text>
      <StyledButton
        text="Create Account"
        style="primary"
        onPress={handleSignUp}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: secondary
  },
  main: {
    flex: 1
  },
  image: {
    aspectRatio: 1,
    height: 300,
    alignSelf: "center"
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 16,
    marginBottom: 5
  },
  input: {
    height: 50,
    padding: 10,
    backgroundColor: tintColorLight,
    borderRadius: borderRadius,
    borderRadius: borderRadius,
    borderColor: primary,
    borderWidth: 2
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
    marginTop: 10
  }
});
