import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, FlatList, TextInput } from 'react-native';

interface DropdownProps {
  label?: string;
  error?: string;
  options: { value: string | number; label: string }[];
  icon?: React.ReactNode;
  id?: string;
  value?: string | number;
  onChange?: (value: string | number) => void;
  disabled?: boolean;
  isInputFilter?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  error,
  options,
  icon,
  id,
  value,
  onChange,
  disabled = false,
  isInputFilter = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const [filter, setFilter] = useState('');

  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  };

  const handleSelect = (itemValue: string | number) => {
    setSelectedValue(itemValue);
    if (onChange) {
      onChange(itemValue);
    }
    setIsOpen(false);
  };

  const filteredOptions = isInputFilter
    ? options.filter((option) => option.label.toLowerCase().includes(filter.toLowerCase()))
    : options;

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
          value={options.find((option) => option.value === selectedValue)?.label || ''}
          placeholder={label}
          style={styles.input}
        />
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </TouchableOpacity>
      
      {/* Modal for dropdown */}
      <Modal visible={isOpen} transparent={true} animationType="fade" onRequestClose={() => setIsOpen(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            
            {/* Search bar for filtering options */}
            {isInputFilter && (
              <TextInput
                style={styles.filterInput}
                placeholder="Search..."
                value={filter}
                onChangeText={setFilter}
              />
            )}

            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => String(item.value)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item.value)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsOpen(false)}>
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  normalBorder: {
    borderWidth: 1,
    borderColor: '#ccc',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: 'red',
  },
  disabled: {
    backgroundColor: '#f0f0f0',
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  iconContainer: {
    marginLeft: 10,
  },

  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  filterInput: {
    marginBottom: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  optionText: {
    fontSize: 14,
  },
  closeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 4,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
    color: 'red',
  },
});

export default Dropdown;
