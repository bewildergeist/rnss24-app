import Post from "@/components/Post";
import {
  labelFontSize,
  primary,
  secondary,
  tintColorDark
} from "@/constants/ThemeVariables";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { tintColorLight } from "../../../constants/ThemeVariables";

export default function UserDetails() {
  const { id, updatedAt } = useLocalSearchParams();
  const [user, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    getUser();
    getPosts();
  }, [id, updatedAt]);

  async function getUser() {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/users/${id}.json`);
    const data = await response.json();
    setUser(data);
  }

  async function getPosts() {
    // fetch posts where uid is equal to userId prop
    const response = await fetch(
      `${EXPO_PUBLIC_API_URL}/posts.json?orderBy="uid"&equalTo="${id}"`
    );
    const dataObj = await response.json();
    const postsArray = Object.keys(dataObj).map(key => ({
      id: key,
      ...dataObj[key]
    })); // from object to array
    postsArray.sort((postA, postB) => postB.createdAt - postA.createdAt); // sort by timestamp/ createdBy
    setPosts(postsArray);
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: user?.name || "User profile"
        }}
      />
      <View style={styles.userInfoContainer}>
        <View style={styles.imageContainer}>
          <Image style={styles.image} source={{ uri: user?.image }} />
        </View>
        <Text
          style={[
            styles.userInfoLabel,
            { alignSelf: "center", marginVertical: 16 }
          ]}>
          {[user?.mail, user?.school, user?.country]
            .filter(Boolean)
            .join("︎ ︎︎• ")}
        </Text>
        <UserInfoSection label="About me" content={user?.aboutMe} />
        <UserInfoSection label="I love to..." content={user?.loveToDo} />
        <UserInfoSection
          label="An app I wish existed"
          content={user?.wishApp}
        />
      </View>
      {posts.map(post => (
        <Post post={post} key={post.id} reload={getPosts} />
      ))}
    </ScrollView>
  );
}

function UserInfoSection({ label, content }) {
  if (!content) {
    return null;
  }
  return (
    <View style={styles.userInfoSection}>
      <Text style={styles.userInfoLabel}>{label}</Text>
      <Text style={styles.userInfo}>{content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: secondary
  },
  userInfoContainer: {
    flex: 1,
    backgroundColor: secondary,
    padding: 24,
    borderBottomWidth: 2,
    borderBottomColor: primary
  },
  userInfoSection: {
    paddingBottom: 16
  },
  userInfoLabel: {
    color: primary,
    fontWeight: "bold",
    fontSize: 17
  },
  userInfo: {
    color: primary,
    fontSize: 17
  },
  imageContainer: {
    borderWidth: 3,
    borderColor: primary,
    borderRadius: 200,
    padding: 2,
    width: "60%",
    backgroundColor: tintColorLight,
    alignSelf: "center"
  },
  image: {
    aspectRatio: 1,
    borderRadius: 200
  },
  label: {
    fontSize: labelFontSize,
    color: primary,
    marginTop: 30,
    marginBottom: 5
  },
  userTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: tintColorDark,
    paddingVertical: 4
  }
});
