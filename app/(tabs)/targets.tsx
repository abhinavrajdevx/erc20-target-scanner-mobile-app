import StyledButton from "../../components/StyledButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import StyledTextinput from "../../components/StyledTextinput";

import React, { useEffect, useState } from "react";

import {
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Icon from "react-native-vector-icons/AntDesign";

import { isAddress } from "web3-validator";
// @ts-ignore
import icon from "../../assets/images/icon.png";

const Addtargetmodal = ({
  active_addrr,
  set_active_addr,
  active_nickname,
  set_active_name,
  handleAddtarget,
}: {
  handleAddtarget: () => {};
  active_addrr: string;
  set_active_addr: React.Dispatch<React.SetStateAction<string>>;
  active_nickname: string;
  set_active_name: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View className="">
      <StyledTextinput
        title="Address"
        value={active_addrr}
        handleChangeText={set_active_addr}
      />
      <View className="h-6"></View>
      <StyledTextinput
        title="Nick name"
        value={active_nickname}
        handleChangeText={set_active_name}
      />
      <View className="h-9"></View>
      <StyledButton
        handleClick={handleAddtarget}
        title="Add +"
        containerStyle={"w-full"}
      />
    </View>
  );
};

const AddressInfoModal = ({
  addr,
  name,
  handleDeleteClick,
}: {
  addr: string;
  name: string;
  handleDeleteClick: any;
}) => {
  return (
    <View className="w-full bg-black py-3 rounded-2xl px-3">
      <View className="flex flex-row justify-between items-center">
        <Text className="text-secondary/80  font-psemibold">{"Address"}</Text>
        <TouchableOpacity onPress={() => handleDeleteClick(addr)} className="">
          <Icon name="delete" size={20} color="red" />
        </TouchableOpacity>
      </View>

      <Text selectable={true} className="text-gray text-xs font-psemibold mt-1">
        {addr}
      </Text>
      <Text className="text-secondary/70 mt-3 font-psemibold">
        {"Nick name"}
      </Text>
      <Text className="text-gray font-psemibold">{name}</Text>
    </View>
  );
};

export default function App() {
  const { targets, set_targets, scanning } = useGlobalContext();

  const [targets_list, set_targets_list] = useState([]);
  const [active_addrr, set_active_addr] = useState("");
  const [active_nickname, set_active_name] = useState("");

  useEffect(() => {
    try {
      set_targets_list(JSON.parse(targets));
    } catch (e) {}
  }, [targets]);

  const handleDeleteClick = async (addr: string) => {
    if (scanning) return Alert.alert("Error", "Stop the scanner first.");
    let old_target_list = [];
    try {
      old_target_list = (await JSON.parse(targets))
        ? await JSON.parse(targets)
        : [];
    } catch (e) {}
    let new_target_list = [];

    for (let i = 0; i < old_target_list.length; i++) {
      console.log("old_target_list, ", old_target_list[i].addr);
      if (old_target_list[i].addr != addr)
        new_target_list.push(old_target_list[i]);
    }
    set_targets(JSON.stringify(new_target_list));
    const targetsStoragevalue = useAsyncStorage("targets");
    await targetsStoragevalue.setItem(JSON.stringify(new_target_list));
  };

  const handleAddtarget = async () => {
    if (scanning) return Alert.alert("Warning", "Stop the scanner first.");
    if (active_addrr.length === 0 || active_nickname.length === 0)
      return Alert.alert("Warning", "Fields cannot be blank.");
    if (!isAddress(active_addrr)) return Alert.alert("invalid address");

    let old_target_list = [];
    try {
      old_target_list = (await JSON.parse(targets))
        ? await JSON.parse(targets)
        : [];
    } catch (e) {}

    for (let i = 0; i < old_target_list.length; i++) {
      console.log("old_target_list, ", old_target_list[i].addr);
      if (old_target_list[i].addr == active_addrr) {
        return Alert.alert("Warning", "Address already exists!");
      }
      if (old_target_list[i].name == active_nickname) {
        return Alert.alert("Warning", "Nick name already exists!");
      }
    }

    old_target_list.push({
      addr: active_addrr,
      name: active_nickname,
    });
    set_targets(JSON.stringify(old_target_list));
    const targetsStoragevalue = useAsyncStorage("targets");
    await targetsStoragevalue.setItem(JSON.stringify(old_target_list));
    set_active_name("");
    set_active_addr("");
    return Alert.alert("Success", "Wallet added");
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
          <Addtargetmodal
            handleAddtarget={handleAddtarget}
            active_addrr={active_addrr}
            active_nickname={active_nickname}
            set_active_addr={set_active_addr}
            set_active_name={set_active_name}
          />
          <Text className="text-gray-100 font-psemibold mt-9">
            {`Targets : ${targets_list ? targets_list.length : 0}`}{" "}
          </Text>
          {targets_list?.map((item: any, index) => {
            return (
              <View key={index} className="my-3  ">
                <AddressInfoModal
                  addr={item.addr}
                  name={item.name}
                  handleDeleteClick={handleDeleteClick}
                />
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
