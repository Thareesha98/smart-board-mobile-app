import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import api from "../../../../client/api";
import { AuthContext } from "../../../../auth/AuthContext";

export default function RequestVisitScreen() {
  const { id } = useLocalSearchParams(); // boardingId
  const router = useRouter();
  const { user } = useContext(AuthContext);

  const studentId = user?.id;

  // form fields
  const [numberOfStudents, setNumberOfStudents] = useState("1");
  const [requestedStartTime, setRequestedStartTime] = useState(new Date());
  const [requestedEndTime, setRequestedEndTime] = useState(new Date());
  const [studentNote, setStudentNote] = useState("");

  // -------------------------
  // Date Pickers (Android-safe)
  // -------------------------
  const openStartPicker = () => {
  // 1️⃣ Pick Date
  DateTimePickerAndroid.open({
    value: requestedStartTime,
    mode: "date",
    onChange: (event, selectedDate) => {
      if (!selectedDate) return;

      // 2️⃣ Now pick Time
      DateTimePickerAndroid.open({
        value: requestedStartTime,
        mode: "time",
        is24Hour: true,
        onChange: (event2, selectedTime) => {
          if (!selectedTime) return;

          // Combine date + time
          setRequestedStartTime(buildDate(selectedDate, selectedTime));
        },
      });
    },
  });
};


  const openEndPicker = () => {
  // 1️⃣ Pick Date
  DateTimePickerAndroid.open({
    value: requestedEndTime,
    mode: "date",
    onChange: (event, selectedDate) => {
      if (!selectedDate) return;

      // 2️⃣ Pick Time
      DateTimePickerAndroid.open({
        value: requestedEndTime,
        mode: "time",
        is24Hour: true,
        onChange: (event2, selectedTime) => {
          if (!selectedTime) return;

          // Combine date + time
          setRequestedEndTime(buildDate(selectedDate, selectedTime));
        },
      });
    },
  });
};


  // -------------------------
  // Submit Handler
  // -------------------------
  const onSubmit = async () => {
    if (!studentId) {
      Alert.alert("Error", "Student ID not found.");
      return;
    }
    if (!numberOfStudents || Number(numberOfStudents) < 1) {
      Alert.alert("Error", "Please enter a valid number of students.");
      return;
    }

    try {
      const payload = {
        boardingId: Number(id),
        numberOfStudents: Number(numberOfStudents),
        requestedStartTime: requestedStartTime.toISOString(),
        requestedEndTime: requestedEndTime.toISOString(),
        studentNote: studentNote,
      };

      const res = await api.post(`/appointments/student/${studentId}`, payload);

      Alert.alert("Success", "Appointment request sent!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      console.log("❌ Appointment error:", error);
      Alert.alert("Error", "Could not send appointment request.");
    }
  };

  // -------------------------
  // UI
  // -------------------------
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Request Visit</Text>
        <Text style={styles.subtitle}>Boarding ID: {id}</Text>

        {/* Number of Students */}
        <Text style={styles.label}>Number of Students</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={numberOfStudents}
          onChangeText={setNumberOfStudents}
          placeholder="e.g., 1"
          placeholderTextColor="#64748b"
        />

        {/* Start Time */}
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={openStartPicker}>
          <Text style={styles.datePickerText}>
            {requestedStartTime.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {/* End Time */}
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity style={styles.datePickerButton} onPress={openEndPicker}>
          <Text style={styles.datePickerText}>
            {requestedEndTime.toLocaleString()}
          </Text>
        </TouchableOpacity>

        {/* Student Note */}
        <Text style={styles.label}>Note (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={studentNote}
          onChangeText={setStudentNote}
          placeholder="Any message to the owner..."
          placeholderTextColor="#64748b"
          multiline
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
          <Text style={styles.submitText}>Send Request</Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* 🎨 Styles */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f8fafc",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 20,
  },
  label: {
    color: "#cbd5e1",
    fontSize: 14,
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    backgroundColor: "#1e293b",
    color: "white",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  datePickerButton: {
    backgroundColor: "#1e293b",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  datePickerText: {
    color: "#e2e8f0",
  },
  submitButton: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 30,
  },
  submitText: {
    color: "white",
    fontSize: 17,
    fontWeight: "700",
  },
  cancelButton: {
    padding: 14,
    marginTop: 14,
    alignItems: "center",
  },
  cancelText: {
    color: "#f87171",
    fontSize: 15,
  },
});
