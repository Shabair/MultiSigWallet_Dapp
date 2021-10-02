const Wallet = artifacts.require("multiSigWallet");

contract("multiSigWallet", (accounts) => {
  let wallet;
  beforeEach(async () => {
    wallet = await Wallet.new([accounts[0], accounts[1], accounts[2]], 2);
    await web3.eth.sendTransaction({
      from: accounts[0],
      to: wallet.address,
      value: 100000000000,
    });
  });

  it("Should have correct approvers and quorum", async () => {
    const approvers = await wallet.getApprovers();
    const quorum = await wallet.quorum();
    assert.equal(approvers.length == 3, "1");
    assert.equal(approvers[0], accounts[0], "2");
    assert.equal(approvers[1], accounts[1], "3");
    assert.equal(approvers[2], accounts[2], "4");
    assert.equal(quorum.toNumber(), 2);
  });

  it("should create Transfer", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    const transfers = await wallet.getTransfers();

    assert.equal(transfers.length, 1);
    assert.equal(transfers[0].id, "0", "id");
    assert.equal(transfers[0].amount, 1000, "Amount");
    assert.equal(transfers[0].to, accounts[5], "Address");
    assert.equal(transfers[0].approvals, "0", "approvals");
    assert.equal(transfers[0].sent, false, "Sent");
  });
});
