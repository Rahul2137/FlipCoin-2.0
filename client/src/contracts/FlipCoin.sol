pragma solidity ^0.5.0;
pragma experimental ABIEncoderV2;

contract FlipCoin {
    string  public name = "FlipCoin";
    address private owner;
    string  public symbol = "FlipCoin";
    uint256 public totalSupply = 10000000000; // 1 million tokens
    uint8   public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    event CoinsMinted(
        uint256 _value
    );

    struct Transaction {
        uint256 transaction;
        address otherParty;
        uint256 amount;
        uint256 timestamp;
    }

    mapping(address => uint256) public balanceOf;
    mapping(address => uint256) public spendingsOf;
    mapping(address => mapping(address => uint256)) public allowance;
    mapping(address => Transaction[]) public userTransactions;

    constructor() public {
        balanceOf[owner] = 100000000;
        owner = msg.sender;
    }

    modifier onlyBy(address _account) {
      require(
         msg.sender == _account,
         "Sender not authorized."
      );
      _;
   }

    function mintCoins(uint256 _value) public onlyBy(owner) returns (bool success) {
        balanceOf[owner] += _value;
        emit CoinsMinted(_value);
        return true;
    }

    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        spendingsOf[msg.sender] += _value;
        balanceOf[_to] += _value;
        userTransactions[_to].push(Transaction({
            transaction: 1,
            otherParty: msg.sender,
            amount: _value,
            timestamp: block.timestamp
        }));
        userTransactions[msg.sender].push(Transaction({
            transaction: 0,
            otherParty: _to,
            amount: _value,
            timestamp: block.timestamp
        }));
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender, _spender, _value);
        return true;
    }

    function getBalance(address _user) public view returns (uint256 balance) {
        return balanceOf[_user];
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        require(_value <= balanceOf[_from]);
        // require(_value <= allowance[_from][msg.sender]);
        balanceOf[_from] -= _value;
        spendingsOf[_from] += _value;
        balanceOf[_to] += _value;
        userTransactions[_from].push(Transaction({
            transaction: 0,
            otherParty: _to,
            amount: _value,
            timestamp: block.timestamp
        }));
        userTransactions[_to].push(Transaction({
            transaction: 1,
            otherParty: _from,
            amount: _value,
            timestamp: block.timestamp
        }));
        emit Transfer(_from, _to, _value);
        return true;
    }

    function getSpendings(address _user) public view returns (uint spendings){
        return spendingsOf[_user];
    }

    function getTransactions() public view returns (Transaction[] memory){
        return userTransactions[msg.sender];
    }
}