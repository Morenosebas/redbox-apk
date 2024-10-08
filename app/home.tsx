import React, { useContext, useEffect, useState } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { AuthContext } from "@/context/auth";
import useGetReports from "@/hooks/useGetReports";

export default function HomeView() {
  const { logout } = useContext(AuthContext);
  const { refetchReports, reports, isLoading, error } = useGetReports();
  const router = useRouter();

  const [reportesConSitio, setReportesConSitio] = useState<
    {
      KioskId: string;
      fecha: string;
      nota: string;
      name_tecnico: string;
      code: number;
      store_id: string;
      address: string;
      _id: string;
    }[]
  >(reports);
  useEffect(() => {
    if (reports) {
      setReportesConSitio(reports);
    }
  }, [reports]);

  return (
    <View className="flex-1 gap-2">
      <Stack.Screen
        options={{
          header: () => (
            <View className="min-h-[10%] flex flex-row items-end justify-between pl-2 pr-2 pb-2 bg-red-500">
              <Text className="font-bold text-[24px] text-white">Home</Text>
              <TouchableOpacity onPress={logout}>
                <Text className="text-black bg-white p-2 rounded">Log Out</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView className="flex-1 p-2">
        {reportesConSitio.map((report) => (
          <ReportCard key={report._id} report={report} />
        ))}
      </ScrollView>

      <Button
        mode="contained"
        className="bg-blue-500 m-2"
        onPress={() => {
          router.push("/create_report");
        }}
      >
        Create Report
      </Button>
    </View>
  );
}

function ReportCard({
  report,
}: {
  report: {
    KioskId: string;
    fecha: string;
    nota: string;
    name_tecnico: string;
    code: number;
    store_id: string;
    address: string;
    _id: string;
  };
}) {
  return (
    <Card className="mb-2">
      <Card.Title
        title={`Kiosk ID: ${report.KioskId}`}
        subtitle={`Date: ${report.fecha}`}
      />
      <Card.Content>
        <Text>Technician: {report.name_tecnico}</Text>
        <Text>Note: {report.nota}</Text>
        <Text>Code: {report.code}</Text>
        <Text>Store ID: {report.store_id}</Text>
        <Text>Address: {report.address}</Text>
      </Card.Content>
    </Card>
  );
}
