import React, { useEffect, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchCertificationList } from "../../store/slices/eventSlice";

type CertificationItem = {
  certificationId?: number;
  CertificationId?: number;
  certifiedBy?: string;
  CertifiedBy?: string;
  certificationName?: string;
  CertificationName?: string;
  name?: string;
  title?: string;
};

type Props = {
  selectedIsCertification: boolean | null;
  selectedCertificationsValue: string | null;
  onCertificationsSelect: (selectedCertifications: string | null) => void;
};

const getCertificationId = (certification: CertificationItem) =>
  Number(certification.certificationId ?? certification.CertificationId ?? 0);

const getCertificationLabel = (certification: CertificationItem) =>
  certification.certifiedBy ??
  certification.CertifiedBy ??
  certification.certificationName ??
  certification.CertificationName ??
  certification.name ??
  certification.title ??
  "Certification";

const CertificationsSelect = ({
  selectedIsCertification,
  selectedCertificationsValue,
  onCertificationsSelect,
}: Props) => {
  const [selectedCertifications, setSelectedCertifications] = useState<number[]>([]);
  const [isCertified, setIsCertified] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const { certificationList } = useSelector((state: RootState) => state.event);
  const itemsToShow = 5;

  useEffect(() => {
    dispatch(fetchCertificationList());
  }, [dispatch]);

  useEffect(() => {
    if (selectedCertificationsValue) {
      const parsedValues = selectedCertificationsValue
        .split(",")
        .map((value) => parseInt(value, 10))
        .filter((value) => !Number.isNaN(value));

      setSelectedCertifications(parsedValues);
    } else {
      setSelectedCertifications([]);
    }
  }, [selectedCertificationsValue]);

  useEffect(() => {
    setIsCertified(Boolean(selectedIsCertification));
  }, [selectedIsCertification]);

  useEffect(() => {
    if (!isCertified) {
      onCertificationsSelect(null);
      return;
    }

    onCertificationsSelect(
      selectedCertifications.length > 0 ? selectedCertifications.join(",") : null
    );
  }, [isCertified, selectedCertifications]);

  const toggleCertified = () => {
    setIsCertified((value) => {
      const nextValue = !value;

      if (!nextValue) {
        setSelectedCertifications([]);
      }

      return nextValue;
    });
  };

  const toggleCertification = (certificationId: number) => {
    if (!certificationId) return;

    setSelectedCertifications((prev) =>
      prev.includes(certificationId)
        ? prev.filter((id) => id !== certificationId)
        : [...prev, certificationId]
    );
  };

  const visibleCertificationList = showAll
    ? certificationList
    : certificationList.slice(0, itemsToShow);

  return (
    <View style={styles.customRow}>
      <Pressable style={styles.certifiedHeader} onPress={toggleCertified}>
        <View style={[styles.checkbox, isCertified && styles.checkboxSelected]} />
        <Text style={styles.headerText}>Is Certified</Text>
      </Pressable>
      {isCertified ? (
        <View style={styles.checkContainer}>
          {visibleCertificationList.map((certification: CertificationItem, index: number) => {
            const certificationId = getCertificationId(certification);
            const selected = selectedCertifications.includes(certificationId);

            return (
              <Pressable
                key={`${certificationId}-${index}`}
                style={styles.certificationItem}
                onPress={() => toggleCertification(certificationId)}
              >
                <View style={[styles.checkbox, selected && styles.checkboxSelected]} />
                <Text style={styles.certificationText}>{getCertificationLabel(certification)}</Text>
              </Pressable>
            );
          })}
          {certificationList.length === 0 ? (
            <Text style={styles.emptyText}>No certifications found.</Text>
          ) : null}
          {certificationList.length > itemsToShow ? (
            <Pressable onPress={() => setShowAll((value) => !value)}>
              <Text style={styles.showMore}>{showAll ? "Show Less" : "Show More"}</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  customRow: {
    borderColor: "#e9e9e9",
    borderRadius: 5,
    borderWidth: 1,
    elevation: 1,
    marginVertical: 12,
    padding: 10,
  },
  certifiedHeader: {
    alignItems: "center",
    backgroundColor: "#b8ffbd",
    flexDirection: "row",
    padding: 8,
  },
  headerText: { marginLeft: 10 },
  checkContainer: {
    backgroundColor: "#ffffff",
    flexDirection: "row",
    flexWrap: "wrap",
    paddingTop: 15,
  },
  certificationItem: {
    alignItems: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 5,
    flexDirection: "row",
    marginBottom: 10,
    marginRight: 10,
    minHeight: 34,
    paddingHorizontal: 10,
    width: 300,
  },
  certificationText: { flex: 1, fontSize: 11, fontWeight: "600" },
  checkbox: {
    borderColor: "#2355ff9e",
    borderWidth: 1,
    height: 14,
    marginRight: 8,
    width: 14,
  },
  checkboxSelected: { backgroundColor: "#2355ff" },
  emptyText: { color: "#666666", fontSize: 12, margin: 6 },
  showMore: { color: "#007bff", fontSize: 10, margin: 6 },
});

export default CertificationsSelect;
