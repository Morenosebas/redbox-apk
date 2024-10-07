// fields/ProjectMaterials.tsx
import useDebounce from "@/hooks/useDebounce";
import { PROJECTINTERFACE } from "@/hooks/useGetOneProject";
import React, { useEffect, useState } from "react";
import { View, StyleSheet, FlatList, ScrollView } from "react-native";
import {
  Text,
  Button,
  Dialog,
  Portal,
  TextInput,
  DataTable,
} from "react-native-paper";

interface DataMaterials {
  name: string;
  quantity: number;
  unit: string;
}

interface Material {
  name: string;
  quantity: number;
  unit: string;
}

const ProjectMaterials = ({
  setFieldValue,
  clean,
  data,
}: {
  data: Omit<PROJECTINTERFACE, "STAFF"> & {
    PROJECT_MANAGER: {
      _id: string;
      FULL_NAME: string;
      POSITION: string;
    };
    STAFF: {
      _id: string;
      FULL_NAME: string;
      POSITION: string;
    }[];
  };
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<any>;
  clean?: boolean;
}) => {
  const [visible, setVisible] = useState(false);
  const [newMaterial, setNewMaterial] = useState<Material>({
    name: "",
    quantity: 0,
    unit: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [materials, setMaterials] = useState<DataMaterials[]>([]);
  const [quantities, setQuantities] = useState<{
    [key: string]: number;
  }>({});
  const [currentData, setCurrentData] = useState<
    {
      NAME: string;
      UNIT: string;
      ESTIMATED: number;
      ACTUAL: number;
    }[]
  >([]);
  const showDialog = () => setVisible(true);
  const hideDialog = () => {
    setSearch("");
    setVisible(false);
  };

  useEffect(() => {
    setCurrentData(data.BUDGET);
  }, []);
  useEffect(() => {
    setCurrentData(
      data.BUDGET.filter((mat) =>
        mat.NAME.toUpperCase().includes(debouncedSearch.toUpperCase())
      )
    );
  }, [debouncedSearch]);

  const deleteMaterial = (NAME: string, qty: number) => {
    const mat = materials.find((mat) => mat.name === NAME)?.quantity;
    if (mat && qty > mat) {
      alert("The quantity is greater than the estimated");
      return;
    } else if (mat && qty === mat) {
      setMaterials((prev) => prev.filter((mat) => mat.name !== NAME));
    } else if (mat && qty < mat) {
      setMaterials((prev) =>
        prev.map((mat) => {
          if (mat.name === NAME) {
            return {
              ...mat,
              quantity: mat.quantity - qty,
            };
          }
          return mat;
        })
      );
    }
  };
  const addMaterial = (
    material: {
      NAME: string;
      UNIT: string;
      ESTIMATED: number;
      ACTUAL: number;
    },
    quantity: number,
    unit: string
  ) => {
    const newMaterial = {
      name: material.NAME,
      quantity: quantity,
      unit,
    };

    setMaterials((prev) => {
      if (prev.find((mat) => mat.name === newMaterial.name)) {
        return prev.map((mat) => {
          if (mat.name === newMaterial.name) {
            return {
              ...mat,
              quantity: mat.quantity + newMaterial.quantity,
              unit: newMaterial.unit,
            };
          }
          return mat;
        });
      }
      return [...prev, newMaterial];
    });
    setQuantities((prev) => ({ ...prev, [material.NAME]: 0 }));
  };
  useEffect(() => {
    //   {
    //     name: string;
    //     quantity: number;
    //     unit: string;
    // }[]
    setFieldValue("MATERIAL", materials);
  }, [materials]);
  const onChangeSearch = (event: string) => {
    setSearch(event);
    setCurrentPage(1);
  };
  useEffect(() => {
    if (clean) {
      setMaterials([]);
      setQuantities({});
    }
  }, [clean]);

  const handleQuantityChange = (name: string, value: number) => {
    setQuantities((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MATERIALS</Text>
      <Button mode="contained" className="bg-blue-500" onPress={showDialog}>
        SELECT
      </Button>

      {/* Lista de materiales usando mapeo directo */}
      <ScrollView style={styles.list}>
        <DataTable
          style={{
            maxHeight: 200,
          }}
        >
          <DataTable.Header className="w-full">
            <DataTable.Title className=" ">
              <Text className="items-center w-full flex text-center">
                Material
              </Text>{" "}
            </DataTable.Title>
            <DataTable.Title className=" ">
              <Text className="items-center w-full flex text-center">
                Quantity
              </Text>
            </DataTable.Title>
            <DataTable.Title className=" ">
              <Text className="items-center w-full flex text-center">Unit</Text>
            </DataTable.Title>
            <DataTable.Title className=" ">
              <Text className="items-center w-full flex text-center">
                Action
              </Text>
            </DataTable.Title>
          </DataTable.Header>
          <ScrollView className="max-h-[100%]">
            {materials.map((item, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell className="">
                  <Text className="max- items-center flex  text-[7px] break-words whitespace-normal">
                    {item.name}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell className="">
                  <Text className="items-center w-full flex text-center">
                    {item.quantity}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text className="items-center w-full flex text-center">
                    {item.unit}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text className="items-center w-full flex text-center">
                    <Button
                      mode="text"
                      onPress={() => deleteMaterial(item.name, item.quantity)}
                    >
                      DELETE
                    </Button>
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </ScrollView>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Material</Dialog.Title>
          <View className="w-full flex items-center">
            <TextInput
              label="Search"
              value={search}
              onChangeText={onChangeSearch}
              clearButtonMode="always"
              className="w-[90%] bg-gray-200"
            />
            <DataTable
              style={{
                maxHeight: 200,
              }}
            >
              <DataTable.Header className="">
                <DataTable.Title className=" items-center flex text-center">
                  Material
                </DataTable.Title>
                <DataTable.Title className=" items-center flex text-center">
                  Quantity
                </DataTable.Title>
                <DataTable.Title className=" items-center flex text-center">
                  Unit
                </DataTable.Title>
                <DataTable.Title className=" items-center flex text-center">
                  Action
                </DataTable.Title>
              </DataTable.Header>
              <ScrollView className="max-h-[100%]">
                {currentData.map((material) => (
                  <DataTable.Row key={material.NAME}>
                    <DataTable.Cell className="">
                      <Text className="max-w-[100%] items-center flex  text-[10px] break-words whitespace-normal">
                        {material.NAME}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <TextInput
                        className="items-center flex text-center"
                        // value={newMaterial.quantity.toString()}
                        value={quantities[material.NAME]?.toString() || ""}
                        id={"qty" + material.NAME}
                        keyboardType="numeric"
                        onChangeText={(text) =>
                          handleQuantityChange(material.NAME, Number(text))
                        }
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Text
                        className="items-center flex text-center"
                        children={material.UNIT}
                      />
                    </DataTable.Cell>
                    <DataTable.Cell>
                      <Button
                        onPress={() =>
                          addMaterial(
                            material,
                            quantities[material.NAME],
                            material.UNIT
                          )
                        }
                      >
                        add
                      </Button>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </ScrollView>
            </DataTable>
          </View>
          <Dialog.Actions className="pt-5">
            <Button
              onPress={hideDialog}
              className="bg-red-500 text-white rounded"
              textColor="white"
            >
              cancel
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
      {/* Diálogo para agregar material */}
      {/* ... */}
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
  },
  list: {
    maxHeight: 200,
  },

  input: {
    marginBottom: 8,
  },
});

export default ProjectMaterials;
