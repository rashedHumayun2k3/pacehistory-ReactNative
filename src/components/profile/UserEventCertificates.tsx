import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserCertificateList } from '../../store/slices/medalListSlice';
import { AppDispatch, RootState } from '../../store/store';
import ImageWithModal from './ImageWithModal';

interface UserInfoProps {
  newparams: { id: number; selectionType: string } | null;
}

const UserEventCertificates = ({ newparams }: UserInfoProps) => {
  const { id } = newparams ?? {};
  const dispatch = useDispatch<AppDispatch>();
  const { certificateList, loading } = useSelector((state: RootState) => state.medalList);

  useEffect(() => {
    if (id != null) {
      dispatch(fetchUserCertificateList(id));
    }
  }, [dispatch, id]);

  if (loading.userCertificateList) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Certificate</Text>

      {certificateList.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>No achievements added yet</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {certificateList.map((userCertificate, index) => (
            <ImageWithModal
              imageUrl={userCertificate?.imageCertificate ?? null}
              isNarrowSize
              key={`${userCertificate.resultId}-${index}`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

export default UserEventCertificates;

const styles = StyleSheet.create({
  container: { marginBottom: 4 },
  loading: { color: '#111111', padding: 10 },
  title: {
    color: '#111111',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 8,
  },
  emptyBox: {
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  emptyText: { color: '#555555', fontSize: 13 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
});
