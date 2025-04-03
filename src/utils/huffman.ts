// Huffman Tree Node
class HuffmanNode {
  char: string;
  frequency: number;
  left: HuffmanNode | null;
  right: HuffmanNode | null;

  constructor(char: string, frequency: number) {
    this.char = char;
    this.frequency = frequency;
    this.left = null;
    this.right = null;
  }
}

// Build frequency map from input text
export const buildFrequencyMap = (text: string): Map<string, number> => {
  const frequencyMap = new Map<string, number>();
  
  for (const char of text) {
    frequencyMap.set(char, (frequencyMap.get(char) || 0) + 1);
  }
  
  return frequencyMap;
};

// Build Huffman Tree
export const buildHuffmanTree = (frequencyMap: Map<string, number>): HuffmanNode => {
  const nodes: HuffmanNode[] = [];
  
  // Create leaf nodes
  for (const [char, freq] of frequencyMap) {
    nodes.push(new HuffmanNode(char, freq));
  }
  
  while (nodes.length > 1) {
    nodes.sort((a, b) => a.frequency - b.frequency);
    
    const left = nodes.shift()!;
    const right = nodes.shift()!;
    
    const parent = new HuffmanNode('', left.frequency + right.frequency);
    parent.left = left;
    parent.right = right;
    
    nodes.push(parent);
  }
  
  return nodes[0];
};

// Generate Huffman codes
export const generateHuffmanCodes = (root: HuffmanNode): Map<string, string> => {
  const codes = new Map<string, string>();
  
  function traverse(node: HuffmanNode, code: string) {
    if (!node.left && !node.right) {
      codes.set(node.char, code);
      return;
    }
    
    if (node.left) traverse(node.left, code + '0');
    if (node.right) traverse(node.right, code + '1');
  }
  
  traverse(root, '');
  return codes;
};

// Calculate compression ratio
export const calculateCompressionRatio = (
  originalText: string,
  huffmanCodes: Map<string, string>
): number => {
  const originalBits = originalText.length * 8;
  let compressedBits = 0;
  
  for (const char of originalText) {
    compressedBits += huffmanCodes.get(char)?.length || 0;
  }
  
  return (1 - compressedBits / originalBits) * 100;
};

// Encode text using Huffman codes
export const encodeText = (
  text: string,
  huffmanCodes: Map<string, string>
): string => {
  let encoded = '';
  for (const char of text) {
    encoded += huffmanCodes.get(char) || '';
  }
  return encoded;
};