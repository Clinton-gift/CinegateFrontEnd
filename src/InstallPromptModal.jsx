
import React from 'react';
import { View, Text, StyleSheet, Button, Modal, Image } from 'react-native';
import useIosInstallPrompt from './hooks/useIosInstallPrompt';
import useWebInstallPrompt from './hooks/useWebInstallPrompt';

export const InstallPWA = ({ modalIsOpen, handleInstallClick, closeModal }) => {
  const [iosInstallPrompt] = useIosInstallPrompt();
  const [webInstallPrompt, handleWebInstallDeclined, handleWebInstallAccepted] = useWebInstallPrompt();

  if (!iosInstallPrompt && !webInstallPrompt) return null;

  return (
    <Modal visible={modalIsOpen} transparent animationType="slide" onRequestClose={closeModal}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Image style={styles.icon} source={{ uri: '/assets/icons/chinda-192.png' }} />
          <Text style={styles.title}>Install Taxi Identification</Text>
          <Text style={styles.text}>
            Install this app on your home screen for quick and easy access when you're on the go.
          </Text>
          {iosInstallPrompt && (
            <Text style={styles.instructions}>
              Tap the Share button, then “Add to Home Screen”
            </Text>
          )}
          {webInstallPrompt && (
            <View style={styles.buttonContainer}>
              <Button title="Install" onPress={handleWebInstallAccepted} />
              <Button title="Close" onPress={closeModal} />
            </View>
          )}
          {iosInstallPrompt && <Button title="Close" onPress={closeModal} />}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, padding: 20, backgroundColor: 'white', borderRadius: 10, alignItems: 'center' },
  icon: { width: 80, height: 80, marginBottom: 10 },
  title: { fontSize: 20, marginBottom: 10 },
  text: { fontSize: 12, marginBottom: 14, textAlign: 'center' },
  instructions: { fontSize: 14, marginBottom: 20, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: 20 },
});
