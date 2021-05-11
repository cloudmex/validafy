// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity <0.9.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Valid is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct documentData {
        string hash;
        uint256 tokenid;
    }

    constructor() public ERC721("VALID", "VLD") {}

    function createItem(address owner, string memory tokenURI)
        public
        returns (uint256)
    {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        _mint(owner, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
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
        //arreglo con los documentos
        documentData[] memory dochashes = new documentData[](nTokens);
        for (uint256 i = 0; i < nTokens; i++) {
            dochashes[i].hash = tokenURI(tokenOfOwnerByIndex(owner, i));
            dochashes[i].tokenid = tokenOfOwnerByIndex(owner, i);
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

    function uint2str(uint256 _i)
        internal
        pure
        returns (string memory _uintAsString)
    {
        if (_i == 0) {
            return "0";
        }
        uint256 j = _i;
        uint256 len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint256 k = len - 1;
        while (_i != 0) {
            bstr[k--] = bytes1(uint8(48 + (_i % 10)));
            _i /= 10;
        }
        return string(bstr);
    }
}
