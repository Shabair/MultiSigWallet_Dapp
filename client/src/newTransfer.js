import React, { useState } from "react";

const NewTransfer = ({ createTransfer }) => {
  const [transfer, setTransfer] = useState(undefined);

  const submit = (e) => {
    e.preventDefault();
    createTransfer(transfer);
  };

  const updateTransfer = (e, field) => {
    const value = e.target.value;
    setTransfer({ ...transfer, [field]: value });
  };

  return (
    <>
      <h2>Create Transfer</h2>
      <form
        onSubmit={(e) => {
          submit(e);
        }}
      >
        <label htmlFor="amount">Amount</label>
        <input
          type="text"
          id="amount"
          onChange={(e) => updateTransfer(e, "amount")}
        />

        <label htmlFor="amount">To</label>
        <input
          type="text"
          id="amount"
          onChange={(e) => updateTransfer(e, "to")}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default NewTransfer;
