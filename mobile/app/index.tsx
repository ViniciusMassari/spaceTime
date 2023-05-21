import { View, Text, TouchableOpacity } from "react-native";
import { useAuthRequest, makeRedirectUri } from "expo-auth-session";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

import NlwLogo from "../src/assets/nlwLogo.svg";

import { useEffect } from "react";
import { api } from "../src/assets/lib/api";

const discovery = {
  authorizationEndpoint: "https://github.com/login/oauth/authorize",
  tokenEndpoint: "https://github.com/login/oauth/access_token",
  revocationEndpoint:
    "https://github.com/settings/connections/applications/df478574bfecaf6e5790",
};

export default function App() {
  const router = useRouter();

  // promptSync é a função de login, trocamos o nome por sigInWithGithub

  const [, response, sigInWithGithub] = useAuthRequest(
    {
      clientId: "df478574bfecaf6e5790",
      scopes: ["identity"],
      redirectUri: makeRedirectUri({
        scheme: "nlwspacetime",
      }),
    },
    discovery
  );

  useEffect(() => {
    // console.log(
    //   makeRedirectUri({
    //     scheme: "nlwspacetime",
    //   })
    // );

    async function handleGithubOAuthCode(code: string) {
      const response = await api.post("/register", {
        code,
      });
      const { token } = response.data;
      await SecureStore.setItemAsync("token", token);

      router.push("/memories");
    }

    if (response?.type === "success") {
      const { code } = response.params;
      handleGithubOAuthCode(code);
    }
  }, [response]);

  return (
    <>
      <View className=" flex-1 items-center px-8 py-10">
        <View className="flex-1 items-center justify-center gap-4">
          <NlwLogo />
          <View className="space-y-2">
            <Text className="text-center font-title text-2xl leading-tight text-gray-50">
              Sua capsula do tempo
            </Text>
            <Text className="text-center font-body text-base leading-relaxed text-gray-100">
              Colecione momentos marcantes da sua jornada e compartilhe (se
              quiser) com o mundo!
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              className="rounded-full bg-green-500 px-5 py-2 "
              onPress={() => sigInWithGithub()}
            >
              <Text className="text-center font-alt text-sm uppercase text-black">
                Cadastrar lembrança
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-center font-body text-sm leading-relaxed text-gray-200">
          Feito com 💜 no NLW da Rocketseat
        </Text>
      </View>
    </>
  );
}
