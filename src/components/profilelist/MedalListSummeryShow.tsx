import React from "react";

const { Image, StyleSheet, Text, View } = require("react-native");

interface UserInfoProps {
  medalPictrues: string;
}

const getImageUrl = (path: string) => `${process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME || process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME || ""}${path}`;

const MedalListSummeryShow = ({ medalPictrues }: UserInfoProps) => {
  const maxImages = 50;
  const medalLinks = medalPictrues?.split("|").filter((medalLink) => medalLink.trim() !== "") || [];
  const hasMore = medalLinks.length > maxImages;

  if (medalLinks.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.imageWrap}>
        {medalLinks.slice(0, maxImages).map((medalLink, index) => (
          <View key={`${medalLink}-${index}`} style={styles.imageContainer}>
            <Image source={{ uri: getImageUrl(medalLink) }} style={styles.medalImage} resizeMode="cover" />
          </View>
        ))}
        {hasMore && <Text style={styles.moreText}>(more...)</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { borderRadius: 5, paddingHorizontal: 5, paddingVertical: 10 },
  imageWrap: { flexDirection: "row", flexWrap: "wrap", gap: 4 },
  imageContainer: { borderRadius: 4, overflow: "hidden" },
  medalImage: { borderRadius: 4, height: 34, width: 28 },
  moreText: { alignSelf: "center", color: "#6c757d", fontSize: 12 },
});

export default MedalListSummeryShow;
