import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Badge } from 'react-bootstrap';

type Results = {
  average: string;
  median: string;
  mean: string;
};

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<Results | null>(null);

  // Handle real-time parsing and calculation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setNumbers([]);
      setResults(null);
      return;
    }

    const parsedNumbers = parseEquation(value);
    if (parsedNumbers.length > 0) {
      setNumbers(parsedNumbers);
      calculateStats(parsedNumbers);
    } else {
      setNumbers([]);
      setResults(null);
    }
  };

  // Parse equation into an array of numbers
  const parseEquation = (equation: string): number[] => {
    // Remove any spaces from the equation
    const sanitizedEquation = equation.replace(/\s+/g, '');

    // Split by '+' or '-' while keeping the operators
    const regex = /([+-]?\d+(\.\d+)?)/g;
    const matches = sanitizedEquation.match(regex);

    return matches ? matches.map((match) => parseFloat(match)) : [];
  };

  // Calculate average, median, and mean
  const calculateStats = (nums: number[]) => {
    const sortedNumbers = [...nums].sort((a, b) => a - b);
    const length = sortedNumbers.length;

    const average = nums.reduce((a, b) => a + b, 0) / length;

    let median;
    if (length % 2 === 0) {
      median = (sortedNumbers[length / 2 - 1] + sortedNumbers[length / 2]) / 2;
    } else {
      median = sortedNumbers[Math.floor(length / 2)];
    }

    setResults({
      average: average.toFixed(2),
      median: median.toFixed(2),
      mean: average.toFixed(2),
    });
  };

  // Remove a number from the list and recalculate stats
  const handleRemoveNumber = (index: number) => {
    const updatedNumbers = [...numbers];
    updatedNumbers.splice(index, 1);
    setNumbers(updatedNumbers);
    calculateStats(updatedNumbers);
  };

  // Clear input and results
  const handleClear = () => {
    setInputValue('');
    setNumbers([]);
    setResults(null);
  };

  return (
    <Container className="mt-5">
      <h1>Math Expression Stats</h1>
      <Form.Group controlId="formBasicEquation">
        <Form.Label>Enter a math equation (+ and - only):</Form.Label>
        <Form.Control
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="e.g., 1+2-3+4"
        />
      </Form.Group>

      <Button onClick={handleClear} variant="danger" className="mt-3">
        Clear
      </Button>

      <div className="mt-4">
        <h3>Parsed Numbers:</h3>
        <div>
          {numbers.map((num, index) => (
            <Badge
              key={index}
              className="mr-2 mb-2"
              onClick={() => handleRemoveNumber(index)}
              style={{ cursor: 'pointer' }}
            >
              {num}
            </Badge>
          ))}
        </div>
      </div>

      {results && (
        <div className="mt-4">
          <Alert variant="info">
            <h4>Stats:</h4>
            <p><strong>Average: </strong>{results.average}</p>
            <p><strong>Median: </strong>{results.median}</p>
            <p><strong>Mean: </strong>{results.mean}</p>
          </Alert>
        </div>
      )}
    </Container>
  );
};

export default App;