import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { RootSiblingParent } from "react-native-root-siblings";
import { primary, tintColorLight } from "@/constants/ThemeVariables";
import { auth } from "@/firebase-config";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { StatusBar } from "expo-status-bar";
import { onAuthStateChanged } from "firebase/auth";
import "react-native-reanimated";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)"
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      setTimeout(async () => {
        await SplashScreen.hideAsync();
      }, 1500);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (!user) {
        // No user is signed in.
        router.replace("/sign-in");
      }
    });
  });

  return (
    <RootSiblingParent>
      <StatusBar style="light" />
      <ActionSheetProvider>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="(modals)/post-modal"
            options={{
              presentation: "modal",
              headerStyle: {
                backgroundColor: primary,
                headerTintColor: tintColorLight
              },
              headerTintColor: tintColorLight,
              headerTitleStyle: {
                fontWeight: "bold"
              }
            }}
          />
        </Stack>
      </ActionSheetProvider>
    </RootSiblingParent>
  );
}
