const fs = require('fs');
  const data = fs.readFileSync('D:\\code\\heartrate.json', 'utf8');
  const jsonData = JSON.parse(data);
//  console.log('Parsed JSON data:', jsonData);
function calculateMedian(arr) {
  const sortedArr = arr.slice().sort((a, b) => a - b);
  const middle = Math.floor(sortedArr.length / 2);
  return sortedArr.length % 2 === 0
    ? (sortedArr[middle - 1] + sortedArr[middle]) / 2
    : sortedArr[middle];
}
const data2 = fs.readFileSync('D:\\code\\heartrate.json', 'utf8');
const jsonData2 = JSON.parse(data2);
const result = jsonData2.reduce((acc, entry) => {
  const date = entry.timestamps.startTime.split('T')[0];

  if (!acc[date]) {
    acc[date] = {
      date,
      min: entry.beatsPerMinute,
      max: entry.beatsPerMinute,
      beats: [entry.beatsPerMinute],
      latestDataTimestamp: entry.timestamps.endTime,
    };
  } else {
    const day = acc[date];
    day.min = Math.min(day.min, entry.beatsPerMinute);
    day.max = Math.max(day.max, entry.beatsPerMinute);
    day.beats.push(entry.beatsPerMinute);
    day.latestDataTimestamp = entry.timestamps.endTime;
  }

  return acc;
}, {});
const output = Object.values(result).map((day) => {
  return {
    date: day.date,
    min: day.min,
    max: day.max,
    median: calculateMedian(day.beats),
    latestDataTimestamp: day.latestDataTimestamp,
  };
});
const outputFileName = 'D:\\code\\output.json';
fs.writeFile(outputFileName, JSON.stringify(output, null, 2), (err) => {
  if (err) {
    console.error('Error writing to file:', err);
  } else {
    console.log(`Output written to ${outputFileName}`);
  }
});