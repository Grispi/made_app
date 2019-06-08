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
      <select
        value={this.props.value}
        onChange={this.props.onChange}
        className="selector"
      >
        <option value="green">green</option>
        <option value="red">red</option>
        <option value="blue">blue</option>
        <option value="yellow">yellow</option>
      </select>
    );
  }
}

// component that lets the user select their code guess
class Colours extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ["green", "green", "green", "green"]
    };
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
        <form onSubmit={e => this.handleSubmit(e)}>
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
          <input type="submit" value="Submit" className="submit" />
        </form>
      </div>
    );
  }
}

// component that shows the user guess and calculates the hints given the secret code
function Guess(props) {
  const guess = props.guess;
  const secretCode = props.secretCode;

  // function that increment colour in the dictionary
  function incrementColour(dictColours, colour) {
    if (dictColours[colour]) {
      dictColours[colour] = dictColours[colour] + 1;
    } else {
      dictColours[colour] = 1;
    }
  }

  // conditional that checks if the guess is the secret Code, in that case show the user that they won.
  if (guess.join(", ") === secretCode.join(", ")) {
    return (
      <>
        <p>
          {guess.map((e, i) => (
            <span key={i}>
              <Colour colour={e} />{" "}
            </span>
          ))}
        </p>
        <h1>You win</h1>
      </>
    );
  } else {
    // if the guess is not the secret code, look for colours in same position and also same colours but in different position.
    let exactPosition = 0;
    let dictGuessColours = {};
    let dictSecretCodeColours = {};

    // loop through each colour from the secret code and the guess code
    for (let i = 0; i < guess.length; i++) {
      // look for the same position and colour and increment the count
      if (guess[i] === secretCode[i]) {
        exactPosition = exactPosition + 1;
      } else {
        // if not in same position and colour, increment the colour occurrence from each code in a dictionary of occurrences by colour in order to compare them in the next step
        const color = guess[i];
        const colorSecretCode = secretCode[i];
        incrementColour(dictGuessColours, color);
        incrementColour(dictSecretCodeColours, colorSecretCode);
      }
    }
    // creates an array from the Secret Code dictionary keys in order to iterate over them
    const sameColour = Object.keys(dictSecretCodeColours);
    let sameColourNumber = 0;

    // loop through the colous in the secret code and compares occurrences of that colour in both dictionaries.
    for (let x = 0; x < sameColour.length; x++) {
      let keyc = sameColour[x];
      let countGuessKey = dictGuessColours[keyc];
      let countCodeKey = dictSecretCodeColours[keyc];

      // if there are more occurrences in the guessed code, keep the occurrences from the secret code
      if (countCodeKey - countGuessKey <= 0) {
        sameColourNumber = sameColourNumber + countCodeKey;
        // otherwise, if there are more occurrences in the secret code, keep the occurrences from the guessed code
      } else if (countCodeKey - countGuessKey > 0) {
        sameColourNumber = sameColourNumber + countGuessKey;
      }
    }
    // return the guess code with css colours and the hints
    return (
      <>
        <p>
          {guess.map((e, i) => (
            <span key={i}>
              <Colour colour={e} />{" "}
            </span>
          ))}
          <br />
          Same colour: {sameColourNumber}
          <br />
          Same position & colour:
          {exactPosition}
        </p>
      </>
    );
  }
}

// Component that conditionally shows the secret code, depending on a checkbox to reveal it.
class SecretCode extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      revealSecretCode: false
    };
  }
  handleChange() {
    this.setState({
      revealSecretCode: !this.state.revealSecretCode
    });
  }

  render() {
    const secretCode = this.state.revealSecretCode ? (
      <>
        {this.props.secretCode.map((e, i) => (
          <span key={i}>
            <Colour colour={e} />{" "}
          </span>
        ))}{" "}
        🤐
      </>
    ) : null;
    return (
      <div>
        Reveal secret code?{" "}
        <input
          type="checkbox"
          checked={this.state.revealSecretCode}
          onChange={() => this.handleChange()}
        />
        {secretCode}
      </div>
    );
  }
}

// component that creates the css circle for each colours from the codes.
class Colour extends React.Component {
  render() {
    return <span className={"circle " + this.props.colour} />;
  }
}

// main component that creates the secret code, the posibility to play again and save the steps/rounds
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
    //Determines if there is a winner so that we can stop prompting the user for guesses.
    let winner = false;
    let stepsList = this.state.steps[this.state.steps.length - 1];
    if (stepsList && this.state.secretCode.join(" ") === stepsList.join(" ")) {
      winner = true;
    }

    return (
      <div className="game">
        <div className="game-board">
          <h1 className="title">Mastermind Game</h1>
          <hr />
          <SecretCode secretCode={this.state.secretCode} />
          <h2>Guess the code</h2>
          <ul>
            {/* render the steps with the incrementing step numbers */}
            {this.state.steps.map((step, index) => (
              <li key={index}>
                <p>Guess Nº {index + 1}</p>
                <Guess guess={step} secretCode={this.state.secretCode} />
              </li>
            ))}
            {winner ? null : (
              <li>
                <p>Guess Nº{this.state.steps.length + 1}</p>
                <Colours onSubmit={codeGuess => this.handleSubmit(codeGuess)} />
              </li>
            )}
          </ul>
          {/* button to play again that resets the game state when clicked */}
          <button className="button" onClick={() => this.playAgain()}>
            Play Again
          </button>
        </div>
      </div>
    );
  }
}

export default Game;
