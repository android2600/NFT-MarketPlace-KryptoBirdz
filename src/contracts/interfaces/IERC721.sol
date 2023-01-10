//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC721{
    function ownerOf(uint256 _tokenId) external returns(address);
    function approve(address _approved,uint256 tokenId) external;
    function transferFrom(address _from,address _to, uint256 tokenId) external;
    function balanceOf(address _owner) external returns(uint256);
}