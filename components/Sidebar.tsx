import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  HomeIcon,
  UserIcon,
  DocumentTextIcon,
  FolderIcon,
  BanknotesIcon,
  Bars2Icon,
} from 'react-native-heroicons/outline';
import { useAuth } from '@/state/AuthContext';
import { useTab } from './helpers/TabContext';

const AppSidebar: React.FC = () => {
  const navigation: any = useNavigation();
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useTab();
  const [sidebarVisible, setSidebarVisible] = useState(false);

  const Menu = useMemo(
    () => [
      { title: 'Dashboard', url: 'Dashboard', icon: <HomeIcon /> },
      { title: 'Profile', url: 'Profile', icon: <UserIcon /> },
      { title: 'Attendance', url: 'Attendance', icon: <BanknotesIcon /> },
      { title: 'Shift and Task', url: 'Task', icon: <FolderIcon /> },
    ],
    []
  );

  const MenuHR = useMemo(
    () => [
      { title: 'Dashboard', url: 'home', icon: <HomeIcon /> },
      { title: 'Employees', url: 'employee/index', icon: <UserIcon /> },
      { title: 'Attendance', url: 'attendance/index', icon: <DocumentTextIcon /> },
      { title: 'Leaves', url: 'leaves/index', icon: <FolderIcon /> },
      { title: 'Shift/Tasks', url: 'shift/index', icon: <FolderIcon /> },
    ],
    []
  );

  const MenuAcc = useMemo(
    () => [
      { title: 'Dashboard', url: 'Dashboard', icon: <HomeIcon /> },
      { title: 'Payroll', url: 'Payroll', icon: <BanknotesIcon /> },
      { title: 'Employees', url: 'Employees', icon: <UserIcon /> },
    ],
    []
  );

  const menuToDisplay = user && user.role && user.role === 'user' ? Menu : user.role === 'hr' ? MenuHR : MenuAcc;

  const handleNavigation = (url: string, index: number) => {
    setActiveTab(index);
    navigation.navigate(url);
  };

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

    zIndex: 1000,
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
    width: 250,
    backgroundColor: '#050a30',
    position: 'absolute',
    top: 60,
    left: 0,
    height: '100vh' as any,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#fff',
    padding: 10,
    borderRadius: 6,
  },
  activeMenuItem: {
    backgroundColor: '#60b4f2',
  },
  menuText: {
    marginLeft: 10,
    color: '#fff',
  },
});

export default AppSidebar;
