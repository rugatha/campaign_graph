(function () {
  const rawData = window.CAMPAIGN_GRAPH_DATA || [];

  const svg = d3.select("#rugatha-graph-svg");
  if (svg.empty()) return;

  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  // 先建立 nodeMap，並給每個節點「合理的初始座標」（全部先放在畫面中央）
  const nodeMap = new Map();
  rawData.forEach(d => {
    const node = Object.assign({}, d);
    node.x = width / 2;
    node.y = height / 2;
    node.fx = null;
    node.fy = null;
    node.children = [];
    node.visible = false;
    node.expanded = node.level === 1; // root 展開，其餘收合
    nodeMap.set(node.id, node);
  });

  // 建立 parent/children 與可見狀態邏輯
  RugathaLayout.buildHierarchy(nodeMap);

  const viewport = svg.append("g").attr("id", "rugatha-viewport");

  let pendingCenter = null;
  let nodes = [];
  let links = [];

  // 啟用 zoom 系統
  const zoomApi = RugathaZoom.applyZoom(svg, viewport, width, height);

  // 先建一次 graph 結構
  ({ nodes, links } = RugathaLayout.buildGraph(nodeMap));

  // 建立 force simulation
  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id(d => d.id)
      .distance(160)
      .strength(0.3))
    .force("charge", d3.forceManyBody().strength(-350))
    .force("collide", d3.forceCollide().radius(d => 50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .alphaTarget(0.1)
    .on("tick", ticked);

  let linkSel = viewport.append("g").attr("class", "edges").selectAll("line");
  let nodeSel = viewport.append("g").attr("class", "nodes").selectAll("g");

  function update() {
    const built = RugathaLayout.buildGraph(nodeMap);
    nodes = built.nodes;
    links = built.links;

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(0.35).restart();

    // 更新連線
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
        pendingCenter = d; // 交給 tick 做平順置中

        if (d.children && d.children.length > 0) {
          d.expanded = !d.expanded;
          update();
        }
      }
    );
  }

  function ticked() {
    // 更新線
    linkSel
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);

    // 更新節點位置
    nodeSel.attr("transform", d => `translate(${d.x},${d.y})`);

    // 若有 pendingCenter，第一次 tick 時做置中，避免破圖 / 飄移
    if (pendingCenter) {
      zoomApi.centerOnNode(pendingCenter, 350);
      pendingCenter = null;
    }
  }

  // 初始 render
  update();

  // 一進入頁面就自動做一次 fit-to-view，避免整個圖縮在左上角
  setTimeout(() => {
    zoomApi.fitTo(nodes);
  }, 400);

  // 綁定按鈕事件
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

    // Home：只顯示第一、二層
    nodeMap.forEach(n => {
      if (n.level === 1) n.expanded = true;
      else if (n.level === 2) n.expanded = false;
      else n.expanded = false;
    });

    update();
    zoomApi.reset();
  };
})();
