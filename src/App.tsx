import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaThumbtack, FaTrash } from 'react-icons/fa'; // Import the pin and trash icons

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Results = {
  average: number; // Changed from string to number
  median: number;  // Changed from string to number
  mean: number;    // Changed from string to number
};

type PinnedSet = {
  numbers: number[];
  color: string;
  results: Results;
  name: string; // Add name property
};

// Number formatter for consistent formatting
const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Component to render Median, Mean, and Mode
const ResultsText: React.FC<{ median: number; mean: number; mode: number }> = ({ median, mean, mode }) => (
  <div>
    <p><strong>Median: </strong>{numberFormatter.format(median)}</p>
    <p><strong>Mean: </strong>{numberFormatter.format(mean)}</p>
    <p><strong>Mode: </strong>{numberFormatter.format(mode)}</p>
  </div>
);

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [results, setResults] = useState<Results | null>(null);
  const [pinnedSets, setPinnedSets] = useState<PinnedSet[]>([]); // Use PinnedSet type

  // Load last entered expression from local storage on mount
  useEffect(() => {
    const savedExpression = localStorage.getItem('lastExpression');
    if (savedExpression) {
      setInputValue(savedExpression);
      const parsedNumbers = parseEquation(savedExpression);
      if (parsedNumbers.length > 0) {
        setNumbers(parsedNumbers);
        calculateStats(parsedNumbers);
      }
    }
  }, []);

  // Handle real-time parsing and calculation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.trim() === '') {
      setNumbers([]);
      setResults(null);
      localStorage.removeItem('lastExpression');
      return;
    }

    localStorage.setItem('lastExpression', value); // Save expression to local storage
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

  // Calculate mode, median, and mean
  const calculateStats = (nums: number[]) => {
    const sortedNumbers = [...nums].sort((a, b) => a - b);
    const length = sortedNumbers.length;

    const frequencyMap: Record<number, number> = {};
    nums.forEach((num) => {
      frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    const maxFrequency = Math.max(...Object.values(frequencyMap));
    const mode = parseFloat(
      Object.keys(frequencyMap)
        .filter((key) => frequencyMap[Number(key)] === maxFrequency)
        .map(Number)
        .sort((a, b) => a - b)
        .join(', ')
    );

    let median;
    if (length % 2 === 0) {
      median = (sortedNumbers[length / 2 - 1] + sortedNumbers[length / 2]) / 2;
    } else {
      median = sortedNumbers[Math.floor(length / 2)];
    }

    setResults({
      average: mode, // Store as number
      median: median,
      mean: nums.reduce((a, b) => a + b, 0) / length,
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

  // Pin the current set of numbers and reset input
  const handlePinNumbers = () => {
    if (numbers.length > 0 && results) {
      const newPinnedSet: PinnedSet = {
        numbers,
        color: getRandomColor(), // Assign a random color
        results,
        name: `Pinned Set ${pinnedSets.length + 1}`, // Default name
      };
      setPinnedSets([...pinnedSets, newPinnedSet]);
      setInputValue('');
      setNumbers([]);
      setResults(null);
    }
  };

  const handleEditPinnedSetName = (index: number, newName: string) => {
    const updatedPinnedSets = [...pinnedSets];
    updatedPinnedSets[index].name = newName;
    setPinnedSets(updatedPinnedSets);
  };

  const handleDeletePinnedSet = (index: number) => {
    if (window.confirm('Are you sure you want to delete this pinned set?')) {
      const updatedPinnedSets = [...pinnedSets];
      updatedPinnedSets.splice(index, 1);
      setPinnedSets(updatedPinnedSets);
    }
  };

  // Generate a random vibrant color
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  // Prepare data for the line chart, including pinned sets
  const chartData = {
    labels: numbers.map((_, index) => `Index ${index + 1}`),
    datasets: [
      ...pinnedSets.map((set, idx) => ({
        label: `Pinned Set ${idx + 1}`,
        data: set.numbers,
        fill: false,
        borderColor: set.color, // Use color from PinnedSet
        tension: 0.1,
      })),
      {
        label: 'Current Numbers',
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

      {/* Parsed Numbers */}
      <div className="mt-4">
        <h3>Parsed Numbers:</h3>
        <div className="d-flex align-items-center flex-wrap">
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
          {numbers.length > 0 && (
            <Button
              onClick={handlePinNumbers}
              variant="light"
              className="ml-2 mb-2 p-0"
              onMouseEnter={(e) => (e.currentTarget.style.color = 'black')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'gray')}
            >
              <FaThumbtack size={16} />
            </Button>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="mt-4 d-flex flex-wrap" style={{ gap: '16px' }}> {/* Add gap for spacing */}
        {/* Current working set */}
        {results && (
          <div>
            <Alert variant="info">
              <h4>Stats:</h4>
              <ResultsText median={results.median} mean={results.mean} mode={results.average} />
            </Alert>
          </div>
        )}

        {/* Pinned sets */}
        {[...pinnedSets].reverse().map((set, idx) => ( // Reverse the order for newest on the left
          <div key={idx}>
            <Alert variant="secondary" style={{ position: 'relative' }}> {/* Add relative positioning */}
              <Button
                variant="link"
                onClick={() => handleDeletePinnedSet(pinnedSets.length - 1 - idx)} // Adjust index for reversed order
                style={{
                  color: 'red',
                  padding: 0,
                  position: 'absolute', // Position the button
                  top: '8px', // Align to the top
                  right: '8px', // Align to the right
                }}
              >
                <FaTrash />
              </Button>
              <input
                type="text"
                value={set.name}
                onChange={(e) => handleEditPinnedSetName(pinnedSets.length - 1 - idx, e.target.value)} // Adjust index for reversed order
                placeholder={`Pinned Set ${pinnedSets.length - idx}`} // Default name as placeholder
                style={{
                  fontWeight: 'bold',
                  color: '#6c757d',
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  marginBottom: '8px',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', border: `1px solid ${set.color}`, padding: '8px', borderRadius: '4px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    maxWidth: '160px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    marginLeft: '8px',
                  }}
                  title={set.numbers.join(', ')} // Full numbers as tooltip
                >
                  {set.numbers.join(', ')}
                </span>
              </div>
              <ResultsText median={set.results.median} mean={set.results.mean} mode={set.results.average} />
            </Alert>
          </div>
        ))}
      </div>

      {/* Line Chart */}
      {numbers.length > 0 || pinnedSets.length > 0 ? (
        <div className="mt-5">
          <h3>Line Graph of Numbers</h3>
          <Line data={chartData} />
        </div>
      ) : null}
    </Container>
  );
};

export default App;