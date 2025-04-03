import React from 'react';

interface Props {
  frequencyMap: Map<string, number>;
  huffmanCodes: Map<string, string>;
}

const FrequencyTable: React.FC<Props> = ({ frequencyMap, huffmanCodes }) => {
  const sortedEntries = Array.from(frequencyMap.entries())
    .sort((a, b) => b[1] - a[1]);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-purple-200">
        <thead className="bg-purple-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
              Character
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
              Frequency
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
              Huffman Code
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-purple-700 uppercase tracking-wider">
              Bits Saved
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-purple-100">
          {sortedEntries.map(([char, frequency]) => {
            const code = huffmanCodes.get(char) || '';
            const bitsSaved = frequency * (8 - code.length);
            
            return (
              <tr key={char} className="hover:bg-purple-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-purple-900">
                  {char === ' ' ? '(space)' : char}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                  {frequency}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-mono">
                  {code}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                  {bitsSaved > 0 ? `${bitsSaved} bits` : '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FrequencyTable;