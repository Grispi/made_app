import React from "react";

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function pickColours(number) {
  if (number === 1) {
    return "red";
  } else if (number === 2) {
    return "blue";
  } else if (number === 3) {
    return "green";
  } else if (number === 4) {
    return "yellow";
  }
}
class Selector extends React.Component {
  render() {
    return (
      <select value={this.props.value} onChange={this.props.onChange}>
        <option value="green">green</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
      </select>
    );
  }
}

class Colours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ["green", "green", "green", "green"]
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event, index) {
    const newValue = this.state.value.slice();
    newValue[index] = event.target.value;
    this.setState({
      value: newValue
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.value);
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <Selector
            onChange={event => this.handleChange(event, 0)}
            value={this.state.value[0]}
          />
          <Selector
            onChange={event => this.handleChange(event, 1)}
            value={this.state.value[1]}
          />
          <Selector
            onChange={event => this.handleChange(event, 2)}
            value={this.state.value[2]}
          />
          <Selector
            onChange={event => this.handleChange(event, 3)}
            value={this.state.value[3]}
          />
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

function Guess(props) {
  const guess = props.guess;
  const secretCode = props.secretCode;
  function createDicc(diccColours, color) {
    if (diccColours[color]) {
      diccColours[color] = diccColours[color] + 1;
    } else {
      diccColours[color] = 1;
    }
  }

  if (guess.join(", ") === secretCode.join(", ")) {
    return (
      <>
        <p>{guess.join(", ")}</p>
        <h1>You win</h1>
      </>
    );
  } else {
    let exactPosition = 0;
    let exactPositionIndexes = [];
    let diccColours = {};
    let diccSecretCodeColours = {};

    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === secretCode[i]) {
        exactPosition = exactPosition + 1;
        exactPositionIndexes.push(i);
      } else {
        const color = guess[i];
        const colorSecretCode = secretCode[i];
        createDicc(diccColours, color);
        createDicc(diccSecretCodeColours, colorSecretCode);
      }
    }
    const sameColour = Object.keys(diccSecretCodeColours);
    let sameColourNumber = 0;

    for (let x = 0; x < sameColour.length; x++) {
      let keyc = sameColour[x];
      let countGuessKey = diccColours[keyc];
      let countCodeKey = diccSecretCodeColours[keyc];
      if (countCodeKey - countGuessKey <= 0) {
        sameColourNumber = sameColourNumber + countCodeKey;
      } else if (countCodeKey - countGuessKey > 0) {
        sameColourNumber = sameColourNumber + countGuessKey;
      }
    }
    return (
      <>
        <p>
          {guess.join(", ")}
          <br />
          red:{sameColourNumber} white:{exactPosition}
        </p>
        <p className="try-again">try again</p>
      </>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      steps: [],
      secretCode: this.createSecretCode()
    };
  }
  handleSubmit(codeGuess) {
    this.setState({
      steps: this.state.steps.concat([codeGuess])
    });
  }
  createSecretCode() {
    const c1 = pickColours(getRandomInt(1, 5));
    const c2 = pickColours(getRandomInt(1, 5));
    const c3 = pickColours(getRandomInt(1, 5));
    const c4 = pickColours(getRandomInt(1, 5));
    const secretCode = [c1, c2, c3, c4];
    return secretCode;
  }

  playAgain() {
    this.setState({
      secretCode: this.createSecretCode(),
      steps: []
    });
  }

  render() {
    let winner = false;
    let stepsList = this.state.steps[this.state.steps.length - 1];
    if (stepsList && this.state.secretCode.join(" ") === stepsList.join(" ")) {
      winner = true;
    }

    return (
      <div className="game">
        <div className="game-board">
          <h1 className="title">Mastermind Game</h1>
          secretCode = {this.state.secretCode.join(" ")}
          <hr />
          <h1>Guess the code</h1>
          <ul>
            {this.state.steps.map((step, index) => (
              <li key={index}>
                <p>Round Nº {index + 1}</p>
                <Guess guess={step} secretCode={this.state.secretCode} />
              </li>
            ))}
            {winner ? null : (
              <li>
                <p>Round Nº{this.state.steps.length + 1}</p>
                <Colours onSubmit={codeGuess => this.handleSubmit(codeGuess)} />
              </li>
            )}
          </ul>
          <button className="button" onClick={() => this.playAgain()}>
            Play Again
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
