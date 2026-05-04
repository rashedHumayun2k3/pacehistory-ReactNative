import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface ProfileDetailsProps {
  params: Promise<{ id: string }> | { id: string };
}

const placeholderAvatar = { uri: "https://via.placeholder.com/40" };

const CommentsSection = ({ params }: ProfileDetailsProps) => {
  const [id, setId] = useState<string | null>(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const unwrapParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };

    unwrapParams();
  }, [params]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Comments</Text>

      <View style={styles.form}>
        <Image source={placeholderAvatar} style={styles.avatar} />
        <TextInput
          style={styles.commentBox}
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          placeholderTextColor="#777777"
          multiline
        />
      </View>

      <Pressable style={styles.postButton} onPress={() => setComment("")}>
        <Text style={styles.postText}>Post</Text>
      </Pressable>

      <Comment name="John Doe" time="3 hours ago" text="Amazing performance! Congratulations on your personal best!" />
      <Comment name="Jane Smith" time="1 day ago" text="Great job! The difficulty rating sounds intense." />

      {id ? <Text style={styles.profileHint}>Profile ID: {id}</Text> : null}
    </View>
  );
};

const Comment = ({ name, time, text }: { name: string; time: string; text: string }) => (
  <View style={styles.comment}>
    <Image source={placeholderAvatar} style={styles.avatar} />
    <View style={styles.commentBody}>
      <Text style={styles.commentName}>{name}</Text>
      <Text style={styles.commentTime}>{time}</Text>
      <Text style={styles.commentText}>{text}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { marginTop: 16 },
  title: { color: "#111111", fontSize: 16, fontWeight: "800", marginBottom: 10 },
  form: { alignItems: "flex-start", flexDirection: "row", gap: 10 },
  avatar: { backgroundColor: "#e2e8f0", borderRadius: 20, height: 40, width: 40 },
  commentBox: {
    borderColor: "#ced4da",
    borderRadius: 8,
    borderWidth: 1,
    color: "#111111",
    flex: 1,
    minHeight: 72,
    padding: 10,
    textAlignVertical: "top",
  },
  postButton: {
    alignItems: "center",
    alignSelf: "flex-end",
    backgroundColor: "#1877f2",
    borderRadius: 6,
    marginTop: 8,
    paddingHorizontal: 18,
    paddingVertical: 9,
  },
  postText: { color: "#ffffff", fontWeight: "700" },
  comment: { flexDirection: "row", gap: 10, marginTop: 14 },
  commentBody: { flex: 1 },
  commentName: { color: "#111111", fontSize: 13, fontWeight: "800" },
  commentTime: { color: "#777777", fontSize: 11, marginBottom: 4 },
  commentText: { color: "#333333", fontSize: 13 },
  profileHint: { color: "#777777", fontSize: 12, marginTop: 10, textAlign: "center" },
});

export default CommentsSection;
