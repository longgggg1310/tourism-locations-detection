import axios from "axios";

export const fetchUserData = async (userToken: string) => {
  const endpoint = "http:///profile/my";
  try {
    const response = await axios.get(endpoint, {
      headers: {
        Authorization: `Bearer ${userToken}`,
      },
    });

    return response.data;
  } catch (error) {
    return null;
  }
};
