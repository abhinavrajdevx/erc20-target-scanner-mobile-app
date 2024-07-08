import { View, Text, Image, Linking } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import { registerForPushNotificationsAsync } from "../utils/pushNotifications";
import { useGlobalContext } from "../context/GlobalProvider";
import { checkForUpdate } from "../utils/versionControlSystem";
import StyledButton from "../components/StyledButton";

// @ts-ignore
import icon from "../assets/images/icon.png";

const index = () => {
  const { version } = useGlobalContext();

  const [loading, set_loading] = useState(true);
  const [update_reuired, set_update_required] = useState(false);
  const [update_url, set_update_url] = useState("");

  useEffect(() => {
    const first_run = async () => {
      set_loading(true);
      try {
        const actionStoragevalue = useAsyncStorage("actions");
        await actionStoragevalue.removeItem();
        await registerForPushNotificationsAsync();
        const _updata = await checkForUpdate(version);
        set_update_required(_updata == "ok" ? false : true);
        set_update_url(_updata);
        await new Promise((resolve) => {
          setTimeout(() => resolve(""), 2000);
        });
      } catch (e) {
        console.log(e);
      } finally {
        set_loading(false);
      }
    };

    first_run();
  }, []);
  console.log(loading);
  if (loading) {
    return (
      <SafeAreaView className="h-full">
        <View className="h-full bg-primary justify-center items-center">
          <Image source={icon} className="h-[100px] w-[100px] mb-9" />
          <Text className="text-secondary text-3xl text-center mb-[100px] font-bold tracking-wider ">
            ERC20 Target Scanner
          </Text>
        </View>
      </SafeAreaView>
    );
  } else if (!loading && update_reuired) {
    return (
      <SafeAreaView className="h-full">
        <View className="h-full bg-primary justify-center items-center">
          <Image source={icon} className="h-[100px] w-[100px] mb-9" />
          <Text className="text-secondary text-3xl text-center  font-bold tracking-wider ">
            New Version Available
          </Text>
          <StyledButton
            title={"Update now"}
            containerStyle={" mt-9"}
            handleClick={() => Linking.openURL(update_url)}
          />
        </View>
      </SafeAreaView>
    );
  } else {
    return <Redirect href="/home" />;
  }
};

export default index;
