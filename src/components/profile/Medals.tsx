import { useEffect, useMemo, useRef, useState } from "react";
import { Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMedalList } from "../../store/slices/medalListSlice";
import { AppDispatch, RootState } from "../../store/store";
import { ParticipatedEventResult, UserMedals } from "../../types/user/userProfile.interface";
import MedalPopup from "./MedalPopup";

interface UserInfoProps {
  newparams: { id: number; selectionType: string } | null;
  fileServerDomain?: string;
  onSeeFullResults?: (eventDetails: ParticipatedEventResult) => void;
}

const getImageUrl = (path?: string | null, fileServerDomain = "") => {
  const server =
    fileServerDomain ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
    "";

  return path ? `${server}${path}` : `${server}/images/medal-default-image.png`;
};

const Medals = ({ newparams, fileServerDomain, onSeeFullResults }: UserInfoProps) => {
  const { id } = newparams ?? {};
  const dispatch = useDispatch<AppDispatch>();
  const { userMadelList, loading } = useSelector((state: RootState) => state.medalList);
  const lastFetchedId = useRef<number | null>(null);
  const [selectedMedelInfo, setSelectedMedelInfo] = useState<UserMedals | null>(null);

  useEffect(() => {
    if (id != null && id !== lastFetchedId.current) {
      lastFetchedId.current = id;
      dispatch(fetchUserMedalList(id));
    }
  }, [dispatch, id]);

  const { specialMedals, groupedMedals } = useMemo(
    () =>
      userMadelList.reduce(
        (acc, medal) => {
          const key = medal.eventYear;
          if (medal.isSpecial) {
            acc.specialMedals[key] = acc.specialMedals[key] || [];
            acc.specialMedals[key].push(medal);
          } else {
            acc.groupedMedals[key] = acc.groupedMedals[key] || [];
            acc.groupedMedals[key].push(medal);
          }
          return acc;
        },
        {
          specialMedals: {} as Record<number, UserMedals[]>,
          groupedMedals: {} as Record<number, UserMedals[]>,
        }
      ),
    [userMadelList]
  );

  const sortedYears = useMemo(
    () => Object.entries(groupedMedals).sort(([yearA], [yearB]) => Number(yearB) - Number(yearA)),
    [groupedMedals]
  );
  const specialList = Object.values(specialMedals).flatMap((medals) => medals);

  if (loading.userMadelList) return <Text style={styles.loading}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medals</Text>
      {userMadelList.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No achievements added yet</Text>
        </View>
      ) : (
        <View style={styles.medalsContainer}>
          {specialList.length > 0 ? <Text style={styles.smallTitle}>Special</Text> : null}
          <View style={styles.medalsRow}>
            {specialList.map((medal, index) => (
              <MedalImage
                key={`${medal.eventMadelId ?? "special"}-${index}`}
                fileServerDomain={fileServerDomain}
                medal={medal}
                onPress={() => setSelectedMedelInfo(medal)}
              />
            ))}
          </View>
          {sortedYears.map(([year, medals]) => (
            <View key={year} style={styles.yearGroup}>
              <Text style={styles.smallTitle}>Event Year: {year}</Text>
              <View style={styles.medalsRow}>
                {medals.map((medal, index) => (
                  <MedalImage
                    key={`${medal.eventMadelId ?? year}-${index}`}
                    fileServerDomain={fileServerDomain}
                    medal={medal}
                    onPress={() => setSelectedMedelInfo(medal)}
                  />
                ))}
              </View>
            </View>
          ))}
        </View>
      )}
      <Modal visible={selectedMedelInfo !== null} transparent animationType="fade" onRequestClose={() => setSelectedMedelInfo(null)}>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalTopBar}>
              <Text style={styles.modalTitle}>Medal Details</Text>
              <Pressable style={styles.closeButton} onPress={() => setSelectedMedelInfo(null)}>
                <Text style={styles.closeText}>x</Text>
              </Pressable>
            </View>
            <ScrollView contentContainerStyle={styles.modalBody}>
              {selectedMedelInfo ? (
                <MedalPopup
                  fileServerDomain={fileServerDomain}
                  medals={userMadelList}
                  onSeeFullResults={(eventDetails) => {
                    setSelectedMedelInfo(null);
                    onSeeFullResults?.(eventDetails);
                  }}
                  selectedMadel={selectedMedelInfo}
                />
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const MedalImage = ({
  medal,
  fileServerDomain,
  onPress,
}: {
  medal: UserMedals;
  fileServerDomain?: string;
  onPress: () => void;
}) => (
  <Pressable style={styles.medalItem} onPress={onPress}>
    <Image source={{ uri: getImageUrl(medal.medelPictureLink, fileServerDomain) }} style={styles.medalImage} resizeMode="cover" />
  </Pressable>
);

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  loading: { color: "#111111", padding: 10 },
  title: { color: "#111111", fontSize: 18, fontWeight: "800", marginBottom: 8 },
  emptyBox: { alignItems: "center", backgroundColor: "#f5f5f5", borderRadius: 8, padding: 16 },
  emptyText: { color: "#555555", fontSize: 13 },
  medalsContainer: { gap: 8 },
  smallTitle: { color: "#111111", fontSize: 10, fontWeight: "800", marginTop: 4 },
  medalsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  yearGroup: { gap: 4, marginTop: 10 },
  medalItem: { borderRadius: 6, overflow: "hidden" },
  medalImage: { borderRadius: 6, height: 90, width: 70 },
  overlay: { backgroundColor: "rgba(0,0,0,0.55)", flex: 1, justifyContent: "center", padding: 16 },
  modal: { backgroundColor: "#ffffff", borderRadius: 8, maxHeight: "90%", overflow: "hidden" },
  modalTopBar: {
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  modalTitle: { color: "#111111", fontSize: 16, fontWeight: "800" },
  closeButton: { alignItems: "center", height: 34, justifyContent: "center", width: 34 },
  closeText: { color: "#111111", fontSize: 18, fontWeight: "800" },
  modalBody: { padding: 12 },
});

export default Medals;
