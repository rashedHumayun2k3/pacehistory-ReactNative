/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { raceDistanceConstact, statusOptions } from "../../helpers/constantValues";
import { IGroup } from "../../types/group/groupType.interface";
import EventTypePhysicalVirtual from "./EventTypePhysical_Virtual";

interface FilterProps {
  filters: {
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
  organizers: IGroup[];
  onFiltersChange: (filters: FilterProps["filters"]) => void;
  onFilterReset: () => void;
  closeModal: () => void;
  onStatusChange: (statusId: number | null) => void;
}

const emptyFilters: FilterProps["filters"] = {
  eventName: null,
  eventYear: null,
  eventTypeId: 1,
  raceDistance: null,
  eventStatusId: null,
  organizerId: null,
  country: null,
  isCustom: null,
  isCertified: null,
};

const EventFilters = ({
  filters,
  organizers,
  onFiltersChange,
  onFilterReset,
  closeModal,
  onStatusChange,
}: FilterProps) => {
  const [tempFilters, setTempFilters] = useState(filters);

  const handleInputChange = (key: keyof FilterProps["filters"], value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSearch = () => {
    onFiltersChange(tempFilters);
    closeModal();
  };

  const handleReset = () => {
    setTempFilters(emptyFilters);
    onFilterReset();
    closeModal();
  };

  const handleStatusChange = (newStatus: number) => {
    const nextStatus = newStatus || null;

    setTempFilters((prev) => ({ ...prev, eventStatusId: nextStatus }));
    onStatusChange(nextStatus);
  };

  return (
    <ScrollView style={styles.container} nestedScrollEnabled>
      <View style={styles.topBlock}>
        <TextInput
          placeholder="Search by event name"
          value={tempFilters.eventName || ""}
          onChangeText={(value) => handleInputChange("eventName", value || null)}
          style={styles.formControl}
        />
        <View style={styles.grayBlock}>
          <Text style={styles.label}>Event Type</Text>
          <EventTypePhysicalVirtual
            selecteEventTypeValue={tempFilters.eventTypeId ?? null}
            onEventTypeSelect={(value) => handleInputChange("eventTypeId", value || null)}
          />
        </View>
        <View style={styles.blackBlock}>
          <TextInput
            placeholder="Country code"
            value={tempFilters.country ?? ""}
            onChangeText={(value) => handleInputChange("country", value || null)}
            style={styles.countryInput}
          />
        </View>
      </View>

      <View style={styles.filterColumns}>
        <View style={styles.leftColumn}>
          <ChipPicker
            label="Select Distance"
            items={raceDistanceConstact.map((value) => ({ label: `${value} K`, value: `${value}` }))}
            selectedValue={tempFilters.raceDistance ?? ""}
            onSelect={(value) => handleInputChange("raceDistance", value)}
          />
          <ChipPicker
            label="Select Year"
            items={Array.from({ length: new Date().getFullYear() + 2 - 2000 }, (_, index) => {
              const year = `${2000 + index}`;
              return { label: year, value: year };
            })}
            selectedValue={tempFilters.eventYear ?? ""}
            onSelect={(value) => handleInputChange("eventYear", value)}
          />
          <ChipPicker
            label="Select Organizer"
            items={organizers.map((org) => ({ label: org.groupName, value: `${org.groupID}` }))}
            selectedValue={tempFilters.organizerId ? `${tempFilters.organizerId}` : ""}
            onSelect={(value) => handleInputChange("organizerId", parseInt(value, 10))}
          />
          <Pressable
            style={styles.certifiedRow}
            onPress={() => handleInputChange("isCertified", !tempFilters.isCertified)}
          >
            <View style={[styles.checkbox, tempFilters.isCertified && styles.checkboxSelected]} />
            <Text>Certified Event</Text>
          </Pressable>
        </View>
        <View style={styles.statusColumn}>
          <Text style={styles.statusLabel}>Event Status</Text>
          {statusOptions.map((option) => {
            const selected = tempFilters.eventStatusId === option.EventStatusId;

            return (
              <Pressable
                key={option.EventStatusId}
                onPress={() => handleStatusChange(option.EventStatusId)}
                style={[styles.statusItem, { backgroundColor: selected ? option.color : "#eeeeee" }]}
              >
                <Text style={[styles.statusText, selected && styles.selectedStatusText]}>
                  {option.EventStatusName}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.primaryButton} onPress={handleSearch}>
          <Text style={styles.buttonText}>Search</Text>
        </Pressable>
        <Pressable style={styles.primaryButton} onPress={handleReset}>
          <Text style={styles.buttonText}>Clear Filter</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
};

const ChipPicker = ({
  label,
  items,
  selectedValue,
  onSelect,
}: {
  label: string;
  items: { label: string; value: string }[];
  selectedValue: string;
  onSelect: (value: string) => void;
}) => (
  <View style={styles.chipPicker}>
    <Text style={styles.label}>{label}</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {items.map((item) => {
        const selected = selectedValue === item.value;

        return (
          <Pressable
            key={item.value}
            onPress={() => onSelect(item.value)}
            style={[styles.chip, selected && styles.selectedChip]}
          >
            <Text style={[styles.chipText, selected && styles.selectedChipText]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: { padding: 8 },
  topBlock: { borderBottomColor: "#eeeeee", borderBottomWidth: 2, paddingLeft: 5 },
  formControl: {
    borderColor: "#cccccc",
    borderRadius: 4,
    borderWidth: 1,
    height: 40,
    paddingHorizontal: 10,
    width: "100%",
  },
  grayBlock: { backgroundColor: "#eeeeee", marginBottom: 10, marginTop: 8, width: "100%" },
  blackBlock: { backgroundColor: "#000000", marginBottom: 8, padding: 20, width: "100%" },
  countryInput: { backgroundColor: "#ffffff", borderRadius: 4, height: 40, paddingHorizontal: 10 },
  label: { color: "#444444", fontSize: 14, fontWeight: "600", marginBottom: 5 },
  filterColumns: { flexDirection: "row", flexWrap: "wrap" },
  leftColumn: { minWidth: 260, flex: 1 },
  statusColumn: { backgroundColor: "#e98a1a", borderRadius: 5, minWidth: 180, padding: 6 },
  statusLabel: { color: "#ffffff", fontWeight: "600" },
  statusItem: { borderRadius: 5, marginVertical: 3, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { color: "#000000", fontSize: 13 },
  selectedStatusText: { color: "#ffffff", fontWeight: "700" },
  chipPicker: { marginTop: 8 },
  chip: { backgroundColor: "#eeeeee", borderRadius: 5, marginRight: 6, padding: 8 },
  selectedChip: { backgroundColor: "#575757" },
  chipText: { color: "#000000" },
  selectedChipText: { color: "#ffffff", fontWeight: "700" },
  certifiedRow: { alignItems: "center", flexDirection: "row", marginTop: 10 },
  checkbox: { borderColor: "#2355ff9e", borderWidth: 1, height: 14, marginRight: 8, width: 14 },
  checkboxSelected: { backgroundColor: "#2355ff" },
  actionRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, padding: 10 },
  primaryButton: { backgroundColor: "#337ab7", borderRadius: 4, marginTop: 5, padding: 10, width: "45%" },
  buttonText: { color: "#ffffff", textAlign: "center" },
});

export default EventFilters;
