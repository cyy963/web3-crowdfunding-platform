const Footer = () => {
  return (
    <div className="fixed bottom-0 w-[100vw] h-auto bg-purple-400 p-4 flex items-center justify-center">
      <p className="font-normal text-white text-xl max-md:text-xs">
        To test the features, connect your metamask wallet and switch to the
        sepolia testnet and request free test tokens {' '}
        <a
          href="https://cloud.google.com/application/web3/faucet/ethereum/sepolia"
          className="underline text-blue-300 hover:text-blue-400"
          target="_blank"
          rel="noopener noreferrer"
        >
        here
        </a>
        {'.'}
      </p>
    </div>
  );
};
export default Footer;
