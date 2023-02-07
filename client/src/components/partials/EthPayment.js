import * as Utils from "web3-utils";
import React, { useEffect, useState } from "react";
import contract from "./contract.json";
import { ethers } from "ethers";
import { dispatchFeedbackContexts, showFeedbackContexts } from "../../App";
import axios from "axios";
import apiService from "../../services/apiService";
import { showCartContexts } from "./../../App";

const contractAddress = "0xf9C4870f3F59e3dD99Ce0184A788DF8a9903c15f";
const abi = contract;
function EthPayment(props) {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [paying, setPaying] = useState(false);
  const dispatch = dispatchFeedbackContexts();
  const [ethToPay, setEthToPay] = useState();
  const [totalGwei, setTotalGwei] = useState();
  const cart = showCartContexts();
  const getEthPrice = async () => {
    try {
      let res = await axios.get(
        "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=EUR"
      );

      let ethPrice = res.data.EUR;
      let eurAmount = props.amountToPay;
      let ethToPay = parseFloat(eurAmount) / parseFloat(ethPrice);
      //   let gweiToPay = ethers.utils.parseEther(ethToPay.toString());
      //   console.log(gweiToPay);
      console.log(ethToPay);
      setEthToPay(ethToPay);
    } catch (err) {
      console.log(err);
    }
  };
  const payEthereum = async (event) => {
    event.preventDefault();

    console.log();
    const { ethereum } = window;

    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);

      if (!props.shippingAddress) {
        dispatch({
          value: true,
          message: "You need to select a shipping address ",
          type: "Error",
        });
        return;
      }

      setPaying(true);
      // CHANGE ETH PRICE IN PROD
      let nftTxt = await nftContract.sendEth({
        value: ethers.utils.parseEther("0.001").toString(),
      });
      await nftTxt.wait();
      setPaying(false);

      //UNCOMMENT IN PROD
      let transaction = "test";
      // COMMENT IN PROD

      const form = new FormData();
      form.append("userId", apiService.getUser().id);
      form.append("shipping", props.shippingAddress);
      form.append("totalAmount", cart.cart.totalAmount);
      form.append("cartItems", JSON.stringify(cart.cart.items));

      // To do: User apiService to include access token
      let session = await axios.post(
        "http://localhost:8080/stripe/ether",
        form
      );

      console.log(session);
      window.location.replace(session.data.url);
      dispatch({
        value: true,
        message: "Great! Transaction completed: " + nftTxt["hash"],
        type: "Success",
      });
    } catch (err) {
      console.log(err);

      if (
        err.response.data.unavailableProducts &&
        err.response.data.unavailableProducts.length > 0
      ) {
        console.log(err.response.data.unavailableProducts);
        props.setUnavailableProducts(err.response.data.unavailableProducts);
      }
      dispatch({
        value: true,
        message: err.response.data.message || "Error from server",
        type: "Error",
      });
    }
  };
  const checkWalletIsConnected = async () => {
    // Check if Metamask is installed
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask installed!");
    } else {
      console.log("Wallet exists! We're ready!");
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account :", account);
      setCurrentAccount(account);
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, abi, signer);
    } else {
      console.log("No authorized account");
    }
  };

  const connectWalletHandler = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      alert("Please install Metamask!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Found an account! Address: ", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    checkWalletIsConnected();
    getEthPrice();
  }, []);

  return currentAccount ? (
    paying ? (
      <a href="#">Wait! Your payment is being processed</a>
    ) : (
      <a onClick={(event) => payEthereum(event)} href="#">
        PAY WITH ETH
      </a>
    )
  ) : (
    <a onClick={connectWalletHandler} href="#">
      Connect Your ETH Wallet
    </a>
  );
}

export default EthPayment;
