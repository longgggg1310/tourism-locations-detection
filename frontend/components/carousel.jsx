import { View, StyleSheet } from "react-native";
import React from "react";
import { SliderBox } from "react-native-image-slider-box";
import { COLORS, SIZES } from "../constants";

const Carousel = () => {
  const slides = [
    "https://cdn1.vietnamtourism.org.vn/images/content/934a27a870ce686ce1672a7b7117e576.jpg",
    "https://www.tourhero.com/en/magazine/wp-content/uploads/2021/02/da-nang-things-to-do.jpg",
    "https://vietnam.travel/sites/default/files/2021-12/shutterstock_1741919756_resize_0.jpg",
  ];
  return (
    <View style={styles.carouselContainer}>
      <SliderBox
        images={slides}
        dotColor={COLORS.primary}
        inactiveDotColor={COLORS.secondary}
        ImageComponentStyle={{ borderRadius: 15, width: "93%", marginTop: 15 }}
        autoplay
        circleLoop
      />
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  carouselContainer: {
    flex: 1,
    alignItems: "center",
  },
});
