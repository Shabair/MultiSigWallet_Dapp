const { expectRevert } = require("@openzeppelin/test-helpers");
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

  it("should not create transaction if sender is not approver", async () => {
    await expectRevert(
      wallet.craeteTransfer(1000, accounts[5], { from: accounts[4] }),
      "You not a Approver!"
    );
  });

  it("should increment the approvls", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[0] });

    const transfers = await wallet.getTransfers();

    assert.equal(transfers[0].approvals, "1", "checking approvers count");
    assert.equal(transfers[0].sent, false, "checking the sent status");
    assert.equal(transfers[0].amount, 1000, "checking the contract balance");
  });

  it("should transfer the amount after approval", async () => {
    const balance = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[1] });

    const newBalance = web3.utils.toBN(await web3.eth.getBalance(accounts[5]));

    assert.equal(
      newBalance.sub(balance),
      1000,
      "checking the contract balance"
    );
  });

  it("should NOT approve if not an approver", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await expectRevert(
      wallet.approveTransfers(0, { from: accounts[4] }),
      "You not a Approver!"
    );
  });

  it("should NOT approve twice", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[0] });

    await expectRevert(
      wallet.approveTransfers(0, { from: accounts[0] }),
      "can't Approve Trasnation Twice!"
    );
  });

  it("should check approvals", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[0] });
    const checkApprovals = await wallet.checkApprovals(accounts[0], 0);
    assert.equal(checkApprovals, true, "true if required");
  });

  it("should NOT approve if transaction already sent", async () => {
    await wallet.craeteTransfer(1000, accounts[5], { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[0] });
    await wallet.approveTransfers(0, { from: accounts[1] });
    await expectRevert(
      wallet.approveTransfers(0, { from: accounts[2] }),
      "Transation has alredy been sent!"
    );
  });
});
