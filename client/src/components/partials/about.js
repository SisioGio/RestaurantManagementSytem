// client/src/App.js

import React from "react";

function About() {
  return (
    <div id="about">
      <div id="img-container">
        <div className="img-layer"></div>
        <img src="https://s21285.s3.amazonaws.com/home_image.jpg" alt="" />

        <div id="home-banner" className="text-white">
          <p class="text-white">
            Score a goal for your team loyalty with an official Juventus
            t-shirt, now available for purchase using Ether.
          </p>
        </div>
      </div>

      <div className="about-content">
        <h1>ABOUT US</h1>

        <p>
          Welcome to our online store, dedicated to providing fans of the
          legendary <b>Juventus Football Club</b> with official merchandise. We
          are passionate supporters of the team ourselves, and we understand the
          importance of showing your love for the Bianconeri through
          high-quality, authentic apparel. We are proud to be one of the few
          e-commerce shops that accepts <b>Ether</b> as a payment method, making
          it easy for our customers to get their hands on the latest Juventus
          gear. We offer a wide range of products, all featuring the iconic
          black and white stripes and the Juventus crest. Whether you're looking
          for a gift for a fellow fan or want to treat yourself, we have
          something for everyone. Thank you for choosing our store and{" "}
          <b>Forza Juve!</b>
        </p>
      </div>
      <div className="about-content">
        <h1>WHY US</h1>

        <p>
          Shop with confidence at our ecommerce store for all your Juventus
          merchandise. With our unique payment options of both Ether and credit
          card, you can enjoy a seamless shopping experience without any hassle.
          Our commitment to quality and affordability sets us apart from the
          competition. Plus, as official Juventus partners, you can be sure that
          you are getting authentic and official products. Choose us for your
          Juventus gear and join the millions of fans worldwide in support of
          the Bianconeri.
        </p>
      </div>
      <div className="about-content">
        <h1>WHAT IS ETHEREUM?</h1>
        <img
          className="left"
          src="https://s21285.s3.amazonaws.com/what_is_blockchain.jpg"
          alt=""
        />
        <p>
          The <b>Ethereum network</b> is a decentralized platform that runs
          smart contracts: applications that run exactly as programmed without
          any possibility of downtime, censorship, fraud or third party
          interference. These apps run on a custom built blockchain, an
          enormously powerful shared global infrastructure that can move value
          around and represent ownership.
          <br />
          Want to know more? Check out the official{" "}
          <a target="_blank" href="https://ethereum.org/en/">
            website
          </a>
        </p>
      </div>
      <div className="about-content">
        <h1>WHAT IS ETHER?</h1>
        <img
          className="left"
          src="https://s21285.s3.amazonaws.com/ether_what_is.png"
          alt=""
        />
        <p>
          Ether (ETH) is a cryptocurrency that is used to pay for transactions
          on the Ethereum network. To use it to pay for goods or services, you
          will need to have a digital wallet that supports Ether. Some popular
          options include MyEtherWallet, MetaMask, and Ledger Live.
        </p>
      </div>
      <div className="about-content">
        <h1>WHY ETHEREUM?</h1>
        <img
          className="right"
          src="https://s21285.s3.amazonaws.com/why_ethereum.jpg"
          alt=""
        />
        <p>
          Ethereum's blockchain technology is <b>decentralized</b> and open
          source; meaning the code is available for anyone to see and
          contributes to it's growing ecosystem.
          <br />
          Smart contracts are not just about financial transactions like paying
          for a flight ticket or receiving your salary; they can also be used
          for co-signing a <b>loan or renting out your house</b> through an
          escrow service.
        </p>
      </div>
    </div>
  );
}

export default About;
