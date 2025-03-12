import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/api/store/AuthStore";

interface MovieTimeCounterProps {
  projection_date: string;
  start_time: string;
  projection_id: number;
  onTimeUpdate: (canReserve: boolean, timeRemaining: string) => void;
}

const MovieTimeCounter = ({
  projection_date,
  start_time,
  projection_id,
  onTimeUpdate,
}: MovieTimeCounterProps) => {
  const [timeRemaining, setTimeRemaining] = useState("");
  const [canReserve, setCanReserve] = useState(false);
  const { user } = useAuthStore();
  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const checkReservationAvailability = async () => {
    if (!projection_date || !start_time) {
      setTimeRemaining("No projection data available");
      onTimeUpdate(false, "No projection data available");
      return;
    }

    const [hours, minutes, seconds] = start_time.split(":");
    const projectionDate = new Date(projection_date);
    projectionDate.setHours(Number(hours), Number(minutes), 0);
    const now = new Date();
    const diffMs = projectionDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    // Calculate detailed time components
    const totalSeconds = Math.floor(diffMs / 1000);
    const daysCalc = Math.floor(totalSeconds / (24 * 60 * 60));
    const hoursCalc = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutesCalc = Math.floor((totalSeconds % (60 * 60)) / 60);
    const secondsCalc = Math.floor(totalSeconds % 60);
    
    setDays(daysCalc);
    setHours(hoursCalc);
    setMinutes(minutesCalc);
    setSeconds(secondsCalc);

    // Check if the user has already reserved a ticket
    if (user?.username && projection_id) {
      const { data: existingTicket, error } = await supabase
        .from("ticket")
        .select("*")
        .eq("username", user.username)
        .eq("projection_id", projection_id)
        .single();

      if (existingTicket) {
        setCanReserve(false);
        const message = "You have already reserved a ticket for this projection.";
        setTimeRemaining(message);
        onTimeUpdate(false, message);
        return;
      }
    }

    // Set reservation status and message
    if (diffHours <= 24 && diffHours > 0) {
      setCanReserve(true);
      const message = `${hoursCalc}h ${minutesCalc}m ${secondsCalc}s remaining`;
      setTimeRemaining(message);
      onTimeUpdate(true, message);
    } else if (diffHours > 24) {
      setCanReserve(false);
      const message = `Opens in ${daysCalc} days`;
      setTimeRemaining(message);
      onTimeUpdate(false, message);
    } else if (diffHours <= 0) {
      setCanReserve(false);
      const message = diffHours < -2 ? "Projection ended" : "Currently screening";
      setTimeRemaining(message);
      onTimeUpdate(false, message);
    }
  };

  useEffect(() => {
    checkReservationAvailability();
    const timer = setInterval(checkReservationAvailability, 1000);
    return () => clearInterval(timer);
  }, [projection_date, start_time, projection_id, user?.username]);

  // Render counter only when we're approaching the projection time
  const shouldShowCounter = canReserve || (days === 0 && hours < 12);

  return (
    <View style={styles.container}>
      
      {shouldShowCounter && (
        <View style={styles.counterContainer}>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(days).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>days</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(hours).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>hours</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(minutes).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>mins</Text>
          </View>
          <Text style={styles.timeSeparator}>:</Text>
          <View style={styles.timeBlock}>
            <Text style={styles.timeValue}>{String(seconds).padStart(2, '0')}</Text>
            <Text style={styles.timeLabel}>secs</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#13123b",
    borderWidth: 1,
    borderColor: "#535C91",
    marginVertical: 10,
  },
  statusText: {
    color: "#9290C3",
    fontFamily: "Satoshi",
    fontSize: 16,
    textAlign: "center",
    marginBottom: 8,
  },
  counterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  timeBlock: {
    alignItems: "center",
    minWidth: 40,
  },
  timeValue: {
    color: "#FFFFFF",
    fontFamily: "Satoshi",
    fontSize: 20,
    fontWeight: "bold",
  },
  timeLabel: {
    color: "#6B668F",
    fontFamily: "Satoshi",
    fontSize: 12,
  },
  timeSeparator: {
    color: "#9290C3",
    fontFamily: "Satoshi",
    fontSize: 20,
    marginHorizontal: 2,
  },
});

export default MovieTimeCounter;