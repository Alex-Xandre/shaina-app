import { getAllUser } from '@/api/get.info.api';
import Button from '@/components/Button';
import Dropdown from '@/components/Dropdown';
import { Container } from '@/components/helpers/Container';
import { policeRanks } from '@/components/helpers/ranks';
import AppSidebar from '@/components/Sidebar';
import Table from '@/components/Table';
import { useAuth } from '@/state/AuthContext';
import { fetchUsers } from '@/state/AuthReducer';
import { useNavigation } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const Index = () => {
  const headers = [
    {
      header: 'User ID',
      accessor: 'userId',
    },
    {
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Account Access',
      accessor: 'role',
    },

    {
      header: 'Rank',
      accessor: 'rank',
    },
  ];

  const [ranks, setRanks] = useState('');
  const [roles, setRoles] = useState('');
  const [searchId, setSearchId] = useState('');
  const { allUser, dispatch } = useAuth();
  const nav: any = useNavigation();

  console.log(searchId);

  useEffect(() => {
    const getUsers = async () => {
      const getAllUsers = await getAllUser();

      dispatch(fetchUsers({ users: getAllUsers }));
    };
    getUsers();
  }, []);

  return (
    <View style={styles.container}>
      <AppSidebar />

      <View style={styles.content}>
        <View style={styles.nav}>
          <View style={styles.containerHeader}>
            <Text style={styles.title}>Employees</Text>

            <Button
              text='Employee'
             
              onClick={() => nav.navigate('employee/new')}
            />
          </View>

          <View style={styles.accessLevel}>
            <Dropdown
              label='Officer Rank'
              value={ranks}
              options={[
                { value: '', label: 'All' },
                ...policeRanks.map((x) => ({
                  value: x.abbreviation,
                  label: `${x.rank} (${x.abbreviation})`,
                })),
              ]}
              id='status-dropdown'
              //   icon={<IoFilterCircleOutline />}
              onChange={(value) => setRanks(value as string)}
            />
          </View>

          <View style={styles.accessLevel2}>
            <Dropdown
              label='Access Level'
              value={roles}
              options={[
                { value: '', label: 'All' },
                { value: 'user', label: 'Employee' },
                { value: 'act', label: 'Accountant' },
                { value: 'hr', label: 'HR Manager' },
              ]}
              id='role-dropdown'
              //   icon={<BsKeyFill />}
              onChange={(value) => setRoles(value as string)}
            />
          </View>
        </View>

        <Table
          itemsPerPage={10}
          title='Employees'
          data={allUser
            .filter((x) => (roles === '' ? x : x.role === roles) && (ranks === '' ? x : x.rank === ranks))
            ?.filter((x) => (searchId === '' ? x : x?.userId?.toLowerCase().includes(searchId?.toLowerCase())))
            .map((x) => {
              const fullName = x?.firstName + ' ' + x?.lastName;
              return {
                ...x,
                name: fullName,
                role: x.role === 'act' ? 'Accounting' : x.role === 'hr' ? 'HR' : 'Officer',
              };
            })}
          handleSearch={(e) => setSearchId(e)}
          columns={headers as any}
          onEdit={(item) => {
            nav.navigate('employee/new', { data: item._id });
          }}
          onRemove={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop: 100,
  },

  containerHeader: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  //navigation
  nav: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginRight: 2,
    padding: 4,
    zIndex: 400,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },

  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    paddingLeft: 30,
    borderRadius: 5,
  },
  accessLevel: {
    width: '100%',
    position: 'relative',
    zIndex: 100,
  },

  accessLevel2: {
    width: '100%',
    position: 'relative',
    marginTop: 80,
  },
  buttonText: {
    color: '#fff',
    marginRight: 8,
  },
  buttonIcon: {
    color: '#fff',
  },
});

export default Index;
