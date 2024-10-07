// components/reportsList/createReport/fields/Notes.tsx
import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Dialog, Portal, TextInput } from "react-native-paper";
import * as DocumentPicker from "expo-document-picker";
import { ReportRequest } from "@/hooks/useCreateReport";
import { Picker } from "@react-native-picker/picker";

type Attachment = {
  uri: string;
  name: string;
  size?: number;
  type?: string;
  file?: File[];
};

type Note = {
  index: number;
  category: string;
  note: string;
  ATTACHMENTS: Attachment[];
};

type NotesProps = {
  clean?: boolean;
  handleChange: (e: any) => void;
  values: ReportRequest;
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean
  ) => Promise<void> | Promise<any>;
};

const Notes: React.FC<NotesProps> = ({
  handleChange,
  setFieldValue,
  clean,
}) => {
  const [visible, setVisible] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [files, setFiles] = useState<Attachment[]>([]);
  const [category, setCategory] = useState("General Notes");
  const [noteDescription, setNoteDescription] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const showDialog = () => setVisible(true);

  const hideDialog = () => {
    setVisible(false);
    setCategory("");
    setNoteDescription("");
    setFiles([]);
    setEditingIndex(null);
  };

  const pickDocument = async () => {
    let result: DocumentPicker.DocumentPickerResult =
      await DocumentPicker.getDocumentAsync({
        multiple: true,
        type: ["image/*", "application/pdf"],
      });
    if (result.assets && result?.assets?.length > 0) {
      const attachment: Attachment[] = result.assets.map((file) => ({
        uri: file.uri,
        name: file.name,
        size: file.size,
        type: file.mimeType,
      }));

      setFiles([...files, ...attachment]);
    }
  };

  const addNote = () => {
    if (category === "" || noteDescription === "") {
      // Puedes mostrar una alerta o un Toast
      return;
    }

    const noteData: Note = {
      index: editingIndex !== null ? editingIndex : notes.length,
      category: category,
      note: noteDescription,
      ATTACHMENTS: files.map((file) => file),
    };

    if (editingIndex !== null) {
      setNotes(
        notes.map((note) => (note.index === editingIndex ? noteData : note))
      );
    } else {
      setNotes([...notes, noteData]);
    }

    // Limpiar los campos después de agregar
    setCategory("");
    setNoteDescription("");
    setFiles([]);
    setEditingIndex(null);
    hideDialog();
  };

  const deleteNote = (index: number) => {
    setNotes(notes.filter((note) => note.index !== index));
  };

  const onSelectedNote = (index: number) => {
    const note = notes.find((note) => note.index === index);
    if (note) {
      setCategory(note.category);
      setNoteDescription(note.note);
      // setFiles(
      //   note.ATTACHMENTS.map((file) => ({
      //     uri: "",
      //     name: file.name,
      //     size: file.size,
      //     mimeType: "",
      //     file: file,
      //   }))
      // );
      setFiles(note.ATTACHMENTS);
      setEditingIndex(index);
      showDialog();
    }
  };

  useEffect(() => {
    setFieldValue("NOTES", notes);
  }, [notes]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NOTES</Text>
      <Button mode="contained" className="bg-blue-500" onPress={showDialog}>
        ADD NOTE
      </Button>

      <ScrollView style={styles.list}>
        {notes.map((item, index) => (
          <View key={index} style={styles.noteItem}>
            <Text style={styles.noteText}>CATEGORY: {item.category}</Text>
            <Text style={styles.noteText}>NOTE: {item.note}</Text>
            <Text style={styles.noteText}>
              Files: {item.ATTACHMENTS.length}
            </Text>
            <View style={{ flexDirection: "row" }}>
              <Button mode="text" onPress={() => onSelectedNote(item.index)}>
                EDIT
              </Button>
              <Button mode="text" onPress={() => deleteNote(item.index)}>
                DELETE
              </Button>
            </View>
          </View>
        ))}
      </ScrollView>

      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>
            {editingIndex !== null ? "EDIT NOTE" : "ADD NOTE"}
          </Dialog.Title>
          <Dialog.Content>
            {/* <TextInput
              label="CATEGORY"
              value={category}
              onChangeText={(text) => setCategory(text)}
              style={styles.input}
            /> */}
            <Picker
              selectedValue={category}
              onValueChange={(itemValue) => setCategory(itemValue)}
            >
              <Picker.Item label="General Notes" value="General Notes" />
              <Picker.Item label="Equipments" value="Equipments" />
              <Picker.Item label="Access Issues" value="Access Issues" />
              <Picker.Item label="Materials" value="Materials" />
              <Picker.Item label="Dumpster" value="Dumpster" />
              <Picker.Item label="Documentation" value="Documentation" />
              <Picker.Item label="Invoice" value="Invoice" />
            </Picker>
            <TextInput
              label="NOTE"
              // value={noteDescription}
              onChangeText={(text) => setNoteDescription(text)}
              multiline
              style={styles.input}
            />
            <Button onPress={pickDocument}>Select Attachment</Button>
            {files.map((file, idx) => (
              <Text key={idx}>{file.name}</Text>
            ))}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>CANCEL</Button>
            <Button onPress={addNote}>
              {editingIndex !== null ? "UPDATE" : "ADD"}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontWeight: "bold",
    color: "#000",
    fontSize: 16,
    marginBottom: 8,
  },
  list: {
    maxHeight: 200,
    marginTop: 8,
  },
  noteItem: {
    padding: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  noteText: {
    marginBottom: 4,
  },
  input: {
    marginBottom: 8,
  },
});

export default Notes;
