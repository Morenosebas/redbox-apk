// fields/ProjectDates.tsx
import React, { ChangeEvent } from "react";
import { View, StyleSheet } from "react-native";
import { TextInput, Text } from "react-native-paper";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ReportRequest } from "@/hooks/useCreateReport";
import { FormikErrors } from "formik";

const ProjectDates = ({
  setFieldValue,
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<FormikErrors<ReportRequest>>;
}) => {
  const [date, setDate] = React.useState(new Date());
  const [show, setShow] = React.useState(false);

  const onChange = (event: any, selectedDate?: Date) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      setFieldValue("DATE", selectedDate.toISOString().split("T")[0]);
      // Aquí puedes manejar el cambio de fecha
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>DATE</Text>
      <TextInput
        mode="outlined"
        value={date.toISOString().split("T")[0]}
        showSoftInputOnFocus={false}
        onFocus={() => setShow(true)}
      />
      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChange}
        />
      )}
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

export default ProjectDates;
