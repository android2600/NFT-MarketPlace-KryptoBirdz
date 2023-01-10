//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC165.sol';
import './interfaces/IERC721.sol';

contract ERC721 is ERC165,IERC721{
    
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId);
    
    event Approvals(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId);
    
    mapping(uint256 => address) private _tokenOwner;
    mapping(address => uint256) private _OwnedTokensCount;
    mapping(uint256=>address) private _tokenApprovals;


    constructor(){
        _registerInterface(bytes4(keccak256('balanceOf(byte4)')^keccak256('ownerOf(byte4)')^keccak256('transferFrom(byte4)')^keccak256('approve(byte4)')));
    }

    function _exists(uint256 tokenId) internal view returns(bool){
        address owner=_tokenOwner[tokenId];
        return owner!=address(0);
    }

    function balanceOf(address _owner) public override view returns(uint256){
        require(_owner != address(0),'owner address cannot be zero address');
        return _OwnedTokensCount[_owner];
    }

    function ownerOf(uint256 _tokenId) public override view returns (address){
        address owner= _tokenOwner[_tokenId];
        require(owner != address(0),'NFT Token not yet minted');
        return owner;
    }

    function _mint(address to,uint256 tokenId) internal virtual{
        require(to!= address(0),'ERC721: minting to zero address');
        require(!_exists(tokenId),'ERC721 token already exists');
        _tokenOwner[tokenId]=to;
        _OwnedTokensCount[to]+=1; 

        emit Transfer(address(0), to, tokenId);
    }
    function _transferFrom(address _from,address _to, uint256 tokenId) internal{
        require(_to!=address(0),'receiver address is zero address');
        require(ownerOf(tokenId)==_from,'sender does not owns the token');
        _tokenOwner[tokenId]=_to;
        _OwnedTokensCount[_from]-=1;
        _OwnedTokensCount[_to]+=1;
        emit Transfer(_from, _to, tokenId);
    }

    function transferFrom(address _from,address _to, uint256 tokenId) override public{
        require(isApprovedOrOwner(msg.sender, tokenId)); 
        _transferFrom(_from, _to, tokenId);
    }

    function approve(address _to,uint256 tokenId) override public{
        address owner=ownerOf(tokenId);
        require(owner == msg.sender,'current caller is not the owner of the token');
        require(owner!=_to,'Approval to current owner');
        _tokenApprovals[tokenId]=_to;
        emit Approvals(owner, _to, tokenId);
    }

    function isApprovedOrOwner(address spender, uint256 tokenId) internal view returns(bool){
        require(_exists(tokenId),'Token does not exist');
        address owner =ownerOf(tokenId);
        return (spender==owner); //|| getApproved(tokenId)==spender);
    }

}