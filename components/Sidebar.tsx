import { useAuth } from '@/state/AuthContext';
import { signout } from '@/state/AuthReducer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useMemo, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  ArrowLeftCircleIcon,
  BanknotesIcon,
  Bars2Icon,
  DocumentTextIcon,
  FolderIcon,
  HomeIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import { useTab } from './helpers/TabContext';

const AppSidebar: React.FC = () => {
  const navigation: any = useNavigation();
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const Menu = useMemo(
    () => [
      { title: 'Dashboard', url: 'home', icon: <HomeIcon color='#fff' /> },
      { title: 'Attendance', url: 'attendance/index', icon: <BanknotesIcon color='#fff' /> },
      { title: 'Leaves', url: 'leave/index', icon: <FolderIcon color='#fff' /> },
      { title: 'Shifts', url: 'shift/index', icon: <FolderIcon color='#fff' /> },
    ],
    []
  );

  const MenuHR = useMemo(
    () => [
      { title: 'Dashboard', url: 'home', icon: <HomeIcon color='#fff' /> },
      { title: 'Employees', url: 'employee/index', icon: <UserIcon color='#fff' /> },
      { title: 'Attendance', url: 'attendance/index', icon: <DocumentTextIcon color='#fff' /> },
      { title: 'Leaves', url: 'leave/index', icon: <FolderIcon color='#fff' /> },
      { title: 'Shift/Tasks', url: 'shift/index', icon: <FolderIcon color='#fff' /> },
    ],
    []
  );

  const MenuAcc = useMemo(
    () => [
      { title: 'Dashboard', url: 'home', icon: <HomeIcon color='#fff' /> },
      { title: 'Payroll', url: 'attendance/index', icon: <BanknotesIcon color='#fff' /> },
      { title: 'Employees', url: 'employee/index', icon: <UserIcon color='#fff' /> },
    ],
    []
  );

  // if (!user) {
  //   return null;
  // }
  const menuToDisplay = user && user?.role && user.role === 'user' ? Menu : user.role === 'hr' ? MenuHR : MenuAcc;

  const handleNavigation = (url: string, index: number) => {
    setActiveTab(index);
    navigation.navigate(url);
    setSidebarVisible(false);
  };

  const { dispatch } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.appBar}>
        <TouchableOpacity onPress={() => setSidebarVisible(!sidebarVisible)}>
          <Bars2Icon
            size={24}
            color='#fff'
          />
        </TouchableOpacity>
        <Text style={styles.title}>Police Hotline Movement Incorporated</Text>
      </View>

      {sidebarVisible && (
        <View style={styles.sidebar}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: "center" , padding:10, paddingBottom:30}}>
            <TouchableOpacity
              onPress={() => handleNavigation('employee/new', 5)}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Image
                source={{
                  uri: user.avatar,
                }}
                style={{ width: 30, borderRadius: 100, height: 30, marginRight: 10 }}
              />
              <Text style={{ color: '#fff' }}>{user.firstName + ', ' + user.lastName}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ backgroundColor: "#fff", padding: 3, borderRadius: 10 }}
              onPress={async () => {
                dispatch(signout());
                navigation.navigate('index');
                await AsyncStorage.removeItem('token');
              }}
            >
              <ArrowLeftCircleIcon color='#0A145E' />
            </TouchableOpacity>
          </View>
          <FlatList
            data={menuToDisplay}
            keyExtractor={(item) => item.url}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                style={[styles.menuItem, activeTab === index && styles.activeMenuItem]}
                onPress={() => handleNavigation(item.url, index)}
              >
                {item.icon}
                <Text style={styles.menuText}>{item.title}</Text>
              </TouchableOpacity>
            )}
          />


        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    top: 40,
    zIndex: 1001,
  },
  appBar: {
    height: 60,
    width: '100%',
    backgroundColor: '#050a30',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    justifyContent: 'space-between',
    zIndex: 1000,
  },
  title: {
    color: '#fff',
    fontSize: 16,
  },
  sidebar: {
    width: '100%',
    backgroundColor: '#050a30',
    position: 'absolute',
    top: 60,
    left: 0,
    padding: 16,
    flex: 1,
    height: 800,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
  },
  activeMenuItem: {
    backgroundColor: '#0A145E',
  },
  menuText: {
    marginLeft: 10,
    color: '#fff',
  },
});

export default AppSidebar;
