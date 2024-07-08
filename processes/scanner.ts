import { getAllERC20Balances } from "../utils/chainbase";

class Scanner {
  scantarget = async (
    target: any,
    add_buy_action: (details: any, target: any) => void,
    add_sell_action: (details: any, target: any) => void,
    add_logs_action: any,
    chain_base_api_key: string,
    chainId: string
  ) => {
    const CHAINBASE_API = chain_base_api_key;
    let old_balance_sheet: any = null;
    let new_balance_sheeet: any = null;
    let new_val: any = {};
    try {
      if (old_balance_sheet == null)
        old_balance_sheet = await getAllERC20Balances(
          CHAINBASE_API,
          target.address,
          chainId
        );
    } catch (e) {}
    console.log("Started scanning...  ", target);
    await add_logs_action(target);

    let changed = false;

    const timer = setInterval(async () => {
      try {
        new_balance_sheeet = await getAllERC20Balances(
          CHAINBASE_API,
          target.address,
          chainId
        );
      } catch (e) {}
      if (new_balance_sheeet == null) return;

      // Checking the old tokens in new balance sheet
      for (let i = 0; i < new_balance_sheeet.length; i++) {
        let token_found = false;
        for (let j = 0; j < old_balance_sheet.length; j++) {
          // Checking if Same tokens
          if (
            old_balance_sheet[j].contract_address ===
            new_balance_sheeet[i].contract_address
          ) {
            token_found = true;

            // Conditon if the token baught it
            if (
              Number(old_balance_sheet[j].balance) <
              Number(new_balance_sheeet[i].balance)
            ) {
              console.log(
                "1 >>  The address baught token : ",
                new_balance_sheeet[i].contract_address
              );

              const _new_arr = [];
              for (let k = 0; k < new_balance_sheeet.length; k++) {
                _new_arr.push(new_balance_sheeet[k]);
              }
              await add_buy_action(new_balance_sheeet[i], target);
              old_balance_sheet = _new_arr;
            }

            // Conditon if the token sold it even if sold completely it will atch it as alchemy stores all the data of even previously stored tokens which is now 0
            else if (
              Number(old_balance_sheet[j].balance) >
              Number(new_balance_sheeet[i].balance)
            ) {
              console.log(
                "The address Sold token : ",
                new_balance_sheeet[i].contract_address
              );

              const _new_arr = [];
              for (let k = 0; k < new_balance_sheeet.length; k++) {
                _new_arr.push(new_balance_sheeet[k]);
              }
              await add_sell_action(new_balance_sheeet[i], target);
              old_balance_sheet = _new_arr;
            } else {
            }
          }
        }

        // Token present in new balance sheet but not in old one means the token has been baught by the target
        if (!token_found) {
          console.log("2 >> buy");

          const _new_arr = [];
          for (let k = 0; k < new_balance_sheeet.length; k++) {
            _new_arr.push(new_balance_sheeet[k]);
          }
          await add_buy_action(new_balance_sheeet[i], target);
          old_balance_sheet = _new_arr;
        }
      }

      // Checking the new tokens in old balance sheet
      for (let i = 0; i < old_balance_sheet.length; i++) {
        let token_found = false;
        for (let j = 0; j < new_balance_sheeet.length; j++) {
          // Checking if Same tokens
          if (
            old_balance_sheet[i].contract_address ===
            new_balance_sheeet[j].contract_address
          ) {
            token_found = true;
          }
        }

        // token present in old balance sheet but not in new one measn the target has sold the token.
        if (!token_found) {
          console.log("sell", old_balance_sheet[i].contract_address);
          const _new_arr = [];
          for (let k = 0; k < new_balance_sheeet.length; k++) {
            _new_arr.push(new_balance_sheeet[k]);
          }
          await add_sell_action(old_balance_sheet[i], target);
          old_balance_sheet = _new_arr;
        }
      }
    }, 4000);

    return timer;
  };
}
export default Scanner;
