import React, { useState } from 'react';
import { Container, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    const sanitizedEquation = equation.replace(/\s+/g, '');
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

  // Prepare data for the line chart
  const chartData = {
    labels: numbers.map((_, index) => `Index ${index + 1}`),
    datasets: [
      {
        label: 'Number Values',
        data: numbers,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.1,
      },
    ],
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

      {/* Line Chart */}
      {numbers.length > 0 && (
        <div className="mt-5">
          <h3>Line Graph of Numbers</h3>
          <Line data={chartData} />
        </div>
      )}
    </Container>
  );
};

export default App;