export function generateCircularFlow(nodesLabels: string[], center = { x: 300, y: 300 }, radius = 200) {
  const N = nodesLabels.length;
  const nodes = nodesLabels.map((label, i) => {
    const angle = (2 * Math.PI * i) / N;
    return {
      id: `node-${i}`,
      data: { label },
      position: {
        x: center.x + radius * Math.cos(angle),
        y: center.y + radius * Math.sin(angle),
      },
      type: i === 0 ? 'input' : i === N - 1 ? 'output' : undefined,
    };
  });

  const edges = nodes.map((node, i) => ({
    id: `e${i}-${(i + 1) % N}`,
    source: node.id,
    target: nodes[(i + 1) % N].id,
    animated: true,
    label: i === N - 1 ? 'Loop' : undefined,
  }));

  return { nodes, edges };
}
