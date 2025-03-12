import React, { useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ProfilePic from "@/components/ProfilePic";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList, Movie } from "@/constants/Movie";

type NavigationProp = StackNavigationProp<RootStackParamList, "Popular">;

interface MovieActionModalProps {
  isVisible: boolean;
  toggleModal: () => void;
  userRating: number;
  setUserRating: (rating: number) => void;
  movie: Movie;
  seats?: any;
  projection_id?: number;
  projection_date?: string;
  start_time?: string;
  canReserve: boolean;
  timeRemaining: string;
  showReserveButton: boolean;
}

const MovieActionModal = ({
  isVisible,
  toggleModal,
  userRating,
  setUserRating,
  movie,
  seats,
  projection_id,
  projection_date,
  start_time,
  canReserve,
  timeRemaining,
  showReserveButton,
}: MovieActionModalProps) => {
  const navigation = useNavigation<NavigationProp>();
  const modalY = useRef(new Animated.Value(300)).current;

  // Render stars function
  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity
        key={index}
        onPress={() => setUserRating(index + 1)}
        style={{ margin: 5 }}
      >
        <Ionicons
          name={index < rating ? "star" : "star-outline"}
          size={28}
          color="#9290C3"
        />
      </TouchableOpacity>
    ));
  };

  // Handle modal animation
  React.useEffect(() => {
    if (isVisible) {
      Animated.timing(modalY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(modalY, {
        toValue: 300,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [isVisible]);

  // Handle navigation to reserve ticket
  const handleReserveTicket = () => {
    if (canReserve) {
      toggleModal();
      navigation.navigate("ReserveTicket", {
        movie,
        seats,
        projection_id,
        projection_date,
        start_time,
      });
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="none"
      onRequestClose={toggleModal}
    >
      <TouchableWithoutFeedback onPress={toggleModal}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView style={styles.modalWrapper} behavior="padding">
            <Animated.View
              style={[
                styles.modalContainer,
                { transform: [{ translateY: modalY }] },
              ]}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>What would you like to do?</Text>
                <TouchableOpacity onPress={toggleModal}>
                  <Ionicons name="close" size={24} color="#9290C3" />
                </TouchableOpacity>
              </View>

              <View style={styles.modalRatingSection}>
                <Text style={styles.modalSectionTitle}>Rate the Movie:</Text>
                <View style={styles.starsRow}>{renderStars(userRating)}</View>
              </View>

              {showReserveButton && (
                <TouchableOpacity
                  onPress={handleReserveTicket}
                  style={[
                    styles.reserveTicket,
                    !canReserve && styles.disabledButton,
                  ]}
                  disabled={!canReserve}
                >
                  <Ionicons name="ticket-outline" size={22} color="#9290C3" />
                  <Text style={styles.buttonText}>
                    {canReserve ? "Reserve Ticket" : timeRemaining}
                  </Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.modalButton}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#9290C3"
                />
                <Text style={styles.buttonText}>Mark as Watched</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.addToListButton}>
                <Ionicons name="list-outline" size={22} color="#9290C3" />
                <Text style={styles.buttonText}>Add to List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={toggleModal}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </Animated.View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(3, 3, 20, 0.95)",
    justifyContent: "flex-end",
  },
  modalWrapper: {
    width: "100%",
  },
  modalContainer: {
    width: "100%",
    backgroundColor: "#030314",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderColor: "#2E2A4A",
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
    fontFamily: "Satoshi",
  },
  modalRatingSection: {
    marginBottom: 15,
  },
  modalSectionTitle: {
    fontFamily: "Satoshi",
    fontSize: 16,
    color: "#9290C3",
    marginBottom: 5,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  reserveTicket: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#121023",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2E2A4A",
    marginBottom: 10,
  },
  modalButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#0A0821",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2E2A4A",
    marginBottom: 10,
  },
  addToListButton: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
    backgroundColor: "#0A0821",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#2E2A4A",
    marginBottom: 15,
  },
  buttonText: {
    fontFamily: "Satoshi",
    color: "#9290C3",
    fontSize: 16,
    marginLeft: 10,
  },
  confirmButton: {
    width: "100%",
    padding: 15,
    backgroundColor: "#13123b",
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#535C91",
  },
  confirmButtonText: {
    fontFamily: "Satoshi",
    fontWeight: "600",
    color: "#919cd7",
    fontSize: 16,
  },
  disabledButton: {
    backgroundColor: "#0A0821",
    opacity: 0.7,
  },
});

export default MovieActionModal;