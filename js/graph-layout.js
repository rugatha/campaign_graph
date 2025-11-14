window.RugathaLayout = (function () {

  function buildHierarchy(rawMap) {
    rawMap.forEach(n => {
      n.children = [];
      n.visible = false;
      n.expanded = n.level === 1;
      n.fx = null;
      n.fy = null;
    });

    rawMap.forEach(n => {
      if (n.parent && rawMap.has(n.parent)) {
        rawMap.get(n.parent).children.push(n);
      }
    });
  }

  function computeVisibility(rawMap) {
    rawMap.forEach(n => n.visible = false);
    rawMap.forEach(n => {
      if (!n.parent) n.visible = true;
    });

    let changed = true;
    while (changed) {
      changed = false;
      rawMap.forEach(n => {
        if (!n.parent) return;
        const p = rawMap.get(n.parent);
        const should = p && p.visible && p.expanded;
        if (should && !n.visible) {
          n.visible = true;
          changed = true;
        }
      });
    }
  }

  function placeChildrenFan(parent, kids) {
    const fan = Math.PI / 2; // 90°
    const center = 0;        // right direction
    const start = center - fan / 2;
    const end   = center + fan / 2;
    const radius = parent.level === 1 ? 260 : 210;

    kids.forEach((c, i) => {
      const t = kids.length === 1 ? 0.5 : i / (kids.length - 1);
      const a = start + t * (end - start);
      c.fx = parent.x + Math.cos(a) * radius;
      c.fy = parent.y + Math.sin(a) * radius;
    });
  }

  function buildGraph(rawMap) {
    computeVisibility(rawMap);

    const nodes = [];
    const links = [];

    rawMap.forEach(n => {
      if (n.visible) nodes.push(n);
    });

    rawMap.forEach(n => {
      if (n.visible && n.parent) {
        const p = rawMap.get(n.parent);
        if (p && p.visible) {
          links.push({ source: p, target: n });
        }
      }
    });

    rawMap.forEach(n => {
      if (n.expanded && n.children.length > 0) {
        const kids = n.children.filter(c => c.visible);
        placeChildrenFan(n, kids);
      }
    });

    return { nodes, links };
  }

  return {
    buildHierarchy,
    buildGraph
  };
})();
