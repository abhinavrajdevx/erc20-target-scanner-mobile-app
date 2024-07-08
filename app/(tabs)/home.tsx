import StyledButton from "../../components/StyledButton";
import { useGlobalContext } from "../../context/GlobalProvider";
import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";

import { ScrollView, Text, View, Image, Linking, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";
import Scanner from "../../processes/scanner";
import { generateNotification } from "../../utils/pushNotifications";
import { Dropdown } from "react-native-element-dropdown";
import FontAwesome from "@expo/vector-icons/FontAwesome";

// @ts-ignore
import icon from "../../assets/images/icon.png";

interface IAction {
  type: String;
  amount: Number;
  token_addres: String;
  symbol: String;
  token_name: string;
  logo: any;
  target: { address: string; nick_name: string };
  contract_address: String;
  message?: String;
}

const ActionModal = ({ action }: { action: IAction }) => {
  const etherscan_parent = "https://etherscan.io/token/";
  return (
    <View className="w-full">
      {action.type == "buy" || action.type == "sell"}
      {action.type === "buy" && (
        <View>
          {action.logo?.length > 0 ? (
            <View className="flex flex-row items-center">
              <Image
                className="h-7 w-7 "
                source={{
                  uri: action.logo,
                }}
              />
              <View className="flex flex-row ml-3 items-center">
                <Text className="text-green-500 mr-3">{"+"}</Text>
                <Text className="text-green-500">
                  {`${action.token_name} <${action.symbol}>`}{" "}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-row items-center">
              <Text className="text-green-500 mr-3">{"+"}</Text>
              <Text className="text-green-500">
                {`${action.token_name} <${action.symbol}>`}{" "}
              </Text>
            </View>
          )}
          <View className="flex flex-row items-center mt-1">
            <Text className="text-green-500 mr-3">{">"}</Text>
            <View>
              <View className="w-full flex-row">
                <Text className="text-xs text-secondary">Target :</Text>
                <Text className="text-gray-100 text-xs">
                  {action.target.nick_name}
                </Text>
              </View>
              <Text className="text-gray text-xs">
                {action.target.address}{" "}
              </Text>
            </View>
          </View>
        </View>
      )}
      {action.type === "sell" && (
        <View>
          {action.logo?.length > 0 ? (
            <View className="flex flex-row items-center">
              <Image
                className="h-7 w-7 "
                source={{
                  uri: action.logo,
                }}
              />
              <View className="flex flex-row ml-3 items-center">
                <Text className="text-red-500 mr-3">{"-"}</Text>
                <Text
                  selectable={true}
                  onPress={() =>
                    Linking.openURL(
                      `${etherscan_parent}${action.contract_address}`
                    )
                  }
                  className="text-red-500"
                >
                  {`${action.token_name} <${action.symbol}>`}{" "}
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex flex-row items-center">
              <Text className="text-red-500 mr-3">{"+"}</Text>
              <Text
                selectable={true}
                onPress={() =>
                  Linking.openURL(
                    `${etherscan_parent}${action.contract_address}`
                  )
                }
                className="text-red-500"
              >
                {`${action.token_name} <${action.symbol}>`}{" "}
              </Text>
            </View>
          )}
          <View className="flex flex-row items-center mt-1">
            <Text className="text-red-500 mr-3">{">"}</Text>
            <View>
              <View className="w-full flex-row">
                <Text className="text-xs text-secondary">Target :</Text>
                <Text selectable={true} className="text-gray-100 text-xs">
                  {action.target.nick_name}
                </Text>
              </View>
              <Text selectable={true} className="text-gray text-xs">
                {action.target.address}{" "}
              </Text>
            </View>
          </View>
        </View>
      )}
      {action.type === "log" && (
        <View>
          <Text className="text-xs text-secondary">
            {" "}
            {`> ${action.message}`}
          </Text>
        </View>
      )}
    </View>
  );
};

const data = [
  { label: "Ethereum", value: "1" },
  { label: "Polygon", value: "137" },
  { label: "BSC", value: "56" },
  { label: "Avalanche", value: "43114" },
  { label: "Arbitrum One", value: "42161" },
  { label: "Optimism", value: "10" },
  { label: "Base", value: "8453" },
  { label: "zkSync", value: "324" },
  { label: "Merlin", value: "4200" },
];

export default function App() {
  const { targets, chainbase_api_key, scanning, set_scanning } =
    useGlobalContext();

  const [actions, set_actions] = useState<any>([]);
  const [scanner_timers, set_scanner_timers] = useState([]);
  const [targets_list, set_targets_list] = useState<any>([]);
  const [chain, set_chain] = useState(data[0]);

  const add_buy_action = async (
    details: any,
    target: { address: string; nick_name: string }
  ) => {
    const _new_action = {
      type: "buy",
      amount: Number(details.balance),
      token_addres: details.contract_address,
      symbol: details.symbol,
      token_name: details.name,
      logo: details.logos[0]?.uri,
      contract_address: details.contract_address,
      target,
    };

    await generateNotification(
      `${_new_action.target.nick_name}`,
      `+ ${_new_action.token_name}`
    );

    let _actions: any = [];
    try {
      const actionStoragevalue = useAsyncStorage("actions");
      const _actions_str: any = await actionStoragevalue.getItem();
      _actions = (await JSON.parse(_actions_str))
        ? await JSON.parse(_actions_str)
        : [];
      _actions.push(_new_action);
      await actionStoragevalue.setItem(JSON.stringify(_actions));
      set_actions(_actions.reverse());
    } catch (e) {}
  };

  const add_sell_Action = async (
    details: any,
    target: { address: string; nick_name: string }
  ) => {
    const _new_action = {
      type: "sell",
      amount: Number(details.balance),
      token_addres: details.contract_address,
      symbol: details.symbol,
      token_name: details.name,
      logo: details.logos[0]?.uri,
      contract_address: details.contract_address,
      target,
    };
    let _actions: any = [];

    await generateNotification(
      `${_new_action.target.nick_name}`,
      `- ${_new_action.token_name}`
    );

    try {
      const actionStoragevalue = useAsyncStorage("actions");
      const _actions_str: any = await actionStoragevalue.getItem();
      _actions = (await JSON.parse(_actions_str))
        ? await JSON.parse(_actions_str)
        : [];
      _actions.push(_new_action);
      await actionStoragevalue.setItem(JSON.stringify(_actions));
      set_actions(_actions.reverse());
    } catch (e) {}
  };

  const add_logs_action = async (target: {
    address: string;
    nick_name: string;
  }) => {
    console.log();
    const _new_action = {
      type: "log",
      message: `Started scanning ${target.nick_name} `,
    };
    let _actions: any = [];
    try {
      const actionStoragevalue = useAsyncStorage("actions");
      const _actions_str: any = await actionStoragevalue.getItem();
      _actions = (await JSON.parse(_actions_str))
        ? await JSON.parse(_actions_str)
        : [];
      _actions.push(_new_action);
      await actionStoragevalue.setItem(JSON.stringify(_actions));
      set_actions(_actions.reverse());
    } catch (e) {}
  };

  const initializeScanner = async (_target: any) => {
    const scanner = new Scanner();
    const _timer = await scanner.scantarget(
      _target,
      add_buy_action,
      add_sell_Action,
      add_logs_action,
      chainbase_api_key,
      //@ts-ignore
      chain
    );
    return _timer;
  };

  const startScanning = async () => {
    if (targets_list.length == 0)
      return Alert.alert(
        "Warning",
        "No targets found., go to targets tab to add one."
      );
    if (chainbase_api_key?.length == 0 || !chainbase_api_key)
      return Alert.alert("Warning", "Add Chainbase API key in Configure tab.");
    await generateNotification("Started", "Scanner");
    const actionStoragevalue = useAsyncStorage("actions");
    await actionStoragevalue.removeItem();
    const _scanner_timers: any = [];
    for (let i = 0; i < targets_list.length; i++) {
      const timer = await initializeScanner({
        address: targets_list[i].addr,
        nick_name: targets_list[i].name,
      });
      _scanner_timers.push(timer);
    }
    set_scanner_timers(_scanner_timers);
    set_scanning(true);
    console.log("Started");
  };

  const stopScanning = async () => {
    await generateNotification("Stopped", "Scanner");
    for (let i = 0; i < scanner_timers.length; i++) {
      clearInterval(scanner_timers[i]);
    }
    set_scanning(false);
  };

  useEffect(() => {
    const first_run = async () => {
      let _targets_list = [];
      try {
        _targets_list = (await JSON.parse(targets))
          ? await JSON.parse(targets)
          : [];
        set_targets_list(_targets_list);
      } catch (e) {}
    };
    first_run();

    // const _timer: any = updateLogs();
    //  return () => clearInterval(_timer);
  }, [targets]);

  return (
    <SafeAreaView className="h-full bg-primary">
      <View className="mt-9 px-3">
        <View className="flex-row items-center">
          <Image source={icon} className="h-11 w-11 mr-3" />
          <Text className="font-black tracking-wider text-xl text-gray-100">
            ERC20 Target Scanner
          </Text>
        </View>
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          iconStyle={styles.iconStyle}
          data={data}
          disable={scanning}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select chain..."
          searchPlaceholder="Search..."
          value={chain}
          onChange={(item: any) => {
            set_chain(item.value);
          }}
          renderLeftIcon={() => (
            <FontAwesome
              style={styles.icon}
              color="#CCF39A"
              name="chain"
              size={20}
            />
          )}
        />

        <View className="flex-row justify-between items-center mt-9">
          <View>
            <Text className="text-gray-100 font-psemibold">
              {`Targets on Board : ${targets_list.length}`}{" "}
            </Text>
            <Text className="text-gray-100 font-psemibold tracking-wider mb-3">
              Logs :
            </Text>
          </View>

          <StyledButton
            title={`${scanning ? "Stop" : "Start"}`}
            containerStyle={`${
              scanning ? "bg-red-500" : "bg-secondary"
            } py-1 px-3`}
            handleClick={() => (scanning ? stopScanning() : startScanning())}
          />
        </View>
      </View>
      <View className=" flex-1 h-full w-full px-4 pb-3">
        <View className="bg-black flex-1 h-full w-full">
          <ScrollView className="h-full py-3 px-3">
            {actions.map(
              (item: IAction, index: React.Key | null | undefined) => {
                return (
                  <View key={index} className="mb-6">
                    <ActionModal action={item} />
                  </View>
                );
              }
            )}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    backgroundColor: "#16181C",
    borderRadius: 12,
    padding: 0,
    shadowColor: "#000",
  },
  icon: {
    marginRight: 3,
    marginLeft: 3,
  },
  placeholderStyle: {
    fontSize: 16,
    color: "#CCF39A",
    backgroundColor: "#16181C",
  },
  selectedTextStyle: {
    fontSize: 16,
    backgroundColor: "#16181C",
    color: "#CCF39A",
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: "#CCF39A",
    backgroundColor: "#16181C",
  },
});
