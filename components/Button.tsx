import React, { useState } from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet, View } from 'react-native';

interface ButtonProps {
  text: string;
  onClick?: () => Promise<void> | void;
  ic?: React.ReactNode;
  loader?: boolean;
  customStyle?: object;
}

const Button: React.FC<ButtonProps> = ({ text, onClick, ic, loader, customStyle }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleOnClick = async () => {
    if (onClick) {
      setIsLoading(true);
      try {
        await onClick();
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handleOnClick}
      disabled={loader ? loader : isLoading}
      style={[styles.button, customStyle, isLoading && styles.loadingButton]}
    >
      {isLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator
            size='small'
            color='#050a30'
          />
        </View>
      ) : (
        <View style={styles.buttonContent}>
          {ic && <View style={styles.icon}>{ic}</View>}
          <Text style={styles.buttonText}>{text}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: 'white',
    borderColor: '#050a30',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    paddingVertical:5,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  loadingButton: {
    opacity: 0.5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#050a30',
    fontSize: 14,
    marginLeft: 8,
  },
  loaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;
