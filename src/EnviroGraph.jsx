import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cloud, Thermometer } from 'lucide-react';

const fetchEnvironmentData = () => {
  const hour = new Date().getHours();
  const baseTemp = 22.5;
  const tempAmplitude = 3;
  const tempVariation = Math.sin((hour / 24) * 2 * Math.PI) * tempAmplitude;
  
  return {
    temperature: baseTemp + tempVariation + (Math.random() - 0.5) * 2,
    humidity: Math.random() * 20 + 50,
    timestamp: new Date().toLocaleTimeString(),
  };
};

const EnvironmentGraph = () => {
  const [data, setData] = useState([]);
  const [isCelsius, setIsCelsius] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newData = fetchEnvironmentData();
      setData(prevData => [...prevData.slice(-59), newData]);
    }, 2000);

    return () => clearInterval(intervalId);
  }, []);

  const celsiusToFahrenheit = (celsius) => (celsius * 9) / 5 + 32;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const temp = isCelsius 
        ? payload[0].value.toFixed(1)
        : celsiusToFahrenheit(payload[0].value).toFixed(1);
      const unit = isCelsius ? '°C' : '°F';
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
          <p className="text-gray-300">{`Time: ${label}`}</p>
          <p className="text-indigo-400">{`Temperature: ${temp}${unit}`}</p>
          <p className="text-teal-400">{`Humidity: ${payload[1].value.toFixed(1)}%`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-screen p-8 bg-gray-900 text-white flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 to-teal-500 text-transparent bg-clip-text">
          Real-time Environment Dashboard
        </h1>
        <div className="flex items-center">
          <span className={`mr-2 ${!isCelsius ? 'font-bold' : ''}`}>°F</span>
          <div 
            className="w-14 h-7 flex items-center bg-gray-800 rounded-full p-1 cursor-pointer"
            onClick={() => setIsCelsius(!isCelsius)}
          >
            <div
              className={`bg-gradient-to-r from-indigo-500 to-teal-500 w-5 h-5 rounded-full shadow-md transform duration-300 ease-in-out ${
                isCelsius ? 'translate-x-7' : ''
              }`}
            ></div>
          </div>
          <span className={`ml-2 ${isCelsius ? 'font-bold' : ''}`}>°C</span>
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-8">
        <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-between w-64">
          <div>
            <p className="text-gray-400 mb-1">Temperature</p>
            <p className="text-3xl font-bold text-indigo-400">
              {data.length > 0 
                ? isCelsius
                  ? `${data[data.length - 1].temperature.toFixed(1)}°C`
                  : `${celsiusToFahrenheit(data[data.length - 1].temperature).toFixed(1)}°F`
                : '-'}
            </p>
          </div>
          <Thermometer className="text-indigo-400" size={48} />
        </div>
        <div className="bg-gray-800 p-6 rounded-lg flex items-center justify-between w-64">
          <div>
            <p className="text-gray-400 mb-1">Humidity</p>
            <p className="text-3xl font-bold text-teal-400">
              {data.length > 0 ? `${data[data.length - 1].humidity.toFixed(1)}%` : '-'}
            </p>
          </div>
          <Cloud className="text-teal-400" size={48} />
        </div>
      </div>
      <div className="flex-grow bg-gray-800 p-6 rounded-lg">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="timestamp" stroke="#9CA3AF" />
            <YAxis 
              yAxisId="left" 
              stroke="#9CA3AF" 
              domain={isCelsius ? [15, 30] : [celsiusToFahrenheit(15), celsiusToFahrenheit(30)]}
              tickFormatter={(value) => isCelsius ? value.toFixed(0) : celsiusToFahrenheit(value).toFixed(0)}
            />
            <YAxis yAxisId="right" orientation="right" stroke="#9CA3AF" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left" 
              type="monotone" 
              dataKey={isCelsius ? "temperature" : (dataPoint) => celsiusToFahrenheit(dataPoint.temperature)}
              stroke="#818CF8" 
              strokeWidth={2}
              dot={false}
              name={`Temperature (${isCelsius ? '°C' : '°F'})`}
            />
            <Line 
              yAxisId="right" 
              type="monotone" 
              dataKey="humidity" 
              stroke="#5EEAD4" 
              strokeWidth={2}
              dot={false}
              name="Humidity (%)" 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EnvironmentGraph;