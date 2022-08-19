import { Contract, providers } from 'ethers';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import styles from '../styles/Home.module.css';
import Web3Modal from 'web3modal';
import { abi, WHITELIST_CONTRACT_ADDRESS } from '../constants';
import devImage from '../public/crypto-devs.svg';

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [joinedWhitelist, setJoinedWhitelist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [usersWhitelisted, setUsersWhitelisted] = useState(0);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    const provider = await web3ModalRef.current.connect();
    const web3Provider = new providers.Web3Provider(provider);

    const { chainId } = await web3Provider.getNetwork();
    if (chainId !== 4) {
      window.alert('Change the network to Rinkeby');
      throw new Error('Change network to Rinkeby');
    }

    if (needSigner) {
      const signer = web3Provider.getSigner();
      return signer;
    }

    return web3Provider;
  };

  const addAddressToWhitelist = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const tx = await whitelistContract.addAddressToWhitelist();
      setLoading(true);
      await tx.wait();
      setLoading(false);
      await getUsersWhitelistedCount();
      setJoinedWhitelist(true);
    } catch (e) {
      console.error(e);
    }
  };

  const getUsersWhitelistedCount = async () => {
    try {
      const provider = await getProviderOrSigner();
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        provider
      );
      const _usersWhitelistedCount =
        await whitelistContract.numAddressesWhitelisted();
      setUsersWhitelisted(_usersWhitelistedCount);
    } catch (e) {
      console.error(err);
    }
  };

  const checkAddressWhitelisted = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const whitelistContract = new Contract(
        WHITELIST_CONTRACT_ADDRESS,
        abi,
        signer
      );

      const address = await signer.getAddress();

      const _joinedWhitelist = await whitelistContract.whitelistedAddresses(
        address
      );

      setJoinedWhitelist(_joinedWhitelist);
    } catch (e) {
      console.error(e);
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);

      await checkAddressWhitelisted();
      await getUsersWhitelistedCount();
    } catch (e) {
      console.error(e);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWhitelist) {
        return <p className={styles.prg}>Thanks for joining the Whitelist</p>;
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button onClick={addAddressToWhitelist} className={styles.button}>
            Join the Whitelist
          </button>
        );
      }
    } else {
      return (
        <button onClick={connectWallet} className={styles.button}>
          Connect your wallet
        </button>
      );
    }
  };

  useEffect(() => {
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: 'rinkeby',
        providerOptions: {},
        disableInjectedProvider: false,
      });
      connectWallet();
    }
  }, [walletConnected]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Whitelist dApp</title>
        <meta name="description" content="Best whitelist dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <section className={styles.welcomeSection}>
          <h1 className={styles.title}>Welcome to Crypto Devs!</h1>
          <p className={styles.prg}>
            Its an NFT collection for developers in Crypto.
          </p>
          <p className={styles.prg}>
            {parseInt(usersWhitelisted)} users have already joined the Whitelist
          </p>
          {renderButton()}
        </section>
        <section className={styles.imageSection}>
          <Image
            layout="responsive"
            width={100}
            height={100}
            src={devImage}
            alt="A crypto developer with a computer"
          />
        </section>
      </main>
    </div>
  );
}
