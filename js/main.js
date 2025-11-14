(function () {
  const ROOT_ICON =
   "https://rugatha.wordpress.com/wp-content/uploads/2025/05/cropped-e69caae591bde5908d-1_e5b7a5e4bd9ce58d80e59f9f-1-1.png";

  const raw = window.CAMPAIGN_GRAPH_DATA;
  const map = new Map();
  raw.forEach(x => map.set(x.id, x));

  RugathaLayout.buildHierarchy(map);

  const svg = d3.select("#rugatha-graph-svg");
  const width = svg.node().clientWidth;
  const height = svg.node().clientHeight;

  const viewport = svg.append("g").attr("id","vp");

  let pendingCenter = null;

  const zoomApi = RugathaZoom.applyZoom(svg, viewport, width, height);

  let {nodes, links} = RugathaLayout.buildGraph(map);

  const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links)
      .id(d=>d.id)
      .distance(160)
      .strength(0.3))
    .force("charge", d3.forceManyBody().strength(-350))
    .force("collide", d3.forceCollide().radius(d => 50))
    .force("center", d3.forceCenter(width/2, height/2))
    .alphaTarget(0.1)
    .on("tick", ticked);

  let linkSel = viewport.append("g").selectAll("line");
  let nodeSel = viewport.append("g").selectAll("g");

  function update() {
    const built = RugathaLayout.buildGraph(map);
    nodes = built.nodes;
    links = built.links;

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(0.35).restart();

    // edges
    linkSel = linkSel.data(links, d=>d.source.id+"-"+d.target.id);
    linkSel.exit().remove();
    linkSel = linkSel.enter()
      .append("line")
      .attr("class","rugatha-edge")
      .merge(linkSel);

    // nodes
    nodeSel = nodeSel.data(nodes, d=>d.id);
    nodeSel.exit().remove();

    nodeSel = RugathaRender.renderNodes(
      viewport,
      nodeSel,
      simulation,
      (event,d)=>{
        event.stopPropagation();
        pendingCenter = d;
        if (d.children.length>0){
          d.expanded = !d.expanded;
          update();
        }
      }
    );
  }

  function ticked(){
    linkSel
      .attr("x1",d=>d.source.x)
      .attr("y1",d=>d.source.y)
      .attr("x2",d=>d.target.x)
      .attr("y2",d=>d.target.y);

    nodeSel.attr("transform",d=>`translate(${d.x},${d.y})`);

    if (pendingCenter){
      zoomApi.centerOnNode(pendingCenter,350);
      pendingCenter = null;
    }
  }

  update();

  // Zoom control buttons
  document.getElementById("btn-zoom-in").onclick = e=>{
    e.stopPropagation();
    zoomApi.zoomByFactor(1.2);
  };

  document.getElementById("btn-zoom-out").onclick = e=>{
    e.stopPropagation();
    zoomApi.zoomByFactor(1/1.2);
  };

  document.getElementById("btn-fit").onclick = e=>{
    e.stopPropagation();
    zoomApi.fitTo(nodes);
  };

  document.getElementById("btn-home").onclick = e=>{
    e.stopPropagation();
    map.forEach(n=>{
      if (n.level===1) n.expanded = true;
      else if (n.level===2) n.expanded = false;
      else n.expanded = false;
    });
    update();
    zoomApi.reset();
  };

})();
