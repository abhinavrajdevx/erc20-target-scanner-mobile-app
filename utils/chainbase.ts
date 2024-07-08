import axios from "axios";

const getERC20BalanceBypage = async (
  CHAINBASE_API: string,
  target: string,
  current_page: number,
  chainId: string
) => {
  const response = await axios.get(
    "https://api.chainbase.online/v1/account/tokens",
    {
      params: {
        chain_id: chainId,
        address: target,
        limit: "100",
        page: current_page,
      },
      headers: {
        accept: "application/json",
        "x-api-key": CHAINBASE_API,
      },
    }
  );
  return response;
};

export const getAllERC20Balances = async (
  CHAINBASE_API: string,
  target: string,
  chainId: string
) => {
  let balances_all_page = [];
  let completed = false;
  let current_page = 1;
  while (!completed) {
    let balances_current_page: any = await getERC20BalanceBypage(
      CHAINBASE_API,
      target,
      current_page,
      chainId
    );
    balances_current_page = balances_current_page.data.data;

    if (!balances_current_page) return null;
    if (balances_current_page.length < 100) completed = true;
    for (let i = 0; i < balances_current_page.length; i++) {
      balances_all_page.push(balances_current_page[i]);
    }
    current_page++;
  }
  return balances_all_page;
};

export const testApiKey = async (api_key: string) => {
  const response = await axios.get(
    "https://api.chainbase.online/v1/account/tokens",
    {
      params: {
        chain_id: "1",
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
        limit: "100",
        page: 1,
      },
      headers: {
        accept: "application/json",
        "x-api-key": api_key,
      },
    }
  );
  return response.status === 200 ? true : false;
};
