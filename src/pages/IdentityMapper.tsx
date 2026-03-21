import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  ConnectionLineType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { CenterNode } from '@/components/graph/CenterNode';
import { BubbleNode } from '@/components/graph/BubbleNode';
import { SocialNode } from '@/components/graph/SocialNode';
import { SocialHubNode } from '@/components/graph/SocialHubNode';
import { DetailPanel } from '@/components/panels/DetailPanel';
import { SearchBar } from '@/components/SearchBar';
import { StatusBar } from '@/components/StatusBar';
import { mockPerson } from '@/data/mockData';

const nodeTypes = {
  center: CenterNode,
  bubble: BubbleNode,
  social: SocialNode,
  socialHub: SocialHubNode,
};

function buildGraph(person: typeof mockPerson, onSelect: (id: string) => void) {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  const cx = 450;
  const cy = 350;
  const radius = 220;

  // Center
  nodes.push({
    id: 'center',
    type: 'center',
    position: { x: cx - 64, y: cy - 64 },
    data: { label: person.name, subtitle: person.username, avatar: person.avatar, riskScore: person.riskScore, onSelect: () => onSelect('center') },
  });

  // Behavioral (top)
  nodes.push({
    id: 'behavioral',
    type: 'bubble',
    position: { x: cx - 56, y: cy - radius - 56 },
    data: { label: 'Behavioral', type: 'behavioral', summary: 'Patterns & Tone', onSelect: () => onSelect('behavioral') },
  });
  edges.push({ id: 'e-center-behavioral', source: 'center', target: 'behavioral', sourceHandle: 'top', type: 'smoothstep', animated: true, style: { stroke: 'hsl(280, 70%, 55%)', strokeWidth: 1.5 } });

  // Location (left)
  nodes.push({
    id: 'location',
    type: 'bubble',
    position: { x: cx - radius - 56, y: cy - 56 },
    data: { label: 'Location', type: 'location', summary: `${person.location.city}, ${person.location.country}`, onSelect: () => onSelect('location') },
  });
  edges.push({ id: 'e-center-location', source: 'center', target: 'location', sourceHandle: 'left', type: 'smoothstep', animated: true, style: { stroke: 'hsl(140, 70%, 45%)', strokeWidth: 1.5 } });

  // Personal (bottom)
  nodes.push({
    id: 'personal',
    type: 'bubble',
    position: { x: cx - 56, y: cy + radius - 56 },
    data: { label: 'Personal', type: 'personal', summary: 'Identity & Aliases', onSelect: () => onSelect('personal') },
  });
  edges.push({ id: 'e-center-personal', source: 'center', target: 'personal', sourceHandle: 'bottom', type: 'smoothstep', animated: true, style: { stroke: 'hsl(40, 90%, 55%)', strokeWidth: 1.5 } });

  // Social hub (right)
  const hubX = cx + radius + 20;
  const hubY = cy - 20;
  nodes.push({
    id: 'social-hub',
    type: 'socialHub',
    position: { x: hubX, y: hubY },
    data: { label: 'Social', count: person.social.length },
  });
  edges.push({ id: 'e-center-social', source: 'center', target: 'social-hub', sourceHandle: 'right', type: 'smoothstep', animated: true, style: { stroke: 'hsl(0, 70%, 55%)', strokeWidth: 1.5 } });

  // Social platform nodes — evenly spaced
  const totalSocial = person.social.length;
  const socialSpacing = 95;
  const socialBlockHeight = (totalSocial - 1) * socialSpacing;
  const socialStartY = hubY + 20 - socialBlockHeight / 2;
  const socialX = hubX + 170;

  person.social.forEach((s, i) => {
    const id = `social-${s.platform}`;
    nodes.push({
      id,
      type: 'social',
      position: { x: socialX, y: socialStartY + i * socialSpacing },
      data: { platform: s.platform, username: s.username, confidence: s.confidence, color: s.color, onSelect: () => onSelect(s.platform) },
    });
    edges.push({
      id: `e-hub-${id}`,
      source: 'social-hub',
      target: id,
      sourceHandle: 'out',
      type: 'smoothstep',
      animated: false,
      style: { stroke: `${s.color}88`, strokeWidth: 1 },
    });
  });

  return { nodes, edges };
}

export default function IdentityMapper() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [person] = useState(mockPerson);

  const { nodes: initNodes, edges: initEdges } = useMemo(
    () => buildGraph(person, setSelectedNode),
    [person]
  );

  const [nodes, , onNodesChange] = useNodesState(initNodes);
  const [edges, , onEdgesChange] = useEdgesState(initEdges);

  const handleSearch = useCallback((query: string) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setSelectedNode('center');
    }, 2000);
  }, []);

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      {/* Background grid effect */}
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      <SearchBar onSearch={handleSearch} isScanning={isScanning} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.3}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="hsl(220, 15%, 12%)" gap={40} size={1} />
        <Controls
          className="!bg-card !border-border !rounded-xl !shadow-2xl [&>button]:!bg-secondary [&>button]:!border-border [&>button]:!text-muted-foreground [&>button:hover]:!bg-secondary/80"
          showInteractive={false}
        />
      </ReactFlow>

      <DetailPanel selectedNode={selectedNode} person={person} onClose={() => setSelectedNode(null)} />
      <StatusBar />
    </div>
  );
}
