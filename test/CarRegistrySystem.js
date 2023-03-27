const { expect } = require("chai");

describe("carRegistrySystem", function () {
  let carRegistrySystem;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const carRegistrySystemFactory = await ethers.getContractFactory(
      "carRegistrySystem"
    );
    carRegistrySystem = await carRegistrySystemFactory.deploy();
    await carRegistrySystem.deployed();
  });

  it("Should store and retrieve car details", async function () {
    const carNumber = "ABC123";
    const make = "Tesla";
    const model = "Model S";
    const year = 2022;

    await carRegistrySystem.storeCarDetails(carNumber, make, model, year);

    const [storedMake, storedModel, storedYear, owner] =
      await carRegistrySystem.getCarDetails(carNumber);
    expect(storedMake).to.equal(make);
    expect(storedModel).to.equal(model);
    expect(storedYear).to.equal(year);
    expect(owner).to.equal(owner);
  });

  it("Should transfer car ownership", async function () {
    const carNumber = "ABC123";
    const make = "Tesla";
    const model = "Model S";
    const year = 2022;

    await carRegistrySystem.storeCarDetails(carNumber, make, model, year);

    await carRegistrySystem.transferCarOwnership(carNumber, addr1.address);

    const newOwner = await carRegistrySystem.getCarOwner(carNumber);
    expect(newOwner).to.equal(addr1.address);
  });

  it("Should revert when non-owner tries to transfer ownership", async function () {
    const carNumber = "ABC123";
    const make = "Tesla";
    const model = "Model S";
    const year = 2022;

    await carRegistrySystem.storeCarDetails(carNumber, make, model, year);

    await expect(
      carRegistrySystem
        .connect(addr1)
        .transferCarOwnership(carNumber, addr2.address)
    ).to.be.revertedWith("You are not the owner of this car");
  });

  it("Should revert when same car is registered twice", async function () {
    const carNumber = "ABC123";
    const make = "Tesla";
    const model = "Model S";
    const year = 2022;

    await carRegistrySystem.storeCarDetails(carNumber, make, model, year);

    await expect(
      carRegistrySystem.storeCarDetails(carNumber, make, model, year)
    ).to.be.revertedWith("Car already registered");
  });
});
