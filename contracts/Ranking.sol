pragma solidity ^0.4.19;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";

contract Ranking is Ownable {

    event CreateEvent(uint recordId, uint bid, string name, string link);
    event SupportEvent(uint recordId, uint bid);
    event UpdateEvent(uint recordId, uint bid, string name, string link);
    
    struct Record {
        uint bid;
        string name;
        string link;
    }

    Record[] public records;

    mapping (uint => address) public recordToOwner;
    // mapping (address => uint) public ownerRecordCount;

    modifier onlyOwnerOf(uint _recordId) {
        require(msg.sender == recordToOwner[_recordId]);
        _;
    }

    function withdraw() external onlyOwner {
        owner.transfer(this.balance);
    }

    function getBalance() external view returns (uint) {
        return this.balance;
    }

    function getRecordCount() external view returns (uint) {
        return records.length;
    }

    function createRecord (string _name, string _link) external payable {
        require(msg.value >= 0.0001 ether);
        uint recordId = records.push(Record(msg.value, _name, _link)) - 1;
        recordToOwner[recordId] = msg.sender;
        CreateEvent(recordId, msg.value, _name, _link);
    }

    function supportRecord(uint _recordId) external payable {
        require(msg.value >= 0.0001 ether);
        records[_recordId].bid += msg.value;
        SupportEvent (_recordId, records[_recordId].bid);
    }

    function updateRecord(uint _recordId, string _name, string _link) external payable onlyOwnerOf(_recordId)  {
        uint bid = records[_recordId].bid;
        require(msg.value >= bid + 0.0001 ether);
        records[_recordId] = Record(bid + msg.value, _name, _link);
        UpdateEvent (_recordId, msg.value, _name, _link);
    }
}
