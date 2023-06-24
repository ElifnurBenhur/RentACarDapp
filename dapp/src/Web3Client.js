import Web3 from "web3";
import RenterABI from "./ABI/RentalPlatform.json";

let selectedAccount;
let rentedContract;
let isInitialized=false;
let renterContractAddress="0xB081cf4729a021e0fd988EC13E9e94c7C901d2A3";

export const init= async()=>{
    let provider=window.ethereum;
    if(typeof provider!=="undefined"){
        provider
         .request({method:"eth_requestAccounts"})
         .then((accounts)=>{
            selectedAccount=accounts[0];
         })
         .catch((err)=>{
            //console.Log(err);
            return;
         });
    }
    window.ethereum.on("accountChanged",function(accounts){
        selectedAccount=accounts[0];
    });

    const web3= new Web3(provider);
    const networkId=await web3.eth.net.getId();
    rentedContract=new web3.eth.Contract(RenterABI.abi,renterContractAddress);
    isInitialized=true;
};

export const getUserAddress = async ()=>{
    if(!isInitialized){
        await init();

    }
    return selectedAccount;
};

export const setOwner = async (newOwner)=>{
if(!isInitialized){
    await init();
}
try{
    let res=await rentedContract.methods
    .setOwner(newOwner.toLowerCase())
    .send({from:selectedAccount});
    return res;
}
catch(e){
    console.error(e);
}
};

export const register = async(name,surname)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .addUser(name,surname)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const addCar=async (name,url,rentFee,saleFee)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .addCar(name,url,rentFee,saleFee)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const editCarMetaData= async(id,name,imgUrl,rentFee,saleFee)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .editCarMetaData(id,name,imgUrl,rentFee,saleFee)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};
export const editCarStatus=async(id,status)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .editCarStatus(id,status)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const checkOut= async(id)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .checkOut(id)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const checkIn=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .checkIn()
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const deposit=async(value)=>{
    if(!isInitialized){
        await init();
    }
    let send_value=Web3.utils.toWei(value,"ether");
    try{
        let res=await rentedContract.methods
        .deposit()
        .send({from:selectedAccount,value:send_value});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const makePayment=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods
        .makePayment()
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const withdrawBalance=async(value)=>{
    if(!isInitialized){
        await init();
    }
    let send_value=Web3.utils.toWei(value,"ether");
    try{
        let res=await rentedContract.methods
        .withdrawBalance(send_value)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};
export const withdrawOwnerBalance=async(value)=>{
    if(!isInitialized){
        await init();
    }
    let send_value=Web3.utils.toWei(value,"ether");
    try{
        let res=await rentedContract.methods
        .withdrawOwnerBalance(send_value)
        .send({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const getOwner=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getOwner().call();
        return res.toString();
    }
    catch(e){
        console.error(e);
    }
};
export const login=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getUser(selectedAccount).call();
        return res;
    }
    catch(e){
        console.error(e);
    }
};
export const getCar=async(id)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getCar(id).call();
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const getCarByStatus=async(status)=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getCarByStatus(status).call();
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const getCurrentCount=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getCurrentCount().call();
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const getContractBalance=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getContractBalance().call({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};

export const getTotalPayments=async()=>{
    if(!isInitialized){
        await init();
    }
    try{
        let res=await rentedContract.methods.getTotalPayments().call({from:selectedAccount});
        return res;
    }
    catch(e){
        console.error(e);
    }
};
