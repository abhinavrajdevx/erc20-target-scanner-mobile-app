import StyledButton from "../../components/StyledButton";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  Text,
  View,
  Image,
  Linking,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// @ts-ignore
import icon from "../../assets/images/icon.png";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";
import EvilIcons from "react-native-vector-icons/EvilIcons";

export default function App() {
  const [news, set_news] = useState("");

  useEffect(() => {
    async function firstRun() {
      const response = await axios.get(
        "https://abhinavrajdevx.github.io/evm-target-scanner-assets-app/news.txt"
      );
      set_news(response.data);
    }
    firstRun();
  }, []);

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
          <View className="items-center">
            <Image
              className="h-[200px] w-[200px]"
              source={{
                uri: "https://abhinavrajdevx.github.io/evm-target-scanner-assets-app/me.png",
              }}
            />
            <Text className="text-secondary text-center font-psemibold text-base mb-3">
              Abhinav Raj
            </Text>
            <Text className="text-secondary/80 text-center font-psemibold text-xs">
              I am happy to make this project Open source.
            </Text>

            <View className="h-8"></View>
            <StyledButton
              handleClick={() =>
                Linking.openURL(
                  "https://github.com/abhinavrajdevx/erc20-target-scanner-mobile-app"
                )
              }
              title="Open Github"
              containerStyle={"w-full bg-gray-100/80"}
            />
            <View className="mt-6">
              <View className=" flex-row justify-center items-center gap-6">
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://x.com/AbhinavRajHere")
                  }
                >
                  <Icon name="x" size={30} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://www.linkedin.com/in/abhinavraj36/")
                  }
                >
                  <Icon name="linkedin" size={30} color="skyblue" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("mailto:abhinavrajdevxcontactx@gmail.com")
                  }
                >
                  <Icon name="mail" size={30} color="red" />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL("https://t.me/+Ba-Ymevqz-s1YjY1")
                  }
                >
                  <EvilIcons name="sc-telegram" size={30} color="lightgreen" />
                </TouchableOpacity>
              </View>
            </View>
            {news?.length > 0 && (
              <View className="w-full mt-9">
                <Text className="text-secondary font-psemibold">
                  {"Developers voice"}
                </Text>
                <Text className="text-gray-100 mx-3">{news}</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
