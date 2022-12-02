var fs = require("fs");

const stream = fs.createReadStream("./input", "utf-8");

stream.on("data", (chunk) => {
  const caloriesSumList = chunk
    .split("\r\n\r\n")
    .map((list) => list.split("\r\n"))
    .map((list) => list.reduce((acc, curr) => acc + parseInt(curr), 0))
    .sort((right, left) => left - right);

  console.log(`Most calories : ${caloriesSumList[0]}`);
  console.log(
    `Most 3 calories : ${
      caloriesSumList[0] + caloriesSumList[1] + caloriesSumList[2]
    }`
  );
});
