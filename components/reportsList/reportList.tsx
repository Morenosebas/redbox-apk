// ReportList.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import useGetReports from "@/hooks/useGetReports";
import { Card } from "./Card"; // Asegúrate de tener el componente Card
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
export default function ReportList({
  projectName,
}: {
  // Propiedades
  projectName: string;
}) {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [currentFilter, setFilter] = useState<
    "NONE" | "NOT STARTED" | "IN PROGRESS" | "FINISHED" | "STOPPED"
  >("NONE");
  const [currentFilterSiteHealth, setFilterSiteHealth] = useState<
    "NONE" | "NOT STARTED" | "NEED ATTENTION" | "OK" | "FINISHED"
  >("NONE");
  const [currentOrderBy, setOrderBy] = useState<string>("PROJECT_NAME");
  const [search, setSearch] = useState<string>("");
  const [sort, setSort] = useState<"ASC" | "DESC">("ASC");
  const [limit, setLimit] = useState<number>(10);

  // Estados de fecha
  const [START_DATE, setStartDate] = useState<Date | undefined>(undefined);
  const [END_DATE, setEndDate] = useState<Date | undefined>(undefined);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Obtiene los reportes usando el hook
  const { reports, isLoading, error, pagination, refetchReports } =
    useGetReports({
      FilterValuesState: currentFilter,
      FilterValuesSiteHealth: currentFilterSiteHealth,
      orderBy: currentOrderBy,
      limit: limit,
      search: projectName,
      sort: sort,
      currentPage: currentPage,
      END_DATE: END_DATE ? END_DATE.toISOString().split("T")[0] : undefined,
      START_DATE: START_DATE
        ? START_DATE.toISOString().split("T")[0]
        : undefined,
    });

  // Manejadores de eventos
  const handleSearchChange = (text: string) => {
    setSearch(text);
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value as any);
  };

  const handleFilterSiteHealthChange = (value: string) => {
    setFilterSiteHealth(value as any);
  };

  const handleOrderByChange = (value: string) => {
    setOrderBy(value);
  };

  const handleSortChange = (value: string) => {
    setSort(value as any);
  };
  const router = useRouter();
  const onSelectReport = (reportId: string) => {
    // Navegar a la pantalla de detalles
    router.push(`/report/${reportId}`);
  };
  const renderItem = ({ item }: { item: any }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onSelectReport(item._id);
        }}
      >
        <Card data={item} />
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      {/* Filtros */}
      <ScrollView
        className="max-h-[60px] flex-[3]  bg-blue-400 "
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {/* Fecha de inicio */}
        <View className="p-2 ">
          <TouchableOpacity
            className="bg-white h-full flex justify-center p-2"
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              Start Date:{" "}
              {START_DATE ? START_DATE.toISOString().split("T")[0] : "Select"}
            </Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={START_DATE || new Date()}
              mode="date"
              display="default"
              onChange={handleStartDateChange}
            />
          )}
        </View>
        {/* Fecha de fin */}
        <View className="p-2 ">
          <TouchableOpacity
            className="bg-white h-full flex justify-center p-2"
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              End Date:{" "}
              {END_DATE ? END_DATE.toISOString().split("T")[0] : "Select"}
            </Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={END_DATE || new Date()}
              mode="date"
              display="default"
              onChange={handleEndDateChange}
            />
          )}
        </View>

        {/* Filtro por Estado */}
        <View className="m-2 bg-white  w-[200px]  ">
          <Picker
            selectedValue={currentFilter}
            onValueChange={handleFilterChange}
            mode="dropdown"
          >
            <Picker.Item label="Filter by State" value="NONE" />
            <Picker.Item label="IN PROGRESS" value="IN PROGRESS" />
            <Picker.Item label="FINISHED" value="FINISHED" />
            <Picker.Item label="STOPPED" value="STOPPED" />
            <Picker.Item label="NOT STARTED" value="NOT STARTED" />
          </Picker>
        </View>
        {/* Filtro por Site Health */}
        <View className="w-[200px] bg-white  m-2 ">
          <Picker
            selectedValue={currentFilterSiteHealth}
            onValueChange={handleFilterSiteHealthChange}
            mode="dropdown"
            className="h-full text-center"
          >
            <Picker.Item label="Site Health" value="NONE" />
            <Picker.Item label="FINISHED" value="FINISHED" />
            <Picker.Item label="NOT STARTED" value="NOT STARTED" />
            <Picker.Item label="NEED ATTENTION" value="NEED ATTENTION" />
            <Picker.Item label="OK" value="OK" />
          </Picker>
        </View>
        {/* Ordenar por */}
        <View className="m-2 w-[200px] bg-white  ">
          <Picker
            className=""
            selectedValue={currentOrderBy}
            onValueChange={handleOrderByChange}
            mode="dropdown"
          >
            <Picker.Item label="Order By" value="PROJECT_NAME" />
            <Picker.Item label="PROJECT NUMBER" value="PROJECT_NUMBER" />
            <Picker.Item label="PROJECT STATUS" value="STATE" />
            <Picker.Item label="SITE HEALTH" value="SITE_HEALTH" />
            <Picker.Item label="CREATED" value="DATE" />
          </Picker>
        </View>
        {/* Orden */}
        <View className="m-2 w-[120px] bg-white">
          <Picker
            selectedValue={sort}
            onValueChange={handleSortChange}
            mode="dropdown"
          >
            <Picker.Item label="Sort By" value="ASC" />
            <Picker.Item label="ASC" value="ASC" />
            <Picker.Item label="DESC" value="DESC" />
          </Picker>
        </View>
      </ScrollView>

      {/* Lista */}
      <View className="flex-1">
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loader}
          />
        ) : (
          <FlatList
            data={reports}
            renderItem={renderItem}
            keyExtractor={(item) => item._id!.toString()}
            contentContainerStyle={styles.listContent}
            style={{ flex: 1 }}
          />
        )}

        {/* Paginación */}
        <View
          style={{ position: "relative" }}
          className="bg-blue-600 align-middle justify-between flex flex-row p-2"
        >
          <TouchableOpacity
            style={{ maxHeight: "auto", display: "flex" }}
            onPress={() => setCurrentPage(currentPage - 1)}
            disabled={!pagination?.hasPrev}
          >
            <Text
              className="font-bold"
              style={[!pagination?.hasPrev && { color: "white" }]}
            >
              Previous
            </Text>
          </TouchableOpacity>
          <Text className="font-bold">
            Page {pagination?.page} of {pagination?.pages}
          </Text>
          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage + 1)}
            disabled={!pagination?.hasNext}
          >
            <Text
              style={[!pagination?.hasNext && { color: "white" }]}
              className="font-bold "
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  filtersContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  searchInput: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 8,
    marginRight: 10,
    borderRadius: 5,
    minWidth: 120,
  },
  dateButton: {
    paddingHorizontal: 8,
    paddingVertical: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginRight: 10,
  },
  dateButtonText: {
    fontSize: 14,
    color: "#333",
  },
  loader: {
    marginTop: 20,
  },
  listContent: {
    paddingBottom: 0,
    flexGrow: 1,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  paginationButton: {
    fontSize: 16,
    color: "#007AFF",
  },
  paginationText: {
    fontSize: 16,
  },
});
