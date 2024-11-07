import React, { ChangeEvent, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, TextInput, ToastAndroid } from 'react-native';
// import { v4 as uuidv4 } from 'uuid';

import Button from '../../components/Button';
import Dropdown from '../../components/Dropdown';
import AppSidebar from '@/components/Sidebar';
import { policeRanks } from '@/components/helpers/ranks';
import { useAuth } from '@/state/AuthContext';

import Input from '@/components/Input';
import { UserTypes } from '@/types';
import { Container } from '@/components/helpers/Container';
import { uploadFile } from '@/api/user.api';
import { registerUserByAdmin } from '@/api/register.api';
import { addUsers } from '@/state/AuthReducer';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const NewEmployee = () => {
  const navigate: any = useNavigation();
  const inputFile: any = useRef(null);

  const { data } = useLocalSearchParams();

  const forms = [
    { label: 'User ID', name: 'userId', type: 'text', readonly: true },
    { label: 'First Name', name: 'firstName', type: 'text' },
    { label: 'Last Name', name: 'lastName', type: 'text' },
    { label: 'Email', name: 'email', type: 'email', readonly: true },
    { label: 'Birthday', name: 'birthday', type: 'date', placeholder: 'MM/DD/YYYY' },
    { label: 'Contact', name: 'contact', type: 'number' },
    { label: 'Rank', name: 'rank', type: 'dropdown' },
  ];

  const [formData, setFormData] = React.useState<UserTypes>({
    _id: 'x',
    role: 'user',
    userId: '',
    password: '',
    email: '',
    avatar: 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png',
    firstName: '',
    lastName: '',
    gender: '',
    middleName: '',
    birthday: '',
    birthplace: '',
    rank: '',
    address: {
      streetAddres: '',
      city: '',
      state: '',
      zipcode: '',
      latitude: 0,
      longitude: 0,
    },
    age: 0,
    contact: 0,
  });

  const { allUser } = useAuth();

  useEffect(() => {
    if (data) {
      const item = allUser.find((x) => x._id === data);
      if (item) {
        setFormData(item);
      }
    }
  }, [data]);

  const { user } = useAuth();
  useEffect(() => {
    setFormData(user);
  }, []);
  const handleChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const { dispatch } = useAuth();

  const handleSubmit = async () => {
    console.log(formData);
    const res = await registerUserByAdmin({
      ...formData,
      password: new Date(formData.birthday as string).getFullYear(),
    });
    if (res.success === false) {
      ToastAndroid.show(res.data?.msg || 'Error', ToastAndroid.SHORT);

      return;
    }

    dispatch(addUsers(res));

    setTimeout(() => {
      console.log('first');
      navigate.navigate('employee/index');
    }, 1500);
  };

  const changeAvatar = async (e: any) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        const uploadedUrl = await uploadFile(file);
        setFormData({ ...formData, avatar: uploadedUrl });
      } catch (error) {
        console.error('File upload failed:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <AppSidebar />
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}> {user.role === 'user' ? 'Profile' : 'New Employee'}</Text>
        </View>

        <View style={styles.form}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => {
              if (inputFile.current !== null) {
                inputFile.current.click();
              }
            }}
          >
            <Image
              source={{
                uri: formData.avatar
                  ? formData.avatar
                  : 'https://res.cloudinary.com/dyhsose70/image/upload/v1696562163/avatar_ko5htr.png',
              }}
              style={styles.avatar}
            />
            {/* <input
                type='file'
                ref={inputFile}
                onChange={changeAvatar}
                style={styles.hiddenInput}
              /> */}
          </TouchableOpacity>

          <View style={{ width: '100%', marginBottom: 90, position: 'relative', zIndex: 10000 }}>
            <Dropdown
              label='Account Access'
              disabled={user.role === 'user'}
              value={formData.role}
              options={[
                { value: 'user', label: 'Employee' },
                { value: 'act', label: 'Accountant' },
                { value: 'hr', label: 'HR Manager' },
              ]}
              onChange={(e) => handleChange('role', e as string)}
            />
          </View>

          {forms.map((frm) => {
            if (frm.name === 'rank') {
              return (
                <View style={{ width: '100%', position: 'relative', zIndex: 1000 }}>
                  <Dropdown
                    label='Rank'
                    value={formData.rank}
                    disabled={user.role === 'user'}
                    options={policeRanks.map((item) => ({
                      label: item.rank,
                      value: item.abbreviation,
                    }))}
                    onChange={(e) => handleChange('rank', e as string)}
                  />
                </View>
              );
            }
            return (
              <Input
                style={styles.input}
                key={frm.name}
                readOnly={user.role === 'user' && frm.name === 'userId'}
                label={frm.label}
                placeholder={frm.placeholder}
                onChangeText={(value) => handleChange(frm.name, value)}
                value={formData[frm.name as keyof typeof formData] as any}
              />
            );
          })}

          {user.role !== 'user' && (
            <Text style={styles.note}>
              Note: Passwords are auto-generated and will be emailed to the access email - Password Format is
              (LastName_FirstName-Birth Year) e.g. Juan_Delacruz-2024
            </Text>
          )}
          <Button
            text={user.role === 'user' ? 'Save Changes' : data ? 'Update' : 'New'}
            onClick={handleSubmit}
            customStyle={{ marginTop: user.role === 'user' && 100 }}
          />
        </View>
      </ScrollView>
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
    margin: 0,
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
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

export default NewEmployee;
