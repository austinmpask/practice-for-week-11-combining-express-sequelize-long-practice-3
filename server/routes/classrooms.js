// Instantiate router - DO NOT MODIFY
const express = require("express");
const router = express.Router();

// Import model(s)
const {
  Classroom,
  Supply,
  StudentClassroom,
  Student,
} = require("../db/models");
const { Op } = require("sequelize");

// List of classrooms
router.get("/", async (req, res, next) => {
  let errorResult = { errors: [], count: 0, pageCount: 0 };

  // Phase 6B: Classroom Search Filters
  /*
        name filter:
            If the name query parameter exists, set the name query
                filter to find a similar match to the name query parameter.
            For example, if name query parameter is 'Ms.', then the
                query should match with classrooms whose name includes 'Ms.'

        studentLimit filter:
            If the studentLimit query parameter includes a comma
                And if the studentLimit query parameter is two numbers separated
                    by a comma, set the studentLimit query filter to be between
                    the first number (min) and the second number (max)
                But if the studentLimit query parameter is NOT two integers
                    separated by a comma, or if min is greater than max, add an
                    error message of 'Student Limit should be two integers:
                    min,max' to errorResult.errors
            If the studentLimit query parameter has no commas
                And if the studentLimit query parameter is a single integer, set
                    the studentLimit query parameter to equal the number
                But if the studentLimit query parameter is NOT an integer, add
                    an error message of 'Student Limit should be a integer' to
                    errorResult.errors 
    */
  const where = {};
  const { name, studentLimit } = req.query;

  if (name) {
    where.name = {
      [Op.like]: `%${name}%`,
    };
  }

  if (studentLimit) {
    const input = studentLimit.split(",");
    if (input.length === 1) {
      where.studentLimit = studentLimit;
    } else {
      if (input[0] < input[1]) {
        where.studentLimit = {
          [Op.lte]: input[1],
          [Op.gt]: input[0],
        };
      } else {
        errorResult.errors.push("Wrong number order");
        res.status(400).end(errorResult);
      }
    }
  }
  // Your code here

  const classrooms = await Classroom.findAll({
    attributes: ["id", "name", "studentLimit"],
    where,
    // Phase 1B: Order the Classroom search results
    order: [["name", "ASC"]],
  });

  res.json(classrooms);
});

// Single classroom
router.get("/:id", async (req, res, next) => {
  let classroom = await Classroom.findByPk(req.params.id, {
    attributes: ["id", "name", "studentLimit"],
    // Phase 7:
    // Include classroom supplies and order supplies by category then
    // name (both in ascending order)
    // Include students of the classroom and order students by lastName
    // then firstName (both in ascending order)
    // (Optional): No need to include the StudentClassrooms
    // Your code here

    include: [
      {
        model: Supply,
        attributes: ["id", "name", "category", "handed"],
        order: [
          ["category", "ASC"],
          ["name", "ASC"],
        ],
      },

      {
        model: StudentClassroom,
        attributes: ["id"],
        include: [
          {
            model: Student,
            attributes: ["id", "firstName", "lastName", "leftHanded"],
          },
        ],
      },
    ],
  });

  if (!classroom) {
    res.status(404);
    res.send({ message: "Classroom Not Found" });
  }

  // Phase 5: Supply and Student counts, Overloaded classroom
  classroom = classroom.toJSON();
  classroom.supplyCount = await Supply.count({
    where: {
      classroomId: classroom.id,
    },
  });

  classroom.studentCount = await StudentClassroom.count({
    where: {
      classroomId: classroom.id,
    },
  });
  classroom.studentCount > classroom.studentLimit
    ? (classroom.overloaded = true)
    : (classroom.overloaded = false);
  // Phase 5A: Find the number of supplies the classroom has and set it as
  // a property of supplyCount on the response
  // Phase 5B: Find the number of students in the classroom and set it as
  // a property of studentCount on the response
  // Phase 5C: Calculate if the classroom is overloaded by comparing the
  // studentLimit of the classroom to the number of students in the
  // classroom
  // Optional Phase 5D: Calculate the average grade of the classroom
  // Your code here

  res.json(classroom);
});

// Export class - DO NOT MODIFY
module.exports = router;
