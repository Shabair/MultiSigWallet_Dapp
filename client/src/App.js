import React, { useEffect, useState } from "react";
import { getWeb3, getWallet } from "./utils";
import Header from "./Header";
import NewTransfer from "./newTransfer";
import TransferList from "./TransfersList";

function App() {
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState(undefined);
  const [wallet, setWallet] = useState(undefined);
  const [approvers, setApprovers] = useState([]);
  const [quorum, setQuorum] = useState(undefined);
  const [transfers, setTransfers] = useState(undefined);

  useEffect(() => {
    const init = async () => {
      const _web3 = await getWeb3();
      const _accounts = await _web3.eth.getAccounts();
      const _wallet = await getWallet(_web3);
      const quorum = await _wallet.methods.quorum().call();
      const approvers = await _wallet.methods.getApprovers().call();
      const _transfers = await _wallet.methods.getTransfers().call();

      setWeb3(_web3);
      setAccounts(_accounts);
      setWallet(_wallet);
      setApprovers(approvers);
      setQuorum(quorum);
      setTransfers(_transfers);
    };
    init();
  }, []);

  if (
    typeof web3 === undefined ||
    typeof accounts === undefined ||
    typeof wallet === undefined ||
    typeof approvers === undefined ||
    typeof quorum === undefined
  ) {
    return <div>Loading...!</div>;
  }

  const newTransfer = async (transfer) => {
    console.log(transfer);
    wallet.methods
      .craeteTransfer(transfer.amount, transfer.to)
      .send({ from: accounts[0], gas: 3000000 })
      .on("error", (error) => {
        console.log(error);
      });
  };

  const approveTransfer = (transferId) => {
    wallet.methods.approveTransfers(transferId).send({ from: accounts[0] });
  };

  return (
    <>
      <div>Dapp</div>
      <Header approvers={approvers} quorum={quorum} />
      <NewTransfer createTransfer={newTransfer} />
      <TransferList transfers={transfers} approveTransfer={approveTransfer} />
    </>
  );
}

export default App;
