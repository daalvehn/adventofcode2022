var fs = require("fs");

const stream = fs.createReadStream("./input", "utf-8");

class Figure {
  constructor(point_value, win_against, lose_against) {
    this.point_value = point_value;
    this.win_against = win_against;
    this.lose_against = lose_against;
  }
}

const figures = new Map();
figures.set("X", new Figure(1, "C", "B"));
figures.set("Y", new Figure(2, "A", "C"));
figures.set("Z", new Figure(3, "B", "A"));

const roundPoint = {
  Win: 6,
  Draw: 3,
};

function SolveRound(pair) {
  if (!pair[0] || !pair[1]) {
    return 0;
  }

  playerFigure = figures.get(pair[1]);
  let points = playerFigure.point_value;

  if (playerFigure.win_against === pair[0]) {
    points += roundPoint.Win;
  } else if (playerFigure.lose_against !== pair[0]) {
    points += roundPoint.Draw;
  }

  return points;
}

// Part 2 stuff ------------------------------------------------
const roundOutcome = {
  Win: "Z",
  Lose: "X",
};

const translation = new Map();
translation.set("A", "X");
translation.set("B", "Y");
translation.set("C", "Z");

function translateThenSolve(pair) {
  if (!pair[0] || !pair[1]) {
    return 0;
  }

  if (pair[1] === roundOutcome.Win) {
    // Get the figure against which the elf should lose
    const winingAnswer = figures.get(translation.get(pair[0])).lose_against;
    // Translate again for player PoV
    const round = [pair[0], translation.get(winingAnswer)];
    // Then solve the round normally
    return SolveRound(round);
  } else if (pair[1] === roundOutcome.Lose) {
    const losingAnswer = figures.get(translation.get(pair[0])).win_against;
    const round = [pair[0], translation.get(losingAnswer)];
    return SolveRound(round);
  } else {
    const round = [pair[0], translation.get(pair[0])];
    return SolveRound(round);
  }
}

stream.on("data", (chunk) => {
  let scorePart1 = 0;
  let scorePart2 = 0;
  const rounds = chunk.split("\r\n").map((x) => x.split(" "));

  rounds.forEach((round) => {
    scorePart1 += SolveRound(round);
    scorePart2 += translateThenSolve(round);
  });

  //results
  console.log(
    `Guessing the strategy, you got ${scorePart1} points. That's suspicious. Elves cook you.`
  );
  console.log(
    `Knowing the strategy, you got ${scorePart2} points. You tricked the Elves ! You win !`
  );
});
