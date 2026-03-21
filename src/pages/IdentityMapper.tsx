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
import { toast } from 'sonner';

import { CenterNode } from '@/components/graph/CenterNode';
import { BubbleNode } from '@/components/graph/BubbleNode';
import { SocialNode } from '@/components/graph/SocialNode';
import { SocialHubNode } from '@/components/graph/SocialHubNode';
import { DetailPanel } from '@/components/panels/DetailPanel';
import { SearchBar } from '@/components/SearchBar';
import { StatusBar } from '@/components/StatusBar';
import { supabase } from '@/integrations/supabase/client';
import type { PersonData } from '@/data/mockData';

const nodeTypes = {
  center: CenterNode,
  bubble: BubbleNode,
  social: SocialNode,
  socialHub: SocialHubNode,
};

function buildGraph(person: PersonData, onSelect: (id: string) => void) {
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

  // Social platform nodes
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
  const [person, setPerson] = useState<PersonData | null>(null);

  const { nodes: graphNodes, edges: graphEdges } = useMemo(
    () => person ? buildGraph(person, setSelectedNode) : { nodes: [], edges: [] },
    [person]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(graphNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(graphEdges);

  // Sync when person changes
  useMemo(() => {
    setNodes(graphNodes);
    setEdges(graphEdges);
  }, [graphNodes, graphEdges, setNodes, setEdges]);

  const handleSearch = useCallback(async (query: string) => {
    setIsScanning(true);
    setSelectedNode(null);

    try {
      const { data, error } = await supabase.functions.invoke('investigate', {
        body: { query },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setPerson(data as PersonData);
      setTimeout(() => setSelectedNode('center'), 300);
    } catch (err: any) {
      console.error('Investigation failed:', err);
      toast.error(err.message || 'Failed to investigate. Please try again.');
    } finally {
      setIsScanning(false);
    }
  }, []);

  return (
    <div className="w-full h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 cyber-grid opacity-40" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      <SearchBar onSearch={handleSearch} isScanning={isScanning} />

      {person ? (
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
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground text-sm font-mono">Enter a username above to begin investigation</p>
            <p className="text-muted-foreground/50 text-xs">Powered by AI · Uses only public data patterns</p>
          </div>
        </div>
      )}

      {person && (
        <DetailPanel selectedNode={selectedNode} person={person} onClose={() => setSelectedNode(null)} />
      )}
      <StatusBar />
    </div>
  );
}
