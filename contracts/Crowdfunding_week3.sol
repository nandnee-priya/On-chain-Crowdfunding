// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Crowdfunding_week3 {
    address public owner;
    uint public deadline;
    uint public goal;
    uint public raisedAmount;
    mapping(address => uint) public contributions;

    constructor(uint _durationInMinutes, uint _goal) {
        owner = msg.sender;
        deadline = block.timestamp + (_durationInMinutes * 1 minutes);
        goal = _goal;
    }

    function contribute() external payable {
        require(block.timestamp < deadline, "Deadline has passed");
        require(msg.value > 0, "Contribution must be greater than 0");

        contributions[msg.sender] += msg.value;
        raisedAmount += msg.value;
    }

    function getTimeLeft() external view returns (uint) {
        if (block.timestamp >= deadline) return 0;
        return deadline - block.timestamp;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }

    function getContribution(address contributor) public view returns (uint) {
        return contributions[contributor];
    }
}
