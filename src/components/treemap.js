import React, { useState, useEffect } from "react";
import { treemap, hierarchy, scaleOrdinal, format } from "d3";
import { schemeSet3 } from "d3-scale-chromatic";

function TreeMapText({ d }) {
  const parentValue = d.parent ? d.parent.value : d.value;
  const percentage = format(".1%")(d.value / parentValue);
  const categoryValue = d ? `${d.data.name}` : "";

  return (
    <foreignObject width={d.x1 - d.x0} height={d.y1 - d.y0}>
      <div
        style={{
          fontSize: "10px",
          fontFamily: "Arial, sans-serif",
          padding: "2px",
          color: "black", 
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100%",
        }}
      >
        <div style={{ fontWeight: "bold" }}>
          {`${d.data.attr}: ${categoryValue}`}
        </div>
        <div>{`Value: ${percentage}`}</div>
      </div>
    </foreignObject>
  );
}

function Legend({ categories, color, x, y }) {
  const categoryInfo = categories.map((cat) => {
    const [attr, value] = cat.split(":");
    return {
      attr: attr.trim(),
      value: value.trim(),
      fullName: cat,
    };
  });

  return (
    <g transform={`translate(${x}, ${y})`}>
      {categoryInfo.map((info, i) => (
        <g key={info.fullName} transform={`translate(${i * 120}, 0)`}>
          <rect width={20} height={20} fill={color(info.fullName)} />
          <text
            x={25}
            y={15}
            fontSize="11px"
            fill="black"
            fontWeight="500"
            fontFamily="Arial, sans-serif"
          >
            {`${info.attr}: ${info.value}`}
          </text>
        </g>
      ))}
    </g>
  );
}

export function TreeMap({
  margin,
  svg_width,
  svg_height,
  tree,
  selectedCell,
  setSelectedCell,
}) {
  const [hovered, setHovered] = useState(null);
  const [root, setRoot] = useState(null);
  const [parents, setParents] = useState([]);
  const [tooltip, setTooltip] = useState(null);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  const innerwidth = svg_width - margin.left - margin.right;
  const innerheight = svg_height - margin.top - margin.bottom;

  useEffect(() => {
    const rootData = hierarchy(tree)
      .sum((d) => (d.children ? 0 : d.value))
      .sort((a, b) => b.value - a.value);

    treemap().size([innerwidth, innerheight]).padding(2)(rootData);

    const leaves = rootData.leaves();
    const parents = [
      ...new Set(
        leaves.map((d) => `${d.parent.data.attr}: ${d.parent.data.name}`)
      ),
    ];

    setRoot(rootData);
    setParents(parents);
  }, [tree, innerwidth, innerheight]);

  if (!root) return null;

  const color = scaleOrdinal(schemeSet3).domain(parents); 
  const leaves = root.leaves();
  const firstLayer = root.children || [];

  return (
    <div style={{ position: "relative" }}>
      <svg
        viewBox={`0 0 ${svg_width} ${svg_height}`}
        style={{ width: "100%", height: "100%" }}
      >
        <g transform={`translate(${margin.left}, ${margin.top})`}>
          {leaves.map((d, i) => (
            <g
              key={i}
              transform={`translate(${d.x0}, ${d.y0})`}
              onMouseEnter={() => {
                const path = [];
                let node = d;
                while (node) {
                  path.unshift(node.data.name);
                  node = node.parent;
                }
                const pathString = path.join(" > ");
                const valueString = `Value: ${d.value}`;
                setTooltip(`${pathString}\n${valueString}`);
                setHovered(d);
              }}
              onMouseMove={(e) => {
                setMouse({
                  x: e.clientX + 10,
                  y: e.clientY + 10,
                });
              }}
              onMouseLeave={() => {
                setTooltip(null);
                setHovered(null);
              }}
              onClick={() => setSelectedCell(d)}
              style={{ cursor: "pointer" }}
            >
              <rect
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                fill={color(`${d.parent.data.attr}: ${d.parent.data.name}`)}
                opacity={0.85}
              />
              {(hovered?.data === d.data || selectedCell?.data === d.data) && (
                <rect
                  width={d.x1 - d.x0}
                  height={d.y1 - d.y0}
                  fill="red"
                  opacity={0.3}
                  pointerEvents="none"
                />
              )}
              <TreeMapText d={d} />
            </g>
          ))}

          {firstLayer.map((d, i) => (
            <g key={i} transform={`translate(${d.x0}, ${d.y0})`}>
              <rect
                width={d.x1 - d.x0}
                height={d.y1 - d.y0}
                stroke="black"
                fill="none"
                strokeWidth={2}
              />
              <text
                x={(d.x1 - d.x0) / 2}
                y={(d.y1 - d.y0) / 2}
                fontSize="20" 
                fontFamily="Arial, sans-serif"
                fontWeight="bold"
                textAnchor="middle"
                opacity={0.6}
                transform={`rotate(${d.x1 - d.x0 > d.y1 - d.y0 ? 0 : 90}, ${
                  (d.x1 - d.x0) / 2
                }, ${(d.y1 - d.y0) / 2})`}
              >
                {`${d.data.attr}: ${d.data.name}`}
              </text>
            </g>
          ))}
        </g>

        <Legend
          categories={parents}
          color={color}
          x={margin.left}
          y={margin.top - 25}
        />
      </svg>

      {tooltip && (
        <div
          style={{
            position: "fixed",
            top: mouse.y,
            left: mouse.x,
            background: "rgba(0,0,0,0.85)",
            color: "white",
            border: "1px solid #555",
            borderRadius: "6px",
            padding: "6px",
            fontSize: "10px",
            fontFamily: "Arial, sans-serif",
            whiteSpace: "pre-line",
            pointerEvents: "none",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.25)",
            maxWidth: "250px",
            zIndex: 1000,
          }}
        >
          {tooltip}
        </div>
      )}
    </div>
  );
}
