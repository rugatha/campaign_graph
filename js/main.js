(function () {
  const rawData = window.CAMPAIGN_GRAPH_DATA || [];

  const svg = d3.select("#rugatha-graph-svg");
  if (svg.empty()) return;

  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  // 建 nodeMap，先塞基本屬性
  const nodeMap = new Map();
  rawData.forEach(d => {
    const node = Object.assign({}, d);
    node.x = width / 2;
    node.y = height / 2;
    node.fx = null;
    node.fy = null;
    node.children = [];
    node.visible = false;
    node.expanded = node.level === 1; // root 預設展開
    nodeMap.set(node.id, node);
  });

  // 建立 parent / children 結構
  RugathaLayout.buildHierarchy(nodeMap);

  // ⭐ 一開始就做一個「看起來像樹狀圖」的初始位置，避免線拖太長
  function initPositions() {
    // 找 root（level === 1，且 parent 為 null）
    let root = null;
    nodeMap.forEach(n => {
      if (n.level === 1 && !n.parent) {
        root = n;
      }
    });
    if (!root) return;

    const cx = width * 0.3;   // root 稍微偏左
    const cy = height * 0.5;

    root.x = cx;
    root.y = cy;

    // Level 2：排列在 root 右側，一條直線垂直排
    const level2Nodes = [];
    nodeMap.forEach(n => {
      if (n.level === 2 && n.parent === root.id) {
        level2Nodes.push(n);
      }
    });

    const gapY2 = 110; // 第二層節點垂直間距
    const startY2 = cy - (level2Nodes.length - 1) * gapY2 / 2;
    const x2 = cx + 260; // 第二層離 root 的距離

    level2Nodes.forEach((n, i) => {
      n.x = x2;
      n.y = startY2 + i * gapY2;
    });

    // Level 3：依各自母節點，稍微扇形排在右邊
    nodeMap.forEach(n => {
      if (n.level === 3 && n.parent && nodeMap.has(n.parent)) {
        const p = nodeMap.get(n.parent);
        if (!p) return;

        const siblings = p.children.filter(c => c.level === 3);
        const index = siblings.findIndex(s => s.id === n.id);
        const gapY3 = 60;
        const startY3 = p.y - (siblings.length - 1) * gapY3 / 2;
        const x3 = p.x + 220;

        n.x = x3;
        n.y = startY3 + index * gapY3;
      }
    });
  }

  // 先跑一次初始排版
  initPositions();

  const viewport = svg.append("g").attr("id", "rugatha-viewport");

  let pendingCenter = null;
  let nodes = [];
  let links = [];

  // 啟用 zoom 控制
  const zoomApi = RugathaZoom.applyZoom(svg, viewport, width, height);

  // 建第一版 graph
  ({ nodes, links } = RugathaLayout.buildGraph(nodeMap));

  // 建立 force simulation（用初始位置微調，不會從全重疊開始）
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(140)          // 稍微短一點，線不會太長
      .strength(0.35))
    .force("charge", d3.forceManyBody().strength(-260)) // 稍微溫和
    .force("collide", d3.forceCollide().radius(60))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaTarget(0.08)
    .on("tick", ticked);

  let linkSel = viewport.append("g").attr("class", "edges").selectAll("line");
  let nodeSel = viewport.append("g").attr("class", "nodes").selectAll("g");

  function update() {
    const built = RugathaLayout.buildGraph(nodeMap);
    nodes = built.nodes;
    links = built.links;

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(0.3).restart();

    // 更新線
    linkSel = linkSel.data(links, d => d.source.id + "-" + d.target.id);
    linkSel.exit().remove();
    linkSel = linkSel.enter()
      .append("line")
      .attr("class", "rugatha-edge")
      .merge(linkSel);

    // 更新節點
    nodeSel = nodeSel.data(nodes, d => d.id);
    nodeSel.exit().remove();

    nodeSel = RugathaRender.renderNodes(
      viewport,
      nodeSel,
      simulation,
      (event, d) => {
        event.stopPropagation();
        pendingCenter = d;

        if (d.children && d.children.length > 0) {
          d.expanded = !d.expanded;
          update();
        }
      }
    );
  }

  function ticked() {
    linkSel
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);

    if (pendingCenter) {
      zoomApi.centerOnNode(pendingCenter, 350);
      pendingCenter = null;
    }
  }

  // 初始 render
  update();

  // 一進入頁面時：依目前所有節點做一次 fitToView，畫面不會怪偏
  setTimeout(() => {
    zoomApi.fitTo(nodes);
  }, 400);

  // 控制按鈕
  document.getElementById("btn-zoom-in").onclick = e => {
    e.stopPropagation();
    zoomApi.zoomByFactor(1.2);
  };

  document.getElementById("btn-zoom-out").onclick = e => {
    e.stopPropagation();
    zoomApi.zoomByFactor(1 / 1.2);
  };

  document.getElementById("btn-fit").onclick = e => {
    e.stopPropagation();
    zoomApi.fitTo(nodes);
  };

  document.getElementById("btn-home").onclick = e => {
    e.stopPropagation();
    pendingCenter = null;

    // Home：只保留第一、第二層展開狀態
    nodeMap.forEach(n => {
      if (n.level === 1) n.expanded = true;
      else if (n.level === 2) n.expanded = false;
      else n.expanded = false;
    });

    // 重新設一次初始位置，讓圖回到穩定的樹狀配置
    initPositions();
    update();
    zoomApi.reset();
  };
})();
