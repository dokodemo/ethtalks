pragma solidity ^0.4.19;

contract Ranking {
    event CreateEvent(uint id, uint bid, string name, string link);
    event SupportEvent(uint id, uint bid);
    
    struct Record {
        uint bid;
        string name;
        string link;
    }

    address public owner;
    Record[] public records;

    // mapping (uint => address) public recordToOwner;
    // mapping (address => uint) public ownerRecordCount;

    function Ranking() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // modifier onlyOwnerOf(uint _id) {
    //     require(msg.sender == recordToOwner[_id]);
    //     _;
    // }

    function withdraw() external onlyOwner {
        owner.transfer(address(this).balance);
    }

    function updateRecordName(uint _id, string _name) external onlyOwner  {
        records[_id].name = _name;
    }

    function getBalance() external onlyOwner view returns (uint) {
        return address(this).balance;
    }

    function getRecordCount() external view returns (uint) {
        return records.length;
    }

    function createRecord (string _name, string _link) external payable {
        require(msg.value >= 0.0001 ether);
        uint id = records.push(Record(msg.value, _name, _link)) - 1;
        // recordToOwner[id] = msg.sender;
        CreateEvent(id, msg.value, _name, _link);
    }

    function supportRecord(uint _id) external payable {
        require(msg.value >= 0.0001 ether);
        records[_id].bid += msg.value;
        SupportEvent (_id, records[_id].bid);
    }

    function listRecords () external view returns (uint[2][]) {
        uint[2][] memory result = new uint[2][](records.length);
        for (uint i = 0; i < records.length; i++) {
            result[i][0] = i;
            result[i][1] = records[i].bid;
        }
        return result;
    }
}
