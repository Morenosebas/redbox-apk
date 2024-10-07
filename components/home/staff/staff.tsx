import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Modal, Button, DataTable, Searchbar } from "react-native-paper";

// Import your hooks
import useGetData from "@/hooks/useGetData";
import useDebounce from "@/hooks/useDebounce";
export function ModalStaff({
  visible,
  onDismiss,
  setFieldValue,
  setUsersSelected,
  usersSelected,
  pmId,
}: {
  visible: boolean;
  onDismiss: () => void;
  setFieldValue: (field: string, value: any) => void;
  setUsersSelected: React.Dispatch<
    React.SetStateAction<{ _id: string; NAME: string; POSITION: string }[]>
  >;
  usersSelected: { _id: string; NAME: string; POSITION: string }[];
  pmId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentData, setCurrentData] = useState<
    {
      _id: string;
      NAME: string;
      POSITION: string;
    }[]
  >([]);

  // Fetch staff data
  const { data } = useGetData("Staff", debouncedSearch, 1, true);

  useEffect(() => {
    if (data && "users" in data) {
      setCurrentData(data.users);
    }
  }, [data]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const addStaff = (staff: { _id: string; NAME: string; POSITION: string }) => {
    setUsersSelected((prev) => {
      if (prev.find((user) => user._id === staff._id)) return prev;
      return [...prev, staff];
    });
  };

  useEffect(() => {
    setFieldValue(
      "STAFF",
      usersSelected.map((user) => user._id)
    );
  }, [usersSelected]);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.container}>
        <Searchbar
          placeholder="Search Staff"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Full Name</DataTable.Title>
            <DataTable.Title>Position</DataTable.Title>
            <DataTable.Title>Action</DataTable.Title>
          </DataTable.Header>
          <ScrollView className="h-[350px]">
            {currentData.map((staff) => (
              <DataTable.Row key={staff._id}>
                <DataTable.Cell>{staff.NAME}</DataTable.Cell>
                <DataTable.Cell>{staff.POSITION}</DataTable.Cell>
                <DataTable.Cell>
                  <Button
                    mode="contained"
                    onPress={() => addStaff(staff)}
                    disabled={usersSelected.some(
                      (user) => user._id === staff._id
                    )}
                  >
                    {usersSelected.some((user) => user._id === staff._id)
                      ? "Added"
                      : "Add"}
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    maxHeight: "80%",
  },
  container: {
    padding: 20,
  },
  searchbar: {
    marginBottom: 10,
  },
});
