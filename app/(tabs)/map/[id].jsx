import Post from "@/components/Post";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import { ScrollView } from "react-native";

export default function MapDetail() {
  const [post, setPost] = useState({});
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { id } = useLocalSearchParams();

  const getPost = useCallback(async () => {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/posts/${id}.json`);
    const data = await response.json();
    data.id = id;
    setPost(data);
  }, [EXPO_PUBLIC_API_URL, id]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  return (
    <ScrollView>
      <Stack.Screen
        options={{
          title: post?.caption
        }}
      />
      <Post post={post} key={post.id} reload={getPost} />
    </ScrollView>
  );
}
