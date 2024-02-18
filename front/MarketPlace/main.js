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

let contractAddress = "0x995b0614Cf2f2dD65dbc4E4d8796A6014548566D"

import ContractABI from "../../artifacts/contracts/MarketPlace/MyMarketPlace.sol/MyMarketPlace.json" assert {type: "json"}
const ContractInterface = new ethers.utils.Interface(ContractABI.abi)
const ContractABIFormatted = ContractInterface.format(ethers.utils.FormatTypes.full)

const createSaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddress,ContractABIFormatted,signer)
    //Creamos la venta
    const sale = await contractWrite.createSale(1, 10)
    //Formateamos para ver su valor por el BigNumber
    const amount = ethers.utils.parseUnits(sale)
    //Mostramos por consola el resultado
    await sale.wait()
    console.log(sale)
    alert("Creacion de la venta Realizada Correctamente")
    
}

//Relacionar la funcion anterior con el ID del boton del index.html y crear un event Listener
const createSale = document.getElementById("createSale")
createSale.addEventListener("click", async () => {
    await createSaleMyMarketPlace()
})

const buySaleMyMarketPlace = async () => {
    //Creamos una nueva instancia del contrato para poder iteractuar con sus funcionalidades
    contractWrite = new ethers.Contract(contractAddress,ContractABIFormatted,signer)
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
    contractWrite = new ethers.Contract(contractAddress,ContractABIFormatted,signer)
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
    contractRead = new ethers.Contract(contractAddress,ContractABIFormatted,provider)
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
})