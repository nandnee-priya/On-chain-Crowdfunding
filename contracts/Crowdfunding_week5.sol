// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Crowdfunding_week5 {
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
        raisedAmount = 0;
        fundsWithdrawn = false;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function withdrawFunds() external {
        require(msg.sender == owner, "Only owner can withdraw");
        require(block.timestamp >= deadline, "Cannot withdraw before deadline");
        require(raisedAmount >= goal, "Goal not reached");
        require(!fundsWithdrawn, "Funds already withdrawn");

        fundsWithdrawn = true;
        payable(owner).transfer(raisedAmount);
    }

    function refund() external {
        require(block.timestamp >= deadline, "Refunds only after deadline");
        require(raisedAmount < goal, "Goal was met, cannot refund");

        uint amount = contributions[msg.sender];
        require(amount > 0, "No contributions to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    function getContribution(address user) external view returns (uint) {
        return contributions[user];
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}
