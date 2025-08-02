// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding {
    struct Campaign {
        address creator;
        string title;
        string description;
        uint goal;          // in wei
        uint deadline;      // timestamp
        uint amountRaised;
        bool isOpen;
    }

    uint public campaignCount;
    mapping(uint => Campaign) public campaigns;

    event CampaignCreated(
        uint campaignId,
        address indexed creator,
        string title,
        uint goal,
        uint deadline
    );

    function createCampaign(
        string memory _title,
        string memory _description,
        uint _goal,
        uint _durationInSeconds
    ) public {
        require(_goal > 0, "Goal must be greater than zero");
        require(_durationInSeconds > 0, "Duration must be positive");

        uint deadline = block.timestamp + _durationInSeconds;

        campaigns[campaignCount] = Campaign({
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            deadline: deadline,
            amountRaised: 0,
            isOpen: true
        });

        emit CampaignCreated(campaignCount, msg.sender, _title, _goal, deadline);

        campaignCount++;
    }

    function getCampaign(uint _id) public view returns (Campaign memory) {
        return campaigns[_id];
    }
}
