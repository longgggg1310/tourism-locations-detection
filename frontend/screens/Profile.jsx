import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  MaterialCommunityIcons,
  SimpleLineIcons,
  AntDesign,
} from "react-native-vector-icons";
import { COLORS, SIZES } from "../constants";
import { StatusBar } from "expo-status-bar";
import axios from "axios";
import _ from "lodash";
import { fetchUserData } from "../utils/fetchUserData";

const Profile = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [userLogin, setUserLogin] = useState(false);
  const [verify, setVerify] = useState();

  useEffect(() => {
    throttledCheckUserExistence();
    const pollingInterval = setInterval(throttledCheckUserExistence, 2000);
    return () => clearInterval(pollingInterval);
  }, []);

  const checkUserExistence = useCallback(async () => {
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    try {
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        setUserLogin(true);
        const userToken = await AsyncStorage.getItem("user");
        const userVerify = await fetchUserData(userToken);
        setVerify(userVerify.verify);
        setUserData(userVerify);
      } else {
        navigation.navigate("Login");

        // navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  });

  const throttledCheckUserExistence = _.throttle(checkUserExistence, 2000);

  const userLogout = async () => {
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    try {
      await AsyncStorage.multiRemove([userID, "token", "id", "user"]);
      navigation.replace("Bottom Navigation");
    } catch (error) {
      console.error("Error deleting keys:", error);
    }
  };
  const deleteAllKeys = async () => {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      await AsyncStorage.multiRemove(allKeys);
      console.log("All keys deleted successfully.");
    } catch (error) {
      console.error("Error deleting keys:", error);
    }
  };

  const deleteUser = async () => {
    const storedUser = await AsyncStorage.getItem("user");
    const isVerified = verify;
    const endpoint = "";
    if (isVerified != "TRUE") {
      const response = await axios.post(endpoint, storedUser);
      Alert.alert(
        "Email Verification",
        "Email verification was sent to your account. Please verify.",
        [
          {
            text: "OK",
            onPress: () => {},
          },
        ],
        { cancelable: false }
      );
    }
  };

  const logout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", onPress: () => console.log("Cancel pressed") },
        { text: "Continue", onPress: () => userLogout() },
        // { text: "Delete", onPress: () => deleteAllKeys() },
      ],
      { defaultIndex: 1 } // Index 1 corresponds to the "Delete" button
    );

    navigation.navigate("Profile");
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flex: 1,
          backgroundColor: COLORS.lightWhite,
        }}
      >
        <StatusBar backgroundColor={COLORS.gray} />
        <View style={{ width: "100%" }}>
          <Image
            source={require("../assets/images/da-nang-vietnam-city-skyline-with-color-buildings-vector-37145292.jpg")}
            resizeMode="cover"
            style={styles.maiImag}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("../assets/images/logo_vnuk_eng.png")}
            resizeMode="cover"
            style={styles.profileImg}
          />

          <Text style={styles.name}>
            {userData ? userData.name : "Please login into your account"}
          </Text>
          {userLogin === false ? (
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <View style={styles.loginBtn}>
                <Text style={styles.menuItemText}>LOGIN </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={styles.loginBtn}>
              <Text style={styles.menuItemText}>
                {userData ? userData.email : "email@email.com"}{" "}
              </Text>
            </View>
          )}

          {userLogin === false ? (
            <View></View>
          ) : (
            <View style={styles.menuWrapper}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Favorites")}
              >
                <View style={styles.menuItem(0.5)}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    color={COLORS.primary}
                    size={25}
                  />
                  <Text style={styles.menuItemText}>Favorites</Text>
                </View>
              </TouchableOpacity>

              {/* <TouchableOpacity onPress={() => navigation.navigate("Orders")}>
                <View style={styles.menuItem(0.5)}>
                  <MaterialCommunityIcons
                    name="truck-delivery-outline"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuItemText}>Orders</Text>
                </View>
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={clearCache}>
                <View style={styles.menuItem(0.5)}>
                  <MaterialCommunityIcons
                    name="cached"
                    size={24}
                    color={COLORS.primary}
                  />
                  <Text style={styles.menuItemText}>Clear Cache</Text>
                </View>
              </TouchableOpacity> */}

              {verify != "TRUE" && (
                <TouchableOpacity onPress={deleteUser}>
                  <View style={styles.menuItem(0.5)}>
                    <AntDesign
                      name="deleteuser"
                      size={24}
                      color={COLORS.primary}
                    />
                    <Text style={styles.menuItemText}>Verify Account</Text>
                  </View>
                </TouchableOpacity>
              )}

              <TouchableOpacity onPress={logout}>
                <View style={styles.menuItem(0)}>
                  <AntDesign name="logout" size={24} color={COLORS.primary} />
                  <Text style={styles.menuItemText}>Logout</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  loginBtn: {
    backgroundColor: COLORS.secondary,
    padding: 2,
    borderWidth: 0.4,
    borderRadius: SIZES.xxLarge,
    borderColor: COLORS.primary,
  },
  maiImag: {
    height: 290,
    width: "100%",
  },
  profileImg: {
    height: 155,
    width: 155,
    borderRadius: 999,
    borderColor: COLORS.primary,
    borderWidth: 2,
    marginTop: -90,
  },

  uppaRow: {
    marginHorizontal: 20,
    marginBottom: 25,
  },

  name: {
    fontFamily: "bold",
    color: COLORS.primary,
    marginVertical: 4,
  },

  row: {
    flexDirection: "row",
  },

  menuWrapper: {
    marginTop: SIZES.xLarge,
    width: SIZES.width - SIZES.large,
    backgroundColor: COLORS.lightWhite,
    borderRadius: 12,
  },
  menuItem: (borderBottomWidth) => ({
    flexDirection: "row",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomColor: COLORS.gray,
    borderBottomWidth: borderBottomWidth,
  }),
  menuItemText: {
    fontFamily: "regular",
    color: COLORS.gray,
    marginLeft: 20,
    fontWeight: "600",
    fontSize: 14,
    lineHeight: 26,
  },
});
