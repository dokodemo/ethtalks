pragma solidity ^0.4.2;

contract ETHtalks {    
    struct Record {
        string name;
        string link;
        uint value;
    }

    Record[] public records;

    function bid(string _name, string _link) public payable {
        require(msg.value >= 0.001 ether);
        records.push(Record(_name, _link, msg.value));
    }

    function contains(int[] array, int value) internal pure returns(bool) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return true;
            }
        }
        return false;
    }

    function getTop(uint top) public view returns (int[]) {
        int[] memory ret = new int[](top);
        for (uint i = 0; i < top; i++) {
            ret[i] = -1;
        }

        uint counter = 0;

        for (uint t = 0; t < top; t++) {
            int maxIndex = -1;
            uint maxValue = 0;
            for (uint j = 0; j < records.length; j++) {
                if (!contains(ret, int(j)) && (records[j].value > maxValue)) {
                    maxValue = records[j].value;
                    maxIndex = int(j);
                }
            }
            ret[counter] = maxIndex;
            counter++;
        }

        return ret;
    }

    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
}