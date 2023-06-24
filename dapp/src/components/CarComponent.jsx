import React from "react";
import { checkOut,checkIn } from "../Web3Client";
import Web3 from "web3";

const CarComponent=(props)=>{
    const checkOutCar= async ()=>{
        await checkOut(props.id);
    };

    const checkInCar= async ()=>{
        await checkIn(props.id);
    };

    return(
        <div className="border-md border-black flex flex-col">
         <img src={props.image} alt="car image" className="w-80 h-60 rounded-md"></img>
         <p className="w-80 text-white text-lg mt-8">
         Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Cras feugiat erat id malesuada pellentesque. 
         Morbi a malesuada ante, sit amet venenatis lectus. 
         Quisque nisl eros, scelerisque ut commodo in, tempor luctus nibh. 
         Vestibulum nec augue vitae enim condimentum varius in sed risus. 
         </p>
         <div className="text-white space-y-4 text-xl mt-4">
            <p>{props.name}</p>
         </div>
         <div className="text-white space-y-4 text-xl mt-4">
            <p>Car Fee:{Web3.utils.fromWei(props.rentFee)} tBNB</p>
            <p>Sale Fee:{Web3.utils.fromWei(props.saleFee)} tBNB</p>
            <p className={props.carStatus==2 ? "text-green-500":"text-red-300"}>
                  {props.carStatus ==2 ? "Active": "Inactive"}
            </p>
         </div>
         <div className="flex flex-row justify-evenly mt-10">
            <button
            onClick={()=> checkOutCar()}
            className="p-4 bg-gradient-to-r from-puple-500-to-pink-500 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 py-2 rounded-lg"
            >
            <span className="text-white text-sm text-center p-4 font-semibold">
                Chek Out
            </span>
            </button>
            <button
            onClick={()=> checkInCar(props.id)}
            className="p-4 bg-gradient-to-r from-purple-500-to-pink-500 hover:bg-gradient-to-r hover:from-sky-500 hover:to-indigo-500 py-2 rounded-lg"
            >
            <span className="tezt-white text-sm p-4 font-semibold">Check In</span>
            </button>

         </div>
        </div>
    );
};

export default CarComponent;