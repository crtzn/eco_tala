// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract EcoTala {
    // Events
    event ActionLogged(address indexed user, string action, string photoHash, uint256 points, uint256 timestamp);
    event PointsAwarded(address indexed user, uint256 points);

    // Structs
    struct EcoAction {
        string actionType;
        string photoHash;
        uint256 points;
        uint256 timestamp;
        bool verified;
    }

    // State variables
    mapping(address => uint256) public userPoints;
    mapping(address => EcoAction[]) public userActions;
    mapping(string => uint256) public actionPointValues;

    uint256 public totalActions;
    uint256 public totalUsers;
    uint256 public totalPointsAwarded;

    address public owner;

    // Action types with their point values
    constructor() {
        owner = msg.sender;

        // Initialize point values for different actions
        actionPointValues["Recycle Plastic"] = 10;
        actionPointValues["Reusable Cup"] = 8;
        actionPointValues["Carpool"] = 15;
        actionPointValues["Plant Tree"] = 20;
        actionPointValues["Solar Energy"] = 12;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    // Log an eco-friendly action
    function logAction(string memory _actionType, string memory _photoHash) external {
        require(bytes(_actionType).length > 0, "Action type cannot be empty");
        require(bytes(_photoHash).length > 0, "Photo hash cannot be empty");
        require(actionPointValues[_actionType] > 0, "Invalid action type");

        uint256 points = actionPointValues[_actionType];

        // Check if this is user's first action
        if (userActions[msg.sender].length == 0) {
            totalUsers++;
        }

        // Create new action
        EcoAction memory newAction = EcoAction({
            actionType: _actionType,
            photoHash: _photoHash,
            points: points,
            timestamp: block.timestamp,
            verified: true // Auto-verify for MVP
        });

        // Store action
        userActions[msg.sender].push(newAction);
        userPoints[msg.sender] += points;
        totalActions++;
        totalPointsAwarded += points;

        emit ActionLogged(msg.sender, _actionType, _photoHash, points, block.timestamp);
        emit PointsAwarded(msg.sender, points);
    }

    // Get user's total points
    function getUserPoints(address _user) external view returns (uint256) {
        return userPoints[_user];
    }

    // Get user's action count
    function getUserActionCount(address _user) external view returns (uint256) {
        return userActions[_user].length;
    }

    // Get user's specific action
    function getUserAction(address _user, uint256 _index) external view returns (
        string memory actionType,
        string memory photoHash,
        uint256 points,
        uint256 timestamp,
        bool verified
    ) {
        require(_index < userActions[_user].length, "Action index out of bounds");
        EcoAction memory action = userActions[_user][_index];
        return (action.actionType, action.photoHash, action.points, action.timestamp, action.verified);
    }

    // Get global statistics
    function getGlobalStats() external view returns (
        uint256 _totalActions,
        uint256 _totalUsers,
        uint256 _totalPointsAwarded
    ) {
        return (totalActions, totalUsers, totalPointsAwarded);
    }

    // Get all available action types and their point values
    function getActionTypes() external view returns (string[] memory, uint256[] memory) {
        string[] memory actions = new string[](5);
        uint256[] memory points = new uint256[](5);

        actions[0] = "Recycle Plastic";
        actions[1] = "Reusable Cup";
        actions[2] = "Carpool";
        actions[3] = "Plant Tree";
        actions[4] = "Solar Energy";

        points[0] = actionPointValues["Recycle Plastic"];
        points[1] = actionPointValues["Reusable Cup"];
        points[2] = actionPointValues["Carpool"];
        points[3] = actionPointValues["Plant Tree"];
        points[4] = actionPointValues["Solar Energy"];

        return (actions, points);
    }

    // Owner functions
    function updateActionPointValue(string memory _actionType, uint256 _points) external onlyOwner {
        actionPointValues[_actionType] = _points;
    }

    function addActionType(string memory _actionType, uint256 _points) external onlyOwner {
        actionPointValues[_actionType] = _points;
    }

    // Emergency functions
    function withdraw() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
}
