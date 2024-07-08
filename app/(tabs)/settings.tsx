import StyledButton from "../../components/StyledButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import StyledTextinput from "../../components/StyledTextinput";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, View, Image, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { testApiKey } from "../../utils/chainbase";
// @ts-ignore
import icon from "../../assets/images/icon.png";

export default function App() {
  const { chainbase_api_key, set_chainbase_api_key } = useGlobalContext();

  const [chainbase_api_state, set_chainbase_api_state] = useState("");
  const [checking, set_checking] = useState(false);

  useEffect(() => {
    try {
      set_chainbase_api_state(chainbase_api_key);
    } catch (e) {}
  }, []);

  const handleChainbaseupdateClick = async () => {
    set_checking(true);
    const chainBaseApiKeyStoragevalue = useAsyncStorage("chainbase_api_key");
    const _response = await testApiKey(chainbase_api_state);
    if (!_response) return Alert.alert("Invalid API key");
    await chainBaseApiKeyStoragevalue.setItem(chainbase_api_state);
    set_chainbase_api_key(chainbase_api_state);
    set_checking(false);
    return Alert.alert("Success", "API integrated");
  };

  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="mt-9 px-3 pb-3">
        <View className="flex-row items-center">
          <Image source={icon} className="h-11 w-11 mr-3" />
          <Text className="font-black tracking-wider text-xl text-gray-100">
            ERC20 Target Scanner
          </Text>
        </View>
      </View>
      <ScrollView className="h-full">
        <View className="px-3">
          <View className="flex-row justify-between items-center mt-6"></View>
          <View className="">
            <StyledTextinput
              title="chainbase.com API Key, its free.."
              value={chainbase_api_state}
              handleChangeText={set_chainbase_api_state}
            />
            {checking && (
              <Text className="text-secondary font-psemibold text-xs text-center mt-1">
                Checking...
              </Text>
            )}

            <View className="h-8"></View>
            <StyledButton
              handleClick={handleChainbaseupdateClick}
              title="Update"
              containerStyle={"w-full"}
            />
            <Text
              onPress={() =>
                Linking.openURL("https://www.linkedin.com/in/abhinavraj36/")
              }
              className="text-secondary underline text-xs text-center mt-9"
            >
              Help ?
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
