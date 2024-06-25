import {
  borderRadius,
  labelFontSize,
  placeholderTextColor,
  primary,
  secondary,
  tintColorLight
} from "@/constants/ThemeVariables";
import { Stack, router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Image, StyleSheet, Text, TextInput, View } from "react-native";
import StyledButton from "../components/StyledButton";

export default function SignIn() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();

  function handleSignIn() {
    signInWithEmailAndPassword(auth, mail, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log(user);
        router.replace("/");
      })
      .catch(error => {
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }

  function goToSignUp() {
    router.push("/sign-up");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Sign In",
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
      <Text style={styles.errorMessage}>{message}</Text>
      <StyledButton text="Sign In" onPress={handleSignIn} style="primary" />
      <StyledButton
        text="Create New Account"
        onPress={goToSignUp}
        style="secondary"
      />
    </View>
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
