import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons, Feather } from "@expo/vector-icons";
import { SIZES, COLORS } from "../constants";
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { fetchUserData } from "../utils/fetchUserData";

const Search = () => {
  const [userData, setUserData] = useState(null);
  const [verify, setVerify] = useState(null);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [responseImage, setResponseImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRefresh = () => {
    setSearchKey(""); // Reset the search key
    setSearchResults([]); // Clear search results
    setSelectedImage(null); // Clear selected image
    setResponseImage(null); // Clear response image
    setLoading(false); // Set loading to false
    setResult(null); // Clear result
  };
  useEffect(() => {
    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        setNotificationVisible(true);
      }
    })();
  }, []);

  const fetchData = async () => {
    try {
      const id = await AsyncStorage.getItem("id");
      const userID = `user${JSON.parse(id)}`;
      const userData = await AsyncStorage.getItem(userID);
      if (userData !== null) {
        const parsedData = JSON.parse(userData);
        const userToken = await AsyncStorage.getItem("user");
        const userVerify = await fetchUserData(userToken);
        setUserData(parsedData);
        setVerify(userVerify.verify);
      } else {
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Error retrieving user data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
    const pollingInterval = setInterval(fetchData, 2000);
    return () => {
      clearInterval(pollingInterval);
    };
  }, []);
  const classMappings = {
    apec: "APEC park",
    cau_rong: "Dragon Bridge",
    cau_ty: "Love Lock Bridge",
    cham: "Da Nang Museum of Cham Sculpture",
    children_place: "Childrens Cultural Palace",
    dia_bay: "Tien Son Sports Palace",
    han_bridge: "Han Bridge",
    monument: "The 2 September Peace Monument",
    nha_tho: "Rooster Church",
    no_title: "No title",
    thuan_phuoc: "Thuan Phuoc Bridge ",
    // Add more mappings for other classes as needed
  };
  const handleSearch = async () => {
    try {
      const response = await axios.get(`${searchKey}`);
      setSearchResults(response.data);
    } catch (error) {
      alert("You need to input some text to search:", error);
    }
  };
  const getFilenameFromUri = (uri) => {
    const uriComponents = uri.split("/");
    return uriComponents[uriComponents.length - 1];
  };
  const handleCameraPress = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        const formData = new FormData();
        formData.append("image", {
          uri: result.assets[0].uri,
          name: getFilenameFromUri(result.assets[0].uri),
          type: "image/jpeg",
        });

        setLoading(true);
        try {
          const response = await fetch("http://143.198.221.140:5000/predict", {
            method: "POST",
            body: formData,
          });
          if (response.status === 200) {
            const data = await response.json();
            setResponseImage(data.image);
            setLoading(false);
            setResult(data);
          }
        } catch (error) {
          Alert.alert("Network error", error.message);
          setLoading(false);
        }
      }
    } catch (error) {
      Alert.alert("Error launching camera:", error.message);
    }
  };
  const handleNotificationPress = () => {
    Alert.alert("Notification", "You need to verify to use the camera.");
  };
  return (
    <SafeAreaView style={{ color: COLORS.lightWhite, paddingHorizontal: 20 }}>
      <View style={styles.searchContainer}>
        {verify === "TRUE" ? (
          <TouchableOpacity onPress={handleCameraPress}>
            <Feather
              style={styles.searchIcon}
              name="camera"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleNotificationPress}>
            <Feather
              style={styles.searchIcon}
              name="camera"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        )}
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchInput}
            value={searchKey}
            onChangeText={setSearchKey}
            placeholder="What are you looking for?"
          />
        </View>

        <TouchableOpacity style={styles.searchBtn} onPress={handleRefresh}>
          <Ionicons
            name="refresh-outline"
            size={SIZES.xLarge}
            color={COLORS.offwhite}
          />
        </TouchableOpacity>
      </View>
      {selectedImage ? (
        // If a photo is taken, show the image and the text showing predicted class
        <View style={styles.imageContainer}>
          {result && (
            <>
              <Image
                source={{ uri: selectedImage }}
                style={styles.searchImage}
              />
              <Text style={styles.resultText_forecast}>
                Predict Location ={classMappings[result.predicted_class]}
              </Text>
            </>
          )}
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <Image
            source={require("../assets/images/Pose23.png")}
            style={styles.searchImage1}
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default Search;

const styles = StyleSheet.create({
  searchContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.secondary,
    borderRadius: SIZES.medium,
    marginVertical: SIZES.medium,
    height: 50,
  },
  searchImage1: {
    resizeMode: "cover",
    width: SIZES.width - 50,
    height: SIZES.height - 300,
  },

  searchImage: {
    resizeMode: "stretch",
    width: SIZES.width,
    height: SIZES.height - 300,
    opacity: 0.9,
    borderWidth: 2, // Add the desired border width
    borderColor: COLORS.primary, // Add the desired border color
    borderRadius: 10,
  },

  searchWrapper: {
    flex: 1,
    backgroundColor: COLORS.secondary,
    marginRight: SIZES.small,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: SIZES.small,
    height: "100%",
  },
  searchInput: {
    fontFamily: "regular",
    width: "100%",
    height: "100%",
    paddingHorizontal: SIZES.medium,
  },
  searchBtn: {
    width: 50,
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.medium,
    justifyContent: "center",
    alignItems: "center",
  },

  searchIcon: {
    marginRight: 10,
    marginLeft: 10,
    color: "gray",
  },

  resultText_forecast: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center", // Add this line to center the text horizontally
    marginTop: 10,
    borderRadius: SIZES.medium,
  },
  image_forecast: {
    width: 400,
    height: 200,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 20,
  },
  container_forecast: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
  },
  container: {
    marginBottom: 20, // Add the desired margin to the bottom of the container
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
