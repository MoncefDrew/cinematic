import { CinematicColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import { View ,Text, TouchableOpacity} from "react-native"

export const toastConfig = {
    success: (props: any) => (
      <View
        style={{
          height: 70,
          width: "90%",
          backgroundColor: "rgba(18, 19, 45, 0.95)", // Darker background with slight transparency
          borderRadius: 10,
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: CinematicColors.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 10,
          borderColor: CinematicColors.primary,
        }}
      >
        <View
          style={{

            backgroundColor: "rgba(99, 102, 241, 0.2)", // Primary color with transparency
            borderRadius: 30,
            padding: 8,
            marginRight: 12,
          }}
        >
          <Ionicons
            name="checkmark-circle"
            size={24}
            color='#48bb78'
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Satoshi",
              fontSize: 16,
              color: CinematicColors.primaryLight,
              fontWeight: "bold",
              marginBottom: 3,
            }}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={{
                fontFamily: "Satoshi",
                fontSize: 14,
                color: CinematicColors.textSecondary,
              }}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={props.onPress}>
          <Ionicons
            name="close"
            size={20}
            color={CinematicColors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    ),
    
    error: (props: any) => (
      <View
        style={{
          height: 70,
          width: "90%",
          backgroundColor: "rgba(18, 19, 45, 0.95)",
          borderRadius: 16,
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#ef4444",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 10,
          borderLeftColor: "#ef4444",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(239, 68, 68, 0.2)",
            borderRadius: 30,
            padding: 8,
            marginRight: 12,
          }}
        >
          <Ionicons
            name="alert-circle"
            size={24}
            color="#ef4444"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Satoshi",
              fontSize: 16,
              color: "#ef4444",
              fontWeight: "bold",
              marginBottom: 3,
            }}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={{
                fontFamily: "Satoshi",
                fontSize: 14,
                color: CinematicColors.textSecondary,
              }}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={props.onPress}>
          <Ionicons
            name="close"
            size={20}
            color={CinematicColors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    ),
    
    info: (props: any) => (
      <View
        style={{
          height: 70,
          width: "90%",
          backgroundColor: "rgba(18, 19, 45, 0.95)",
          borderRadius: 16,
          padding: 15,
          flexDirection: "row",
          alignItems: "center",
          shadowColor: "#3b82f6",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.35,
          shadowRadius: 8,
          elevation: 10,
          borderLeftWidth: 4,
          borderLeftColor: "#3b82f6",
        }}
      >
        <View
          style={{
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderRadius: 30,
            padding: 8,
            marginRight: 12,
          }}
        >
          <Ionicons
            name="information-circle"
            size={24}
            color="#3b82f6"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: "Satoshi",
              fontSize: 16,
              color: "#3b82f6",
              fontWeight: "bold",
              marginBottom: 3,
            }}
          >
            {props.text1}
          </Text>
          {props.text2 && (
            <Text
              style={{
                fontFamily: "Satoshi",
                fontSize: 14,
                color: CinematicColors.textSecondary,
              }}
            >
              {props.text2}
            </Text>
          )}
        </View>
        <TouchableOpacity onPress={props.onPress}>
          <Ionicons
            name="close"
            size={20}
            color={CinematicColors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    ),
  };