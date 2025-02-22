// components/QRModal/QRModal.js
import React from 'react';
import {
    View,
    Text,
    Modal,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import QRCode from 'react-qr-code';
import { BORDERRADIUS, FONTSIZE } from "@/theme/theme";

const QrModal = ({ visible, ticket, onClose }:any) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.qrContainer}>
                        <QRCode
                            value={ticket?.ticket_id || 'No ID'}
                            size={200}
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                            viewBox={`0 0 256 256`}
                            level="H"
                            fgColor="#16143d"
                            bgColor="white"
                        />
                    </View>
                    <Text style={styles.modalTicketId}>
                        Ticket ID: {ticket?.ticket_id}
                    </Text>
                    <Text style={styles.movieTitle}>
                        {ticket?.projection?.film?.title}
                    </Text>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={onClose}
                    >
                        <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#ffffff',
        padding: 20,
        borderRadius: BORDERRADIUS.radius_25,
        alignItems: 'center',
        width: '80%',
        maxWidth: 400,
    },
    qrContainer: {
        padding: 20,
        backgroundColor: 'white',
        borderRadius: BORDERRADIUS.radius_15,
        width: '100%',
        alignItems: 'center',
    },
    modalTicketId: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_16,
        color: '#16143d',
        marginTop: 20,
    },
    movieTitle: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_14,
        color: '#535C91',
        marginTop: 10,
        textAlign: 'center',
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#535C91',
        borderRadius: BORDERRADIUS.radius_10,
        width: '100%',
        alignItems: 'center',
    },
    closeButtonText: {
        fontFamily: 'Poppins',
        fontSize: FONTSIZE.size_16,
        color: '#FFFFFF',
    },
});

export default QrModal;