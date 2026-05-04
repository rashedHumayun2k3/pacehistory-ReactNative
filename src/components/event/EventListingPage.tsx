/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { statusOptions } from "../../helpers/constantValues";
import { AppDispatch, RootState } from "../../store/store";
import { fetchAllGroups } from "../../store/slices/groupSlice";
import { fetchEventList, fetchEventListByFilter } from "../../store/slices/eventSlice";
import EventCard2 from "./EventCard2";
import EventFilters from "./EventFilters";

const eventTypes = [
  { id: 1, name: "Physical" },
  { id: 2, name: "Virtual" },
  { id: 3, name: "Hybrid" },
];

type EventFiltersState = {
  eventName: string | null;
  eventYear: string | null;
  eventTypeId: number | null;
  raceDistance: string | null;
  eventStatusId: number | null;
  organizerId: number | null;
  country: string | null;
  isCustom: boolean | null;
  isCertified: boolean | null;
};

const defaultFilters: EventFiltersState = {
  eventName: null,
  eventYear: null,
  eventTypeId: null,
  raceDistance: null,
  eventStatusId: null,
  organizerId: null,
  country: "bd",
  isCustom: null,
  isCertified: null,
};

const EventListingPage = ({ navigation }: { navigation?: any }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { eventList, loading, error } = useSelector((state: RootState) => state.event);
  const { groupList } = useSelector((state: RootState) => state.group);
  const [showModal, setShowModal] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFilterChanged, setIsFilterChanged] = useState(false);
  const [filters, setFilters] = useState<EventFiltersState>(defaultFilters);

  useEffect(() => {
    dispatch(fetchAllGroups());
  }, [dispatch]);

  useEffect(() => {
    if (isFilterChanged) return;

    const fetchData = async () => {
      const action = await dispatch(
        fetchEventList({ pageNumber: pageIndex, pageSize: 10, filters, isAll: false })
      );
      const payload = action.payload as any;

      if (payload?.data?.length === 0) {
        setHasMore(false);
      }
    };

    fetchData();
  }, [dispatch, filters, isFilterChanged, pageIndex]);

  useEffect(() => {
    if (!isFilterChanged) return;

    dispatch(fetchEventListByFilter({ pageNumber: 1, pageSize: 100, filters, isAll: false }));
  }, [dispatch, filters, isFilterChanged]);

  const handleFiltersChange = (updatedFilters: EventFiltersState) => {
    setFilters((prev) => ({ ...prev, ...updatedFilters }));
    setIsFilterChanged(true);
    setPageIndex(1);
    setHasMore(true);
  };

  const handleFilterReset = () => {
    setFilters(defaultFilters);
    setPageIndex(1);
    setHasMore(true);
    setIsFilterChanged(false);
  };

  const loadMore = () => {
    if (hasMore && !loading.events && !isFilterChanged) {
      setPageIndex((page) => page + 1);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.activityFeedWrapper}>
      <View style={styles.searchBarProfile}>
        <Text style={styles.title}>Event List</Text>
        <View style={styles.buttonLine}>
          <Pressable style={styles.primaryButton} onPress={() => setShowModal(true)}>
            <Text style={styles.buttonText}>Search with filter</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={handleFilterReset}>
            <Text style={styles.buttonText}>Clear Filter</Text>
          </Pressable>
        </View>
      </View>

      <FilterItems filters={filters} groupList={groupList} />

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {eventList.length === 0 ? (
        <Text style={styles.noEvents}>No events found.</Text>
      ) : (
        eventList.map((event, index) => (
          <EventCard2
            key={event.eventId ?? `${event.eventCode ?? "event"}-${index}`}
            event={event}
            onPress={(selectedEvent) =>
              navigation?.navigate?.("EventDetails", { eventCode: selectedEvent.eventCode })
            }
          />
        ))
      )}

      {loading.events ? <Text style={styles.loading}>Loading more...</Text> : null}
      {hasMore ? (
        <Pressable style={styles.loadMoreButton} onPress={loadMore}>
          <Text style={styles.buttonText}>Load More</Text>
        </Pressable>
      ) : null}

      <Modal transparent animationType="slide" visible={showModal} onRequestClose={() => setShowModal(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalPopup}>
            <View style={styles.closeRow}>
              <Text style={styles.headerModal}>Search Event By Filtering</Text>
              <Pressable style={styles.closeButton} onPress={() => setShowModal(false)}>
                <Text style={styles.closeButtonText}>x</Text>
              </Pressable>
            </View>
            <EventFilters
              filters={filters}
              organizers={groupList}
              onFiltersChange={handleFiltersChange}
              onFilterReset={handleFilterReset}
              closeModal={() => setShowModal(false)}
              onStatusChange={() => {}}
            />
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const FilterItems = ({ filters, groupList }: { filters: EventFiltersState; groupList: any[] }) => {
  const items = [
    filters.eventName ? ["Event Name:", filters.eventName, styles.filterEventName] : null,
    filters.eventYear ? ["Event Year:", filters.eventYear, styles.filterEventYear] : null,
    filters.eventTypeId
      ? [
          "Event Type:",
          eventTypes.find((type) => type.id === filters.eventTypeId)?.name || "Unknown",
          styles.filterEventType,
        ]
      : null,
    filters.raceDistance ? ["Race Distance:", `${filters.raceDistance} KM`, styles.filterRaceDistance] : null,
    filters.eventStatusId
      ? [
          "Event Status:",
          statusOptions.find((status) => status.EventStatusId === filters.eventStatusId)?.EventStatusName ||
            "Unknown",
          styles.filterEventStatus,
        ]
      : null,
    filters.organizerId
      ? [
          "Organizer:",
          groupList.find((org) => org.groupID === filters.organizerId)?.groupName || "Unknown",
          styles.filterOrganizer,
        ]
      : null,
    filters.country ? ["Country:", filters.country, styles.filterCountry] : null,
    filters.isCertified !== null
      ? ["Is Certified:", filters.isCertified ? "Yes" : "No", styles.filterIsCertified]
      : null,
  ].filter(Boolean) as [string, string, any][];

  if (items.length === 0) return null;

  return (
    <View style={styles.filterContainer}>
      <Text style={styles.filterHeader}>Filter Items:</Text>
      {items.map(([label, value, itemStyle]) => (
        <View key={label} style={[styles.filterItem, itemStyle]}>
          <Text>
            <Text style={styles.filterLabel}>{label}</Text> {value}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  activityFeedWrapper: {
    backgroundColor: "#ffffff",
    minHeight: "100%",
    padding: 10,
    width: "100%",
  },
  searchBarProfile: {
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginBottom: 8,
    paddingHorizontal: 10,
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 4 },
  buttonLine: { flexDirection: "row", flexWrap: "wrap", gap: 10, width: "100%" },
  primaryButton: {
    backgroundColor: "#337ab7",
    borderRadius: 4,
    marginTop: 5,
    padding: 10,
    width: "45%",
  },
  buttonText: { color: "#ffffff", textAlign: "center" },
  filterContainer: {
    backgroundColor: "#b7b7b7",
    borderColor: "#dddddd",
    borderRadius: 8,
    borderWidth: 1,
    padding: 15,
  },
  filterHeader: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  filterItem: { borderRadius: 5, marginBottom: 5, padding: 8 },
  filterLabel: { fontWeight: "700" },
  filterEventName: { backgroundColor: "#add8e6" },
  filterEventYear: { backgroundColor: "#f0e68c" },
  filterEventType: { backgroundColor: "#ffa07a" },
  filterRaceDistance: { backgroundColor: "#98fb98" },
  filterEventStatus: { backgroundColor: "#d8bfd8" },
  filterOrganizer: { backgroundColor: "#ffdab9" },
  filterCountry: { backgroundColor: "#ffcccb" },
  filterIsCertified: { backgroundColor: "#d3d3d3" },
  errorText: { color: "#dc3545", padding: 10, textAlign: "center" },
  noEvents: { fontSize: 16, padding: 20, textAlign: "center" },
  loading: { height: 50, textAlign: "center", textAlignVertical: "center" },
  loadMoreButton: {
    alignSelf: "center",
    backgroundColor: "#337ab7",
    borderRadius: 4,
    margin: 10,
    padding: 10,
    width: 180,
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "center",
    padding: 12,
  },
  modalPopup: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    maxHeight: "90%",
    overflow: "hidden",
  },
  closeRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerModal: { color: "#6a6a6a", fontWeight: "700", marginLeft: 10, paddingTop: 2 },
  closeButton: {
    backgroundColor: "#af0000",
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  closeButtonText: { color: "#ffffff" },
});

export default EventListingPage;
