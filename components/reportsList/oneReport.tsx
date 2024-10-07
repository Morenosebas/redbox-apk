import customImageLoader from "@/app/controllers/imageLoader";
import useGetOneReport from "@/hooks/useGetOneReport";
import React, { useState } from "react";
import { ScrollView, View } from "react-native";
import * as Linking from "expo-linking";
import {
  Text,
  Card,
  List,
  Chip,
  Portal,
  Modal,
  Provider,
  Button,
} from "react-native-paper";
import { Image } from "expo-image";
import customFileLoader from "@/app/controllers/fileLoader";
const ReportView = ({ reportid }: { reportid: string }) => {
  const { report, refetch } = useGetOneReport(reportid);

  const [visible, setVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<{
    type: string;
    url: string;
    _id: string;
  } | null>(null);

  const showModal = (attachment: {
    type: string;
    url: string;
    _id: string;
  }) => {
    setSelectedAttachment(attachment);
    setVisible(true);
  };

  const hideModal = () => {
    setVisible(false);
    setSelectedAttachment(null);
  };
  return (
    <ScrollView style={{ padding: 16 }}>
      {/* Estado del sitio */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Estado del Sitio" />
        <Card.Content>
          <Text>{report?.SITE_HEALTH}</Text>
        </Card.Content>
      </Card>

      {/* Notas */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Notas" />
        <Card.Content>
          {report?.NOTES.map((noteItem) => (
            <View key={noteItem._id} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: "bold" }}>{noteItem.category}</Text>
              <Text>{noteItem.note}</Text>
              {noteItem.ATTACHMENTS.map((attachment, index) => (
                <Chip
                  key={index}
                  icon={
                    attachment.type === "IMAGE"
                      ? "image"
                      : attachment.type === "VIDEO"
                      ? "video"
                      : "file"
                  }
                  onPress={() => {
                    showModal({
                      type: attachment.type,
                      url:
                        attachment.type === "IMAGE"
                          ? customImageLoader({ src: attachment.src })
                          : customFileLoader({ src: attachment.src }),
                      _id: noteItem._id,
                    });
                  }}
                  style={{ marginTop: 4 }}
                >
                  {attachment.type}
                </Chip>
              ))}
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Asistencia */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Asistencia" />
        <Card.Content>
          {report?.ATTENDANCE.map((person) => (
            <List.Item
              key={person._id}
              title={person.NAME}
              description={person.POSITION}
              left={(props) => <List.Icon {...props} icon="account" />}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Materiales */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Materiales" />
        <Card.Content>
          {report?.MATERIALS.map((material, index) => (
            <List.Item
              key={index}
              title={material.name}
              description={`Cantidad: ${material.quantity} ${material.unit}`}
              left={(props) => <List.Icon {...props} icon="cube-outline" />}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Fotos del Reporte */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Fotos del Reporte" />
        <Card.Content>
          {report?.REPORT_PHOTOS.map((photoUrl, index) => {
            return (
              <Image
                key={index}
                source={customImageLoader({ src: photoUrl })}
                style={{ width: "100%", height: 400, marginBottom: 8 ,objectFit:"fill"}}
                contentFit="contain"
              />
            );
          })}
        </Card.Content>
      </Card>

      {/* Actualizaciones */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Actualizaciones" />
        <Card.Content>
          {report?.UPDATES.map((update, index) => (
            <List.Item
              key={update._id + index}
              title={update.NAME}
              description={new Date(update.DATE).toLocaleDateString()}
              left={(props) => <List.Icon {...props} icon="update" />}
            />
          ))}
        </Card.Content>
      </Card>

      {/* Estado del Reporte */}
      <Card style={{ marginBottom: 16 }}>
        <Card.Title title="Estado del Reporte" />
        <Card.Content>
          <Text>{report?.REPORT_STATUS}</Text>
        </Card.Content>
      </Card>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
        >
          {selectedAttachment &&
            selectedAttachment.type === "IMAGE" &&
            selectedAttachment.url && (
              <Image
                source={selectedAttachment.url}
                style={{ width: "100%", height: 200, objectFit: "contain" }}
              />
            )}
          {selectedAttachment && selectedAttachment.type === "DOCUMENT" && (
            <Button
              onPress={() => {
                console.log(selectedAttachment.url);
                Linking.openURL(selectedAttachment.url);
              }}
            >
              Abrir Documento
            </Button>
          )}
          <Button onPress={hideModal} style={{ marginTop: 20 }}>
            Cerrar
          </Button>
        </Modal>
      </Portal>
    </ScrollView>
  );
};

export default ReportView;
