// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Donation {
    struct DonationInfo {
        uint id;
        address donateur;
        uint montant;
        uint timestamp;
    }

    DonationInfo[] public donations;
    mapping(address => uint[]) public donationsByDonator;

    uint public nextId = 0;

    event DonationReceived(uint id, address indexed donateur, uint montant, uint timestamp);

    function createDonation() external payable {
        require(msg.value > 0, unicode"La donation doit être supérieure à zéro.");

        donations.push(DonationInfo({
            id: nextId,
            donateur: msg.sender,
            montant: msg.value,
            timestamp: block.timestamp
        }));

        donationsByDonator[msg.sender].push(nextId);

        emit DonationReceived(nextId, msg.sender, msg.value, block.timestamp);

        nextId++;
    }

    function getDonationsByDonator(address _donator) external view returns (uint[] memory) {
        return donationsByDonator[_donator];
    }

    function getDonation(uint _id) external view returns (DonationInfo memory) {
        require(_id < nextId, "ID de donation invalide.");
        return donations[_id];
    }
}
