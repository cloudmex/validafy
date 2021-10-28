// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity  >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Valid is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address payable public ownerbalance;
   
    mapping(uint => Metadata) public metadata;
    
    struct Metadata {
        string hash;
        uint _date;
        address _owner;
        bytes32 _blockhash;
        string _fileName;
        string _explorerUrl;
        uint _blocknumber;
    }


    function createItem(string calldata tokenURI, string calldata fileName, string calldata explorerUrl) external payable {
        _tokenIds.increment();
        _mint(msg.sender, _tokenIds.current());
        _setTokenURI(_tokenIds.current(), tokenURI);
        metadata[_tokenIds.current()] = Metadata(
            tokenURI, //hash
            block.timestamp, // time
            msg.sender, // owner // redesplegar para coregir la propiedad del token
            // blockhash(0), 
            fileName, 
            explorerUrl, 
            block.number
            );
    }

    struct documentData {
        string hash;
        uint256 tokenid;
        uint _date;
        address _owner;
        bytes32 _blockhash;
        string _fileName;
        string _explorerUrl;
        uint _blocknumber;
    }

    modifier onlyOwner() {
        require(msg.sender == ownerbalance);
        _;
    }

    constructor() public ERC721("VALID", "VLD") {
        ownerbalance = msg.sender;
    }

    function smbalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public onlyOwner() {
        ownerbalance.transfer(address(this).balance);
    }

    function IsHashed(string memory ipfshash)
        public
        view
        returns (bool hashed)
    {
        //obtener cuantos tokens tiene el sm
        uint256 nTokens = totalSupply();
        if (nTokens == 0) {
            return false;
        }
        bool exist = false;
        //buscar si existe ese hash
        for (uint256 i = 0; i < nTokens; i++) {
            if (
                keccak256(abi.encodePacked((ipfshash))) ==
                keccak256(abi.encodePacked(tokenURI(tokenByIndex(i))))
            ) {
                exist = true;
                break;
            }
        }
        return (exist);
    }

    function documentsOF(address owner)
        public
        view
        returns (documentData[] memory documents)
    {
        //revisar que no sea el address para quemar tokens
        require(owner != address(0), "Address incorrecto");
        //numero de tokens
        uint256 nTokens = balanceOf(owner);
        if (nTokens == 0) {
            return (new documentData[](nTokens));
        }
        //arreglo con los documentos 2
        documentData[] memory dochashes = new documentData[](nTokens);
        for (uint256 i = 0; i < nTokens; i++) {
            dochashes[i].hash = tokenURI(tokenOfOwnerByIndex(owner, i));
            dochashes[i].tokenid = tokenOfOwnerByIndex(owner, i);

            dochashes[i]._date = metadata[dochashes[i].tokenid]._date;
            dochashes[i]._owner = metadata[dochashes[i].tokenid]._owner;
            dochashes[i]._fileName = metadata[dochashes[i].tokenid]._fileName;
            dochashes[i]._explorerUrl = metadata[dochashes[i].tokenid]._explorerUrl;
            dochashes[i]._blockhash = metadata[dochashes[i].tokenid]._blockhash;
            dochashes[i]._blocknumber = metadata[dochashes[i].tokenid]._blocknumber;
        }
        return (dochashes);
    }

    

    function getAllHashes() public view returns (string[] memory tokens) {
        //obtener cuantos tokens tiene el sm
        uint256 nTokens = totalSupply();
        if (nTokens == 0) {
            return new string[](nTokens);
        }
        //arreglo con los documentos
        string[] memory dochashes = new string[](nTokens);
        for (uint256 i = 0; i < nTokens; i++) {
            dochashes[i] = tokenURI(tokenByIndex(i));
        }
        return (dochashes);
    }

    function tokensOf(address owner)
        public
        view
        returns (uint256[] memory tokens, bool success)
    {
        //revisar que no sea el address para quemar tokens
        require(owner != address(0), "Address incorrecto");
        //numero de tokens
        uint256 nTokens = balanceOf(owner);
        if (nTokens == 0) {
            return (new uint256[](nTokens), false);
        }
        //require(nTokens != 0, "no cuentas con tokens");
        //arreglo de tokens
        uint256[] memory tokensOfowner = new uint256[](nTokens);
        //hacer el arreglo de tokens del owner
        for (uint256 i = 0; i < nTokens; i++) {
            tokensOfowner[i] = tokenOfOwnerByIndex(owner, i);
        }
        return (tokensOfowner, true);
    }
}
