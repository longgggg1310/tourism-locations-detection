import { StyleSheet, Text, View, Image, Alert, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS, SIZES } from "../constants";
import { ScrollView } from "react-native-gesture-handler";
import Input from "../components/auth/input";
import Button from "../components/auth/Button"; // Import the separate Button component
import BackButton from "../components/auth/BackButton";
import React, { useEffect, useState } from "react";

const ResetPasswordPage = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const handleEmailChange = (text) => {
    setEmail(text);
  };
  const handlePasswordChange = async () => {
    try {
      // Send the email to the API
      const response = await fetch("", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }), // Send the email in the request body
      });

      if (response.ok) {
        // Email sent successfully
        alert(
          "Email sent successfully! Please check email to change your password"
        );
        setEmail(email);
      } else {
        // Handle error cases if needed
        const errorData = await response.json();
        alert(errorData.message);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
  return (
    <ScrollView>
      <SafeAreaView style={{ marginHorizontal: 20 }}>
        <View style={styles.container}>
          <BackButton onPress={() => navigation.goBack()} />
        </View>

        <View style={styles.bottomContainer}>
          <Input
            placeholder="Enter email"
            icon="email-outline"
            label={"Email"}
            value={email}
            onChangeText={handleEmailChange}
          />
          <Button
            title={"Send mail to reset password"}
            onPress={handlePasswordChange}
          />
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default ResetPasswordPage;

const styles = StyleSheet.create({
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

  container: {
    marginTop: SIZES.large,
    marginBottom: 20, // Add some margin at the bottom of the BackButton
  },

  bottomContainer: {
    marginTop: SIZES.large,
  },
  buttonContainer: {
    marginTop: 20,
    marginHorizontal: 20,
  },
});
