import ReportView from "@/components/reportsList/oneReport";
import { Stack, useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function Report() {
  const { report } = useLocalSearchParams();
  return (
    <>
      <Stack.Screen options={{ headerTitle: "Report" }} />
      <View>
        <ReportView reportid={report.toString()} />
      </View>
    </>
  );
}
