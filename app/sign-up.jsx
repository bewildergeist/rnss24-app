import {
  borderRadius,
  labelFontSize,
  primary,
  secondary,
  tintColorLight
} from "@/constants/ThemeVariables";
import { Stack, router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import Toast from "react-native-root-toast";
import StyledButton from "../components/StyledButton";

export default function SignUp() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const auth = getAuth();

  function handleSignUp() {
    createUserWithEmailAndPassword(auth, mail, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        Toast.show('Account created. Go to "Profile" to update your profile.');
        router.replace("/profile");
      })
      .catch(error => {
        let errorMessage = error.code.split("/")[1];
        errorMessage = errorMessage.replaceAll("-", " ");
        setMessage(errorMessage);
      });
  }
  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: "Create new account",
          headerTintColor: tintColorLight,
          headerStyle: {
            backgroundColor: primary
          }
        }}
      />
      <Text style={styles.label}>Mail</Text>
      <TextInput
        style={styles.input}
        onChangeText={setMail}
        value={mail}
        placeholder="Type your mail"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        secureTextEntry={true}
        placeholder="Type your password"
      />
      <Text style={styles.errorMessage}>{message}</Text>
      <StyledButton
        text="Create Account"
        style="primary"
        onPress={handleSignUp}
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
    aspectRatio: 1
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
