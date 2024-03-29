import Web3 from "web3";

import wallet from "./contracts/MultiSigWallet.json";

const getWeb3 = () => {
  //for truffle or ganache development
  // return new Web3("http://127.0.0.1:9545/");

  //connect metamask
  return new Promise((resolve, reject) => {
    window.addEventListener("load", async () => {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      } else if (window.web3) {
        resolve(window.web3);
      } else {
        reject("Must Install web3");
      }
    });
  });
};

const getWallet = async (web3) => {
  const networkId = await web3?.eth?.net.getId();
  const deployedNetwork = wallet.networks[networkId];
  return new web3.eth.Contract(
    wallet.abi,
    deployedNetwork && deployedNetwork.address
    // "0x3f7c27FDa52F119690c82e9247a45EB27362b603"
  );
};

export { getWeb3, getWallet };
