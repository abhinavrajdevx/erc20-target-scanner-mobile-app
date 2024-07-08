import { createContext, useContext, useEffect, useState } from "react";
import { useAsyncStorage } from "@react-native-async-storage/async-storage";

const FirstBootContext = createContext<any | null>(null);

const GlobalProvider = ({ children }: { children: any }) => {
  const [firstTime, set_firstTime] = useState<string | null>(null);
  const [targets, set_targets] = useState<string | null>("");
  const [chainbase_api_key, set_chainbase_api_key] = useState<any>("");
  const [scanning, set_scanning] = useState(false);

  const version = "1.0.0";

  useEffect(() => {
    const first_run = async () => {
      const firstTimeStorageValue = useAsyncStorage("FirstTime");
      set_firstTime(await firstTimeStorageValue.getItem());

      const targettorageValue = useAsyncStorage("targets");
      set_targets(await targettorageValue.getItem());

      const chainbaseApiKeyStorageValue = useAsyncStorage("chainbase_api_key");
      set_chainbase_api_key(await chainbaseApiKeyStorageValue.getItem());
    };
    first_run();
  }, []);

  return (
    <FirstBootContext.Provider
      value={{
        firstTime,
        set_firstTime,
        targets,
        set_targets,
        set_chainbase_api_key,
        chainbase_api_key,
        version,
        scanning,
        set_scanning,
      }}
    >
      {children}
    </FirstBootContext.Provider>
  );
};

export default GlobalProvider;
export const useGlobalContext = () => useContext(FirstBootContext);
