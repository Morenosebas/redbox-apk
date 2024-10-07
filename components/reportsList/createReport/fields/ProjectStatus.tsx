// fields/ProjectStatus.tsx
import { ReportRequest } from "@/hooks/useCreateReport";
import React, { ChangeEvent, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Text, Menu, Button } from "react-native-paper";

const ProjectStatus = ({
  setFieldValue,
}: {
  setFieldValue: (field: string, value: string) => void;
}) => {
  const [visibleHealth, setVisibleHealth] = useState(false);
  const [visibleState, setVisibleState] = useState(false);
  const [healthStatus, setHealthStatus] = useState("OK");
  const [stateStatus, setStateStatus] = useState("IN PROGRESS");

  const openMenuHealth = () => setVisibleHealth(true);
  const closeMenuHealth = () => setVisibleHealth(false);

  const openMenuState = () => setVisibleState(true);
  const closeMenuState = () => setVisibleState(false);
  useEffect(() => {
    setFieldValue("SITE_HEALTH", healthStatus);
  }, [healthStatus]);
  useEffect(() => {
    setFieldValue("STATE", stateStatus);
  }, [stateStatus]);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>SITE HEALTH</Text>
      <Menu
        visible={visibleHealth}
        onDismiss={closeMenuHealth}
        anchor={
          <Button mode="outlined" onPress={openMenuHealth}>
            {healthStatus}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setHealthStatus("OK");
            closeMenuHealth();
          }}
          title="OK"
        />
        <Menu.Item
          onPress={() => {
            setHealthStatus("NEED ATTENTION");
            closeMenuHealth();
          }}
          title="NEED ATTENTION"
        />
        <Menu.Item
          onPress={() => {
            setHealthStatus("NO STARTED");
            closeMenuHealth();
          }}
          title="NO STARTED"
        />
        <Menu.Item
          onPress={() => {
            setHealthStatus("FINISHED");
            closeMenuHealth();
          }}
          title="FINISHED"
        />
      </Menu>

      <Text style={styles.label}>PROJECT STATUS</Text>
      <Menu
        visible={visibleState}
        onDismiss={closeMenuState}
        anchor={
          <Button mode="outlined" onPress={openMenuState}>
            {stateStatus}
          </Button>
        }
      >
        <Menu.Item
          onPress={() => {
            setStateStatus("IN PROGRESS");
            closeMenuState();
          }}
          title="IN PROGRESS"
        />
        <Menu.Item
          onPress={() => {
            setStateStatus("FINISHED");
            closeMenuState();
          }}
          title="FINISHED"
        />
        <Menu.Item
          onPress={() => {
            setStateStatus("NOT STARTED");
            closeMenuState();
          }}
          title="NOT STARTED"
        />
        <Menu.Item
          onPress={() => {
            setStateStatus("STOPPED");
            closeMenuState();
          }}
          title="STOPPED"
        />
      </Menu>
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
});

export default ProjectStatus;
