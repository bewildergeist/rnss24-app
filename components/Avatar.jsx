import { primary } from "@/constants/ThemeVariables";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Avatar({ userId }) {
  const [user, setUser] = useState([]);
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    async function getUser() {
      const response = await fetch(
        `${EXPO_PUBLIC_API_URL}/users/${userId}.json`
      );
      const data = await response.json();
      setUser(data);
    }
    if (userId) {
      getUser();
    }
  }, [userId]);

  return (
    <Link href={`/users/${userId}`} asChild>
      <TouchableOpacity>
        <View style={styles.avatarContainer}>
          <View style={styles.avatarImageContainer}>
            <Image style={styles.avatarImage} source={{ uri: user?.image }} />
          </View>
          <View>
            <Text style={styles.avatarName}>{user?.name}</Text>
            <Text style={styles.avatarTitle}>
              {[user?.school, user?.title].filter(Boolean).join(" • ")}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  avatarContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  avatarImageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 100,
    padding: 2,
    height: 55,
    marginRight: 12,
    width: 55
  },
  avatarImage: {
    aspectRatio: 1,
    borderRadius: 100
  },
  avatarName: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 12
  },
  avatarTitle: {
    fontSize: 13,
    marginRight: 12
  }
});
