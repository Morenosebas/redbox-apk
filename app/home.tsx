import React, { useContext, useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  ScrollView,
  FlatList,
  ViewToken,
} from "react-native";
import { Text, Button, Card } from "react-native-paper";
import { Stack, useRouter } from "expo-router";
import { AuthContext } from "@/context/auth";
import useGetReports from "@/hooks/useGetReports";
import Ionicons from "@expo/vector-icons/Ionicons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type ListItemProps = {
  viewableItems: Animated.SharedValue<ViewToken[]>;
  index: number;
  listWidth: number;
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
};
const ListItem: React.FC<ListItemProps> = React.memo(
  ({ viewableItems, index, listWidth, report }) => {
    const rStyle = useAnimatedStyle(() => {
      const isVisible = Boolean(
        viewableItems.value.map((v) => v.index).includes(index)
      );

      return {
        opacity: withTiming(isVisible ? 1 : 0),
      };
    }, []);
    return (
      <Animated.View key={index} style={[{ width: listWidth }, rStyle]}>
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
      </Animated.View>
    );
  }
);

export default function HomeView() {
  const { logout } = useContext(AuthContext);
  const { refetchReports, reports, isLoading, error } = useGetReports();
  const router = useRouter();
  const viewableItems = useSharedValue<ViewToken[]>([]);
  const [listWidth, setListWidth] = useState(0);
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
              <TouchableOpacity
                className="rounded p-1"
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "white",
                }}
                onPress={() => refetchReports()}
              >
                <Ionicons name="reload-circle" size={24} color="black" />
                <Text className="text-black p-2 rounded">Reload</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={logout}>
                <Text className="text-black bg-white p-2 rounded">Log Out</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <FlatList
        data={reportesConSitio}
        onLayout={(event) => {
          const { width } = event.nativeEvent.layout;
          setListWidth(width);
        }}
        onViewableItemsChanged={({ viewableItems: vItems }) => {
          viewableItems.value = vItems;
        }}
        renderItem={({ item, index }) => (
          <ListItem
            index={index}
            listWidth={listWidth}
            report={item}
            viewableItems={viewableItems}
          />
        )}
        keyExtractor={(item) => item._id}
      />
      <View className="p-2">
        <Button
          mode="contained"
          className="bg-blue-500 p-1 "
          onPress={() => {
            router.push("/create_report");
          }}
        >
          Create Report
        </Button>
      </View>
    </View>
  );
}
