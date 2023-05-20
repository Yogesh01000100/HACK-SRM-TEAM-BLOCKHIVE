const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('FarmerRegistration', function () {
  let farmerRegistration;
  let owner;
  const name = "John Doe";
  const age = 30;
  const day = 1;
  const soilHealth = 90;
  const irrigationType = 1;
  const sapAnalysisData = 60;
  const droneImageData = 80;
  const nutrientSamplingData = 70;

  beforeEach(async function () {
    [owner] = await ethers.getSigners();

    const FarmerRegistration = await ethers.getContractFactory('FarmerRegistration');
    farmerRegistration = await FarmerRegistration.deploy();
    await farmerRegistration.deployed();
  });

  it('should register a farmer', async function () {
    await farmerRegistration.registerFarmer(name, age);

    const farmerDetails = await farmerRegistration.getFarmerDetails(owner.address);
    expect(farmerDetails.name).to.equal(name);
    expect(farmerDetails.age).to.equal(age);
    expect(farmerDetails.isRegistered).to.equal(true);
  });

  it('should submit data and emit event', async function () {
    await farmerRegistration.registerFarmer(name, age);

    await expect(farmerRegistration.submitData(day, soilHealth, irrigationType, sapAnalysisData, droneImageData, nutrientSamplingData))
      .to.emit(farmerRegistration, 'DataSubmitted')
      .withArgs(owner.address, day, soilHealth, irrigationType, sapAnalysisData, droneImageData, nutrientSamplingData);
  });

  it('should validate data and emit event', async function () {
    await farmerRegistration.registerFarmer(name, age);
    await farmerRegistration.submitData(day, soilHealth, irrigationType, sapAnalysisData, droneImageData, nutrientSamplingData);

    await expect(farmerRegistration.validateData(owner.address))
      .to.emit(farmerRegistration, 'DataValidated')
      .withArgs(owner.address, 0, true);

    const farmerData = await farmerRegistration.getFarmerData(owner.address, 0);
    expect(farmerData.validated).to.equal(true);
    expect(farmerData.meetsSustainableCriteria).to.equal(true);
  });
});








async function registerFarmer() {
  await getAccess();

  const name = document.getElementById('farmerName').value;
  const age = document.getElementById('farmerAge').value;

  const tx = await tokenContract.registerFarmer(name, age);
  await tx.wait();

  const farmerAddress = await signer.getAddress();
  console.log('Farmer registered successfully! Address:', farmerAddress);
}