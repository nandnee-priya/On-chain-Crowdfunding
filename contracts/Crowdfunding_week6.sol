// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding_week6 {
    address public owner;
    uint public deadline;
    uint public goal;
    uint public raisedAmount;
    bool public fundsWithdrawn;

    mapping(address => uint) public contributions;

    constructor(uint _durationInMinutes, uint _goal) {
        owner = msg.sender;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        goal = _goal;
        fundsWithdrawn = false;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function getContribution(address contributor) external view returns (uint) {
        return contributions[contributor];
    }

    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    function refund() external {
        require(block.timestamp >= deadline, "Deadline not reached");
        require(raisedAmount < goal, "Goal was met");
        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(block.timestamp >= deadline, "Deadline not yet reached");
        require(raisedAmount >= goal, "Funding goal not met");
        require(!fundsWithdrawn, "Funds already withdrawn");

        fundsWithdrawn = true;
        payable(owner).transfer(raisedAmount);
    }
}
