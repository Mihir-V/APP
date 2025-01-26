import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index"  options={{headerShown: false,}}/>
      <Stack.Screen name="forgotpassword" options={{headerShown: false}}/>      
      <Stack.Screen name="landingpage" options={{headerShown: false}}/>
      <Stack.Screen name="VerifyOtpScreen" options={{headerShown: false}}/>
    </Stack>
  );
}
