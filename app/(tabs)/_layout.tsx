import { Redirect, Tabs } from "expo-router";
import React from "react";
import { useColorScheme } from "../../hooks/useColorScheme";
import { Text, View } from "react-native";

import Icon from "react-native-vector-icons/Feather";
import { useGlobalContext } from "../../context/GlobalProvider";

export default function TabLayout() {
  const { firstTime } = useGlobalContext();
  if (firstTime == "YES") return <Redirect href="/welcome" />;

  const colorScheme = useColorScheme();

  const TabIcon = ({
    icon,
    color,
    name,
    focused,
  }: {
    icon: string;
    color: string;
    name: string;
    focused: boolean;
  }) => {
    return (
      <View className="flex items-center justify-center gap-2">
        <Icon
          className="bg-blue-700"
          name={icon}
          size={25}
          color={focused ? color : "#69696B"}
        />
        <Text
          className={`${focused ? "font-bold" : "font-pregular"} text-xs`}
          style={{ color: color }}
        >
          {name}
        </Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#CCF39A",
        tabBarInactiveTintColor: "#69696B",
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: "#101014",
          borderTopWidth: 1,
          borderTopColor: "#69696B",
          height: 60,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"activity"}
              color={color}
              name={"Scanner"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="targets"
        options={{
          title: "targets",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"airplay"}
              color={color}
              name={"Targets"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="dev"
        options={{
          title: "Developer",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"code"}
              color={color}
              name={"Developer"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Configure",
          headerShown: false,
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              icon={"settings"}
              color={color}
              name={"Configure"}
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}
