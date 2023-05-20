// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

contract FarmerRegistration {
    mapping(address => Farmer) public farmers;
    mapping(address => HarvestData[]) public farmerData;

    struct Farmer {
        string name;
        uint256 age;
        bool isRegistered;
    }

    struct HarvestData {
        uint256 timestamp;
        uint256 soilHealth;
        uint256 irrigationType;
        uint256 sapAnalysisData;
        uint256 droneImageData;
        uint256 nutrientSamplingData;
        bool validated;
        bool meetsSustainableCriteria;
    }

    event FarmerRegistered(address indexed farmerAddress, string name, uint256 age);
    event DataSubmitted(address indexed farmer, uint256 indexed day, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData);
    event DataValidated(address indexed farmer, uint256 indexed day, bool meetsSustainableCriteria);

    function registerFarmer(string memory name, uint256 age) external {
        require(!farmers[msg.sender].isRegistered, "Farmer is already registered");

        Farmer memory newFarmer = Farmer(name, age, true);
        farmers[msg.sender] = newFarmer;

        emit FarmerRegistered(msg.sender, name, age);
    }

    function submitData(uint256 day, uint256 soilHealth, uint256 irrigationType, uint256 sapAnalysisData, uint256 droneImageData, uint256 nutrientSamplingData) external {
        require(farmers[msg.sender].isRegistered, "Farmer is not registered");

        HarvestData memory data = HarvestData(
            block.timestamp,
            soilHealth,
            irrigationType,
            sapAnalysisData,
            droneImageData,
            nutrientSamplingData,
            false,
            false
        );
        farmerData[msg.sender].push(data);

        emit DataSubmitted(msg.sender, day, soilHealth, irrigationType, sapAnalysisData, droneImageData, nutrientSamplingData);
    }

    function validateData(address farmer) external {
        require(farmers[farmer].isRegistered, "Farmer is not registered");
        uint256 lastIndex = farmerData[farmer].length - 1;
        HarvestData storage data = farmerData[farmer][lastIndex];
        require(!data.validated, "Data already validated");

        bool meetsSustainableCriteria = checkSustainableCriteria(data);

        data.validated = true;
        data.meetsSustainableCriteria = meetsSustainableCriteria;

        emit DataValidated(farmer, lastIndex, meetsSustainableCriteria);
    }

    function checkSustainableCriteria(HarvestData memory data) internal pure returns (bool) {
        
        if (
            data.soilHealth >= 80 &&
            data.irrigationType == 1 && // Assuming 1 represents sustainable irrigation type
            data.sapAnalysisData >= 50 &&
            data.droneImageData >= 70 &&
            data.nutrientSamplingData >= 60
        ) {
            return true;
        } else {
            return false;
        }
    }

    function getFarmerDetails(address farmer) external view returns (
        string memory name,
        uint256 age,
        bool isRegistered
    ) {
        Farmer storage farmerDetails = farmers[farmer];
        return (
            farmerDetails.name,
            farmerDetails.age,
            farmerDetails.isRegistered
        );
    }


    function getFarmerData(address farmer, uint256 index) external view returns (
        uint256 timestamp,
        uint256 soilHealth,
        uint256 irrigationType,
        uint256 sapAnalysisData,
        uint256 droneImageData,
        uint256 nutrientSamplingData,
        bool validated,
        bool meetsSustainableCriteria
    ) {
        require(index < farmerData[farmer].length, "Invalid data index");

        HarvestData storage data = farmerData[farmer][index];
        return (
            data.timestamp,
            data.soilHealth,
            data.irrigationType,
            data.sapAnalysisData,
            data.droneImageData,
            data.nutrientSamplingData,
            data.validated,
            data.meetsSustainableCriteria
        );
    }
}
