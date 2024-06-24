import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { primary, secondary } from "@/constants/ThemeVariables";

export default function User({ user }) {
  return (
    <TouchableOpacity onPress={() => router.push(`users/${user.id}`)}>
      <View style={styles.userContainer}>
        <View style={styles.userImageContainer}>
          <Image style={styles.userImage} source={{ uri: user.image }} />
        </View>
        <View>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userTitle}>
            {[user?.school, user?.title].filter(Boolean).join(" • ")}
          </Text>
        </View>
        <Ionicons
          style={styles.chevron}
          name="chevron-forward-outline"
          size={28}
          color={primary}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  userContainer: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomColor: secondary,
    borderBottomWidth: 1
  },
  userImageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 100,
    padding: 2,
    height: 55,
    marginRight: 12,
    width: 55
  },
  userImage: {
    aspectRatio: 1,
    borderRadius: 100
  },
  userName: {
    fontSize: 17,
    fontWeight: "bold",
    marginRight: 12
  },
  userTitle: {
    fontSize: 13,
    marginRight: 12
  },
  chevron: {
    position: "absolute",
    right: 10
  }
});
