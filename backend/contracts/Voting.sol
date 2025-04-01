// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Voting {
    address immutable owner;
    struct Election {
        uint electionId;
        string electionName;
        bool isActive;
        uint startTime;
        uint endTime;
        uint totalCandidates;
        uint totalVoters;
        uint totalVotes;
        uint winnerId;
        bool isCompleted;
    }
    struct Candidate {
        uint candidateId;
        address candidateAddress;
        string candidateName;
        uint electionId;
        uint voteCount;
    }
    struct Voter {
        uint voterId;
        string voterName;
        address voterAddress;
        uint electionId;
        uint candidateId;
        bool isVoted;
    }
    mapping(uint => Election) public elections;
    mapping(uint => mapping(uint => Candidate)) public candidates;
    mapping(uint => mapping(address => bool)) public isCandidateRegistered;
    mapping(uint => mapping(address => Voter)) public voters;
    uint electionCount;

    // uint candidateCount;
    // uint voterCount;
    constructor() {
        owner = msg.sender;
    }

    modifier onlyAdmin() {
        require(owner == msg.sender, "only admin");
        _;
    }
    modifier isValidString(string memory _string) {
        require(bytes(_string).length > 0, "Invalid");
        _;
    }
    modifier isValidNumber(uint _number) {
        require(_number > 0, "Invalid");
        _;
    }
    modifier isValidAddress(address _address) {
        require(_address != address(0), "Invalid");
        _;
    }

    function getBlockTimestamp() public view returns (uint) {
        return block.timestamp;
    }

    function createElection(
        string memory _electionName,
        uint _startTime,
        uint _endTime
    ) public onlyAdmin isValidString(_electionName) returns (uint) {
        require(block.timestamp <= _endTime, "Invalid end time!");
        // require(elections[_electionId]._electionName != _electionName);
        require(_startTime <= _endTime, "Start time must be before end time");
        elections[electionCount] = Election({
            electionId: electionCount,
            electionName: _electionName,
            isActive: false,
            startTime: _startTime,
            endTime: _endTime,
            totalCandidates: 0,
            totalVoters: 0,
            totalVotes: 0,
            winnerId: 0,
            isCompleted: false
        });
        electionCount++;
        return electionCount;
    }

    function addCandidate(
        uint _electionId,
        string memory _candidateName,
        address _candidateAddress
    )
        public
        onlyAdmin
        isValidString(_candidateName)
        isValidAddress(_candidateAddress)
        returns (uint)
    {
        require(_electionId < electionCount, "Invalid Election Id");
        require(
            !isCandidateRegistered[_electionId][_candidateAddress],
            "Candidate Already added!"
        );
        uint candidateCount = elections[_electionId].totalCandidates++;
        candidates[_electionId][candidateCount] = Candidate({
            candidateId: candidateCount,
            candidateAddress: _candidateAddress,
            candidateName: _candidateName,
            electionId: _electionId,
            voteCount: 0
        });
        isCandidateRegistered[_electionId][_candidateAddress] = true;
        return candidateCount;
    }

    function getElection(
        uint _electionId
    )
        public
        view
        returns (
            uint electionId,
            string memory electionName,
            bool isActive,
            uint startTime,
            uint endTime,
            uint totalCandidates,
            uint totalVoters,
            uint totalVotes,
            uint winnerId,
            bool isCompleted
        )
    {
        require(_electionId < electionCount, "Invalid election id!");
        Election memory election = elections[_electionId];
        return (
            election.electionId,
            election.electionName,
            election.isActive,
            election.startTime,
            election.endTime,
            election.totalCandidates,
            election.totalVoters,
            election.totalVotes,
            election.winnerId,
            election.isCompleted
        );
    }

    function getCandidate(
        uint _electionId,
        uint _candidateId
    )
        public
        view
        returns (
            uint candidateId,
            address candidateAddress,
            string memory candidateName,
            uint electionId,
            uint voteCount
        )
    {
        uint candidateCount = elections[_electionId].totalCandidates;
        require(_electionId < electionCount, "Invalid candidate id!");
        require(_candidateId <= candidateCount, "Invalid candidate id!");
        Candidate memory candidate = candidates[_electionId][_candidateId];
        return (
            candidate.candidateId,
            candidate.candidateAddress,
            candidate.candidateName,
            candidate.electionId,
            candidate.voteCount
        );
    }

    function getAllCandidates(
        uint _electionId
    )
        public
        view
        returns (
            uint[] memory,
            string[] memory,
            address[] memory,
            uint[] memory
        )
    {
        require(_electionId < electionCount, "Invalid election id!");
        uint candidateCount = elections[_electionId].totalCandidates;
        uint[] memory candidateId = new uint[](candidateCount);
        address[] memory candidateAddress = new address[](candidateCount);
        string[] memory candidateName = new string[](candidateCount);
        uint[] memory voteCount = new uint[](candidateCount);
        for (uint i = 0; i < candidateCount; i++) {
            candidateId[i] = candidates[_electionId][i].candidateId;
            candidateAddress[i] = candidates[_electionId][i].candidateAddress;
            candidateName[i] = candidates[_electionId][i].candidateName;
            voteCount[i] = candidates[_electionId][i].voteCount;
        }
        return (candidateId, candidateName, candidateAddress, voteCount);
    }

    function castVote(
        string memory _voterName,
        uint _electionId,
        uint _candidateId
    ) public isValidString(_voterName) returns (uint voterId) {
        uint candidateCount = elections[_electionId].totalCandidates;
        uint voterCount = elections[_electionId].totalVoters++;
        require(_electionId < electionCount, "Invalid election id");
        require(_candidateId < candidateCount, "invalid candidate id");
        uint newVoterId = voterCount;
        require(
            !voters[_electionId][msg.sender].isVoted,
            "you already voted for this election!)"
        );
        require(elections[_electionId].isActive, "election is not active!");
        require(
            elections[_electionId].startTime <= block.timestamp &&
                elections[_electionId].endTime >= block.timestamp,
            "Invalid time for voting"
        );
        require(
            candidates[_electionId][_candidateId].electionId == _electionId,
            "Invalid Candidate Id"
        );
        voters[_electionId][msg.sender] = Voter({
            voterId: newVoterId,
            voterName: _voterName,
            voterAddress: msg.sender,
            electionId: _electionId,
            candidateId: _candidateId,
            isVoted: true
        });
        elections[_electionId].totalVotes++;
        candidates[_electionId][_candidateId].voteCount++;
        return newVoterId;
    }

    function getVoter(
        uint _electionId,
        address _voterAddress
    )
        public
        view
        isValidNumber(_electionId)
        returns (
            uint voterId,
            string memory voterName,
            address voterAddress,
            uint electionId,
            uint candidateId,
            bool isVoted
        )
    {
        require(_electionId < electionCount, "Invalid election Id");
        if (_voterAddress == address(0)) _voterAddress = msg.sender;
        Voter memory voter = voters[_electionId][_voterAddress];
        return (
            voter.voterId,
            voter.voterName,
            voter.voterAddress,
            voter.electionId,
            voter.candidateId,
            voter.isVoted
        );
    }

    function activeElection(
        uint _electionId
    ) public onlyAdmin returns (string memory) {
        require(_electionId < electionCount, "Invalid Election Id");
        require(
            !elections[_electionId].isCompleted,
            "election is already completed!"
        );
        require(
            !elections[_electionId].isActive,
            "election is already active!"
        );
        elections[_electionId].isActive = true;
        return "Election is Active";
    }

    function deactiveElection(
        uint _electionId
    ) public onlyAdmin returns (string memory) {
        require(_electionId <= electionCount, "Invalid Election Id");
        require(
            elections[_electionId].isActive,
            "election is already deactive!"
        );
        elections[_electionId].isActive = false;
        return "Election is Deactive";
    }

    function completeElection(
        uint _electionId
    ) public onlyAdmin returns (string memory) {
        require(_electionId <= electionCount, "Invalid Election Id");
        require(
            !elections[_electionId].isActive,
            "election is already active!"
        );
        require(
            !elections[_electionId].isCompleted,
            "election is already completed!"
        );
        elections[_electionId].isCompleted = true;
        return "Election is Completed";
    }

    function getWinner(uint _electionId) public onlyAdmin returns (uint, uint) {
        require(_electionId < electionCount, "Invalid Election Id");
        require(
            elections[_electionId].isCompleted,
            "election is not completed yet"
        );
        require(
            !elections[_electionId].isActive,
            "election is already active!"
        );
        uint candidateCount = elections[_electionId].totalCandidates;
        uint maxVote;
        uint winnerId;
        for (uint i = 0; i < candidateCount; i++) {
            if (candidates[_electionId][i].electionId == _electionId) {
                if (maxVote < candidates[_electionId][i].voteCount) {
                    maxVote = candidates[_electionId][i].voteCount;
                    winnerId = i;
                }
            }
        }
        elections[_electionId].winnerId = winnerId;
        return (maxVote, winnerId);
    }
}
