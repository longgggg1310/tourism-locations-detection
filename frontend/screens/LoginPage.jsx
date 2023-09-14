import { StyleSheet, Text, View, Image, Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../components/auth/input";
import Button from "../components/auth/Button";
import BackButton from "../components/auth/BackButton";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import jwtDecode from "jwt-decode";

const LoginPage = ({ navigation }) => {
  const [loader, setLoader] = React.useState(false);
  const [responseData, setResponseData] = useState(null);
  const [inputs, setInput] = React.useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = React.useState({});

  const handleError = (errorMessage, input) => {
    setErrors((prevState) => ({ ...prevState, [input]: errorMessage }));
  };

  // INPUT VALIDATION
  const validate = () => {
    Keyboard.dismiss();
    let valid = true;

    if (!inputs.email) {
      handleError("Provide a valid email", "email");
      valid = false;
    } else if (!inputs.email.match(/\S+@\S+\.\S+/)) {
      handleError("Provide a valid email", "email");
      valid = false;
    }

    if (!inputs.password) {
      handleError("Please input password", "password");
      valid = false;
    } else if (inputs.password.length < 8) {
      handleError("At least 8 characters are required", "password");
      valid = false;
    }

    if (valid) {
      login();
    }
  };

  const login = async () => {
    setLoader(true);
    try {
      const endpoint = "";
      const data = inputs;
      const response = await axios.post(endpoint, data);
      const accessToken = response.data.accessToken;
      const decodedToken = jwtDecode(accessToken);

      await AsyncStorage.setItem("user", response.data.accessToken);
      await AsyncStorage.setItem("userFull", JSON.stringify(decodedToken));
      await AsyncStorage.setItem(
        `user${decodedToken.user.id}`,
        JSON.stringify(decodedToken.user)
      );
      const token = await AsyncStorage.getItem("user");

      console.log("your decoded token is: ", token);
      await AsyncStorage.setItem("id", JSON.stringify(decodedToken.user.id));
      navigation.replace("Bottom Navigation");
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || "An error occurred during login.";
        Alert.alert("Error", errorMessage);
      } else {
        Alert.alert("Error", "Need to login");
      }
    }
  };

  const handleChanges = (text, input) => {
    setInput((prevState) => ({ ...prevState, [input]: text }));
  };
  // useEffect(() => {
  //   // Call the login API on component mount
  //   login();
  // }, []);
  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <View>
          <Image
            source={require("../assets/images/esy-030573560.jpg")}
            style={styles.img}
          />
          {/* WELCOME TEXT */}
          <Text style={styles.motto}>DaNang discovery</Text>
          <Input
            placeholder="Enter email"
            icon="email-outline"
            label={"Email"}
            error={errors.email}
            onFocus={() => {
              handleError(null, "email");
            }}
            onChangeText={(text) => handleChanges(text, "email")}
          />

          <Input
            placeholder="Password"
            icon="lock-outline"
            label={"Password"}
            error={errors.password}
            onFocus={() => {
              handleError(null, "password");
            }}
            onChangeText={(text) => handleChanges(text, "password")}
          />
          <Button title={"LOGIN"} onPress={validate} />
          <Text
            style={styles.registered}
            onPress={() => navigation.navigate("Signup")}
          >
            Don't have an account? Register
          </Text>
          <Text
            style={styles.registered}
            onPress={() => navigation.navigate("ResetPassword")}
          >
            Forgort password?
          </Text>
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  img: {
    height: SIZES.height / 3,
    width: SIZES.width - 30,
    resizeMode: "contain",
    marginBottom: SIZES.xxLarge,
  },

  motto: {
    fontFamily: "bold",
    fontSize: SIZES.xLarge,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: SIZES.large,
  },

  registered: {
    marginTop: 10,
    color: COLORS.black,
    textAlign: "center",
  },
});
