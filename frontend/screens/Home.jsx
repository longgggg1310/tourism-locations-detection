import { StyleSheet, Text, View, TouchableOpacity, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { COLORS, SIZES } from "../constants";
import { Ionicons, Fontisto } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { Carousel, Headings, ProductRow, Welcome } from "../components";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import _ from "lodash";
import { fetchUserData } from "../utils/fetchUserData";
import NetInfo from "@react-native-community/netinfo"; // Import NetInfo

const Home = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [hasShownAlert, setHasShownAlert] = useState(false);

  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [cartCount, setCartCount] = useState("0");
  const [verify, setVerify] = useState();
  const [userDataVerify, setUserDataVerify] = useState("FALSE");
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        setHasShownAlert(false); // Reset hasShownAlert when there's no connectivity
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!isConnected && !hasShownAlert) {
      handleAlert();
      setHasShownAlert(true);
    }
  }, [isConnected, hasShownAlert]);

  const handleAlert = () => {
    Alert.alert(
      "No Internet Connection",
      "Please check your Internet connection and try again.",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
    );
  };

  useEffect(() => {
    throttledCheckUserExistence();
    const pollingInterval = setInterval(throttledCheckUserExistence, 2000);
    return () => clearInterval(pollingInterval);
  }, []);

  const checkUserExistence = async () => {
    const id = await AsyncStorage.getItem("id");
    const userID = `user${JSON.parse(id)}`;
    const userData = await AsyncStorage.getItem("userFull");
    const parsedUserData = JSON.parse(userData);

    const verify = parsedUserData.user.verify;
    setUserDataVerify(verify);
    try {
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        setUserLoggedIn(true);
        const userToken = await AsyncStorage.getItem("user");
        const userVerify = await fetchUserData(userToken);
        setVerify(userVerify.verify);
        setUserData(userVerify);
        const count = await AsyncStorage.getItem("cartCount");

        if (count !== null) {
          const parsedCart = JSON.parse(count);
          setCartCount(parsedCart);
        } else {
          return;
        }
      } else {
        return;
      }
    } catch (error) {
      Alert.alert("Error", "Please check your Internet connection");
    }
  };
  const throttledCheckUserExistence = _.throttle(checkUserExistence, 2000);
  const handlePress = () => {
    if (userLoggedIn) {
      navigation.navigate("Cart");
    } else {
      // Navigate to the Login page when hasId is false
      navigation.navigate("Login");
    }
  };
  return (
    <SafeAreaView>
      <View style={styles.appBarWrapper}>
        <View style={styles.appBar}>
          <Ionicons name="location-outline" size={28} color="black" />
          <Text style={styles.location}>Da Nang, VietNam</Text>
          <View style={{ alignItems: "flex-end" }}>
            {/* <View style={styles.cartCounter}>
              <Text style={styles.cartNumber}>{cartCount ? cartCount : 0}</Text>
            </View> */}
            <TouchableOpacity onPress={() => handlePress()}>
              <Fontisto name="camera" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{ marginHorizontal: 10 }}>
          <Welcome />
          <Carousel />
          <Headings />
          {userLoggedIn && verify === "TRUE" ? <ProductRow /> : null}
        </View>
      </ScrollView>
      {!isConnected && !hasShownAlert && (
        <Text style={styles.internetStatus}>No internet connection</Text>
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightWhite,
  },
  appBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  appBarWrapper: {
    marginHorizontal: 22,
    marginTop: 12,
  },
  location: {
    color: COLORS.gray,
    fontFamily: "semibold",
    fontSize: SIZES.medium,
  },
  cartCounter: {
    position: "absolute",
    bottom: 16,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "green",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  cartNumber: {
    fontWeight: "600",
    fontSize: 10,
    color: COLORS.white,
  },
  scrollViewContent: {
    flexGrow: 1, // Allow the ScrollView to take up only the available space
    marginHorizontal: 10,
  },
});
