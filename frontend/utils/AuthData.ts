// authUtils.js
import AsyncStorage from "@react-native-async-storage/async-storage";

const checkUserExistence = async () => {
  try {
    const id = await AsyncStorage.getItem("id");

    const userID = `user${JSON.parse(id)}`;
    const userData = await AsyncStorage.getItem(userID);

    if (userData !== null) {
      const parsedUserData = JSON.parse(userData);
      return parsedUserData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error retrieving user data:", error);
    return null;
  }
};

export default checkUserExistence;
