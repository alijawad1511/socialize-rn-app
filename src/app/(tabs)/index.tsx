import { Image } from "expo-image";
import { Link, useRouter } from "expo-router";
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from "react-native";

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Socialize</Text>
      <Image source={
        { uri: 'https://avatars.githubusercontent.com/u/85053422?v=4' }
      } style={styles.image} />
      <TextInput placeholder="Enter your name" style={styles.input} />
      <ActivityIndicator size="large" />
      <Link href="/about">About</Link>
      <Button title="Go to About" onPress={() => router.push("/about")} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  image: {
    width: 100,
    height: 100,
  },
  input: {
    borderColor: 'black',
    borderBottomWidth: 1,
    width: '80%'
  }
});
