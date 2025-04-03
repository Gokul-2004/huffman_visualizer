import React, { useState, useEffect } from 'react';

interface TreeNode {
  char: string;
  frequency: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

interface Props {
  root: TreeNode;
}

const HuffmanTree: React.FC<Props> = ({ root }) => {
  const [showTree, setShowTree] = useState(false);
  const [nodes, setNodes] = useState<TreeNode[]>([]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (showTree) {
      const allNodes: TreeNode[] = [];
      const queue: TreeNode[] = [root];
      
      while (queue.length > 0) {
        const node = queue.shift()!;
        allNodes.push(node);
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
      }
      
      setNodes([]);
      let currentStep = 0;
      const interval = setInterval(() => {
        if (currentStep < allNodes.length) {
          setNodes(prev => [...prev, allNodes[currentStep]]);
          currentStep++;
          setStep(currentStep);
        } else {
          clearInterval(interval);
        }
      }, 500);

      return () => clearInterval(interval);
    } else {
      setNodes([]);
      setStep(0);
    }
  }, [showTree, root]);

  const calculateTreeDimensions = (node: TreeNode, level: number = 0): { width: number; height: number } => {
    if (!node) return { width: 0, height: 0 };
    if (!node.left && !node.right) return { width: 100, height: 80 };

    const left = node.left ? calculateTreeDimensions(node.left, level + 1) : { width: 0, height: 0 };
    const right = node.right ? calculateTreeDimensions(node.right, level + 1) : { width: 0, height: 0 };

    return {
      width: Math.max(left.width + right.width, 100),
      height: Math.max(left.height, right.height) + 80
    };
  };

  const dimensions = calculateTreeDimensions(root);
  const nodeSize = 40;

  const renderNode = (node: TreeNode, x: number, y: number, level: number, maxWidth: number): JSX.Element => {
    const leftChild = node.left;
    const rightChild = node.right;
    const horizontalGap = maxWidth / Math.pow(2, level + 1);
    const verticalGap = 80;

    const isNodeVisible = nodes.includes(node);
    const nodeOpacity = isNodeVisible ? "1" : "0";
    const edgeOpacity = isNodeVisible && nodes.includes(node.left || node.right || {}) ? "1" : "0";

    return (
      <g key={`${x}-${y}`}>
        {leftChild && (
          <>
            <line
              x1={x}
              y1={y + nodeSize / 2}
              x2={x - horizontalGap}
              y2={y + verticalGap - nodeSize / 2}
              className="stroke-orange-300"
              strokeWidth="2"
              strokeDasharray="4"
              style={{ opacity: edgeOpacity, transition: 'opacity 0.5s ease-in-out' }}
            />
            <text
              x={x - horizontalGap / 2}
              y={y + verticalGap / 2 - 10}
              textAnchor="middle"
              className="text-xs text-orange-600"
              style={{ opacity: edgeOpacity, transition: 'opacity 0.5s ease-in-out' }}
            >
              0
            </text>
            {renderNode(leftChild, x - horizontalGap, y + verticalGap, level + 1, maxWidth)}
          </>
        )}

        {rightChild && (
          <>
            <line
              x1={x}
              y1={y + nodeSize / 2}
              x2={x + horizontalGap}
              y2={y + verticalGap - nodeSize / 2}
              className="stroke-orange-300"
              strokeWidth="2"
              strokeDasharray="4"
              style={{ opacity: edgeOpacity, transition: 'opacity 0.5s ease-in-out' }}
            />
            <text
              x={x + horizontalGap / 2}
              y={y + verticalGap / 2 - 10}
              textAnchor="middle"
              className="text-xs text-orange-600"
              style={{ opacity: edgeOpacity, transition: 'opacity 0.5s ease-in-out' }}
            >
              1
            </text>
            {renderNode(rightChild, x + horizontalGap, y + verticalGap, level + 1, maxWidth)}
          </>
        )}

        <g style={{ opacity: nodeOpacity, transition: 'opacity 0.5s ease-in-out' }}>
          <circle
            cx={x}
            cy={y}
            r={nodeSize / 2}
            className="fill-white stroke-orange-500 stroke-2"
          />
          <text
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium text-orange-700"
          >
            {node.char || '*'}
          </text>
          <text
            x={x}
            y={y + 20}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-orange-600"
          >
            {node.frequency}
          </text>
        </g>
      </g>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowTree(!showTree)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          {showTree ? 'Reset Tree' : 'Show Tree Construction'}
        </button>
        {showTree && (
          <span className="text-orange-600">
            Building tree... Step {step}
          </span>
        )}
      </div>
      <div className="w-full overflow-x-auto bg-orange-50 rounded-lg p-4">
        <svg
          width={Math.max(800, dimensions.width)}
          height={Math.max(400, dimensions.height)}
          className="mx-auto"
        >
          <g transform={`translate(${Math.max(800, dimensions.width) / 2}, 40)`}>
            {renderNode(root, 0, 0, 1, dimensions.width)}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default HuffmanTree;