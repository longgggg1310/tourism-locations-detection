import NetInfo, { NetInfoState } from "@react-native-community/netinfo";

let isConnected = false;

// Utility function to check internet connection
export const checkInternetConnection = async (): Promise<boolean> => {
  try {
    const netInfoState: NetInfoState = await NetInfo.fetch();
    isConnected = netInfoState.isConnected;
    return isConnected;
  } catch (error) {
    console.error("Error checking internet connection:", error);
    return false;
  }
};

// Listen for changes in internet connectivity
NetInfo.addEventListener((state) => {
  isConnected = state.isConnected;
});
