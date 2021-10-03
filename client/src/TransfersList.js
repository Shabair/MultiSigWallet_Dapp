import React from "react";

const TransferList = ({ transfers, approveTransfer }) => {
  return (
    <div>
      <h2>Transfers</h2>
      <table>
        <thead>
          <tr>
            <td>Id</td>
            <td>Amount</td>
            <td>To</td>
            <td>Approvals</td>
            <td>Sent</td>
          </tr>
        </thead>
        <tbody>
          {transfers?.map((transfer, index) => (
            <tr key={index}>
              <td>{transfer.id}</td>
              <td>{transfer.amount}</td>
              <td>{transfer.to}</td>
              <td>{transfer.approvals}</td>
              <td>{transfer.sent ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => approveTransfer(transfer.id)}>
                  Approve
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransferList;
