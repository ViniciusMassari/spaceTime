import NlwLogo from "../src/assets/nlwLogo.svg";

import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Icon from "@expo/vector-icons/Feather";

import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { api } from "../src/assets/lib/api";
import ptBr from "dayjs/locale/pt-br";
import dayjs from "dayjs";

dayjs.locale(ptBr);

interface Memory {
  coverUrl: string;
  excerpt: string;
  id: string;
  createdAt: string;
}

const Memories = () => {
  const [memories, setMemories] = useState<Memory[] | null>([null]);
  async function signOut() {
    const router = useRouter();
    await SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  async function loadMemories() {
    const token = SecureStore.getItemAsync("token");
    const response = await api.get("/memories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setMemories(response.data);
  }

  useEffect(() => {
    loadMemories();
  }, []);

  const { bottom, top } = useSafeAreaInsets();
  return (
    <ScrollView
      className="flex-1 "
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NlwLogo />
        <View className="">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-green-500"
          >
            <Icon name="log-out" size={16} color={"#000"} />
          </TouchableOpacity>
          <Link href={"/new"} asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color={"#000"} />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View className="space-y-4" key={memory.id}>
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50" />
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt).format("D[ de ]MMMM[, ]YYYY'")}
                </Text>
              </View>
              <View className=" space-y-4 px-8">
                <Image
                  source={{ uri: memory.coverUrl }}
                  className="aspect-video w-full rounded-lg"
                  alt=""
                />
                <Text className="text-hray-100 font-body text-base leading-relaxed">
                  {memory.excerpt}
                </Text>
                <Link href={"/memories/id"} asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color={"#9e9ea0"} />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default Memories;
