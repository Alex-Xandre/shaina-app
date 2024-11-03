/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { ReactNode, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import Input from './Input';
import { TableProps } from '@/types';
import { roleColor } from './helpers/statusColor';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';

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
}): JSX.Element => {
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

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        {title && (
          <Text style={styles.title}>
            <Text style={styles.count}>{data.length}</Text> All {title}
          </Text>
        )}
        {!notSearch && (
          <Input
            placeholder='Officer ID'
            icon={<MagnifyingGlassIcon />}
            onChange={(e) => handleSearch && handleSearch(e)}
          />
        )}
      </View>

      <ScrollView
        horizontal
        style={styles.scrollContainer}
      >
        <View style={styles.table}>
          <View style={styles.header}>
            {handleBatch && (
              <View style={styles.cell}>
                <TouchableOpacity
                  onPress={() => {
                    if (selectedRows.length === data.length) {
                      setSelectedRows([]);
                    } else {
                      const allIds = data.map((row: any) => row._id);
                      setSelectedRows(allIds);
                    }
                  }}
                >
                  <Text>{selectedRows.length === data.length ? '☑️' : '☐'}</Text>
                </TouchableOpacity>
              </View>
            )}
            {columns.map((column, index) => (
              <Text
                key={index}
                style={styles.headerCell}
              >
                {column.header}
              </Text>
            ))}
            <Text style={styles.headerCell}>Actions</Text>
          </View>

          {currentItems.length === 0 ? (
            <Text style={styles.noData}>No Data Found</Text>
          ) : (
            currentItems.map((row, rowIndex) => (
              <View
                key={rowIndex}
                style={styles.row}
              >
                {handleBatch && (
                  <View style={styles.cell}>
                    <TouchableOpacity onPress={() => toggleRowSelection((row as any)._id)}>
                      <Text>{selectedRows.includes((row as any)._id) ? '☑️' : '☐'}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                {columns.map((column, columnIndex) => (
                  <Text
                    key={columnIndex}
                    style={styles.cell}
                  >
                    <Text
                      style={{
                        backgroundColor: title === 'applicant' ? '#f0f0f0' : 'transparent',
                        color:
                          title === 'User'
                            ? roleColor[
                                column.render ? column.render(row[column.accessor], row) : (row[column.accessor] as any)
                              ]
                            : '#000',
                      }}
                    >
                      {column.render ? column.render(row[column.accessor], row) : (row[column.accessor] as string)}
                    </Text>
                  </Text>
                ))}
                <View style={styles.cell}>
                  <TouchableOpacity onPress={() => onEdit(row)}>
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>
                  {isPay && (
                    <TouchableOpacity onPress={() => onViewPayment && onViewPayment(row)}>
                      <Text style={styles.actionText}>{(row as any)?.salaryIsPaid ? 'Paid' : 'Mark as paid'}</Text>
                    </TouchableOpacity>
                  )}
                </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
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
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    overflow: 'hidden',

    width: 1000,
  },
  header: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'left',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  cell: {
    display: 'flex',
    flex: 1,

    textAlign: 'left',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  actionText: {
    color: '#007bff',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  pageButton: {
    color: '#007bff',
  },
  pageInfo: {
    marginHorizontal: 10,
  },
  noData: {
    textAlign: 'center',
    padding: 20,
    flex: 1,
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

export default Table;
