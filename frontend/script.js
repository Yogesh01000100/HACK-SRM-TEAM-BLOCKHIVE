const provider = new ethers.providers.Web3Provider(window.ethereum);
let signer;

const tokenAbi = [
  "event DataSubmitted(address indexed farmer, uint256 indexed day, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData)",
      "event DataValidated(address indexed farmer, uint256 indexed day, bool meetsSustainableCriteria)",
      "event FarmerRegistered(address indexed farmerAddress, string name, uint256 age)",
      "function farmerData(address, uint256) view returns (uint256 timestamp, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData, bool validated, bool meetsSustainableCriteria) @29000000",
      "function farmers(address) view returns (string name, uint256 age, bool isRegistered) @29000000",
      "function getFarmerData(address farmer, uint256 index) view returns (uint256 timestamp, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData, bool validated, bool meetsSustainableCriteria) @29000000",
      "function getFarmerDetails(address farmer) view returns (string name, uint256 age, bool isRegistered) @29000000",
      "function registerFarmer(string name, uint256 age) @29000000",
      "function submitData(uint256 day, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData) @29000000",
      "function validateData(address farmer) @29000000"
  ];
const tokenAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
let tokenContract = null;


async function getAccess() {
  if (tokenContract) return;
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();
  tokenContract = new ethers.Contract(tokenAddress, tokenAbi, signer);
}

async function registerFarmer() {
  await getAccess();

  const name = document.getElementById('farmerName').value;
  const age = document.getElementById('farmerAge').value;

  const tx = await tokenContract.registerFarmer(name, age);
  await tx.wait();

  const farmerAddress = await signer.getAddress();
  console.log('Farmer registered successfully! Address:', farmerAddress);
}
  
  

  
  async function submitData() {
    await getAccess();
    
    const day = document.getElementById("dataDay").value;
    const soilHealth = document.getElementById("soilHealth").value;
    const irrigationType = document.getElementById("irrigationType").value;
    const sapAnalysisData = document.getElementById("sapAnalysisData").value;
    const droneImageData = document.getElementById("droneImageData").value;
    const nutrientSamplingData = document.getElementById("nutrientSamplingData").value;
    
    const tx = await tokenContract.submitData(
      day,
      soilHealth,
      irrigationType,
      sapAnalysisData,
      droneImageData,
      nutrientSamplingData
    );
    await tx.wait();
    
    console.log("Data submitted successfully!");
  }
  
  async function validateData() {
    await getAccess();
    
    const farmerAddress = document.getElementById("validationFarmerAddress").value;
    
    const tx = await tokenContract.validateData(farmerAddress);
    await tx.wait();
    
    console.log("Data validated successfully!");
  }
 
  
  async function fetchFarmerDetails() {
    await getAccess();
  
    const farmerAddress = document.getElementById("detailsFarmerAddress").value;
  
    const farmerDetails = await tokenContract.getFarmerDetails(farmerAddress);
    console.log("Farmer details:", farmerDetails);
  }
