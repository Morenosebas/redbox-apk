import { Link, Stack } from "expo-router";
import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, TextInput, Button, IconButton } from "react-native-paper";
import ReportList from "@/components/reportsList/reportList";
import { AuthContext } from "@/context/auth";
import useGetOneProject from "@/hooks/useGetOneProject";
import useGetProjectsNames from "@/hooks/useGetProjectsNames";
import { Dropdown } from "react-native-element-dropdown";
import ProjectModal from "@/components/home/modal";
export default function HomeView() {
  const { logout, project: projectContext } = useContext(AuthContext);
  const { data: projectsNames } = useGetProjectsNames(
    projectContext.PROJECT_MANAGER
  );
  const [selected, setSelected] = useState<{ label: string; value: string }>(
    {
      label: projectContext._id!,
      value: projectContext.PROJECT_NAME!,
    }!
  );
  const [data, setData] = useState<{ label: string; value: string }[]>([
    { label: projectContext._id!, value: projectContext.PROJECT_NAME! },
  ]);
  const { project, isLoading, refetch } = useGetOneProject(selected.label);

  useEffect(() => {
    if (projectsNames) {
      setData(
        projectsNames.projects.map((project) => {
          return { label: project._id, value: project.PROJECT_NAME };
        })
      );
    }
  }, [projectsNames]);

  const [modalVisible, setModalVisible] = useState(false);

  const onSelected = (value: { label: string; value: string }) => {
    setSelected(value);
    setModalVisible(false);
  };
  const onSelect = () => {
    setModalVisible(true);
  };

  return (
    <View className="flex-1 gap-2">
      <Stack.Screen
        options={{
          header: () => {
            return (
              <View className="min-h-[10%] flex flex-row  items-end justify-between pl-2 pr-2 pb-2 bg-blue-500  ">
                <Text className="font-bold text-[24px] text-white items-center text-center ">
                  Home
                </Text>
                {data &&
                  project &&
                  projectsNames &&
                  project.project.PROJECT_NAME && (
                    <Dropdown
                      style={{ width: 200 }}
                      data={data}
                      value={selected.value}
                      onChange={(value) => {
                        setSelected(value);
                        const project = projectsNames.projects.find(
                          (project) => project._id === value.label
                        );
                        console.log(project);
                      }}
                      search
                      renderItem={(item) => (
                        <View
                          className={`p-2 border-b ${
                            selected.label == item.label ? "bg-orange-400" : ""
                          }`}
                        >
                          <Text className="text-center">{item.value}</Text>
                        </View>
                      )}
                      searchField="value"
                      placeholder={selected.value}
                      labelField="value"
                      valueField="label"
                    />
                  )}
                <TouchableOpacity onPress={logout} className=" items-end">
                  <Text className="text-white bg-red-500  p-2 rounded ">
                    Log Out
                  </Text>
                </TouchableOpacity>
              </View>
            );
          },
        }}
      />
      <TouchableOpacity
        onPress={() => onSelect()}
        className="justify-start flex-3 border-white border-b-2 bg-gray-300 flex items-start p-2"
      >
        <Text className="text-center font-bold">
          PROJECT LEADER: {project?.project?.PROJECT_MANAGER.FULL_NAME}
        </Text>
        <Text className="text-center font-bold">
          PROJECT NAME: {project?.project?.PROJECT_NAME}
        </Text>
        <Text className="text-center font-bold">
          START DATE: {project?.project?.START_DATE.toString().split("T")[0]}
        </Text>
        <Text className="text-center font-bold">
          ESTIMATED DATE:{" "}
          {project?.project?.ESTIMATED_END_DATE.toString().split("T")[0]}
        </Text>
        <View className=" w-full flex flex-row justify-evenly align-middle pt-4 pb-4">
          <View className="grid items-center gap-2">
            <Text className="text-center font-bold">STATUS</Text>
            {project && project.project.STATE === "NOT STARTED" && (
              <View className={`w-[50px] h-[50px]` + " bg-gray-400"}></View>
            )}
            {project && project.project.STATE === "IN PROGRESS" && (
              <View className={`w-[50px] h-[50px]` + " bg-yellow-500"}></View>
            )}
            {project && project.project.STATE === "STOPPED" && (
              <View className={`w-[50px] h-[50px]` + " bg-red-500"}></View>
            )}
            {project && project.project.STATE === "FINISHED" && (
              <View className={`w-[50px] h-[50px]` + " bg-green-600"}></View>
            )}
            <Text className="text-center font-bold">
              {project?.project?.STATE || ""}
            </Text>
          </View>
          <View className="grid items-center gap-2">
            <Text className="text-center font-bold">SITE HEALTH</Text>
            {project && project.project.SITE_HEALTH === "NOT STARTED" && (
              <View className={`w-[50px] h-[50px]` + " bg-gray-400"}></View>
            )}
            {project && project.project.SITE_HEALTH === "FINISHED" && (
              <View className={`w-[50px] h-[50px]` + " bg-green-700"}></View>
            )}
            {project && project.project.SITE_HEALTH === "NEED ATTENTION" && (
              <View className={`w-[50px] h-[50px]` + " bg-red-500"}></View>
            )}
            {project && project.project.SITE_HEALTH === "OK" && (
              <View className={`w-[50px] h-[50px]` + " bg-green-500"}></View>
            )}
            <Text className="text-center font-bold">
              {project?.project.SITE_HEALTH || ""}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
      <View className=" border-gray-500 border-b bg-gray-300 flex items-center flex-1 p-2  ">
        <TouchableOpacity>
          <Link
            className="flex mb-2 items-center"
            href={`/${project?.project._id}`}
          >
            <View className="bg-blue-500 w-full pl-5 pr-5 pt-3 pb-3 mb-2 rounded">
              <Text className="text-center font-bold ">CREATE REPORT</Text>
            </View>
          </Link>
        </TouchableOpacity>
        <ReportList projectName={project?.project.PROJECT_NAME || ""} />
      </View>
      {project?.project && modalVisible && (
        <ProjectModal
          visible={modalVisible}
          project={project}
          refetchProject={refetch}
          onDismiss={() => setModalVisible(false)}
        />
      )}
    </View>
  );
}
