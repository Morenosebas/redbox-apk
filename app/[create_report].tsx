import FormCreateReport from "@/components/reportsList/createReport/createReport";
import { Stack, useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function CreateReport() {
  const { create_report } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "Create Report",
        }}
      ></Stack.Screen>
      <FormCreateReport projectId={create_report as string} />
    </>
  );
}
