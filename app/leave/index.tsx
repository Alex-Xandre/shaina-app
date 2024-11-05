import { getLeave } from '@/api/leave.api';
import Button from '@/components/Button';
import { Container } from '@/components/helpers/Container';
import AppSidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import { useAuth } from '@/state/AuthContext';
import { fetchLeaves } from '@/state/AuthReducer';
import { useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { PlusIcon } from 'react-native-heroicons/outline';

const Index = () => {
  const headers = [
    { header: 'User ID', accessor: 'userId' },
    { header: 'Name', accessor: 'name' },
    { header: 'Date', accessor: 'date' },
    { header: 'Leave Type', accessor: 'leaveType' },
    { header: 'Status', accessor: 'status' },
  ];

  const { allUser, leave, dispatch } = useAuth();
  const nav = useNavigation();

  const [searchId, setSearchId] = useState('');
  useEffect(() => {
    const getUsers = async () => {
      const getAllLeave = await getLeave();
      dispatch(fetchLeaves({ leave: getAllLeave }));
    };
    getUsers();
  }, []);
  return (
    <ScrollView>
      <AppSidebar />
      <View style={Container as any}>
        <View style={styles.header}>
          <Text style={styles.title}>List of Leaves</Text>{' '}
        <Button text='Leave' customStyle={{marginRight:10}}/>
        </View>

        <View style={styles.tableContainer}>
          <Table
            itemsPerPage={12}
            handleSearch={(e) => setSearchId(e.target.value)}
            title='Leaves'
            data={leave
              .map((x) => {
                const userId = allUser.find((y) => y._id === x.userId)?.userId;
                const user = allUser.find((y) => y._id === x.userId);
                return {
                  ...x,
                  userId: userId,
                  name: user && `${user.firstName} ${user.lastName}`,
                  status: x.status ? 'Confirmed' : 'Unconfirmed',
                };
              })
              ?.filter((x) => x?.userId?.toLowerCase().includes(searchId?.toLowerCase()))}
            columns={headers as any}
            onEdit={(item) => console.log('first')}
            onRemove={function (): void {
              throw new Error('Function not implemented.');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  tableContainer: {
    marginTop: 20,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  dateSeparator: {
    marginHorizontal: 5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    marginLeft: 5,
  },
});

export default Index;
