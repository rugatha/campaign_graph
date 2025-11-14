window.RugathaRender = (function () {
  const ROOT_ICON_URL =
    "https://rugatha.wordpress.com/wp-content/uploads/2025/05/cropped-e69caae591bde5908d-1_e5b7a5e4bd9ce58d80e59f9f-1-1.png";

  function getRectSize(n) {
    const len = n.label ? n.label.length : 0;
    let baseW, baseH, perChar;

    if (n.level === 1) {
      baseW = 140; baseH = 140; perChar = 5;
    } else if (n.level === 2) {
      baseW = 170; baseH = 50; perChar = 7;
    } else {
      baseW = 160; baseH = 44; perChar = 6;
    }

    const width = Math.max(baseW, 40 + len * perChar);
    const height = baseH;
    return { width, height };
  }

  function renderNodes(viewport, nodeSel, simulation, onClick) {
    const enter = nodeSel.enter()
      .append("g")
      .attr("class", d => "level-" + d.level);

    // 畫節點本體（root = icon，其他 = 圓角矩形）
    enter.each(function (d) {
      const g = d3.select(this);

      if (d.level === 1) {
        const size = 90;
        g.append("image")
          .attr("href", ROOT_ICON_URL)
          .attr("width", size)
          .attr("height", size)
          .attr("x", -size / 2)
          .attr("y", -size / 2);
      } else {
        const r = getRectSize(d);
        g.append("rect")
          .attr("class", "node-rect")
          .attr("x", -r.width / 2)
          .attr("y", -r.height / 2)
          .attr("width", r.width)
          .attr("height", r.height)
          .attr("rx", 18)
          .attr("ry", 18);
      }
    });

    // 標籤文字（root 不顯示文字）
    enter.append("text")
      .attr("class", "node-label")
      .text(d => (d.level === 1 ? "" : d.label || ""));

    // 拖曳（D3 v7 正確寫法，用 event 參數）
    enter.call(
      d3.drag()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.1).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    // 點擊（展開 / 收合行為從 main.js 傳進來）
    enter.on("click", onClick);

    return enter.merge(nodeSel);
  }

  return {
    renderNodes
  };
})();
