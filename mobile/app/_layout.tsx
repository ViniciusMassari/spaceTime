import blurBg from "../src/assets/luz.png";
import Stripes from "../src/assets/stripes.svg";

import { BaiJamjuree_700Bold } from "@expo-google-fonts/bai-jamjuree";
import {
  useFonts,
  Roboto_400Regular,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SplashScreen, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { styled } from "nativewind";
import { useEffect, useState } from "react";
import { ImageBackground } from "react-native";
import * as SecureStore from "expo-secure-store";

export default function Layout() {
  const [isAuthenticated, setIsAuthenticated] = useState<null | boolean>(null);

  const [hasLoadedFonts] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold,
    BaiJamjuree_700Bold,
  });

  useEffect(() => {
    SecureStore.getItemAsync("token").then((token) => {
      setIsAuthenticated(!!token);
    });
  }, []);

  const StyledStripes = styled(Stripes);

  if (!hasLoadedFonts) {
    return <SplashScreen />;
  }

  return (
    <ImageBackground
      imageStyle={{ position: "absolute", left: "-100%" }}
      source={blurBg}
      className="relative flex-1 bg-gray-900 "
    >
      <StyledStripes className="absolute left-2" />
      <StatusBar style="light" translucent />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "transparent" },
          animation: "fade",
        }}
      >
        {/* Rotas da aplicação*/}
        <Stack.Screen name="index" redirect={isAuthenticated} />
        <Stack.Screen name="memories" />
        <Stack.Screen name="new" />
      </Stack>
    </ImageBackground>
  );
}
