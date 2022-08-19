// SPDX-License-Identifier: unlicense
pragma solidity ^0.8.0;

contract Whitelist {
  
  uint public maxUsersWhitelist;

  mapping(address => bool) public whitelistedAddresses;

  uint public numAddressesWhitelisted;

  constructor(uint _maxUsersWhitelist){
    maxUsersWhitelist = _maxUsersWhitelist;
  }

  function addAddressToWhitelist() public {
    require(numAddressesWhitelisted < maxUsersWhitelist, "Whitelist fullfiled");
    require(!whitelistedAddresses[msg.sender],"User has already been whitelisted");
    whitelistedAddresses[msg.sender] = true;
    numAddressesWhitelisted += 1;
  }

}
