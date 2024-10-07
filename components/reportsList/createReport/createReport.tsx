// FormCreateReport.tsx
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Button, Snackbar } from "react-native-paper";
import ProjectData from "./fields/ProjectData";
import ProjectDates from "./fields/ProjectDates";
import ProjectStatus from "./fields/ProjectStatus";
import ProjectMaterials from "./fields/ProjectMaterials";
import ProjectStaff from "./fields/ProjectStaff";
import Notes from "./fields/Notes";
import ReportPhotos from "./fields/ReportPhotos";
import { useCreateReport } from "@/hooks/useCreateReport";
import useGetOneProject from "@/hooks/useGetOneProject";
import { useRouter } from "expo-router";

const FormCreateReport = ({ projectId }: { projectId: string }) => {
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    currentStatus,
    resetForm,
    setCurrentStatus,
  } = useCreateReport(projectId);
  const [clean, setClean] = useState(false);
  const { isLoading, project, refetch } = useGetOneProject(projectId);
  const router = useRouter();
  useEffect(() => {
    if (!isSubmitting && currentStatus === 200) {
      resetForm();
      setCurrentStatus(null);
      setClean(true);
      refetch();
      router.replace("/home");
    } else if (
      !isSubmitting &&
      currentStatus !== 200 &&
      currentStatus !== null
    ) {
      setCurrentStatus(null);
    }
  }, [isSubmitting, currentStatus]);
  useEffect(() => {
    if (currentStatus === null) {
      resetForm();
    }
  }, [currentStatus]);
  useEffect(() => {
    if (clean) {
      setClean(false);
    }
  }, [clean]);
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* ToastContainer puede ser reemplazado por Snackbar de React Native Paper */}
      <Snackbar
        visible={false} // Cambia esto según tu estado
        onDismiss={() => {}}
        duration={3000}
      >
        {/* Mensaje del Toast */}
        REPORT CREATED
      </Snackbar>

      <View style={styles.section}>
        {project &&
          project.project &&
          "ADDRESS" in project.project &&
          "PROJECT_NAME" in project.project && (
            <ProjectData
              projectName={project.project.ADDRESS}
              address={project.project.PROJECT_NAME}
              projectManager={project.project.PROJECT_MANAGER.FULL_NAME}
            />
          )}
        <ProjectDates setFieldValue={setFieldValue} />
        <ProjectStatus setFieldValue={setFieldValue} />
      </View>

      <View style={styles.section}>
        {project && project.project && (
          <ProjectMaterials
            data={project?.project}
            setFieldValue={setFieldValue}
            clean={clean}
          />
        )}
        {project && project.project && "STAFF" in project.project && (
          <ProjectStaff
            setFieldValue={setFieldValue}
            staff={[
              project.project.PROJECT_MANAGER,
              ...project?.project?.STAFF,
            ]}
          />
        )}
      </View>

      <View style={styles.section}>
        <Notes
          handleChange={handleChange}
          setFieldValue={setFieldValue}
          values={values}
          clean={clean}
        />
        <ReportPhotos setFieldValue={setFieldValue} />
        <Button
          onPress={() => {
            handleSubmit();
          }}
          mode="contained"
          style={styles.submitButton}
        >
          CREATE REPORT
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 16,
  },
  section: {
    gap: 16,
  },
  submitButton: {
    backgroundColor: "#e77a1a",
  },
});

export default FormCreateReport;
