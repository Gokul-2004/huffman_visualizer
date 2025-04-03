import React, { useState, useEffect } from 'react';
import { FileText, Upload, Type, Binary, Users } from 'lucide-react';
import {
  buildFrequencyMap,
  buildHuffmanTree,
  generateHuffmanCodes,
  calculateCompressionRatio,
  encodeText
} from './utils/huffman';
import HuffmanTree from './components/HuffmanTree';
import FrequencyTable from './components/FrequencyTable';
import EncodingVisualizer from './components/EncodingVisualizer';
import Stats from './components/Stats';

function App() {
  const [text, setText] = useState<string>('');
  const [frequencyMap, setFrequencyMap] = useState<Map<string, number>>(new Map());
  const [huffmanTree, setHuffmanTree] = useState<any>(null);
  const [huffmanCodes, setHuffmanCodes] = useState<Map<string, string>>(new Map());
  const [compressionRatio, setCompressionRatio] = useState<number>(0);
  const [encodedText, setEncodedText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'input' | 'upload' | 'stats'>('input');

  useEffect(() => {
    if (text) {
      const freqMap = buildFrequencyMap(text);
      const tree = buildHuffmanTree(freqMap);
      const codes = generateHuffmanCodes(tree);
      const ratio = calculateCompressionRatio(text, codes);
      const encoded = encodeText(text, codes);

      setFrequencyMap(freqMap);
      setHuffmanTree(tree);
      setHuffmanCodes(codes);
      setCompressionRatio(ratio);
      setEncodedText(encoded);
    }
  }, [text]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setText(e.target?.result as string);
      };
      reader.readAsText(file);
    }
  };

  const handleTextInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            Huffman Coding Visualizer
          </h1>
          <p className="text-xl text-gray-600">
            See how Huffman coding compresses your text in real-time
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('input')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                activeTab === 'input'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Type className="w-5 h-5 mr-2" />
              Text Input
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                activeTab === 'upload'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Upload className="w-5 h-5 mr-2" />
              File Upload
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`flex items-center px-4 py-2 rounded-lg transition ${
                activeTab === 'stats'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Users className="w-5 h-5 mr-2" />
              Statistics
            </button>
          </div>

          {activeTab === 'stats' ? (
            <Stats />
          ) : (
            <>
              {activeTab === 'input' ? (
                <div className="mb-8">
                  <textarea
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your text here to see it being compressed..."
                    value={text}
                    onChange={handleTextInput}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center mb-8">
                  <label className="flex flex-col items-center space-y-2 cursor-pointer">
                    <div className="flex items-center justify-center w-64 h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400">
                      <div className="flex flex-col items-center space-y-2">
                        <Upload className="w-8 h-8 text-blue-500" />
                        <span className="text-sm text-gray-500">
                          Choose a file or drag it here
                        </span>
                      </div>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept=".txt"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              )}

              {text && (
                <div className="space-y-8">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-700">
                      <FileText className="w-5 h-5 mr-2" />
                      Input Preview
                    </h2>
                    <p className="text-gray-700 whitespace-pre-wrap font-mono bg-white p-4 rounded-lg shadow-inner">
                      {text.slice(0, 200)}
                      {text.length > 200 ? '...' : ''}
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-green-700">
                      <Binary className="w-5 h-5 mr-2" />
                      Compression Results
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-4 rounded-lg shadow-inner">
                        <h3 className="text-lg font-medium mb-2 text-green-600">
                          Compression Ratio
                        </h3>
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-green-500 h-4 rounded-full transition-all duration-500"
                              style={{ width: `${100 - compressionRatio}%` }}
                            ></div>
                          </div>
                          <span className="ml-4 font-mono text-lg text-green-700">
                            {compressionRatio.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded-lg shadow-inner">
                        <h3 className="text-lg font-medium mb-2 text-green-600">
                          Size Comparison
                        </h3>
                        <p className="font-mono">
                          Original: {text.length * 8} bits
                          <br />
                          Compressed: {encodedText.length} bits
                        </p>
                      </div>
                    </div>
                  </div>

                  <EncodingVisualizer
                    text={text}
                    huffmanCodes={huffmanCodes}
                    encodedText={encodedText}
                  />

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-orange-700">
                      Huffman Tree
                    </h2>
                    {huffmanTree && <HuffmanTree root={huffmanTree} />}
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 text-purple-700">
                      Character Frequencies
                    </h2>
                    <FrequencyTable
                      frequencyMap={frequencyMap}
                      huffmanCodes={huffmanCodes}
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;