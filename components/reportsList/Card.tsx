// Card.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

export function Card({
  data,
}: {
  data: {
    PROJECT_NAME: string;
    DATE: string;
    PROJECT_MANAGER: string;
    STATE: string;
    SITE_HEALTH: string;
  };
}) {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.projectName}>PROJECT NAME: {data.PROJECT_NAME}</Text>
      <Text style={styles.date}>
        Date: {new Date(data.DATE).toISOString().split("T")[0]}
      </Text>
      <Text style={styles.projectManager}>PM: {data.PROJECT_MANAGER}</Text>
      <View style={styles.statusContainer}>
        {/* STATUS */}
        <View style={styles.statusItem}>
          <Text style={styles.statusTitle}>STATUS</Text>
          {data.STATE === "IN PROGRESS" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#fbbf24" }]}
            ></View>
          )}
          {data.STATE === "FINISHED" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#15803d" }]}
            ></View>
          )}
          {data.STATE === "NOT STARTED" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#9ca3af" }]}
            ></View>
          )}
          {data.STATE === "STOPPED" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#dc2626" }]}
            ></View>
          )}
          <Text style={styles.statusText}>{data.STATE}</Text>
        </View>

        {/* SITE HEALTH */}
        <View style={styles.statusItem}>
          <Text style={styles.statusTitle}>SITE HEALTH</Text>
          {data.SITE_HEALTH === "FINISHED" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#15803d" }]}
            ></View>
          )}
          {data.SITE_HEALTH === "NEED ATTENTION" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#dc2626" }]}
            ></View>
          )}
          {data.SITE_HEALTH === "NOT STARTED" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#9ca3af" }]}
            ></View>
          )}
          {data.SITE_HEALTH === "OK" && (
            <View
              style={[styles.statusBox, { backgroundColor: "#22c55e" }]}
            ></View>
          )}
          <Text style={styles.statusText}>{data.SITE_HEALTH}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#d1d5db", // bg-gray-400
    borderRadius: 8,
    padding: 16,
    marginVertical: 4,
  },
  projectName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  date: {
    fontSize: 14,
    fontWeight: "bold",
  },
  projectManager: {
    fontWeight: "bold",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 8,
  },
  statusItem: {
    alignItems: "center",
    marginVertical: 8,
  },
  statusTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  statusBox: {
    width: 50,
    height: 50,
    marginVertical: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
