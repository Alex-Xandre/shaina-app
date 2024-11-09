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
  const nav: any = useNavigation();

  const [searchId, setSearchId] = useState('');
  useEffect(() => {
    const getUsers = async () => {
      const getAllLeave = await getLeave();
      dispatch(fetchLeaves({ leave: getAllLeave }));
    };
    getUsers();
  }, []);


  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>List of Leaves</Text>
          <Button
            text='Leave'
            onClick={() => nav.navigate('leave/new')}
            customStyle={{ marginRight: 10, paddingRight: 15 }}
          />
        </View>

        {leave.length === 0 && <Text>List Empty</Text>}

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
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  tableContainer: {
    marginTop: 20,
    marginRight: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 18,
    width: '100%',
  },
  content: {
    height: '90%',
    paddingLeft: 15,
    margin: 0,
    position: 'relative',
    paddingRight: 10,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
 
    paddingRight: 10,
  },
  headerText: {
    fontWeight: '800',
  },
  chevron: {
    marginHorizontal: 8,
  },
  headerSubText: {
    opacity: 0.7,
  },
  form: {
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 1,
    flexGrow: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 8,
    opacity: 0.7,
  },
  hiddenInput: {
    display: 'none',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 16,
    padding: 8,
  },
  note: {
    fontSize: 12,
    marginVertical: 16,
    color: '#666',
    marginTop: 100,
  },
});
export default Index;
