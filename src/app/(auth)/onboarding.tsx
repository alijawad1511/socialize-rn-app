import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function OnBoardingScreen() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select Profile Image",
      "Choose an option",
      [
        { text: "Take Photo", onPress: takePhoto },
        { text: "Choose from Library", onPress: pickImage },
        { text: "Cancel", style: "cancel" }
      ]
    )
  }

  const takePhoto = async () => {
    // Request camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        "Error",
        "Need camera permission to take photos"
      )
      return;
    }

    // Launch camera
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
  }

  const pickImage = async () => {
    // Request media library permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    console.log(status);
    if (status !== 'granted') {
      Alert.alert(
        "Error",
        "Permission not granted to access media library"
      )
      return;
    }

    // Launch image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
      console.log(result);
    }
  }

  const handleOnboarding = () => {
    if (!name || !username) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (username.length < 3) {
      Alert.alert("Error", "Username must be at least 3 characters long");
      return;
    }
    
    setIsLoading(true);
    try {
      // TODO: Complete onboarding
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to complete onboarding. Please try again");    
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Complete Your Profile</Text>
          <Text style={styles.subtitle}>Add your information to get started</Text>
        </View>
        <View style={styles.formContainer}>
          <TouchableOpacity style={styles.imageContainer} onPress={showImagePickerOptions}>
            { 
              profileImage ? (
                <View style={styles.placeholderImage}>
                  <Image source={{ uri: profileImage }} style={styles.profileImage} />
                  <View style={styles.editBadge}>
                    <Text style={styles.editBadgeText}>Edit</Text>
                  </View>
                </View>
              ): (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderImageText}>+</Text>
                  <View style={styles.editBadge}>
                    <Text style={styles.editBadgeText}>Edit</Text>
                  </View>
                </View>
              )
            }
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={"#999"}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor={"#999"}
            autoCapitalize="none"
            autoComplete="username"
            value={username}
            onChangeText={setUsername}
          />

          <TouchableOpacity style={styles.button} onPress={handleOnboarding}>
            <Text style={styles.buttonText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  header: {
    marginBottom: 32
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16
  },
  formContainer: {
    width: '100%'
  },
  imageContainer: {
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 100
  },
  placeholderImage: {
    width: 100,
    height: 100,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e0e0e0'
  },
  placeholderImageText: {
    fontSize: 28
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#000',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 16
  },
  editBadgeText: {
    fontSize: 10,
    color: '#fff'
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  linkButton: {
    marginTop: 16
  },
  linkButtonText: {
    color: '#666',
    fontSize: 14
  },
  linkButtonTextBold: {
    color: '#000',
    fontWeight: '600'
  }
});