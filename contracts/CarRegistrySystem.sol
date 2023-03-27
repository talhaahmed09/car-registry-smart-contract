// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract carRegistrySystem {
    struct Car {
        string make;
        string model;
        uint256 year;
        address owner;
    }

    mapping(string => Car) private cars;

    function storeCarDetails(
        string memory carNumber,
        string memory make,
        string memory model,
        uint256 year
    ) public {
        require(cars[carNumber].owner == address(0), "Car already registered");
        cars[carNumber] = Car(make, model, year, msg.sender);
    }

    function getCarDetails(
        string memory carNumber
    )
        public
        view
        returns (
            string memory make,
            string memory model,
            uint256 year,
            address owner
        )
    {
        Car memory car = cars[carNumber];
        require(car.owner != address(0), "Car not registered");
        return (car.make, car.model, car.year, car.owner);
    }

    function transferCarOwnership(
        string memory carNumber,
        address newOwner
    ) public {
        require(
            cars[carNumber].owner == msg.sender,
            "You are not the owner of this car"
        );
        cars[carNumber].owner = newOwner;
    }

    function getCarOwner(
        string memory carNumber
    ) public view returns (address owner) {
        Car memory car = cars[carNumber];
        require(car.owner != address(0), "Car not registered");
        return car.owner;
    }
}
