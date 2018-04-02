pragma solidity ^0.4.2;

contract ETHtalks {
    event BidEvent(string _name);
    
    struct Record {
        string name;
        string link;
        uint value;
    }

    Record[] public records;
    string[] public records2;

    function bid(string _name, string _link) public payable {
        require(msg.value >= 0.001 ether);
        records.push(Record(_name, _link, msg.value));

        BidEvent(_name);
    }

    function getCount() public view returns (uint) {
        return records.length;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}