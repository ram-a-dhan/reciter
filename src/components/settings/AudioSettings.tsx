import { useState } from "react";
import { List, TouchableRipple } from "react-native-paper";

interface ILangOption {
  label: string;
  value: string;
}

const langOptions: ILangOption[] = [
  {
    label: "English",
    value: "EN",
  },
  {
    label: "Spanish",
    value: "ES",
  },
  {
    label: "Russian",
    value: "RU",
  },
  {
    label: "Swedish",
    value: "SE",
  },
  {
    label: "French",
    value: "FR",
  },
  {
    label: "German",
    value: "DE",
  },
  {
    label: "Italian",
    value: "IT",
  },
  {
    label: "Turkish",
    value: "TR",
  },
  {
    label: "Malaysian",
    value: "MY",
  },
  {
    label: "Indonesian",
    value: "ID",
  },
  {
    label: "Japanese",
    value: "JP",
  },
  {
    label: "Korean",
    value: "KR",
  },
  {
    label: "Chinese",
    value: "CN",
  },
];

export default function AudioSettings() {
  return (
    <>
      <List.Section title="Audio">
        <TouchableRipple
          onPress={() => {}}
          borderless
        >
          <List.Item
            title="Translation Language"
            description={"English"}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={(props) => <List.Icon {...props} icon="chevron-right" />}
          />
        </TouchableRipple>
      </List.Section>
    </>
  );
}
