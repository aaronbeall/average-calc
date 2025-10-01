
import tinycolor from 'tinycolor2';
import React, { useState, useEffect } from 'react';
import logo from '../public/logo.svg';
import { Form } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaThumbtack, FaCog, FaTrash, FaPalette, FaArrowLeft, FaArrowRight, FaChartLine, FaChartBar, FaSort, FaSortAmountUp, FaSortAmountDown } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';


// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

type Results = {
  total: number;
  median: number;
  mean: number;
  min: number;
  max: number;
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
const ResultsText: React.FC<{ total: number; median: number; mean: number; min: number; max: number }> = ({ total, median, mean, min, max }) => (
  <div style={{
    background: 'rgba(255,255,255,0.85)',
    borderRadius: '5px',
    boxShadow: 'none',
    padding: '7px 8px',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
    minWidth: '150px',
    maxWidth: '260px',
  }}>
    {/* Total - most important */}
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: '6px',
      paddingBottom: '2px',
      borderBottom: '1px solid #e0e0e0',
    }}>
  <span style={{ fontWeight: 600, color: '#3a3a3a', fontSize: '1em', letterSpacing: '0.01em' }}>Total</span>
      <span style={{
        color: total >= 0 ? '#2d7d46' : '#b00020',
        background: total >= 0 ? 'rgba(45,125,70,0.10)' : 'rgba(176,0,32,0.10)',
        borderRadius: '3px',
        padding: '2px 8px',
        fontWeight: 700,
        fontSize: '1em',
        minWidth: '44px',
        textAlign: 'right',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
      }}>{numberFormatter.format(total)}</span>
    </div>
    {/* Median & Mean - related group */}
    <div style={{ display: 'flex', gap: '8px', margin: '6px 0', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', fontSize: '0.95em', textAlign: 'left', flex: 1 }}>Median</span>
        <span style={{
          color: median >= 0 ? '#2d7d46' : '#b00020',
          background: median >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '3px',
          padding: '1px 6px',
          fontWeight: 600,
          minWidth: '36px',
          textAlign: 'right',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}>{numberFormatter.format(median)}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', fontSize: '0.95em', textAlign: 'left', flex: 1 }}>Mean</span>
        <span style={{
          color: mean >= 0 ? '#2d7d46' : '#b00020',
          background: mean >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '3px',
          padding: '1px 6px',
          fontWeight: 600,
          minWidth: '36px',
          textAlign: 'right',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}>{numberFormatter.format(mean)}</span>
      </div>
    </div>
    {/* Divider for hierarchy */}
  <div style={{ borderBottom: '1px solid #e0e0e0', margin: '2px 0 6px 0' }} />
    {/* Min & Max - related group */}
    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', fontSize: '0.95em', textAlign: 'left', flex: 1 }}>Min</span>
        <span style={{
          color: min >= 0 ? '#2d7d46' : '#b00020',
          background: min >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '3px',
          padding: '1px 6px',
          fontWeight: 600,
          minWidth: '36px',
          textAlign: 'right',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}>{numberFormatter.format(min)}</span>
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontWeight: 500, color: '#3a3a3a', fontSize: '0.95em', textAlign: 'left', flex: 1 }}>Max</span>
        <span style={{
          color: max >= 0 ? '#2d7d46' : '#b00020',
          background: max >= 0 ? 'rgba(45,125,70,0.08)' : 'rgba(176,0,32,0.08)',
          borderRadius: '3px',
          padding: '1px 6px',
          fontWeight: 600,
          minWidth: '36px',
          textAlign: 'right',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        }}>{numberFormatter.format(max)}</span>
      </div>
    </div>
  </div>
);

const App: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');
  const [numbers, setNumbers] = useState<number[]>([]);
  const [sortMode, setSortMode] = useState<'original' | 'asc' | 'desc'>('original');
  const [results, setResults] = useState<Results | null>(null);
  const [pinnedSets, setPinnedSets] = useState<PinnedSet[]>([]); // Use PinnedSet type
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

  // Load last entered expression from local storage on mount
  useEffect(() => {
    const savedExpression = localStorage.getItem('lastExpression');
    if (savedExpression) {
      setInputValue(savedExpression);
      const parsedNumbers = parseEquation(savedExpression);
      if (parsedNumbers.length > 0) {
        setNumbers(parsedNumbers);
        updateResults(parsedNumbers);
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
    updatePinnedSets(updated);
  };

  // Move pinned set right
  const handleMovePinnedSetRight = (index: number) => {
    if (index <= 0) return;
    const updated = [...pinnedSets];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    updatePinnedSets(updated);
  };

  // Change color of pinned set
  const handleChangePinnedSetColor = (index: number) => {
    const updated = [...pinnedSets];
    updated[index].color = getRandomColor();
    updatePinnedSets(updated);
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
    setNumbers(parsedNumbers);
    if (parsedNumbers.length > 0) {
      updateResults(parsedNumbers);
    } else {
      setResults(null);
    }
  };

  // Parse equation into an array of numbers
  const parseEquation = (equation: string): number[] => {
    // Remove spaces and commas
    const sanitizedEquation = equation.replace(/[\s,]+/g, '');
    const regex = /([+-]?\d+(\.\d+)?)/g;
    const matches = sanitizedEquation.match(regex);

    return matches ? matches.map((match) => parseFloat(match)) : [];
  };

  const updateResults = (nums: number[]) => {
    setResults(calculateStats(nums));
  }

  // Calculate min, max, median, mean, and total
  const calculateStats = (nums: number[]) => {
    const sortedNumbers = [...nums].sort((a, b) => a - b);
    const length = sortedNumbers.length;
    const total = nums.reduce((a, b) => a + b, 0);
    const min = length > 0 ? sortedNumbers[0] : 0;
    const max = length > 0 ? sortedNumbers[length - 1] : 0;

    let median;
    if (length % 2 === 0) {
      median = (sortedNumbers[length / 2 - 1] + sortedNumbers[length / 2]) / 2;
    } else {
      median = sortedNumbers[Math.floor(length / 2)];
    }

    return {
      total,
      median,
      mean: total / length,
      min,
      max,
    };
  };

  // Helper to get sorted numbers for display
  const getSortedNumbers = (nums: number[], mode: 'original' | 'asc' | 'desc') => {
    if (mode === 'asc') return [...nums].sort((a, b) => a - b);
    if (mode === 'desc') return [...nums].sort((a, b) => b - a);
    return nums;
  };

  // Remove a number from the list and recalculate stats
  const handleRemoveNumber = (index: number) => {
    // Remove from the unsorted numbers (input order)
    const unsorted = [...numbers];
    // To remove the correct number, we need to know which number is being displayed at this index in the sorted view
    const sortedNumbers = getSortedNumbers(numbers, sortMode);
    const numToRemove = sortedNumbers[index];
    // Remove the first occurrence of numToRemove from the unsorted numbers
    const removeIdx = unsorted.indexOf(numToRemove);
    if (removeIdx !== -1) {
      unsorted.splice(removeIdx, 1);
      setNumbers(unsorted);
      updateResults(unsorted);
    }
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
      updatedPinnedSets[setIndex].numbers = parsedNumbers;
      updatedPinnedSets[setIndex].results = calculateStats(parsedNumbers);
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

  const [cumulative, setCumulative] = React.useState(false);

  // Prepare data for the chart, including pinned sets
  // Compute the largest set length for x-axis
  const allChartSets = [...pinnedSets.map((set) => set.numbers), numbers];
  const maxSetLength = Math.max(0, ...allChartSets.map(arr => arr.length));
  const chartLabels = Array.from({ length: maxSetLength }, (_, i) => `${i + 1}`);

  const chartData = {
    labels: chartLabels,
    datasets: [
      ...pinnedSets.map((set) => ({
        label: set.name,
        data: [...set.numbers, ...Array(maxSetLength - set.numbers.length).fill(null)],
        fill: false,
        borderColor: set.color,
        backgroundColor: set.color,
        tension: 0.1,
      })),
      {
        label: 'Current Numbers',
        data: [...numbers, ...Array(maxSetLength - numbers.length).fill(null)],
        fill: false,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
      },
    ],
  };

  // Helper to get chart data in serial or cumulative mode
  const getChartData = () => {
    if (!cumulative) return chartData;
    // Cumulative: sum up each dataset
    const cumulate = (arr: number[]) => arr.reduce((acc, val, i) => {
      acc.push((acc[i - 1] || 0) + val);
      return acc;
    }, [] as number[]);
    const newDatasets = chartData.datasets.map(ds => ({
      ...ds,
      data: cumulate(ds.data as number[]),
    }));
    return { ...chartData, datasets: newDatasets };
  };

  // Compute totals across all sets (current + pinned) using calculateStats
  const allSets = [numbers, ...pinnedSets.map(set => set.numbers)].filter(arr => arr && arr.length > 0);
  const totalsStats = calculateStats(allSets.flat());

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(120deg, #f8fafc 0%, #e3e9f3 100%)', padding: 0, margin: 0, width: '100vw', overflowX: 'hidden' }}>
  <div style={{ width: '100%', padding: '32px 0 48px 0', boxSizing: 'border-box' }}>
        {/* Header */}
        <div style={{
          maxWidth: 1400,
          marginLeft: 'auto',
          marginRight: 'auto',
          paddingLeft: '4vw',
          paddingRight: '4vw',
          boxSizing: 'border-box',
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          marginBottom: 32
        }}>
          <img src={logo} alt="Logo" style={{ height: 48, width: 48, marginRight: 10, flexShrink: 0 }} />
          <h1 style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#1e293b',
            margin: 0,
            textShadow: '0 2px 8px rgba(30,41,59,0.04)'
          }}>Number <span style={{ color: '#3b82f6', fontWeight: 900 }}>Stats</span></h1>
        </div>

  <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 32px rgba(30,41,59,0.07)', padding: '32px 4vw 24px 4vw', marginBottom: 32, maxWidth: 1400, marginLeft: 'auto', marginRight: 'auto' }}>
          {/* Input Section */}
          <Form.Group controlId="formBasicEquation" style={{ marginBottom: 24 }}>
            <Form.Label style={{ fontWeight: 700, fontSize: '1.15em', color: '#334155', marginBottom: 8 }}>Enter a math equation <span style={{ color: '#3b82f6' }}>(+ and - only)</span>:</Form.Label>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <Form.Control
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="e.g., 1+2-3+4"
                style={{ fontSize: '1.15em', padding: '10px 16px', borderRadius: 8, border: '1.5px solid #e0e7ef', background: '#f8fafc', color: '#1e293b', fontWeight: 500, flex: 1 }}
              />
            </div>
          </Form.Group>

          {/* Parsed Numbers Section */}
          <div style={{ marginTop: 8, marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontWeight: 600, color: '#64748b', fontSize: '1.08em' }}>Parsed Numbers</span>
              <button
                type="button"
                onClick={() => {
                  let nextMode: 'original' | 'asc' | 'desc';
                  if (sortMode === 'original') nextMode = 'asc';
                  else if (sortMode === 'asc') nextMode = 'desc';
                  else nextMode = 'original';
                  setSortMode(nextMode);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: 20,
                  cursor: 'pointer',
                  marginLeft: 10,
                  padding: 2,
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'color 0.15s',
                }}
                title={
                  sortMode === 'original'
                    ? 'Sort ascending'
                    : sortMode === 'asc'
                    ? 'Sort descending'
                    : 'Original order'
                }
                aria-label="Toggle sort order"
              >
                {sortMode === 'original' && <FaSort style={{ color: '#64748b' }} />}
                {sortMode === 'asc' && <FaSortAmountUp style={{ color: '#2563eb' }} />}
                {sortMode === 'desc' && <FaSortAmountDown style={{ color: '#2563eb' }} />}
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
              {getSortedNumbers(numbers, sortMode).map((num, index) => (
                <ParsedNumberBadge
                  key={index}
                  num={num}
                  onRemove={() => handleRemoveNumber(index)}
                />
              ))}
              {/* Pin button moved to Current Set tile */}
            </div>
          </div>
        </div>

        {/* Results, pinned sets, totals, and chart will be modernized in the next steps */}
        {/* Results & Sets Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '32px',
          marginTop: 32,
          marginBottom: 32,
          width: '100%',
          maxWidth: 1400,
          marginLeft: 'auto',
          marginRight: 'auto',
          boxSizing: 'border-box',
        }}>
          {/* Current working set */}
          {results && (
            <div style={{ background: '#f1f5f9', borderRadius: 14, boxShadow: '0 2px 8px rgba(30,41,59,0.04)', padding: '22px 20px 18px 20px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', width: '100%', marginBottom: 8 }}>
                <span style={{ fontWeight: 700, color: '#2563eb', fontSize: '1.13em', letterSpacing: '-0.01em', flex: 1 }}>Current Set</span>
                <button
                  onClick={handlePinNumbers}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    marginLeft: 8,
                    color: '#2563eb',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: 20,
                  }}
                  title="Pin this set"
                >
                  <FaThumbtack size={20} />
                </button>
              </div>
              <ResultsText total={results.total} median={results.median} mean={results.mean} min={results.min} max={results.max} />
            </div>
          )}

          {/* Pinned sets */}
          {[...pinnedSets].reverse().map((set, idx) => (
            <div key={idx} style={{ background: '#f8fafc', borderRadius: 14, boxShadow: '0 2px 8px rgba(30,41,59,0.04)', padding: '22px 20px 18px 20px', minWidth: 0, position: 'relative', borderLeft: `8px solid ${set.color}` }}>
              <Dropdown style={{ position: 'absolute', top: 12, right: 12 }}>
                <Dropdown.Toggle variant="link" style={{ color: '#888', padding: 0 }}>
                  <FaCog />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item
                    onClick={() => handleDeletePinnedSet(pinnedSets.length - 1 - idx)}
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
                onChange={(e) => handleEditPinnedSetName(pinnedSets.length - 1 - idx, e.target.value)}
                placeholder={`Pinned Set ${pinnedSets.length - idx}`}
                style={{
                  fontWeight: 'bold',
                  color: '#64748b',
                  border: 'none',
                  background: 'transparent',
                  width: '100%',
                  marginBottom: '8px',
                  outline: 'none',
                  fontSize: '1.08em',
                }}
                onFocus={(e) => (e.target.style.background = '#f1f5f9')}
                onBlur={(e) => (e.target.style.background = 'transparent')}
              />
              <Form.Control
                type="text"
                value={formatEquation(set.numbers)}
                onChange={(e) => handleEditPinnedSetNumbers(pinnedSets.length - 1 - idx, e.target.value)}
                placeholder="Enter numbers (e.g., 1+2-3)"
                style={{
                  marginBottom: '8px',
                  background: '#f8fafc',
                  border: '1.5px solid #e0e7ef',
                  borderRadius: 8,
                  fontWeight: 500,
                  color: '#334155',
                  fontSize: '1.08em',
                }}
                onFocus={(e) => (e.target.style.background = '#f1f5f9')}
                onBlur={(e) => (e.target.style.background = '#f8fafc')}
              />
              <ResultsText total={set.results.total} median={set.results.median} mean={set.results.mean} min={set.results.min} max={set.results.max} />
            </div>
          ))}

          {/* Totals card across all sets */}
          {totalsStats && (
            <div style={{ background: 'linear-gradient(90deg, #e8f5e9 60%, #f8fff8 100%)', borderRadius: 14, boxShadow: '0 2px 8px rgba(30,130,76,0.07)', padding: '22px 20px 18px 20px', minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ fontSize: '1.13em', fontWeight: 700, marginBottom: 8, color: '#1e824c', letterSpacing: '-0.01em' }}>Totals (All Sets)</div>
              <ResultsText total={totalsStats.total} median={totalsStats.median} mean={totalsStats.mean} min={totalsStats.min} max={totalsStats.max} />
            </div>
          )}
        </div>

        {/* Chart Section */}
        {(numbers.length > 0 || pinnedSets.length > 0) && (
          <div style={{
            background: '#fff',
            borderRadius: 14,
            boxShadow: '0 4px 32px rgba(30,41,59,0.07)',
            padding: '32px 4vw 28px 4vw',
            marginTop: 24,
            marginBottom: 0,
            width: '100%',
            maxWidth: 1400,
            marginLeft: 'auto',
            marginRight: 'auto',
            boxSizing: 'border-box',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginBottom: 18 }}>
              <div style={{ fontWeight: 700, color: '#334155', fontSize: '1.18em', letterSpacing: '-0.01em', flex: 1 }}>Graph of Numbers</div>
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  type="button"
                  style={{
                    border: '1.5px solid #e0e7ef',
                    borderRadius: 8,
                    background: '#f8fafc',
                    color: '#2563eb',
                    padding: '7px 14px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.08em',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                  }}
                  onClick={() => setChartType(chartType === 'line' ? 'bar' : 'line')}
                  title={chartType === 'line' ? 'Switch to bar chart' : 'Switch to line chart'}
                >
                  {chartType === 'line' ? <FaChartLine style={{ marginRight: 7 }} /> : <FaChartBar style={{ marginRight: 7 }} />}
                  {chartType === 'line' ? 'Line' : 'Bar'}
                </button>
                <button
                  type="button"
                  style={{
                    border: '1.5px solid #e0e7ef',
                    borderRadius: 8,
                    background: cumulative ? '#e0e7ef' : '#f8fafc',
                    color: '#2563eb',
                    padding: '7px 14px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '1.08em',
                    display: 'flex',
                    alignItems: 'center',
                    transition: 'background 0.2s',
                    boxShadow: cumulative ? '0 2px 8px rgba(59,130,246,0.07)' : 'none',
                  }}
                  onClick={() => setCumulative(c => !c)}
                  title={cumulative ? 'Show serial (raw) data' : 'Show cumulative data'}
                >
                  <FaSortAmountUp style={{ marginRight: 7, opacity: cumulative ? 1 : 0.4 }} />
                  {cumulative ? 'Cumulative' : 'Serial'}
                </button>
              </div>
            </div>
            <div style={{ width: '100%', minHeight: 320, display: 'flex', alignItems: 'stretch' }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {chartType === 'line' ? (
                  <Line data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} style={{ width: '100%', height: '320px' }} />
                ) : (
                  <Bar data={getChartData()} options={{ responsive: true, maintainAspectRatio: false }} style={{ width: '100%', height: '320px' }} />
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* (Old duplicated results/cards/chart UI removed) */}
  </div>
  );
};

// ParsedNumberBadge: extracted for hover state with hooks
const ParsedNumberBadge: React.FC<{ num: number; onRemove: () => void }> = ({ num, onRemove }) => {
  const [hovered, setHovered] = React.useState(false);
  // Determine color by value
  let bgColor = 'bg-secondary';
  let textColor = '#fff';
  if (num > 0) bgColor = 'bg-success';
  else if (num < 0) bgColor = 'bg-danger';
  else bgColor = 'bg-secondary';

  return (
    <span
      onClick={onRemove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`badge ${bgColor}`}
      style={{
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '1.08em',
        padding: '8px 16px',
        borderRadius: 8,
        marginBottom: 4,
        boxShadow: '0 1px 4px rgba(30,41,59,0.08)',
        letterSpacing: '0.01em',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
        position: 'relative',
        color: textColor,
        overflow: 'hidden',
        transition: 'background 0.15s, color 0.15s',
      }}
      title="Remove this number"
    >
      <span style={{ opacity: hovered ? 0.25 : 1, transition: 'opacity 0.18s' }}>{num}</span>
      {/* Ghost overlay and icon on hover */}
      {hovered && (
        <span style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.10)',
          color: '#fff',
          fontSize: 18,
          opacity: 1,
          transition: 'opacity 0.18s',
          pointerEvents: 'none',
        }}>
          <FaTrash style={{ opacity: 0.85 }} />
        </span>
      )}
    </span>
  );
};

export default App;
