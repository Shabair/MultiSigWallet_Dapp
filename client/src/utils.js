import web3 from "web3";

import wallet from "./contracts/MultiSigWallet.json";

const getWeb3 = () => {
  return new web3("http://127.0.0.1:9545/");
};

const getWallet = async (web3) => {
  const networkId = await web3?.eth?.net.getId();
  const deployedNetwork = wallet.networks[networkId];
  return new web3.eth.Contract(
    wallet.abi,
    deployedNetwork && deployedNetwork.address
  );
};

export { getWeb3, getWallet };
