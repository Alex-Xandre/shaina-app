import { getTasks } from '@/api/tasks.api';
import Button from '@/components/Button';
import AppSidebar from '@/components/Sidebar';
import { useAuth } from '@/state/AuthContext';
import { fetchShifts } from '@/state/AuthReducer';
import { useNavigation } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import Card from './Card';

const Index = () => {
  const nav: any = useNavigation();
  const { user, dispatch, shifts } = useAuth();

  //get shiffts
  useEffect(() => {
    const getUsers = async () => {
      const getAllShift = await getTasks();

      dispatch(fetchShifts({ shift: getAllShift }));
    };
    getUsers();
  }, []);

  

  return (
    <View style={styles.container}>
      <AppSidebar />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>List of Shifts</Text>
          {user.role !== 'user' && (
            <Button
              text='Shift'
              onClick={() => nav.navigate('shift/new')}
              customStyle={{ marginRight: 10, paddingRight: 15 }}
            />
          )}
        </View>

        <ScrollView
          style={{ paddingRight: 10, flex: 1, backgroundColor: '#fff' }}
          showsVerticalScrollIndicator={false}
        >
          {shifts.length === 0 ? <Text>Attendance List Empty</Text> :
          
          shifts.map((x) => {
            return <Card data={x} />;
          })}
        </ScrollView>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: '700',
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
    marginTop: 100,
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
