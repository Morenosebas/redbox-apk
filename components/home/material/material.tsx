import React, { useState, useEffect, Dispatch } from "react";
import { View, StyleSheet } from "react-native";
import {
  Modal,
  Button,
  TextInput,
  DataTable,
  Searchbar,
  Text,
} from "react-native-paper";

// Import your hooks
import useGetData from "@/hooks/useGetData";
import useDebounce from "@/hooks/useDebounce";
import { ScrollView } from "react-native";

export function ModalMaterial({
  visible,
  onDismiss,
  setFieldValue,
  setMaterials,
  materials,
}: {
  visible: boolean;
  onDismiss: () => void;
  setFieldValue: (field: string, value: any) => void;
  setMaterials: Dispatch<
    React.SetStateAction<
      {
        NAME: string;
        ESTIMATED: number;
        ACTUAL: number;
        UNIT: string;
      }[]
    >
  >;
  materials: {
    NAME: string;
    ESTIMATED: number;
    ACTUAL: number;
    UNIT: string;
  }[];
}) {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [currentData, setCurrentData] = useState<
    {
      _id: string;
      name: string;
      quantity?: number;
      unit?: string;
    }[]
  >([]);

  // Fetch materials data
  const { data } = useGetData("Materials", debouncedSearch, 1, true);

  useEffect(() => {
    if (data && "materials" in data) {
      setCurrentData(data.materials);
    }
  }, [data]);

  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
  };

  const addMaterial = (
    material: {
      _id: string;
      name: string;
    },
    quantity: number,
    unit: string
  ) => {
    const newMaterial = {
      NAME: material.name,
      ESTIMATED: quantity,
      UNIT: unit,
      ACTUAL: 0,
    };

    setMaterials((prev) => {
      const existing = prev.find((mat) => mat.NAME === newMaterial.NAME);
      if (existing) {
        return prev.map((mat) =>
          mat.NAME === newMaterial.NAME
            ? { ...mat, ESTIMATED: mat.ESTIMATED + newMaterial.ESTIMATED }
            : mat
        );
      }
      return [...prev, newMaterial];
    });
  };

  useEffect(() => {
    setFieldValue("BUDGET", materials);
  }, [materials]);

  return (
    <Modal
      visible={visible}
      onDismiss={onDismiss}
      contentContainerStyle={styles.modalContainer}
    >
      <View style={styles.container}>
        <Searchbar
          placeholder="Search Materials"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchbar}
        />
        <DataTable className="w-full">
          <DataTable.Header className="w-full">
            <DataTable.Title
              textStyle={{
                textAlign: "center",
                justifyContent: "center",
                flex: 1,
                fontWeight: "bold",
                color: "black",
              }}
              className="flex items-center text-center"
            >
              {"name"}
            </DataTable.Title>
            <DataTable.Title
              textStyle={{
                textAlign: "center",
                justifyContent: "center",
                flex: 1,
                fontWeight: "bold",
                color: "black",
              }}
              numeric
              className="flex w-full items-center text-center"
            >
              {"qty"}
            </DataTable.Title>
            <DataTable.Title
              textStyle={{
                textAlign: "center",
                justifyContent: "center",
                flex: 1,
                fontWeight: "bold",
                color: "black",
              }}
              className="flex items-center text-center"
            >
              unit
            </DataTable.Title>
            <DataTable.Title
              textStyle={{
                textAlign: "center",
                justifyContent: "center",
                flex: 1,
                fontWeight: "bold",
                color: "black",
              }}
              className="w-full"
            >
              Action
            </DataTable.Title>
          </DataTable.Header>
          <ScrollView className="h-[250px]">
            {currentData.map((material) => (
              <DataTable.Row key={material._id}>
                <DataTable.Cell className="w-[30px]">
                  <Text>{material.name}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="Qty"
                    className="text-center"
                    style={styles.input}
                    onChangeText={(text) => {
                      material.quantity = parseFloat(text) || 0;
                    }}
                  />
                </DataTable.Cell>
                <DataTable.Cell>
                  <TextInput
                    placeholder="Unit"
                    style={styles.input}
                    onChangeText={(text) => {
                      material.unit = text;
                    }}
                    className="text-center"
                  />
                </DataTable.Cell>
                <DataTable.Cell
                  style={{
                    flex: 1,
                }}
                >
                  <Button
                    mode="contained"
                    onPress={() => {
                      if (material.quantity && material.unit) {
                        addMaterial(material, material.quantity, material.unit);
                      }
                    }}
                  >
                    Add
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
  input: {
    backgroundColor: "white",
    width: 80,
    height: 40,
  },
});
