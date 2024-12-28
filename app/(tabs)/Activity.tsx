import React, { useState } from "react";
import { StyleSheet, Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import Poll from "@/components/Poll";
import {Colors} from "@/constants/Colors"; // Import the Cards component

// Types for movie data
type Movie = { id: number; title: string; poster: any };

// Updated Activity Component
export default function Activity() {
  return (
    <View style={styles.container}>
      <Poll/>
    </View>
  );
}

// Styles (unchanged)
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.theme.background },

});
