
const ERC20DeployScript = require("./ERC20.deploy")
const MarketPlaceDeployScript = require("./MarketPlace.deploy")

const main = async () => {
    await ERC20DeployScript.deploy()
    await MarketPlaceDeployScript.deploy()
}

main()
