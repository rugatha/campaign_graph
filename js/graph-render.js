window.RugathaRender = (function () {

  function getRectSize(n) {
    const len = n.label.length;
    if (n.level === 1) return { width: 140, height: 140 };
    if (n.level === 2) return { width: Math.max(170, len * 7), height: 50 };
    return { width: Math.max(160, len * 6), height: 44 };
  }

  function renderNodes(viewport, nodeSel, simulation, onClick) {
    const enter = nodeSel.enter()
      .append("g")
      .attr("class", d => "level-" + d.level);

    enter.each(function (d) {
      const g = d3.select(this);
      const r = getRectSize(d);

      if (d.level === 1) {
        g.append("image")
          .attr("href", "https://rugatha.wordpress.com/...icon.png")
          .attr("width", 90)
          .attr("height", 90)
          .attr("x", -45)
          .attr("y", -45);
      } else {
        g.append("rect")
          .attr("class", "node-rect")
          .attr("width", r.width)
          .attr("height", r.height)
          .attr("x", -r.width/2)
          .attr("y", -r.height/2)
          .attr("rx", 18).attr("ry", 18);
      }
    });

    enter.append("text")
      .attr("class", "node-label")
      .text(d => (d.level === 1 ? "" : d.label));

    enter.call(
      d3.drag()
        .on("start", d => {
          if (!d3.event.active) simulation.alphaTarget(0.1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", d => {
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", d => {
          if (!d3.event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    enter.on("click", onClick);

    return enter.merge(nodeSel);
  }

  return {
    renderNodes
  };
})();
