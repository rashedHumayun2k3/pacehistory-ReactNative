import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import StatusHandler from "../common/StatusHandler";
import { routes } from "../../routes/routes";
import { AppDispatch, RootState } from "../../store/store";
import {
  fetchUserList,
  fetchUserListFilter,
  resetLoadedPages,
} from "../../store/slices/userListSlice";
import { UserProfile } from "../../types/user/userProfile.interface";
import AchievementBadgeShow from "./AchievementBadgeShow";
import MedalListSummeryShow from "./MedalListSummeryShow";
import ProfileFilters from "./ProfileFilters";

interface FilterState {
  isTrainer: boolean | null;
  selectedFilters: string[];
  selectedCountry: string;
}

interface ProfileListProps {
  navigate: (path: string) => void;
}

const FILE_SERVER =
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  process.env.EXPO_PUBLIC_FILESERVER_DOMAIN_NAME ||
  "";

const DEFAULT_PROFILE_IMAGE = `${FILE_SERVER}/images/user-profile.jpg`;

const ProfileList = ({ navigate }: ProfileListProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { userList, loadedPages, loading, error } = useSelector(
    (state: RootState) => state.userList
  );

  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [nameFilter, setNameFilter] = useState("");
  const [loggedInUserCountry, setLoggedInUserCountry] = useState("bd");
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    isTrainer: null,
    selectedFilters: [],
    selectedCountry: "bd",
  });
  const pageSize = 10;

  const shouldUseFilteredList =
    filters.isTrainer !== null ||
    filters.selectedFilters.length > 0 ||
    nameFilter.length >= 3;

  const filterActive =
    filters.selectedFilters.length > 0 ||
    filters.selectedCountry.length > 0 ||
    nameFilter.length > 0 ||
    filters.isTrainer === true;

  useEffect(() => {
    const loadUserCountry = async () => {
      const storedUser = await AsyncStorage.getItem("userProfile");

      if (storedUser && storedUser !== "[]") {
        try {
          const user = JSON.parse(storedUser);
          if (user?.country) {
            setLoggedInUserCountry(user.country);
            setFilters((current) => ({
              ...current,
              selectedCountry: user.country,
            }));
          }
        } catch (storageError) {
          console.error("Error parsing user profile from AsyncStorage:", storageError);
        }
      }
    };

    loadUserCountry();
  }, []);

  useEffect(() => {
    if (!hasMore || loadedPages.includes(pageIndex)) {
      return;
    }

    const loadUsers = async () => {
      const action = shouldUseFilteredList
        ? await dispatch(
            fetchUserListFilter({
              pageIndex,
              pageSize,
              isTrainer: filters.isTrainer,
              achievements: filters.selectedFilters.length ? filters.selectedFilters : null,
              name: nameFilter,
              loggedInUserCountry: filters.selectedCountry || loggedInUserCountry,
            })
          )
        : await dispatch(
            fetchUserList({
              pageIndex,
              pageSize,
              isTrainer: null,
              achievements: null,
              name: "",
            })
          );

      if (Array.isArray(action.payload) && action.payload.length === 0) {
        setHasMore(false);
      }
    };

    loadUsers();
  }, [
    dispatch,
    filters,
    hasMore,
    loadedPages,
    loggedInUserCountry,
    nameFilter,
    pageIndex,
    shouldUseFilteredList,
  ]);

  const restartList = () => {
    setPageIndex(1);
    setHasMore(true);
    dispatch(resetLoadedPages());
  };

  const handleNameChange = (filterName: string) => {
    setNameFilter(filterName);
    restartList();
  };

  const handleFilterChange = (updatedFilters: FilterState) => {
    setFilters(updatedFilters);
    setShowModal(false);
    restartList();
  };

  const handleFilterReset = () => {
    setFilters({
      isTrainer: null,
      selectedFilters: [],
      selectedCountry: "bd",
    });
    setNameFilter("");
    setShowModal(false);
    restartList();
  };

  const handleEndReached = () => {
    if (!loading.userList && hasMore) {
      setPageIndex((current) => current + 1);
    }
  };

  const navigateToProfile = (profile: UserProfile) => {
    const profileCode = profile.profileName || profile.id?.toString();

    if (profileCode) {
      navigate(`${routes.profileDetailsBase}/${profileCode}`);
    }
  };

  const renderProfile = ({ item: profile }: { item: UserProfile }) => {
    const hasIronman = profile.achievements?.includes("Ironman");

    return (
      <Pressable
        onPress={() => navigateToProfile(profile)}
        style={[styles.profileCard, hasIronman && styles.ironmanCard]}
      >
        <View style={styles.profileTopRow}>
          <View style={styles.imageWrapper}>
            <Image
              resizeMode="cover"
              source={{
                uri: profile.imageProfilePicture
                  ? `${FILE_SERVER}${profile.imageProfilePicture}`
                  : DEFAULT_PROFILE_IMAGE,
              }}
              style={styles.profileImage}
            />
            {profile.isTrainer ? (
              <View style={styles.trainerBadge}>
                <Text style={styles.trainerBadgeText}>Trainer</Text>
              </View>
            ) : null}
          </View>

          <View style={styles.profileText}>
            <View style={styles.profileNameContainer}>
              <Text style={styles.profileName}>
                {profile.firstName} {profile.lastName}
              </Text>
              <View style={styles.countryBadge}>
                <Text style={styles.countryBadgeText}>{profile.country || "USA"}</Text>
              </View>
            </View>

            {profile.prHistory ? (
              <Text style={styles.prHistory}>{profile.prHistory}</Text>
            ) : (
              <Text style={styles.profileDescription}>
                {profile.profileSummery
                  ? profile.profileSummery.length > 100
                    ? `${profile.profileSummery.substring(0, 100)}...`
                    : profile.profileSummery
                  : "Profile summary has not been set yet"}
              </Text>
            )}
          </View>
        </View>

        <AchievementBadgeShow achievements={profile.achievements ?? ""} />
        <MedalListSummeryShow medalPictrues={profile.medalPictureLinks ?? ""} />
      </Pressable>
    );
  };

  return (
    <View style={styles.activityFeedWrapper}>
      <View style={styles.searchBarProfile}>
        <Text style={styles.pageTitle}>Athletes & Professionals</Text>
        <View style={styles.buttonRow}>
          <Pressable onPress={() => setShowModal(true)} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Search with filter</Text>
          </Pressable>
          <Pressable onPress={handleFilterReset} style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>Clear Filter</Text>
          </Pressable>
        </View>
      </View>

      {filterActive ? (
        <View style={styles.filterContainer}>
          <Text style={styles.filterHeader}>Filter Items:</Text>
          {filters.selectedCountry ? (
            <Text style={styles.filterItem}>Country Name: {filters.selectedCountry}</Text>
          ) : null}
          {nameFilter ? <Text style={styles.filterItem}>Filter Name: {nameFilter}</Text> : null}
          {filters.isTrainer === true ? (
            <Text style={styles.filterItem}>Is Trainer: True</Text>
          ) : null}
          {filters.selectedFilters.map((filter, index) => (
            <Text key={`${filter}-${index}`} style={styles.filterItem}>
              Badge: {filter}
            </Text>
          ))}
        </View>
      ) : null}

      <StatusHandler isLoading={loading.userList && userList.length === 0} error={error}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={userList}
          keyExtractor={(item, index) => `${item.id ?? item.profileName}-${index}`}
          ListFooterComponent={
            loading.userList && userList.length > 0 ? (
              <View style={styles.paginationIndicator}>
                <ActivityIndicator color="#337ab7" />
                <Text style={styles.loadingMoreText}>Loading more...</Text>
              </View>
            ) : null
          }
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
          renderItem={renderProfile}
        />
      </StatusHandler>

      <Modal
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
        transparent
        visible={showModal}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Athletes By Filtering</Text>
              <Pressable onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeText}>x</Text>
              </Pressable>
            </View>
            <ProfileFilters
              closeModal={() => setShowModal(false)}
              filteredSelected={filters.selectedFilters}
              isTrainerSelected={filters.isTrainer}
              loggedInUserCountry={loggedInUserCountry}
              nameValue={nameFilter}
              onFilterReset={handleFilterReset}
              onFiltersChange={handleFilterChange}
              onNameChange={handleNameChange}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  activityFeedWrapper: {
    alignSelf: "center",
    backgroundColor: "#ffffff",
    flex: 1,
    maxWidth: 750,
    width: "100%",
  },
  searchBarProfile: {
    backgroundColor: "#ffffff",
    padding: 10,
  },
  pageTitle: {
    color: "#111111",
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 8,
    textAlign: "center",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  primaryButton: {
    alignItems: "center",
    backgroundColor: "#337ab7",
    borderColor: "#2e6da4",
    borderRadius: 4,
    borderWidth: 1,
    flex: 1,
    justifyContent: "center",
    minHeight: 42,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "800",
  },
  filterContainer: {
    backgroundColor: "#f5f6f7",
    borderColor: "#dddddd",
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 10,
    marginBottom: 8,
    padding: 10,
  },
  filterHeader: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  filterItem: {
    color: "#333333",
    fontSize: 13,
    marginTop: 2,
  },
  listContent: {
    padding: 10,
  },
  profileCard: {
    backgroundColor: "#ffffff",
    borderColor: "#e5e5e5",
    borderRadius: 8,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 8,
    padding: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  ironmanCard: {
    borderColor: "#d8302f",
  },
  profileTopRow: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  imageWrapper: {
    position: "relative",
  },
  profileImage: {
    borderRadius: 50,
    height: 100,
    width: 100,
  },
  trainerBadge: {
    backgroundColor: "#d8302f",
    borderRadius: 4,
    bottom: 0,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: "absolute",
  },
  trainerBadgeText: {
    color: "#ffffff",
    fontSize: 10,
    fontWeight: "700",
  },
  profileText: {
    flex: 1,
    marginLeft: 10,
  },
  profileNameContainer: {
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  profileName: {
    color: "#111111",
    flexShrink: 1,
    fontSize: 18,
    fontWeight: "700",
  },
  countryBadge: {
    backgroundColor: "#eeeeee",
    borderRadius: 3,
    marginLeft: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  countryBadgeText: {
    color: "#555555",
    fontSize: 11,
  },
  prHistory: {
    backgroundColor: "gold",
    borderRadius: 12,
    color: "#111111",
    fontSize: 13,
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  profileDescription: {
    color: "#6c757d",
    fontSize: 13,
    lineHeight: 18,
    marginTop: 6,
  },
  paginationIndicator: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    padding: 16,
  },
  loadingMoreText: {
    color: "#333333",
    fontSize: 13,
    marginLeft: 8,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.55)",
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  modal: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "92%",
    overflow: "hidden",
  },
  modalHeader: {
    alignItems: "center",
    borderBottomColor: "#eeeeee",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
  },
  modalTitle: {
    color: "#111111",
    flex: 1,
    fontSize: 16,
    fontWeight: "900",
  },
  closeButton: {
    alignItems: "center",
    height: 34,
    justifyContent: "center",
    width: 34,
  },
  closeText: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "900",
  },
});

export default ProfileList;
