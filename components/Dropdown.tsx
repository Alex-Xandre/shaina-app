import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList, StyleSheet } from 'react-native';

interface DropdownProps {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  icon?: React.ReactNode;
  id?: string;
  value?: string | number;
  isInputFilter?: boolean;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  error,
  options,
  icon,
  id,
  value,
  isInputFilter = false,
  onChange,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('');

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const filteredOptions = options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()));

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={[styles.inputContainer, error ? styles.errorBorder : styles.normalBorder, disabled && styles.disabled]}
        onPress={toggleDropdown}
        disabled={disabled}
      >
        <TextInput
          editable={false}
          value={value ? options.find((option) => option.value === value)?.label : ''}
          placeholder={label}
          style={styles.input}
        />
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.dropdownContainer}>
          {isInputFilter && (
            <TextInput
              placeholder='Search...'
              style={styles.filterInput}
              value={filter}
              onChangeText={setFilter}
            />
          )}
          <FlatList
            data={isInputFilter ? filteredOptions : options}
            keyExtractor={(item) => String(item.value)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  if (onChange) {
                    onChange(item.value);
                  }
                  setIsOpen(false);
                }}
              >
                <Text style={{ paddingVertical: 4 }}>{item.label}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
    zIndex: 0,
  },
  inputContainer: {
    paddingVertical: 0,
    fontSize: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 0,
  },
  normalBorder: {
    backgroundColor: '#f0f0f0',
    zIndex: 0,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
    zIndex: 0,
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 14,
    zIndex: 0,
    paddingVertical: 5,
  },
  iconContainer: {
    marginLeft: 10,
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 4,
    elevation: 5,
    zIndex: 99,
  },
  dropdownContainerActive: {
    top:0 !
  },

  filterInput: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop:-40,
    zIndex:100,
    backgroundColor:"#fff"
  },
  option: {
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default Dropdown;
