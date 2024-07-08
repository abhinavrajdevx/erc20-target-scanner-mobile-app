import axios from "axios";

export const checkForUpdate = async (current_version: string) => {
  const response = await axios.get(
    "https://abhinavrajdevx.github.io/evm-target-scanner-assets-app/version.txt"
  );
  return response.data.split(" ")[0] === current_version
    ? "ok"
    : response.data.split(" ")[1];
};
