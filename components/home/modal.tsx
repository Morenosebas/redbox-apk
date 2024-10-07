import { PROJECTINTERFACE } from "@/hooks/useGetOneProject";
import React, { useState, useEffect } from "react";
import { View, ScrollView, Alert, StyleSheet } from "react-native";
import {
  Modal,
  Button,
  TextInput,
  DataTable,
  ActivityIndicator,
} from "react-native-paper";
import { Image } from "expo-image";
import { useFormik } from "formik";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Toast } from "toastify-react-native";

// Import your hooks
import { useModifyProject } from "@/hooks/useModifyProject";
import AXIOS from "@/axios/config";
import { ModalMaterial } from "./material/material";
import { ModalStaff } from "./staff/staff";
import customImageLoader from "@/app/controllers/imageLoader";

export default function ModalProject({
  visible,
  onDismiss,
  project,
  refetchProject,
}: {
  visible: boolean;
  onDismiss: () => void;
  project: {
    project: Omit<PROJECTINTERFACE, "STAFF"> & {
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
  };
  refetchProject: () => void;
}) {
  // State variables
  const [onEdit, setOnEdit] = useState(false);
  const [openSelectMaterial, setOpenSelectMaterial] = useState(false);
  const [openSelectStaff, setOpenSelectStaff] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Fetch project data

  // Initialize formik
  const {
    handleChange,
    handleSubmit,
    values,
    setFieldValue,
    isSubmitting,
    resetForm,
    submitForm,
  } = useModifyProject(project.project, onEdit);

  // State for materials and staff
  const [materials, setMaterials] = useState<
    {
      NAME: string;
      ESTIMATED: number;
      ACTUAL: number;
      UNIT: string;
    }[]
  >([]);
  const [usersSelected, setUsersSelected] = useState<
    { _id: string; NAME: string; POSITION: string }[]
  >([]);

  // Update materials and users when project changes
  useEffect(() => {
    if (project && project.project) {
      setMaterials(project.project.BUDGET);
      setUsersSelected([
        {
          _id: project.project.PROJECT_MANAGER._id,
          NAME: project.project.PROJECT_MANAGER.FULL_NAME,
          POSITION: project.project.PROJECT_MANAGER.POSITION,
        },
        ...project.project.STAFF.map((staff) => ({
          _id: staff._id,
          NAME: staff.FULL_NAME,
          POSITION: staff.POSITION,
        })),
      ]);
    }
  }, [project]);

  // Delete project function
  const deleteProject = async () => {
    Alert.alert(
      "Delete Project",
      "Are you sure you want to delete this project?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "OK",
          onPress: async () => {
            try {
              const res = await AXIOS.delete(`/api/projects/${project}/delete`);
              if (res.status === 200) {
                refetchProject();
                onDismiss();
              } else {
                throw new Error("Error deleting project " + res.data.message);
              }
            } catch (e) {
              Toast.error((e as Error).message, "top");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Image picker function
  const pickImage = async (field: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setFieldValue(field, result.assets[0].uri);
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={styles.modalContainer}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Project Manager */}
          <View style={styles.fieldContainer}>
            <TextInput
              label="Project Manager"
              value={project.project.PROJECT_MANAGER.FULL_NAME}
              editable={false}
              style={styles.input}
            />
          </View>

          {/* Other Fields */}
          {Object.keys(values).map((key) => {
            if (
              [
                "_id",
                "STAFF",
                "CLIENT_LOGO",
                "CONTRACTING_LOGO",
                "BUDGET",
                "PM_ID",
                "PROJECT_MANAGER",
                "SITE_HEALTH",
                "STATE",
              ].includes(key)
            )
              return null;

            if (["ESTIMATED_END_DATE", "START_DATE"].includes(key)) {
              const showDatePicker =
                key === "START_DATE" ? showStartDatePicker : showEndDatePicker;
              const setShowDatePicker =
                key === "START_DATE"
                  ? setShowStartDatePicker
                  : setShowEndDatePicker;

              return (
                <View key={key} style={styles.fieldContainer}>
                  <Button
                    mode="outlined"
                    onPress={() => setShowDatePicker(true)}
                    disabled={!onEdit || isSubmitting}
                    style={styles.dateButton}
                  >
                    {/* @ts-ignore */}
                    {values[key]
                      ? `${key.replace("_", " ")}: ${new Date(
                          /* @ts-ignore */
                          values[key]
                        ).toLocaleDateString()}`
                      : `Select ${key.replace("_", " ")}`}
                  </Button>
                  {showDatePicker && (
                    <DateTimePicker
                      /* @ts-ignore */
                      value={values[key] ? new Date(values[key]) : new Date()}
                      mode="date"
                      display="default"
                      onChange={(event, selectedDate) => {
                        setShowDatePicker(false);
                        if (selectedDate) {
                          setFieldValue(key, selectedDate.toISOString());
                        }
                      }}
                    />
                  )}
                </View>
              );
            } else {
              return (
                <View key={key} style={styles.fieldContainer}>
                  <TextInput
                    label={key.replace("_", " ")}
                    /* @ts-ignore */
                    value={values[key]}
                    onChangeText={handleChange(key)}
                    editable={onEdit && !isSubmitting}
                    style={styles.input}
                  />
                </View>
              );
            }
          })}

          {/* SITE_HEALTH Picker */}
          <View style={styles.fieldContainer}>
            <Picker
              selectedValue={values.SITE_HEALTH}
              onValueChange={(itemValue) =>
                setFieldValue("SITE_HEALTH", itemValue)
              }
              enabled={onEdit && !isSubmitting}
              style={styles.picker}
            >
              <Picker.Item label="Not Started" value="NOT STARTED" />
              <Picker.Item label="Need Attention" value="NEED ATTENTION" />
              <Picker.Item label="OK" value="OK" />
              <Picker.Item label="Finished" value="FINISHED" />
            </Picker>
          </View>

          {/* STATE Picker */}
          <View style={styles.fieldContainer}>
            <Picker
              selectedValue={values.STATE}
              onValueChange={(itemValue) => setFieldValue("STATE", itemValue)}
              enabled={onEdit && !isSubmitting}
              style={styles.picker}
            >
              <Picker.Item label="Not Started" value="NOT STARTED" />
              <Picker.Item label="In Progress" value="IN PROGRESS" />
              <Picker.Item label="Finished" value="FINISHED" />
              <Picker.Item label="Stopped" value="STOPPED" />
            </Picker>
          </View>

          {/* Materials DataTable */}
          <View style={styles.tableContainer}>
            <Button
              mode="contained"
              onPress={() => setOpenSelectMaterial(true)}
              disabled={!onEdit || isSubmitting}
              style={styles.button}
            >
              Select Materials
            </Button>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title
                  textStyle={{
                    textAlign: "center",
                    justifyContent: "center",
                    flex: 1,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Material
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
                >
                  Estimated
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
                >
                  Current
                </DataTable.Title>
                <DataTable.Title
                  textStyle={{
                    textAlign: "center",
                    justifyContent: "center",
                    flex: 1,
                    fontWeight: "bold",
                    color: "black",
                  }}
                >
                  Unit
                </DataTable.Title>
              </DataTable.Header>

              {materials.map((material, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                  >
                    {material.NAME}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                    numeric
                  >
                    {material.ESTIMATED}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                    numeric
                  >
                    {material.ACTUAL}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                  >
                    {material.UNIT}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>

          {/* Staff DataTable */}
          <View style={styles.tableContainer}>
            <Button
              mode="contained"
              onPress={() => setOpenSelectStaff(true)}
              disabled={!onEdit || isSubmitting}
              style={styles.button}
            >
              Select Staff
            </Button>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title
                  textStyle={{
                    textAlign: "center",
                    justifyContent: "center",
                    flex: 1,
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Full Name
                </DataTable.Title>
                <DataTable.Title
                  textStyle={{
                    textAlign: "center",
                    justifyContent: "center",
                    flex: 1,
                    color: "black",
                    fontWeight: "bold",
                  }}
                >
                  Position
                </DataTable.Title>
              </DataTable.Header>

              {usersSelected.map((staff, index) => (
                <DataTable.Row key={index}>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                  >
                    {staff.NAME}
                  </DataTable.Cell>
                  <DataTable.Cell
                    textStyle={{
                      textAlign: "center",
                      justifyContent: "center",
                      flex: 1,
                      color: "black",
                    }}
                  >
                    {staff.POSITION}
                  </DataTable.Cell>
                </DataTable.Row>
              ))}
            </DataTable>
          </View>

          {/* Client Logo */}
          <View style={styles.imageContainer}>
            {/* <Button
              mode="contained"
              onPress={() => pickImage("CLIENT_LOGO")}
              disabled={!onEdit || isSubmitting}
            >
              Select Client Logo
            </Button> */}
            {project.project.LOGOS.CLIENT_LOGO && (
              <Image
                source={{
                  uri: customImageLoader({
                    src: project.project.LOGOS.CLIENT_LOGO,
                  }),
                }}
                style={styles.logoImage}
              />
            )}
          </View>

          {/* Contracting Logo */}
          <View style={styles.imageContainer}>
            {/* <Button
              mode="contained"
              onPress={() => pickImage("CONTRACTING_LOGO")}
              disabled={!onEdit || isSubmitting}
            >
              Select Contracting Logo
            </Button> */}
            {project.project.LOGOS.CONTRACTING_LOGO && (
              <Image
                source={{
                  uri: customImageLoader({
                    src: project.project.LOGOS.CONTRACTING_LOGO,
                  }),
                }}
                style={styles.logoImage}
              />
            )}
          </View>

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={() => submitForm()}
              loading={isSubmitting}
              disabled={!onEdit || isSubmitting}
              style={styles.button}
            >
              Save
            </Button>
            <Button
              mode="contained"
              onPress={() => setOnEdit(true)}
              disabled={onEdit || isSubmitting}
              style={styles.button}
            >
              Edit
            </Button>
            <Button
              mode="contained"
              onPress={deleteProject}
              disabled={isSubmitting}
              style={styles.button}
            >
              Delete
            </Button>
            <Button
              mode="contained"
              onPress={() => {
                resetForm();
                onDismiss();
              }}
              disabled={isSubmitting}
              style={styles.button}
            >
              {onEdit ? "Cancel" : "Close"}
            </Button>
          </View>

          {/* Modals for Material and Staff selection */}
        </ScrollView>
      </Modal>
      {openSelectMaterial && (
        <ModalMaterial
          visible={openSelectMaterial}
          onDismiss={() => setOpenSelectMaterial(false)}
          setFieldValue={setFieldValue}
          setMaterials={setMaterials}
          materials={materials}
        />
      )}
      {openSelectStaff && (
        <ModalStaff
          visible={openSelectStaff}
          onDismiss={() => setOpenSelectStaff(false)}
          setFieldValue={setFieldValue}
          setUsersSelected={setUsersSelected}
          usersSelected={usersSelected}
          pmId={project.project.PROJECT_MANAGER._id}
        />
      )}
    </>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 8,
    maxHeight: 600,
  },
  scrollContainer: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "white",
  },
  picker: {
    backgroundColor: "white",
  },
  dateButton: {
    marginBottom: 15,
  },
  tableContainer: {
    marginBottom: 15,
  },
  imageContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  logoImage: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginTop: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 5,
  },
});
