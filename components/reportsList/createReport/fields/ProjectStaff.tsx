// fields/ProjectStaff.tsx
import { ReportRequest } from "@/hooks/useCreateReport";
import useDebounce from "@/hooks/useDebounce";
import { FormikErrors } from "formik";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  Text,
  Button,
  Dialog,
  Portal,
  TextInput,
  DataTable,
} from "react-native-paper";

interface Staff {
  id: string;
  fullName: string;
  position: string;
}

const ProjectStaff = ({
  setFieldValue,
  clean,
  staff,
}: {
  staff: {
    _id: string;
    FULL_NAME: string;
    POSITION: string;
  }[];
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<ReportRequest>>;
  clean?: boolean;
}) => {
  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);
  const [userSelecteds, setUserSelecteds] = useState<
    {
      _id: string;
      NAME: string;
      POSITION: string;
    }[]
  >([]);
  const [currentData, setCurrentData] = useState<
    {
      _id: string;
      FULL_NAME: string;
      POSITION: string;
    }[]
  >([]);

  useEffect(() => {
    setCurrentData(staff);
  }, []);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setFieldValue("ATTENDANCE", userSelecteds);
  }, [userSelecteds]);
  useEffect(() => {
    if (clean) {
      setUserSelecteds([]);
    }
  }, [clean]);

  const handleSearch = (e: string) => {
    setSearch(e);
  };

  useEffect(() => {
    setCurrentData(
      staff.filter((personal) => personal.FULL_NAME.includes(debouncedSearch))
    );
  }, [debouncedSearch]);

  function onChangeSelectUser(personal: {
    _id: string;
    FULL_NAME: string;
    POSITION: string;
  }) {
    if (userSelecteds.some((user) => user._id == personal._id)) {
      return;
    }
    setUserSelecteds((prev) => [
      ...prev,
      {
        _id: personal._id,
        NAME: personal.FULL_NAME,
        POSITION: personal.POSITION,
      },
    ]);
  }
  function handleRemoveUser(personal: {
    _id: string;
    FULL_NAME: string;
    POSITION: string;
  }) {
    if (!userSelecteds.some((user) => user._id == personal._id)) {
      return;
    }
    setUserSelecteds((prev) =>
      prev.filter((user) => user._id !== personal._id)
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>STAFF</Text>
      <Button mode="contained" className="bg-blue-500" onPress={showDialog}>
        SELECT
      </Button>

      {/* Lista de personal seleccionado usando mapeo directo */}
      <DataTable>
        <DataTable.Header>
          <DataTable.Title>FULL NAME</DataTable.Title>
          <DataTable.Title>POSITION</DataTable.Title>
          <DataTable.Title>ACTION</DataTable.Title>
        </DataTable.Header>

        <ScrollView style={styles.list}>
          {staff
            .filter((personal) =>
              userSelecteds.some((user) => user._id == personal._id)
            )
            .map((item, index) => (
              <DataTable.Row
                key={`${item._id}-${index}`}
                style={styles.staffItem}
              >
                <DataTable.Cell>
                  <Text style={styles.staffName}>{item.FULL_NAME}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.staffPosition}>{item.POSITION}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Button mode="text" onPress={() => handleRemoveUser(item)}>
                    DELETE
                  </Button>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        </ScrollView>
      </DataTable>
      {/* Diálogo para agregar personal */}
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>STAFF</Dialog.Title>
          <View className="w-full flex items-center">
            <TextInput
              label="Search"
              value={search}
              onChangeText={handleSearch}
              clearButtonMode="always"
              className="w-[90%] bg-gray-200"
            />
            <DataTable
              style={{
                maxHeight: 200,
              }}
            >
              <DataTable.Header>
                <DataTable.Title>FULL NAME</DataTable.Title>
                <DataTable.Title>POSITION</DataTable.Title>
                <DataTable.Title>ACTION</DataTable.Title>
              </DataTable.Header>
              <ScrollView>
                {currentData.map((item, index) => (
                  <DataTable.Row key={`${item._id}-${index}`}>
                    <DataTable.Cell>
                      <Text style={styles.staffName}>{item.FULL_NAME}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text style={styles.staffPosition}>{item.POSITION}</Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Button
                        mode="text"
                        onPress={() => onChangeSelectUser(item)}
                      >
                        ADD
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </ScrollView>
            </DataTable>
          </View>
          <Dialog.Actions>
            <Button onPress={hideDialog}>CANCEL</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    maxHeight: 200,
    marginTop: 8,
  },
  staffItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  staffInfo: {
    flex: 1,
    marginRight: 8,
  },
  staffName: {
    fontSize: 14,
    fontWeight: "500",
  },
  staffPosition: {
    fontSize: 12,
    color: "#666",
  },
  input: {
    marginBottom: 8,
  },
});

export default ProjectStaff;
