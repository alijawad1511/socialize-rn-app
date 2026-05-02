import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (isLoading) return;
    
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Failed to login. Please try again");    
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign In to Continue</Text>
        <View style={styles.formContainer}>
        <TextInput
            placeholder="Email"
            placeholderTextColor={"#999"}
            keyboardType="email-address"
            autoComplete="email"
            autoCapitalize="none"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            placeholderTextColor={"#999"}
            autoComplete="password"
            secureTextEntry
            autoCapitalize="none"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton} onPress={() => router.push("/(auth)/signup")}>
            <Text style={styles.linkButtonText}>Don't have an account? <Text style={styles.linkButtonTextBold}>Sign Up</Text></Text>
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