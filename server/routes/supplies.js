// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();

// Import model(s)
const { Supply } = require("../db/models");

// List of supplies by category
router.get("/category/:categoryName", async (req, res, next) => {
  const { categoryName } = req.params;
  if (categoryName) {
    const options = {
      where: {
        category: categoryName,
      },
      order: [
        ["name", "ASC"],
        ["handed", "ASC"],
      ],
    };

    const suppliesByCategory = await Supply.findAll(options);
    res.status(200).json(suppliesByCategory);
  }

  // Phase 1C:
  // Find all supplies by category name
  // Order results by supply's name then handed
  // Return the found supplies as the response body
  // Phase 8A:
  // Include Classroom in the supplies query results
  // Order nested classroom results by name first then by supply name
  // Your code here
});

// Scissors Supply Calculation - Business Logic Goes Here!
router.get("/scissors/calculate", async (req, res, next) => {
  let result = {};

  // Phase 10A: Current number of scissors in all classrooms
  // result.numRightyScissors should equal the total number of all
  // right-handed "Safety Scissors" currently in all classrooms
  // result.numLeftyScissors should equal the total number of all
  // left-handed "Safety Scissors" currently in all classrooms
  // result.totalNumScissors should equal the total number of all
  // "Safety Scissors" currently in all classrooms, regardless of
  // handed-ness
  // Your code here

  // Phase 10B: Total number of right-handed and left-handed students in all
  // classrooms
  // result.numRightHandedStudents should equal the total number of
  // right-handed students in all classrooms
  // Note: This is different from the total amount of students that
  // are right-handed in the database. This is a total of all
  // right-handed students in each classroom combined. Some
  // students are enrolled in multiple classrooms, so if a
  // right-handed student was enrolled in 3 classrooms, that
  // student would contribute to 3 students in the total amount of
  // right-handed students in all classrooms.
  // result.numLeftHandedStudents should equal the total number of
  // left-handed students in all classrooms
  // Your code here

  // Phase 10C: Total number of scissors still needed for all classrooms
  // result.numRightyScissorsStillNeeded should equal the total number
  // of right-handed scissors still needed to be added to all the
  // classrooms
  // Note: This is the number of all right-handed students in all
  // classrooms subtracted by the number of right-handed scissors
  // that all the classrooms already have.
  // result.numLeftyScissorsStillNeeded should equal the total number
  // of left-handed scissors still needed to be added to all the
  // classrooms
  // Your code here

  res.json(result);
});

// Export class - DO NOT MODIFY
module.exports = router;
