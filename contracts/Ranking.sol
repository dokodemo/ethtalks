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
        owner.transfer(address(this).balance);
    }

    function getBalance() external view returns (uint) {
        return address(this).balance;
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

    //Bubble sort
    function listRecords () external view returns (uint[]) {
        uint[] memory bids = new uint[](records.length);
        uint[] memory recordIds = new uint[](records.length);
        for (uint i = 0; i < records.length; i++) {
            bids[i] = records[records.length-i-1].bid;
            recordIds[i] = records.length-i-1;
        }

        for (uint j = 0; j < bids.length; j++) {
            for (uint k = 0; k < bids.length - j - 1; k++) {
                if (bids[k] < bids[k+1]) {
                    uint tempBid = bids[k+1];
                    bids[k+1] = bids[k];
                    bids[k] = tempBid;

                    uint tempRecordId = recordIds[k+1];
                    recordIds[k+1] = recordIds[k];
                    recordIds[k] = tempRecordId;
                }
            }
        }
        return recordIds;
    }
}
