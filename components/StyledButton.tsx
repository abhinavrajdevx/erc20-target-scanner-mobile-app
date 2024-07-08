import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const StyledButton = ({
  title,
  containerStyle,
  handleClick,
}: {
  title: string;
  containerStyle: string;
  handleClick: any;
}) => {
  return (
    <>
      <TouchableOpacity
        className={`bg-secondary px-9 py-3 rounded-2xl ${containerStyle}`}
        onPress={handleClick}
      >
        <Text className="text-primary text-xl w-full text-center font-psemibold">
          {title}
        </Text>
      </TouchableOpacity>
    </>
  );
};

export default StyledButton;
