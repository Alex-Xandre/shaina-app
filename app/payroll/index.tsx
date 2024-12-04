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
      header: 'Name',
      accessor: 'name',
    },
    {
      header: 'Date',
      accessor: 'date',
    },
    {
      header: 'End Date',
      accessor: 'endDate',
    },
    {
      header: 'Deductions',
      accessor: 'deduction',
    },
    {
      header: 'Total',
      accessor: 'total',
    },
  ];

  const [searchId, setSearchId] = useState('');
  const { allUser, dispatch, salary } = useAuth();
  const nav: any = useNavigation();

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
            <Text style={styles.title}>Payroll</Text>

            <Button
              text='Pay'
              customStyle={{paddingRight:15}}
              onClick={() => nav.navigate('payroll/new')}
            />
          </View>
        </View>

        <Table
          itemsPerPage={10}
          title='Payroll'
          data={salary.map((x) => {
            const user = allUser.find((y) => y._id === x.userId);

            return {
              ...x,
              date: new Date(x.date).toISOString().split('T')[0],
              endDate: new Date(x.endDate).toISOString().split('T')[0],
              deduction: x.sss + x.pagibig + x.philhealth + x.insurance,
              _id: x._id,
              userId: user && user.userId,
              name: user && `${user.firstName} ${user.lastName}`,
              total: x.total - (x.sss + x.pagibig + x.philhealth + x.insurance),
            };
          })}
          handleSearch={(e) => setSearchId(e)}
          columns={headers as any}
          onEdit={(item) => {
            nav.navigate('payroll/new', { data: item._id });
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
    fontWeight: '800',
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
