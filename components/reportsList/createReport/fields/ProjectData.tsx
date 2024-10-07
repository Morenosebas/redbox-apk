// fields/ProjectData.tsx
import React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput } from "react-native-paper";

interface ProjectDataProps {
  projectName: string;
  address: string;
  projectManager: string;
}

const ProjectData: React.FC<ProjectDataProps> = ({
  projectName,
  address,
  projectManager,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>PROJECT NAME</Text>
      <TextInput
        mode="outlined"
        value={projectName}
        disabled
        style={styles.input}
      />

      <Text style={styles.label}>ADDRESS</Text>
      <TextInput
        mode="outlined"
        value={address}
        disabled
        style={styles.input}
      />

      <Text style={styles.label}>PROJECT LEADER</Text>
      <TextInput
        mode="outlined"
        value={projectManager}
        disabled
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  label: {
    fontWeight: "bold",
    color: "#000",
  },
  input: {
    backgroundColor: "#f0f0f0",
  },
});

export default ProjectData;
