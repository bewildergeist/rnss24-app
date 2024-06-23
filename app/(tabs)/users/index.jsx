import User from "@/components/User";
import { primary, secondary } from "@/constants/ThemeVariables";
import { useEffect, useState } from "react";
import {
  RefreshControl,
  SectionList,
  StyleSheet,
  Text,
  View
} from "react-native";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [sections, setSections] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const EXPO_PUBLIC_API_URL = process.env.EXPO_PUBLIC_API_URL;

  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    const response = await fetch(`${EXPO_PUBLIC_API_URL}/users.json`);
    const dataObj = await response.json();
    const usersArray = Object.keys(dataObj).map(key => ({
      id: key,
      ...dataObj[key]
    })); // from object to array
    usersArray.sort((userA, userB) => userA.name.localeCompare(userB.name)); // sort by name
    setUsers(usersArray);
  }

  useEffect(() => {
    // group users by title
    const groupUsersByTitle = users.reduce((titles, user) => {
      // reduce to object
      const title = user.title || "Others"; // default title
      if (!titles[title]) {
        // if title not exist, create new
        titles[title] = { title: title, data: [] }; // title: title, data: []
      }
      titles[title].data.push(user); // push user to data
      return titles; // return object
    }, {}); // initial value is empty object

    const sectionData = Object.values(groupUsersByTitle); // from object to array
    sectionData.sort((a, b) => a.title.localeCompare(b.title)); // sort by title
    setSections(sectionData); // set sections - state
  }, [users]);

  async function handleRefresh() {
    setRefreshing(true);
    await getUsers();
    setTimeout(() => {
      setRefreshing(false);
    }, 500);
  }

  function renderUser(item) {
    const user = item.item;
    return <User user={user} />;
  }

  function renderHeader({ section }) {
    return <Text style={styles.header}>{section.title}</Text>;
  }

  return (
    <SectionList
      sections={sections}
      renderItem={renderUser}
      renderSectionHeader={renderHeader}
      keyExtractor={item => item.id}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={primary}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: "bold",
    color: primary,
    backgroundColor: secondary,
    paddingHorizontal: 10,
    paddingTop: 25,
    paddingBottom: 10
  }
});
