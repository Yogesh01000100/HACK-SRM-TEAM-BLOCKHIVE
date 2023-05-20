const hre = require("hardhat");
const fs = require("fs/promises");

async function main() {
  const SustainableFarmingCreditContract = await hre.ethers.getContractFactory("FarmerRegistration");
  const contract = await SustainableFarmingCreditContract.deploy();

  await contract.deployed();
  await writeDeploymentInfo(contract, "contract.json");
}

async function writeDeploymentInfo(contract, filename = "") {
  const data = {
    network: hre.network.name,
    contract: {
      address: contract.address,
      signerAddress: contract.signer.address,
      abi: contract.interface.format(),
    },
  };

  const content = JSON.stringify(data, null, 2);
  await fs.writeFile(filename, content, { encoding: "utf-8" });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
