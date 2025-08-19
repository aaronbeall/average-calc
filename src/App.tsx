import tinycolor from 'tinycolor2';
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert, Badge } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaThumbtack } from 'react-icons/fa'; // Import the pin and trash icons
import { FaCog, FaTrash, FaPalette, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

type Results = {
  total: number;
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
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

// Component to render Total, Median, Mean, and Mode
const ResultsText: React.FC<{ total: number; median: number; mean: number; mode: number }> = ({ total, median, mean, mode }) => (
  <div style={{
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '6px',
    boxShadow: 'none',
    padding: '10px 12px',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    minWidth: '180px',
    maxWidth: '320px',
  }}>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 500, color: '#2d7d46', letterSpacing: '0.01em' }}>Total</span>
        <span style={{
          color: total >= 0 ? '#2d7d46' : '#b00020',
          background: total >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontWeight: 600,
          fontSize: '1em',
          minWidth: '48px',
          textAlign: 'right',
        }}>{numberFormatter.format(total)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', letterSpacing: '0.01em' }}>Median</span>
        <span style={{
          color: median >= 0 ? '#2d7d46' : '#b00020',
          background: median >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontWeight: 600,
          minWidth: '48px',
          textAlign: 'right',
        }}>{numberFormatter.format(median)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', letterSpacing: '0.01em' }}>Mean</span>
        <span style={{
          color: mean >= 0 ? '#2d7d46' : '#b00020',
          background: mean >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontWeight: 600,
          minWidth: '48px',
          textAlign: 'right',
        }}>{numberFormatter.format(mean)}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', letterSpacing: '0.01em' }}>Mode</span>
        <span style={{
          color: mode >= 0 ? '#2d7d46' : '#b00020',
          background: mode >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '4px',
          padding: '2px 8px',
          fontWeight: 600,
          minWidth: '48px',
          textAlign: 'right',
        }}>{numberFormatter.format(mode)}</span>
      </div>
    </div>
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

  useEffect(() => {
    const savedPinnedSets = localStorage.getItem('pinnedSets');
    if (savedPinnedSets) {
      setPinnedSets(JSON.parse(savedPinnedSets));
    }
  }, []); // Ensure this runs only once on mount

  // Move pinned set left
  const handleMovePinnedSetLeft = (index: number) => {
    if (index >= pinnedSets.length - 1) return;
    const updated = [...pinnedSets];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setPinnedSets(updated);
  };

  // Move pinned set right
  const handleMovePinnedSetRight = (index: number) => {
    if (index <= 0) return;
    const updated = [...pinnedSets];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setPinnedSets(updated);
  };

  // Change color of pinned set
  const handleChangePinnedSetColor = (index: number) => {
    const updated = [...pinnedSets];
    updated[index].color = getRandomColor();
    setPinnedSets(updated);
  };

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

  // Calculate mode, median, mean, and total
  const calculateStats = (nums: number[]) => {
    const sortedNumbers = [...nums].sort((a, b) => a - b);
    const length = sortedNumbers.length;
    const total = nums.reduce((a, b) => a + b, 0);

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
      total,
      average: mode, // Store as number
      median: median,
      mean: total / length,
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

  const updatePinnedSets = (newPinnedSets: PinnedSet[]) => {
    setPinnedSets(newPinnedSets);
    localStorage.setItem('pinnedSets', JSON.stringify(newPinnedSets)); // Save to local storage
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
      updatePinnedSets([...pinnedSets, newPinnedSet]); // Use helper function
      setInputValue('');
      setNumbers([]);
      setResults(null);
    }
  };

  const handleEditPinnedSetName = (index: number, newName: string) => {
    const updatedPinnedSets = [...pinnedSets];
    updatedPinnedSets[index].name = newName;
    updatePinnedSets(updatedPinnedSets); // Use helper function
  };

  const handleDeletePinnedSet = (index: number) => {
    if (window.confirm('Are you sure you want to delete this pinned set?')) {
      const updatedPinnedSets = [...pinnedSets];
      updatedPinnedSets.splice(index, 1);
      updatePinnedSets(updatedPinnedSets); // Use helper function
    }
  };

  const handleEditPinnedSetNumbers = (setIndex: number, newValue: string) => {
    const updatedPinnedSets = [...pinnedSets];
    const parsedNumbers = parseEquation(newValue); // Parse the input just like the main input

    if (parsedNumbers.length > 0) {
      const sortedNumbers = [...parsedNumbers].sort((a, b) => a - b);
      const length = sortedNumbers.length;

      const frequencyMap: Record<number, number> = {};
      parsedNumbers.forEach((num) => {
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

      updatedPinnedSets[setIndex].numbers = parsedNumbers;
      const total = parsedNumbers.reduce((a, b) => a + b, 0);
      updatedPinnedSets[setIndex].results = {
        total,
        average: mode,
        median: median,
        mean: total / length,
      };

      updatePinnedSets(updatedPinnedSets); // Use helper function
    }
  };

  // Generate a random vibrant color
  const getRandomColor = () => {
  // Use random hue, and random pleasant ranges for saturation and lightness
  const hue = Math.floor(Math.random() * 360);
  // Saturation: 0.5 - 0.85 (vivid but not neon)
  const saturation = 0.5 + Math.random() * 0.35;
  // Lightness: 0.45 - 0.7 (not too dark or washed out)
  const lightness = 0.45 + Math.random() * 0.25;
  const color = tinycolor({ h: hue, s: saturation, l: lightness }).toHexString();
  return color;
  };

  const formatEquation = (numbers: number[]): string => {
    return numbers.map((num, i) => (i === 0 ? num : (num >= 0 ? `+${num}` : `${num}`))).join(' ');
  };

  // Prepare data for the line chart, including pinned sets
  const chartData = {
    labels: numbers.map((_, index) => `Index ${index + 1}`),
    datasets: [
      ...pinnedSets.map((set) => ({
        label: set.name, // Use the pinned set title name
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
    <Container className="mt-5" fluid>
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
              <ResultsText total={results.total} median={results.median} mean={results.mean} mode={results.average} />
            </Alert>
          </div>
        )}

        {/* Pinned sets */}
        {[...pinnedSets].reverse().map((set, idx) => ( // No need for null checks
          <div key={idx}>
            <Alert
              variant="secondary"
              style={{
                position: 'relative',
                paddingLeft: '16px',
                borderLeft: `12px solid ${set.color}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                background: '#f8f9fa',
              }}
            >
              <Dropdown style={{ position: 'absolute', top: 8, right: 8 }}>
                <Dropdown.Toggle variant="link" style={{ color: '#888', padding: 0 }}>
                  <FaCog />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this pinned set?')) {
                        handleDeletePinnedSet(pinnedSets.length - 1 - idx);
                      }
                    }}
                  >
                    <FaTrash style={{ marginRight: 8 }} /> Delete
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleChangePinnedSetColor(pinnedSets.length - 1 - idx)}>
                    <FaPalette style={{ marginRight: 8 }} /> New color
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMovePinnedSetLeft(pinnedSets.length - 1 - idx)} disabled={idx === 0}>
                    <FaArrowLeft style={{ marginRight: 8 }} /> Move left
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleMovePinnedSetRight(pinnedSets.length - 1 - idx)} disabled={idx === pinnedSets.length - 1}>
                    <FaArrowRight style={{ marginRight: 8 }} /> Move right
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
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
                onFocus={(e) => (e.target.style.background = '#f8f9fa')} // Light gray background on focus
                onBlur={(e) => (e.target.style.background = 'transparent')} // Reset background on blur
              />
              <Form.Control
                type="text"
                value={formatEquation(set.numbers)} // Use formatEquation to handle formatting
                onChange={(e) => handleEditPinnedSetNumbers(pinnedSets.length - 1 - idx, e.target.value)} // Adjust index for reversed order
                placeholder="Enter numbers (e.g., 1+2-3)"
                style={{
                  marginBottom: '8px',
                  background: 'transparent',
                  border: '1px solid #ced4da', // Default border
                }}
                onFocus={(e) => (e.target.style.background = '#f8f9fa')}
                onBlur={(e) => (e.target.style.background = 'transparent')}
              />
              <ResultsText total={set.results.total} median={set.results.median} mean={set.results.mean} mode={set.results.average} />
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