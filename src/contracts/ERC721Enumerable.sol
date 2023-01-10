//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721.sol';
import './interfaces/IERC721Enumerable.sol';

contract ERC721Enumerable is  IERC721Enumerable, ERC721{
    
    constructor(){
        _registerInterface(bytes4(keccak256('totalSupply(byte4)')^keccak256('tokenByIndex(byte4)')^keccak256('tokenOwnerByIndex(byte4)')));
    }

    uint256[] private _allTokens;
    
    mapping (uint256=>uint256) private _allTokenIndex;
    mapping (address => uint256[]) private _ownedTokens;
    mapping (uint256 => uint256) private _ownedTokensIndex;

    function _mint(address to, uint256 tokenId) internal override(ERC721){
        super._mint(to,tokenId);
        _addTokensToAllTokenEnumeration(tokenId);
        _addTokensToAllOwnerEnumeration(to, tokenId);
    }

    function _addTokensToAllTokenEnumeration(uint256 tokenId) private {
        _allTokenIndex[tokenId]=_allTokens.length;
        _allTokens.push(tokenId);
    }
    
    function _addTokensToAllOwnerEnumeration(address to,uint256 tokenId) private{
        _ownedTokensIndex[tokenId]=_ownedTokens[to].length;
        _ownedTokens[to].push(tokenId);
    }

    function tokenByIndex(uint256 index) public override view returns(uint256){
        require (index<totalSupply(),'global index is out of bound');
        return _allTokens[index];
    }
    function tokenOfOwnerByIndex(address owner,uint256 index) public override view  returns(uint256){
        require(index<balanceOf(owner),'owner index out of bound');
        return _ownedTokens[owner][index];
    }

    function totalSupply() public override view returns(uint256){
        return _allTokens.length;
    }

}