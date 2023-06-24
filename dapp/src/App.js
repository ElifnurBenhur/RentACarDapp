
import './App.css';
import InfoBox from "./components/InfoBox";
import TopLabel from "./components/TopLabel";
import Status from "./components/Status";
import InputComponent from "./components/InputComponent";
import Header from "./components/Header";
import CarComponent from "./components/CarComponent";
import Model from "./components/Model";
import GradientButton from "./components/GradientButton";
import AdminActions from "./components/AdminActions";
import DueComponent from "./components/DueComponent";
import {
  getUserAddress,
  register,
  getCarByStatus,
  getCar,
  getOwner,
  login,
} from "./Web3Client";

import {BiWallet,BiTimeFive} from "react-icons/bi";
import {GiToken} from "react-icons/gi";
import {useState,useEffect} from "react";
import Web3 from "web3";
function App() {
  const[showModel, setShowModel]=useState(false);
  const[loggedIn,setLoggedIn]=useState(false);
  const[cars,setCars]=useState([]);
  const[userName,setUserName]=useState("");
  const[name,setName]=useState({});
  const[lastName,setlastName]=useState({});
  const[isAdmin,setIsAdmin]=useState(false);
  const[userCredit,setUserCredit]=useState("0");
  const[due,setDue]=useState("0");
  const[isAvailable,setIsAvailable]=useState("Can Rent");
  const[rideMins,setRideMins]=useState("0");

  const emptyAddress="0x0000000000000000000000000000000000000000";

  useEffect(()=> {
   const handleInit=async()=>{
    let isAUser= await login();

    if(isAUser.address !== emptyAddress){
      setLoggedIn(true);
      setUserCredit(
        Web3.utils.fromWei(String(isAUser.debt),"ether").toStrin()
      );
      let userDue=Web3.utils.fromWei(String(isAUser.debt),"ether").toString();
      setDue(userDue);
      setUserName(isAUser.name);
      let address=await getUserAddress();
      let owner=await getOwner();
      if(address===owner.toLowerCase()){
        setIsAdmin(true);
      }
      let carArray=[];
      let carByStatus=await getCarsByStatus(2);
      carArray.push(...carByStatus);
      if(isAUser.rentedCarId!=="0"){
        const userCar=await getCar(Number(isAUser.rentedCarId));
        carArray.push(userCar);
      }
      setCars(carArray);

      if(isAUser.rentedCarId!=="0"){
        let rentedCar= await getCar(isAUser.rentedCarId);
        setIsAvailable(`Rented ${rentedCar.name} - ${rentedCar.id}`);
      }
      else{
        console.warn(userDue);
        if(userDue!=="0"){
          setIsAvailable("Pay your due!");
        }
      }

      let rideMins="0";
      if(isAUser.rentedCarId!=="0"){
        rideMins=Math.floor((Math.floor(Date.now()/1000)- isAUser.start)/60).toString();
      }
      setRideMins(rideMins);
    }
   };

   handleInit();

  },[]);

  const handleNameChange=(event)=>{
    setName(event.target.value);
  };

  const handleLastNameChange=(event)=>{
    setlastName(event.target.value);
  }
  return (
<div className="h-full bg-[url('./assets/background.jpg')] bg-cover bg-center bg-no-repeat">
  {/*Header */}
  <Header loggedIn={loggedIn}/>
   {/* Tittle */}
   {loggedIn ? (
    <div>
      <div className="mt-12">
        <TopLabel userName={userName}/>
        </div>
      <div className="grid place-content-center mt-8"> 
         {isAdmin && (
          <GradientButton
           onClick={()=> setShowModel(true)}
           title="AdminActions"
           />
         )}
        </div>

   {/* Data Section */} 
     <div className="mx-auto grid place-content-center mt-12">
      <div className="flex flex-row items-center">
        <div className="grid grid-flow-row- md:grid-flow-col items-center">
          <InfoBox
          label="BNB Credit"
          number={userCredit}
          icon={<BiWalletAlt/>}
          />
          <InfoBox label="BNB Due" number={due} icon={<GiToken/>}/>
          <InfoBox
          label="Ride Minutes"
          number={rideMins}
          icon={<BiWalletAlt/>}
          />
          <div className="grid place-items-center">
            <Status status={isAvailable} />
            </div>
          </div>
        </div>
      </div>

    {/* Input Section */}   

    <div className="place-content-center grid items-center p-4 mt-12">
      <InputComponent
        holder="Credit balance"
        label="Credit your account"
        type="credit"
      />
      <DueComponent 
      label="Pay your due"
      />
      <InputComponent
        holder="Withdraw Balance"
        label="Withdraw token from your account"
        type="withdraw"
      />
      </div>
   {/* Car Section */}   

   <div className="grid md:grid-flow-col gap4 gap-y-12 justify-evenly mt-24 pb-24">
    {cars.length>0?(
      cars.map((car)=>(
        <div key={car.id}>
          <CarComponent 
          carStatus={car.status}
          rentFee={car.rentFee}
          saleFee={car.saleFee}
          image={car.imgUrl}
          id={car.id}
          name={car.name}
          />
          </div>
      ))
    ):(
      <div>
        <div className="text-white text-4xl mb-60"> ...LOADING CARS... </div>
        </div>
    )}
    </div>




      </div>
   ):(
    <>
    <div className="h-screen text-white w-full">  ...Loading User...</div>
    </>
   )}

</div>
  );
}

export default App;
