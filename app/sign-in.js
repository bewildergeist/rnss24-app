import { Stack, useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Button, StyleSheet, Text, TextInput, View } from "react-native";
import {
  borderRadius,
  labelFontSize,
  primary,
  secondary,
  tintColorLight
} from "../constants/ThemeVariables";

export default function SignIn() {
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
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
      <Button title="Sign In" color={primary} onPress={handleSignIn} />
      <Button title="Create new account" color={primary} onPress={goToSignUp} />
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
    marginVertical: 20,
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
