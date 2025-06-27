fetch('http://localhost:3001/')
    .then(res => res.json())
    .then(data => {
        document.getElementById('output').textContent = data.message;
    });

/**
 * Reads two numbers and an operation from input fields,
 * sends them to the `/calculate` endpoint via POST,
 * and displays the result in the `result` div.
 *
 * @function
 * @returns {void}
 */
function calculate() {
    var value1 = Number(document.getElementById("number1").value);
    var value2 = Number(document.getElementById("number2").value);
    var operation = document.getElementById("operation").value;

    // Send the three values to /calculate
    fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            value1: value1,
            value2: value2,
            operation: operation
        })
    })
        .then(res => res.json())
        .then(result => {
            document.getElementById('result').textContent = "The result is " + result.result;
        });
}