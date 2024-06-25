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

    console.log(users);
    setUsers(usersArray);
  }

  useEffect(() => {
    // group users by title
    const groupUsersBySchool = users.reduce((schools, user) => {
      // reduce to object
      const school = user.school || "Others"; // default title
      if (!schools[school]) {
        // if title not exist, create new
        schools[school] = { title: school, data: [] }; // title: title, data: []
      }
      schools[school].data.push(user); // push user to data
      return schools; // return object
    }, {}); // initial value is empty object

    const sectionData = Object.values(groupUsersBySchool); // from object to array
    sectionData.sort((a, b) => a.school?.localeCompare(b.school)); // sort by title
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
    padding: 10
  }
});
