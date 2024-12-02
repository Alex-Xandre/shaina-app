import React, { ReactNode, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Input from './Input';
import { TableProps } from '@/types';
import { roleColor } from './helpers/statusColor';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import { useAuth } from '@/state/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

const Table = <T,>({
  data,
  columns,
  onEdit,
  title,
  isRecord,
  isPay,
  itemsPerPage = 5,
  onViewPayment,
  handleBatch,
  notSearch,
  handleSearch,
  submitSelected,
}: TableProps<T> & {
  isRecord?: boolean;
  itemsPerPage?: number;
  isPay?: boolean;
  handleSearch?: (e: any) => void;
  onViewPayment?: (e: any) => void;
  handleBatch?: ReactNode;
  submitSelected?: (e: any) => void;
  notSearch?: boolean;
  title?: string;
}): JSX.Element => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 5,
      marginTop: title === 'Employees' ? 60 : 10,
    },
    nav: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    title: {
      fontWeight: '600',
      marginTop: 15,
    },
    count: {
      backgroundColor: '#e0e0e0',
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    scrollContainer: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    card: {
      backgroundColor: '#fff',
      borderRadius: 8,
      padding: 15,
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#ccc',
    },
    cardHeader: {
      flexDirection: 'row',
      flexWrap: 'wrap', // Allow items to wrap into multiple rows
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    cardItem: {
      width: '48%', // Each item will take up roughly half of the card's width
      marginBottom: 10,
    },
    cardLabel: {
      fontWeight: 'bold',
      color: '#333',
      fontSize: 12,
    },
    cardValue: {
      color: '#333',
      fontSize: 14,
    },
    actions: {
      marginTop: 10,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      padding: 8,
      backgroundColor: '#007bff',
      borderRadius: 5,
    },
    actionText: {
      color: '#fff',
      fontSize: 14,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      marginBottom: 5,
    },
    pageButton: {
      color: '#007bff',
      fontSize: 14,
    },
    pageInfo: {
      marginHorizontal: 10,
    },
    noData: {
      textAlign: 'center',
      padding: 20,
    },
    batchButton: {
      backgroundColor: '#fff',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
      marginTop: 10,
    },
    disabled: {
      color: 'gray',
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prevSelectedRows) => {
      if (prevSelectedRows.includes(id)) {
        return prevSelectedRows.filter((rowId) => rowId !== id);
      } else {
        return [...prevSelectedRows, id];
      }
    });
  };

  const { user } = useAuth();

  return (
    <View style={styles.container}>
      {!notSearch && user.role !== 'user' && (
        <Input
          placeholder='Officer ID'
          icon={<MagnifyingGlassIcon color='#ccc' />}
          onChangeText={(text) => {
            console.log(text);
            if (handleSearch) handleSearch(text);
          }}
        />
      )}

      <ScrollView
        style={styles.scrollContainer}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.list}>
          {currentItems.length === 0 ? (
            <Text style={styles.noData}>No Data Found</Text>
          ) : (
            currentItems.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={styles.card}
              >
                <View style={styles.cardHeader}>
                  {/* Render columns dynamically */}
                  {columns.map((column, columnIndex) => {
                    return (
                      <View
                        key={columnIndex}
                        style={styles.cardItem}
                      >
                        <Text style={styles.cardLabel}>{column.header}:</Text>
                        <Text style={styles.cardValue}>
                          {column.render ? column.render(row[column.accessor], row) : (row[column.accessor] as string)}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* Action Button */}
                {user.role !== 'user' && title !=="Salary" &&  (
                  <View style={styles.actions}>
                    <TouchableOpacity
                      onPress={() => onEdit(row)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionText}>View</Text>
                    </TouchableOpacity>
                    {isPay && (
                      <TouchableOpacity
                        onPress={() => onViewPayment && onViewPayment(row)}
                        style={styles.actionButton}
                      >
                        <Text style={styles.actionText}>{(row as any)?.salaryIsPaid ? 'Done' : 'Mark as Done'}</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </View>
            ))
          )}
        </View>
      </ScrollView>

      <View style={styles.pagination}>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <Text style={[styles.pageButton, currentPage === 1 && styles.disabled]}>Previous</Text>
        </TouchableOpacity>
        <Text style={styles.pageInfo}>
          Page {currentPage} of {totalPages}
        </Text>
        <TouchableOpacity
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <Text style={[styles.pageButton, currentPage === totalPages && styles.disabled]}>Next</Text>
        </TouchableOpacity>
      </View>

      {handleBatch && selectedRows.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            if (submitSelected) {
              submitSelected(selectedRows);
              setSelectedRows([]);
            }
          }}
          style={styles.batchButton}
        >
          <Text>
            {selectedRows.length} Selected - {handleBatch}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Table;
