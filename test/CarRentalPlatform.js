const CarRentalPlatform = artifacts.require("CarRentalPlatform");


contract("CarRentalPlatform", accounts => {
 
  let carRentalPlatform;
  const owner = accounts[0];
  const user1= accounts[1];

  beforeEach(async ()=>{
    carRentalPlatform=await CarRentalPlatform.new();
  });

  describe("Add user and car", ()=>{
    it("adds a new user", async ()=>{
      
      await carRentalPlatform.addUser("Alice","Smith",{from: user1});
      const user = await carRentalPlatform.getUser(user1);
      assert.equal(user.name,"Alice","Problem with user name!");
      assert.equal(user.lastname,"Smith","Problem with user lastname");
    });

    it("adds a car", async ()=>{
      await carRentalPlatform.addCar("Tesla Model S", "example url", 10, 50000,{from:owner});
      const car = await carRentalPlatform.getCar(1);
      assert.equal(car.name,"Tesla Model S","Problem with car name!");
      assert.equal(car.imgUrl,"example url","Problem with car image url!");
      assert.equal(car.rentFee,10,"Problem with car rent fee!");
      assert.equal(car.saleFee,50000,"Problem with car sale fee!");
    });
  });

  describe("Checkout and check in car", ()=>{
      it("Checks out a car", async ()=> {
        await carRentalPlatform.addUser("Alice","Smith",{from: user1});
        await carRentalPlatform.addCar("Tesla Model S","example url",10,50000,{from:owner});
        await carRentalPlatform.checkOut(1,{from: user1});

        const user =await carRentalPlatform.getUser(user1);
        assert.equal(user.rentedCarId,1,"User could not check out the car!");
      });
      it("Checks in a car", async ()=> {
        await carRentalPlatform.addUser("Alice","Smith",{from: user1});
        await carRentalPlatform.addCar("Tesla Model S","example url",10,50000,{from:owner});
        await carRentalPlatform.checkOut(1,{from:user1});
        await new Promise((resolve)=> setTimeout(resolve,6000));//waiting time decreased

        await carRentalPlatform.checkIn({from: user1});

        const user= await carRentalPlatform.getUser(user1);
         
       // assert.equal(user.balance,0,"user balance="+user.balance);
        assert.equal(user.rentedCarId,0,"User could not check in the car!");
        assert.equal(user.debt,60,"User debt didn't created");//debt calculated by seconds!!
      });
  });

  describe("Deposit token and make payment", ()=>{
    it("deposits token", async ()=> {
      await carRentalPlatform.addUser("Alice","Smith",{from:user1});
      await carRentalPlatform.deposit({from: user1, value:100});
      

      const user =await carRentalPlatform.getUser(user1);
      assert.equal(user.balance,100,"User could not deposit tokens!");
    });
    it("makes payment", async ()=> {
      await carRentalPlatform.addUser("Alice","Smith",{from:user1});
      await carRentalPlatform.addCar("Tesla Model S","example url",10,50000,{from:owner});
      await carRentalPlatform.checkOut(1,{from:user1});
      await new Promise((resolve)=> setTimeout(resolve,6000));//waiting time decreased
      await carRentalPlatform.checkIn({from: user1});

      await carRentalPlatform.deposit({from:user1,value:100});
      await carRentalPlatform.makePayment({from:user1});

      const user= await carRentalPlatform.getUser(user1);

      assert.equal(user.debt,0,"Payment went wrong!");
      
    });
});


describe("edit car",()=>{

  it("should edit an existing car's metadata with valid parameters",async()=>{
   await carRentalPlatform.addCar("Tesla Model S", "example url",10,50000,{from:owner});

   const newName="Honda";
   const newImgUrl="new img url";
   const newRentFee=20;
   const newSaleFee=100000;
   await carRentalPlatform.editCarMetaData(1,newName,newImgUrl,newRentFee,newSaleFee,{from:owner});

   const car= await carRentalPlatform.getCar(1);
   assert.equal(car.name, newName,"Problem editting car name");
   assert.equal(car.imgUrl,newImgUrl,"example url","Problem with editting car image url!");
      assert.equal(car.rentFee,newRentFee,10,"Problem with editting car rent fee!");
      assert.equal(car.saleFee,newSaleFee,50000,"Problem with editting car sale fee!");
  });

  it("should edit an existing car's status",async ()=>{
  await carRentalPlatform.addCar("Tesla Model S", "example url",10,50000,{from:owner});
  const newStatus=0;
  await carRentalPlatform.editCarStatus(1,newStatus,{from:owner});
  const car = await carRentalPlatform.getCar(1);
  assert.equal(car.status,newStatus,"Problem with editing car status");
  });
});

describe("Withdraw balance", ()=>{

  it("should send the desired amount of tokens to the user",async()=>{
    await carRentalPlatform.addUser("Alice","Smith",{from:user1});
    await carRentalPlatform.deposit({from: user1, value:100});
    await carRentalPlatform.withDrawBalance(50,{from:user1});

    const user =await carRentalPlatform.getUser(user1);
    assert.equal(user.balance,50,"User could not get their tokens");
  });

  it("should send the desired amount of tokens to the owner", async()=>{
    await carRentalPlatform.addUser("Alice","Smith",{from:user1});
    await carRentalPlatform.addCar("Tesla Model S", "example url",10,50000,{from:owner});
    await carRentalPlatform.checkOut(1,{from:user1});
    await new Promise((resolve)=> setTimeout(resolve,6000));//waiting time decreased
    await carRentalPlatform.checkIn({from: user1});
    await carRentalPlatform.deposit({from: user1, value:1000});
    await carRentalPlatform.makePayment({from:user1});

    const totalPaymentAmount= await carRentalPlatform.getTotalPayments({from:owner});
    const amountToWithdraw=totalPaymentAmount-10;
    await carRentalPlatform.withDrawnOwnerBalance(amountToWithdraw,{from:owner});
    const totalPayment= await carRentalPlatform.getTotalPayments({from:owner});
    assert.equal(totalPayment,10,"Owner could not withdraw tokens!");

  })
});
  
});
