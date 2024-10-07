import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import {
  Text,
  TextInput,
  Button,
  IconButton,
  ActivityIndicator,
} from "react-native-paper";
import { Link, useRouter, Stack } from "expo-router";
import useLogIn from "@/hooks/useLogIn";
import { Toast } from "toastify-react-native";
import { AuthContext, AuthProvider } from "@/context/auth";
import HomeView from "./home";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MainLog() {
  const { isAuthenticated, loading } = useContext(AuthContext);
  console.log("isAuthenticated", isAuthenticated);
  console.log("loading", loading);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Login />
    </>
  );
}

function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const {
    handleChange,
    handleSubmit,
    isSubmitting,
    submitForm,
    values,
    isSuccess,
  } = useLogIn();
  const { login } = useContext(AuthContext);

  const onSubmit = async () => {
    handleSubmit();
  };
  useEffect(() => {
    if (isSuccess) {
      login()
    }
  }, [isSuccess]);
  return (
    <>
      <View style={styles.container}>
        <Text variant="titleLarge" style={styles.title}>
          Log In
        </Text>
        <TextInput
          label="USERNAME"
          value={values.USERNAME}
          onChangeText={handleChange("USERNAME")}
          style={styles.input}
          keyboardType="default"
          autoCapitalize="none"
        />
        <TextInput
          label="PASSWORD"
          id="PASSWORD"
          value={values.PASSWORD}
          onChangeText={handleChange("PASSWORD")}
          style={styles.input}
          secureTextEntry={!passwordVisible}
          right={
            <TextInput.Icon
              // @ts-ignore
              name={passwordVisible ? "eye-off" : "eye"}
              onPress={() => setPasswordVisible(!passwordVisible)}
            />
          }
        />
        <Button
          className="bg-blue-500"
          mode="contained"
          onPress={onSubmit}
          style={styles.button}
        >
          Log In
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  input: {
    marginBottom: 15,
    backgroundColor: "white",
  },
  button: {
    marginTop: 10,
    padding: 5,
    // backgroundColor: "#807492",
  },
});
