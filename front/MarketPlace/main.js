let address, provider, signer, contractRead, contractWrite

const connectMetamask = async () => {
    // A Web3Provider wraps a standard Web3 provider, which is
    // what MetaMask injects as window.ethereum into each page
    provider = new ethers.providers.Web3Provider(window.ethereum)

    // MetaMask requires requesting permission to connect users accounts
    await provider.send("eth_requestAccounts", []);

    // The MetaMask plugin also allows signing transactions to
    // send ether and pay to change state within the blockchain.
    // For this, you need the account signer...
    signer = provider.getSigner()

    address = await signer.getAddress()
    
    console.log(address)
}

const getNativeBalance = async () => {
    console.log("")
    console.log("getNativeBalance")
    console.log("")

    const balance = await provider.getBalance(address)
    const formattedBalance = ethers.utils.formatEther(balance)

    console.log(balance)
    console.log(formattedBalance)
}

const getNetwork = async () => {
    console.log("")
    console.log("getNetwork")
    console.log("")

    const network = await provider.getNetwork();

    console.log(network)
}

//Para crear una instancia de un contrato y poder atacarlo son necesarias tres partes
// 1- Provider/Signer, porque necesitamos una conexion con la blockchain
// 2- Contract Address, porque una referencia de donde atacar en la blockchain
// 3- Contract ABI (Application Binary Interface), porque necesitamos lo que puede hacer el contrato

//Contrato MyCoin
let contractAddressMyCoin = "0x9676B5e8834391151d2a2E05eFB208E5F07dfff1"

import ContractABIMyCoin from "../../artifacts/contracts/ERC20/MyCoin.sol/MyCoin.json" assert {type: "json"}
const ContractInterfaceMyCoin = new ethers.utils.Interface(ContractABIMyCoin.abi)
const ContractABIFormattedMyCoin = ContractInterfaceMyCoin.format(ethers.utils.FormatTypes.full)

const getMyCoinBalance = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractRead = new ethers.Contract(contractAddressMyCoin,ContractABIFormattedMyCoin,provider)
    const balance = await contractRead.getBalance(address)
    console.log(balance)

    const decimals = await contractRead.decimals()
    const formattedBalance = ethers.utils.formatUnits(balance,decimals)

    console.log(formattedBalance)
}

const MyCoinApprove= async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractRead = new ethers.Contract(contractAddressMyCoin,ContractABIFormattedMyCoin,signer)
    //Formateamos para ver su valor por el BigNumber
    const decimals = await contractRead.decimals()
    const amount = ethers.utils.parseUnits("500.0",decimals)
    //Autorizamos a signer para que pueda realizar la transferencia de los tokens
    const approve = await contractRead.approve(address, amount)
    //Esperamos la aprobacion y la mostramos por consola
    await approve.wait()
    console.log(approve)
    alert("Aprobacion MYC Realizada Correctamente")
}

//Contrato MyNFTCollection
let contractAddressMyNFTCollection = "0x940BF96f16a1CDffc0Ab8c6d94850986F285BB73"

import ContractABIMyNFTCollection from "../../artifacts/contracts/ERC721/MyNFTCollection.sol/MyNFTCollection.json" assert {type: "json"}
const ContractInterfaceMyNFTCollection = new ethers.utils.Interface(ContractABIMyNFTCollection.abi)
const ContractABIFormattedMyNFTCollection = ContractInterfaceMyNFTCollection.format(ethers.utils.FormatTypes.full)

const mintNewTokenMyNFTCollection = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddressMyNFTCollection,ContractABIFormattedMyNFTCollection,signer)
    //Formateamos para ver su valor por el BigNumber
    const amount = ethers.utils.parseUnits("1",1)
    //Minteamos el TokenId
    const mint = await contractWrite.mintNewToken()
    //Mostramos por consola el resultado
    await mint.wait()
    console.log(mint)
    alert("Se minteo en tokenId correctamente")
}

const MyNFTCollectionApprove = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractRead = new ethers.Contract(contractAddressMyNFTCollection,ContractABIFormattedMyNFTCollection,signer)
    //Autorizamos a signer para que pueda realizar la transferencia de los tokens
    const approve = await contractRead.approve(contractAddressMarketPlace, 1)
    //Esperamos la aprobacion y la mostramos por consola
    await approve.wait()
    console.log(approve)
    alert("Aprobacion MyNFTCollection Realizada Correctamente")
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const mintTokenId = document.getElementById("mintTokenId")
mintTokenId.addEventListener("click", async () => {
    await mintNewTokenMyNFTCollection()
})

//Contrato MyMarketplace
let contractAddressMarketPlace = "0x995b0614Cf2f2dD65dbc4E4d8796A6014548566D"

import ContractABIMarketPlace from "../../artifacts/contracts/MarketPlace/MyMarketPlace.sol/MyMarketPlace.json" assert {type: "json"}
const ContractInterfaceMarketPlace = new ethers.utils.Interface(ContractABIMarketPlace.abi)
const ContractABIFormattedMarketPlace = ContractInterfaceMarketPlace.format(ethers.utils.FormatTypes.full)

const createSaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddressMarketPlace,ContractABIFormattedMarketPlace,signer)
    //Creamos la venta
    const sale = await contractWrite.createSale(1, 10)
    //Formateamos para ver su valor por el BigNumber
    const amount = ethers.utils.parseUnits("10", 10)
    //Mostramos por consola el resultado
    await sale.wait()
    console.log(sale)
    alert("Creacion de la venta Realizada Correctamente")
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const createSale = document.getElementById("createSale")
createSale.addEventListener("click", async () => {
    await MyNFTCollectionApprove()
    await createSaleMyMarketPlace()    
})

const buySaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddressMarketPlace,ContractABIFormattedMarketPlace,signer)
    //Compramos la venta
    const sale = await contractWrite.buySale(1)
    //Formateamos para ver su valor por el BigNumber
    const amount = ethers.utils.parseUnits(sale)
    //Mostramos por consola el resultado
    await sale.wait()
    console.log(sale)
    alert("Compra de la venta Realizada Correctamente")
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const buySale = document.getElementById("buySale")
buySale.addEventListener("click", async () => {
    await buySaleMyMarketPlace()
})

const CancelSaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddressMarketPlace,ContractABIFormattedMarketPlace,signer)
    //Compramos la venta
    const sale = await contractWrite.canceSale(1)
    //Formateamos para ver su valor por el BigNumber
    const amount = ethers.utils.parseUnits(sale)
    //Mostramos por consola el resultado
    await sale.wait()
    console.log(sale)
    alert("Cancelacion de la venta Realizada Correctamente")
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const canceSale = document.getElementById("canceSale")
canceSale.addEventListener("click", async () => {
    await CancelSaleMyMarketPlace()
})

const getSaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractRead = new ethers.Contract(contractAddressMarketPlace,ContractABIFormattedMarketPlace,signer)
    //Verificamos la venta
    const balance = await contractRead.getSale(1)
    console.log(balance)
    //Formateamos para ver su valor por el BigNumber
    const formattedBalance = ethers.utils.formatUnits(balance)
    //Mostramos por consola el resultado
    console.log(formattedBalance)
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const getSale = document.getElementById("getSale")
getSale.addEventListener("click", async () => {
    await getSaleMyMarketPlace()
})

const metamaskButton = document.getElementById("metamaskButton")
metamaskButton.addEventListener("click", async () =>{
    console.log("Hola, soy el boton Connect Metamask y esta es tu address:")
    await connectMetamask()
    await getNativeBalance()
    await getNetwork()
    await getMyCoinBalance()
    await MyCoinApprove()
})