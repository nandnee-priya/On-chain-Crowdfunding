// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding_week4 {
    address public owner;
    uint public deadline;
    uint public goal;
    uint public raisedAmount;
    bool public withdrawn;

    mapping(address => uint) public contributions;

    event ContributionMade(address indexed contributor, uint amount);
    event FundsWithdrawn(address indexed owner, uint amount);
    event RefundIssued(address indexed contributor, uint amount);

    constructor(uint _durationInMinutes, uint _goal) {
        owner = msg.sender;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        goal = _goal;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not the contract owner");
        _;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;

        emit ContributionMade(msg.sender, msg.value);
    }

    function withdraw() external onlyOwner {
        require(block.timestamp >= deadline, "Cannot withdraw before deadline");
        require(raisedAmount >= goal, "Funding goal not met");
        require(!withdrawn, "Funds already withdrawn");

        withdrawn = true;
        payable(owner).transfer(raisedAmount);

        emit FundsWithdrawn(owner, raisedAmount);
    }

    function refund() external {
        require(block.timestamp >= deadline, "Deadline not reached");
        require(raisedAmount < goal, "Funding goal was met");

        uint contributed = contributions[msg.sender];
        require(contributed > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributed);

        emit RefundIssued(msg.sender, contributed);
    }

    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    function getContribution(address contributor) external view returns (uint) {
        return contributions[contributor];
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
    }
}
