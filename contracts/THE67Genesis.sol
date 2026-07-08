// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { ERC721A } from "erc721a/ERC721A.sol";
import { IERC721A } from "erc721a/IERC721A.sol";
import { ERC721AQueryable } from "erc721a/extensions/ERC721AQueryable.sol";
import { Ownable } from "@openzeppelin/contracts/access/Ownable.sol";
import { Pausable } from "@openzeppelin/contracts/utils/Pausable.sol";
import { ReentrancyGuard } from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import { ERC2981 } from "@openzeppelin/contracts/token/common/ERC2981.sol";
import { Strings } from "@openzeppelin/contracts/utils/Strings.sol";

/// @title THE67Genesis
/// @notice Production ERC721A collection for THE67 Genesis Citizens on Base.
/// @dev Non-upgradeable. Public supply is capped at 63; creator reserve is capped at 4.
contract THE67Genesis is ERC721AQueryable, ERC2981, Ownable, Pausable, ReentrancyGuard {
    using Strings for uint256;

    // -------------------------------------------------------------------------
    // Constants
    // -------------------------------------------------------------------------

    /// @notice Maximum total collection supply.
    uint256 public constant MAX_SUPPLY = 67;

    /// @notice Maximum NFTs available to the public mint.
    uint256 public constant PUBLIC_SUPPLY = 63;

    /// @notice Maximum NFTs reserved for the creator.
    uint256 public constant CREATOR_RESERVE = 4;

    /// @notice Public mint price in wei (0.0067 ETH).
    uint256 public constant MINT_PRICE = 0.0067 ether;

    /// @notice Maximum NFTs any wallet may mint during the public sale.
    uint256 public constant MAX_PER_WALLET = 1;

    /// @notice Maximum NFTs per public mint transaction.
    uint256 public constant MAX_PER_TRANSACTION = 1;

    /// @notice Default royalty in basis points (5%).
    uint96 public constant DEFAULT_ROYALTY_BPS = 500;

    // -------------------------------------------------------------------------
    // Storage
    // -------------------------------------------------------------------------

    /// @notice Unix timestamp when the public mint opens. Zero means unset.
    uint256 public mintStartTime;

    /// @notice Unix timestamp when the public mint closes. Zero means unset.
    uint256 public mintEndTime;

    /// @notice Number of NFTs minted through the creator reserve.
    uint256 public reservedMinted;

    /// @notice Whether token metadata has been revealed.
    bool public revealed;

    /// @notice Base URI used after reveal. Must end with a trailing slash.
    string private _baseTokenURI;

    /// @notice Metadata URI returned for all tokens before reveal.
    string private _hiddenURI;

    /// @notice OpenSea-compatible collection-level metadata URI.
    string private _contractURI;

    /// @notice Tracks how many NFTs each wallet has minted in the public sale.
    mapping(address => uint256) public mintedByWallet;

    // -------------------------------------------------------------------------
    // Events
    // -------------------------------------------------------------------------

    event MintStartTimeUpdated(uint256 startTime);
    event MintEndTimeUpdated(uint256 endTime);
    event BaseURIUpdated(string baseURI);
    event HiddenURIUpdated(string hiddenURI);
    event ContractURIUpdated(string contractURI);
    event CollectionRevealed();
    event Withdrawn(address indexed to, uint256 amount);
    event ReservedMint(address indexed to, uint256 quantity);

    // -------------------------------------------------------------------------
    // Errors
    // -------------------------------------------------------------------------

    error MintClosed();
    error IncorrectPayment();
    error ExceedsWalletLimit();
    error ExceedsTransactionLimit();
    error PublicSupplyExhausted();
    error ExceedsCreatorReserve();
    error ExceedsMaxSupply();
    error InvalidAddress();
    error InvalidMintWindow();
    error NothingToWithdraw();
    error WithdrawFailed();
    error ZeroQuantity();

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    /// @notice Deploys the collection with mint closed by default.
    /// @param initialOwner Address that receives Ownable control.
    /// @param royaltyReceiver Default ERC2981 royalty receiver.
    /// @param hiddenURI_ Hidden metadata URI used before reveal.
    /// @param contractURI_ Collection metadata URI for marketplaces.
    constructor(
        address initialOwner,
        address royaltyReceiver,
        string memory hiddenURI_,
        string memory contractURI_
    ) ERC721A("THE67 Genesis Citizens", "THE67") Ownable(initialOwner) {
        if (initialOwner == address(0)) revert InvalidAddress();
        if (royaltyReceiver == address(0)) revert InvalidAddress();

        _hiddenURI = hiddenURI_;
        _contractURI = contractURI_;
        _setDefaultRoyalty(royaltyReceiver, DEFAULT_ROYALTY_BPS);
    }

    // -------------------------------------------------------------------------
    // Public mint
    // -------------------------------------------------------------------------

    /// @notice Mints one Genesis Citizen to the caller during the public sale.
    function mint() external payable whenNotPaused nonReentrant {
        uint256 quantity = 1;

        if (!mintIsOpen()) revert MintClosed();
        if (msg.value != MINT_PRICE * quantity) revert IncorrectPayment();
        if (quantity > MAX_PER_TRANSACTION) revert ExceedsTransactionLimit();
        if (mintedByWallet[msg.sender] + quantity > MAX_PER_WALLET) {
            revert ExceedsWalletLimit();
        }
        if (_publicMinted() + quantity > PUBLIC_SUPPLY) revert PublicSupplyExhausted();
        if (_totalMinted() + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        mintedByWallet[msg.sender] += quantity;
        _safeMint(msg.sender, quantity);
    }

    // -------------------------------------------------------------------------
    // Owner
    // -------------------------------------------------------------------------

    /// @notice Pauses the public mint.
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpauses the public mint.
    function unpause() external onlyOwner {
        _unpause();
    }

    /// @notice Mints from the creator reserve. Never exceeds 4 reserved NFTs.
    /// @param to Recipient of the reserved NFTs.
    /// @param quantity Number of NFTs to reserve mint.
    function reserveMint(address to, uint256 quantity) external onlyOwner nonReentrant {
        if (to == address(0)) revert InvalidAddress();
        if (quantity == 0) revert ZeroQuantity();
        if (reservedMinted + quantity > CREATOR_RESERVE) revert ExceedsCreatorReserve();
        if (_totalMinted() + quantity > MAX_SUPPLY) revert ExceedsMaxSupply();

        reservedMinted += quantity;
        _safeMint(to, quantity);

        emit ReservedMint(to, quantity);
    }

    /// @notice Withdraws the entire contract ETH balance to the owner.
    function withdraw() external onlyOwner nonReentrant {
        uint256 balance = address(this).balance;
        if (balance == 0) revert NothingToWithdraw();

        address recipient = owner();
        (bool success,) = payable(recipient).call{ value: balance }("");
        if (!success) revert WithdrawFailed();

        emit Withdrawn(recipient, balance);
    }

    /// @notice Sets the revealed base URI. Should end with a trailing slash.
    function setBaseURI(string calldata baseURI_) external onlyOwner {
        _baseTokenURI = baseURI_;
        emit BaseURIUpdated(baseURI_);
    }

    /// @notice Sets the hidden metadata URI used before reveal.
    function setHiddenURI(string calldata hiddenURI_) external onlyOwner {
        _hiddenURI = hiddenURI_;
        emit HiddenURIUpdated(hiddenURI_);
    }

    /// @notice Reveals the collection metadata.
    function reveal() external onlyOwner {
        revealed = true;
        emit CollectionRevealed();
    }

    /// @notice Sets the public mint start timestamp.
    function setMintStartTime(uint256 startTime_) external onlyOwner {
        if (mintEndTime != 0 && startTime_ >= mintEndTime) revert InvalidMintWindow();
        mintStartTime = startTime_;
        emit MintStartTimeUpdated(startTime_);
    }

    /// @notice Sets the public mint end timestamp.
    function setMintEndTime(uint256 endTime_) external onlyOwner {
        if (mintStartTime != 0 && endTime_ <= mintStartTime) revert InvalidMintWindow();
        mintEndTime = endTime_;
        emit MintEndTimeUpdated(endTime_);
    }

    /// @notice Updates the collection-level metadata URI.
    function setContractURI(string calldata contractURI_) external onlyOwner {
        _contractURI = contractURI_;
        emit ContractURIUpdated(contractURI_);
    }

    // -------------------------------------------------------------------------
    // Views
    // -------------------------------------------------------------------------

    /// @notice Returns whether the public mint is currently open.
    function mintIsOpen() public view returns (bool) {
        if (paused()) return false;
        if (mintStartTime == 0 || mintEndTime == 0) return false;
        if (block.timestamp < mintStartTime || block.timestamp > mintEndTime) return false;
        if (_publicMinted() >= PUBLIC_SUPPLY) return false;
        return true;
    }

    /// @notice Returns the remaining total supply.
    function remainingSupply() external view returns (uint256) {
        return MAX_SUPPLY - _totalMinted();
    }

    /// @notice Returns the remaining public supply.
    function publicRemaining() external view returns (uint256) {
        uint256 publicMinted = _publicMinted();
        if (publicMinted >= PUBLIC_SUPPLY) return 0;
        return PUBLIC_SUPPLY - publicMinted;
    }

    /// @notice Returns the OpenSea collection metadata URI.
    function contractURI() external view returns (string memory) {
        return _contractURI;
    }

    /// @notice Returns token metadata, hidden or revealed.
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721A, IERC721A)
        returns (string memory)
    {
        if (!_exists(tokenId)) revert URIQueryForNonexistentToken();
        if (!revealed) return _hiddenURI;
        return string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    /// @inheritdoc ERC721A
    function _startTokenId() internal view virtual override returns (uint256) {
        return 1;
    }

    /// @notice Number of tokens minted through the public sale.
    function _publicMinted() internal view returns (uint256) {
        return _totalMinted() - reservedMinted;
    }

    /// @inheritdoc ERC721A
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /// @inheritdoc ERC721A
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721A, IERC721A, ERC2981)
        returns (bool)
    {
        return ERC721A.supportsInterface(interfaceId) || ERC2981.supportsInterface(interfaceId);
    }
}
