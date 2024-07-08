import { View, Text, TextInput } from "react-native";
import React from "react";

const StyledTextinput = ({
  title,
  value,
  handleChangeText,
}: {
  title: string;
  value: string;
  handleChangeText: any;
}) => {
  return (
    <View>
      <Text className="text-secondary font-psemibold tracking-wider">
        {title}
      </Text>
      <View className="w-full h-16 px-3 bg-black rounded-2xl border-2 border-secondary/50 focus:border-secondary ">
        <TextInput
          className="flex-1 text-secondary tracking-wider font-psemibold text-base"
          value={value}
          onChangeText={handleChangeText}
        />
      </View>
    </View>
  );
};

export default StyledTextinput;
