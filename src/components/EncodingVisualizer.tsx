import React from 'react';

interface Props {
  text: string;
  huffmanCodes: Map<string, string>;
  encodedText: string;
}

const EncodingVisualizer: React.FC<Props> = ({ text, huffmanCodes, encodedText }) => {
  return (
    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 text-indigo-700">Encoding Process</h2>
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-medium mb-2 text-indigo-600">Character Mapping</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {Array.from(huffmanCodes.entries()).map(([char, code]) => (
              <div
                key={char}
                className="flex items-center justify-between bg-indigo-50 p-2 rounded"
              >
                <span className="font-mono">
                  {char === ' ' ? '(space)' : char}
                </span>
                <span className="font-mono text-indigo-600">{code}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-medium mb-2 text-indigo-600">Encoded Output</h3>
          <div className="font-mono text-sm break-all bg-indigo-50 p-4 rounded">
            {encodedText}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-medium mb-2 text-indigo-600">Live Encoding</h3>
          <div className="space-y-2">
            {text.split('').map((char, index) => (
              <div key={index} className="flex items-center space-x-2">
                <span className="font-mono bg-indigo-100 px-2 py-1 rounded">
                  {char === ' ' ? '(space)' : char}
                </span>
                <span className="text-gray-400">→</span>
                <span className="font-mono bg-indigo-500 text-white px-2 py-1 rounded">
                  {huffmanCodes.get(char)}
                </span>
              </div>
            )).slice(0, 5)}
            {text.length > 5 && (
              <div className="text-center text-gray-500">...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EncodingVisualizer;