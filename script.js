// This code waits for the DOM content to be fully loaded before executing any
// JavaScript code
document.addEventListener('DOMContentLoaded', function () {
  // Retrieve the DOM element with the id 'screen' and assign it to the variable
  // 'screen'
  const screen = document.getElementById('screen');

  // Initialize variables to track calculator state
  let clickCounter = 0;
  let rightSide = 0;
  let leftSide = 0;
  let result = 0;
  let newNumber = true;
  let operator = [];

  // Function to handle input from calculator buttons
  function handleInput(value) {
    // Handle special cases for initial zero and decimal point
    if (
      (screen.textContent === '0' && value == '.') ||
      (screen.textContent === '' && value == '.')
    ) {
      screen.textContent = '0';
    } else if (screen.textContent === '0' || newNumber) {
      screen.textContent = '';
    }
    // Limit the number of characters on the screen to 15
    if (clickCounter < 15) {
      // Avoid adding multiple decimal points
      if (!(value === '.' && screen.textContent.includes('.'))) {
        screen.textContent += value;
        clickCounter += 1;
        newNumber = false;
      }
    }
  }

  // Function to handle 'AC' (all clear) button click
  function handleAC() {
    // Reset the screen content and calculator state
    screen.textContent = '0';
    rightSide = 0;
    leftSide = 0;
    result = 0;
    newNumber = true;
    clickCounter = 0;
    operator = [];
  }

  // Function to handle 'Backspace' button click
  function handleBackspace() {
    // Remove the last character from the screen content
    screen.textContent = screen.textContent.slice(0, -1);

    if (clickCounter > 0) {
      clickCounter -= 1;
    }
  }

  // Function to handle equals button click
  function handleEquals() {
    if (parseFloat(screen.textContent) != result && screen.textContent != '') {
      clickCounter = 0;
      newNumber = true;
      // Extract numbers and perform calculations
      getNumbers();
      // Display the result on the screen
    }
  }

  // Function to handle operator clicks
  function handleOperator(value) {
    clickCounter = 0;
    // Replace the special character '∗' with '*'
    if (value === '×') {
      value = '*';
    }
    if (value === '÷') {
      value = '/';
    }

    operator.push(value);
    console.log(operator);
    // Reset leftSide and rightSide if a new calculation starts without clearing
    // the screen
    if (rightSide !== 0) {
      // If there's a rightSide value already, it means the user is starting a new calculation
      leftSide = result;
      rightSide = 0;
    } else if (parseFloat(screen.textContent) !== result && result !== 0) {
      // If the screen value is not the result and the result is not 0, reset leftSide
      leftSide = 0;
    }
    // Extract numbers and perform calculations
    getNumbers();
  }

  // Function to extract numbers and prepare for calculation
  function getNumbers() {
    if (leftSide === 0) {
      // If leftSide is not set, set it to the current screen value
      leftSide = parseFloat(screen.textContent);
      screen.textContent = '';
    } else if (rightSide === 0) {
      // If rightSide is not set, set it to the current screen value and
      // perform calculation
      rightSide = parseFloat(screen.textContent);
      calculate();
    } else {
      // If both leftSide and rightSide are set, set leftSide to the previous
      // result for further calculations
      leftSide = result;
      screen.textContent = '';
      rightSide = 0;
    }
  }

  // Function to perform the calculation based on the operator and operands
  function calculate() {
    let expression = `${leftSide} ${operator.shift()} ${rightSide}`;
    let tempResult = eval(expression);

    // If result is a decimal number, round it to 10 digits
    if (!Number.isInteger(tempResult)) {
      tempResult = parseFloat(tempResult.toFixed(7));
    }

    // Store the result for further calculations
    result = tempResult;

    // Display the result
    screen.textContent = result;
    leftside = result;
    result = 0; // this stops the weird effect after pressing enter
    newNumber = true;
    clickCounter = 0;
  }

  // Function to handle keyboard input
  function handleKeyboardInput(key) {
    if (key === 'Backspace') {
      handleBackspace();
    } else if (key === 'Escape') {
      handleAC();
    } else if ((!isNaN(key) && key != ' ') || key == '.') {
      handleInput(key);
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
      handleOperator(key);
    } else if (key === 'Enter') {
      handleEquals();
    }
    if (screen.textContent == 'NaN') {
      handleAC();
    }
  }

  // Event listener for button clicks in the main grid
  document
    .querySelector('.grid-container')
    .addEventListener('click', function (event) {
      const target = event.target;
      if (target.tagName === 'BUTTON') {
        const value = target.textContent;
        switch (value) {
          case 'AC':
            handleAC();
            break;
          case '⌫':
            handleBackspace();
            break;
          case '+':
          case '-':
          case '×':
          case '÷':
            handleOperator(value);
            break;
          case '=':
            handleEquals();
            break;
          default:
            handleInput(value);
            break;
        }
      }
      if (screen.textContent == 'NaN') {
        handleAC();
      }
    });

  // Event listener for button clicks in the side grid
  document
    .querySelector('.grid-side')
    .addEventListener('click', function (event) {
      const target = event.target;
      if (target.tagName === 'BUTTON') {
        const value = target.textContent;
        switch (value) {
          case '+':
          case '-':
          case '×':
          case '/':
            handleOperator(value);
            break;
          case '=':
            handleEquals();
            break;
        }
      }
      if (screen.textContent == 'NaN') {
        handleAC();
      }
    });

  // Event listener for keyboard input
  document.addEventListener('keydown', function (event) {
    const key = event.key;
    handleKeyboardInput(key);
  });

  // Function to handle changes to the screen content
  function handleScreenChanges(mutationsList, observer) {
    const maxLength = 19; // Adjust as needed
    const textLength = document.getElementById('screen').textContent.length;
    const scaleFactor = 0.99; // Adjust as needed

    // Calculate the new font size based on text length
    const newSize = Math.max(
      10,
      500 - (textLength / maxLength) * 405 * scaleFactor
    );

    // Apply the new font size to the screen
    document.getElementById('screen').style.fontSize = newSize + '%';
  }

  // Create a new MutationObserver
  const observer = new MutationObserver(handleScreenChanges);

  // Configure the observer to listen to changes in the screen content
  const config = { subtree: true, childList: true };

  // Start observing the target node for configured mutations
  observer.observe(document.getElementById('screen'), config);
});
document.addEventListener('DOMContentLoaded', function () {
  let isToggled = false;

  const toggleColors = () => {
    const originalMetaColor = '#08527f';
    const newMetaColor = '#d20801';
    const originalBackgroundColor = 'linear-gradient(#08527f, #022a42)';
    const newBackgroundColor = 'linear-gradient(#d20801, #3a0014)';
    const originalButtonColor = 'rgb(0, 153, 255)';
    const newButtonColor = 'rgb(255, 10, 0)';

    // Define blue and red colors
    let buttons = document.querySelectorAll('.grid-item-operator button');

    // Loop through each button and restyle it
    buttons.forEach((button) => {
      // Modify CSS properties based on toggle state
      button.style.backgroundColor = isToggled
        ? originalButtonColor
        : newButtonColor;
    });

    buttons = document.querySelectorAll('.grid-item-numbers.tall button');

    // Loop through each button and restyle it
    buttons.forEach((button) => {
      // Modify CSS properties based on toggle state
      button.style.backgroundColor = isToggled
        ? originalButtonColor
        : newButtonColor;
    });

    // Change body background color based on toggle state
    document.body.style.background = isToggled
      ? originalBackgroundColor
      : newBackgroundColor;
    document.body.style.backgroundAttachment = 'fixed';

    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    // Change the content attribute based on toggle state
    themeColorMeta.setAttribute(
      'content',
      isToggled ? originalMetaColor : newMetaColor
    );

    // Toggle the state
    isToggled = !isToggled;
  };

  const floatingButton = document.querySelector('.floating-button');

  floatingButton.addEventListener('click', toggleColors);
});
