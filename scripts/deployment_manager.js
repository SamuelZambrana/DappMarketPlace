
const ERC20DeployScript = require("./ERC20.deploy")
const ERC721DeployScript = require("./ERC721.deploy")
const MarketPlaceDeployScript = require("./MarketPlace.deploy")

const main = async () => {
    await ERC20DeployScript.deploy()
    //Funcion Hererada que tiene en comun todos los deployer heredados  que devuelve el contractAdress
    let ERC20ContractAddress = await ERC20DeployScript.getContractAddress()
    await ERC721DeployScript.deploy()
    //Funcion Hererada que tiene en comun todos los deployer heredados  que devuelve el contractAdress
    let ERC721ContractAddress = await ERC721DeployScript.getContractAddress()
    await MarketPlaceDeployScript.deploy(ERC20ContractAddress, ERC721ContractAddress)
}

main()
