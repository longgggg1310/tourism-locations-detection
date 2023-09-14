import React, { useEffect, useCallback, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants";
const Tab = createBottomTabNavigator();
import { Cart, Home, LoginPage, Profile, Search } from "../screens";
import AsyncStorage from "@react-native-async-storage/async-storage";
import _ from "lodash";

const screenOptions = {
  tabBarShowLabel: false,
  headerShown: false,
  tabBarHideOnKeyboard: true,
  tabBarStyle: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    elevation: 0,
    height: 30,
  },
};

const BottomTabNavigation = () => {
  let [token, setToken] = useState("");

  useEffect(() => {
    throttledCheckUserExistence();
    const pollingInterval = setInterval(throttledCheckUserExistence, 2000);
    return () => clearInterval(pollingInterval);
    // checkUserExistence();
  }, []);

  const checkUserExistence = useCallback(() => {
    try {
      AsyncStorage.getItem("user").then((value) => {
        if (value) {
          setToken(value);
        }
      });
    } catch (error) {
      console.error(error);
      setToken("");
    }
  });

  const throttledCheckUserExistence = _.throttle(checkUserExistence, 2000);

  if (!token) {
    return (
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
          name="Login"
          component={LoginPage}
          options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray2}
                />
              );
            },
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Search"
        component={Search}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name="search-sharp"
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? COLORS.primary : COLORS.gray2}
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;
