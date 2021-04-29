const token = artifacts.require("erc721");

module.exports = function(deployer) {
  deployer.deploy(token);
};
