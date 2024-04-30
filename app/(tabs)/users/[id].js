import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View, ScrollView } from "react-native";
import Post from "../../components/Post";
import {
  primary,
  secondary,
  tintColorLight
} from "../../../constants/ThemeVariables";

export default function UserDetails() {
  const { id } = useLocalSearchParams();
  const [user, setUser] = useState([]);
  const [posts, setPosts] = useState([]);
  const { EXPO_PUBLIC_API_URL } = process.env;

  useEffect(() => {
    getUser();
    getPosts();
  }, [id]);

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
    <ScrollView>
      <Stack.Screen
        options={{
          title: user?.name || ""
        }}
      />
      <View style={styles.userNameContainer}>
        <Text style={styles.userTitle}>{user?.title}</Text>
        <Text style={styles.userTitle}>{user?.mail}</Text>
      </View>
      <Image style={styles.userImage} source={{ uri: user?.image }} />
      <Text style={styles.postHeader}>Posts by {user?.name}</Text>
      {posts.map(post => (
        <Post post={post} key={post.id} reload={getPosts} />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  userImage: {
    height: 275
  },
  userNameContainer: {
    paddingVertical: 16,
    alignItems: "center",
    backgroundColor: primary
  },
  userTitle: {
    fontSize: 16,
    color: tintColorLight,
    paddingVertical: 4
  },
  postHeader: {
    fontSize: 22,
    paddingTop: 45,
    paddingBottom: 15,
    paddingHorizontal: 12,
    backgroundColor: secondary,
    color: primary,
    fontWeight: "bold"
  }
});
