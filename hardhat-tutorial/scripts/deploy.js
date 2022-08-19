const hre = require("hardhat")

async function main() {

  const whitelistContract = await hre.ethers.getContractFactory('Whitelist');

  const deployWhitelistContract = await whitelistContract.deploy(10);

  await deployWhitelistContract.deployed()

  console.log(
    "Whitelist Contract Address:",
    deployWhitelistContract.address
  )
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  })