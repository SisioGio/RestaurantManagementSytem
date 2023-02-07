// client/src/App.js

import React from "react";

function HowTo() {
  return (
    <div id="how-to">
      <h1>All what you need to know is here</h1>

      <div className="how-to-content">
        <h3>Install Metamask extension</h3>

        <ul>
          <li>
            Go to the MetaMask website{" "}
            <a href="https://metamask.io/" target="_blank">
              Metamask
            </a>{" "}
            and click on "Get MetaMask for" and select your browser.
          </li>
          <li>Click on "Add to Browser" and confirm the installation.</li>
          <li>
            A MetaMask icon will appear in the top right corner of your browser.
            Click on it to open the MetaMask interface.
          </li>
          <li>Click on "Create a Wallet" to set up a new account.</li>
          <li>
            Read and accept the terms of use, and then create a strong password
            to protect your account.
          </li>
          <li>
            Click on "Next" to generate a seed phrase (a series of words that
            you will use to restore your account if you ever need to). Write
            down the seed phrase and store it in a safe place.
          </li>
        </ul>

        <p>
          Your MetaMask account is now set up and ready to use. You can use it
          to interact with dApps, manage your cryptocurrency assets, and make
          transactions on the Ethereum network. It is important to keep your
          seed phrase safe and secure, as losing it will mean losing access to
          your account and any assets it contains.
        </p>

        <p>
          For additional help, open a ticket or check the follow{" "}
          <a
            target="_blank"
            href="https://www.geeksforgeeks.org/how-to-install-and-use-metamask-on-google-chrome/#:~:text=Step%201%3A%20Go%20to%20Chrome,the%20Add%20to%20Chrome%20button."
          >
            link
          </a>
        </p>
      </div>

      <div className="how-to-content">
        <h3>Buy ethers</h3>

        <ul>
          <li>
            Sign up for an account on a cryptocurrency exchange that supports
            Ether, such as Coinbase, Binance, Kraken, etc. ({" "}
            <a
              target="_blank"
              href="https://accounts.binance.com/en/register-person"
            >
              Binace registration
            </a>
            )
          </li>
          <li>
            Verify your identity by providing the required personal information
            and documentation.
          </li>
          <li>
            Link your bank account, debit card or credit card to the exchange
            account.
          </li>
          <li>
            Navigate to the Ether trading pair and place a buy order. You can
            either buy at market price or set a limit order at a specific price.
          </li>
          <li>
            Confirm the details of the transaction and complete the purchase.
          </li>
          <li>The Ether will then be deposited into your exchange account.</li>
          <li>
            From there, you can withdraw the Ether to your digital wallet by
            providing the wallet's public address and the amount of Ether you
            wish to transfer.
          </li>
        </ul>
      </div>

      <div className="how-to-content">
        <h3>Purchase products & Accept Transaction</h3>

        <ul>
          <li>
            Add the desired items to the cart and fill out the needed shipping
            address information.
          </li>
          <li>
            If your wallet is not connected, the 'Connect your wallet' button
            displays; clicking it connects your wallet to the site.
          </li>
          <li>
            When the button 'Pay with ETH' is available, clicking it will open a
            popup window from Metamask with all the transaction details,
            including the amount to pay and gas fees.
          </li>
          <li>
            After verifying the data, the 'Confirm' button must be clicked to
            finalize the transaction.
          </li>
          <li>
            The status of your payment will be communicated as soon as it is
            processed.
          </li>
        </ul>

        <p>
          All transactions are registered in the etherscan application ({" "}
          <a href="https://etherscan.io/address/0x48a00fbcc609e145a3f639764ce8d9d5ee6858d5#code">
            Etherscan
          </a>
          )
        </p>
      </div>
    </div>
  );
}

export default HowTo;
