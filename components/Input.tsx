import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  customStyle?: object;
  containerStyle?: object;
  icon?: React.ReactNode;
  handleShowPassword?: () => void;
  id?: string;
  isPassword?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  customStyle,
  containerStyle,
  icon,
  handleShowPassword,
  id,
  isPassword,
  ...rest
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.inputContainer}>
        {icon && (
          <TouchableOpacity
            onPress={handleShowPassword}
            style={styles.iconContainer}
          >
            {icon}
          </TouchableOpacity>
        )}
        <TextInput
          {...rest}
          id={id}
          secureTextEntry={isPassword}
          style={[
            styles.input, 
            error ? styles.inputError : {}, 
            customStyle, 
            icon ? styles.inputWithIcon : {}
          ]}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  inputContainer: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    fontSize: 14,
    width: '100%',
  },
  inputError: {
    borderColor: 'red',
  },
  inputWithIcon: {
    paddingLeft: 40, // Adjust this value as needed for icon size
  },
  iconContainer: {
    position: 'absolute',
    zIndex:100,
    left: 10,
    top: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default Input;
