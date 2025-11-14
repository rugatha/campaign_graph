// js/graph-layout.js
window.RugathaLayout = (function () {
  /**
   * 初始化階層關係、預設屬性
   */
  function buildHierarchy(rawMap) {
    rawMap.forEach(n => {
      n.children = [];
      n.visible = false;
      n.expanded = n.level === 1; // 只有 root 預設展開
      n.fx = null;
      n.fy = null;
    });

    // 建 parent → children 關係
    rawMap.forEach(n => {
      if (n.parent && rawMap.has(n.parent)) {
        rawMap.get(n.parent).children.push(n);
      }
    });
  }

  /**
   * 根據 expanded 狀態，決定哪些節點要顯示
   */
  function computeVisibility(rawMap) {
    rawMap.forEach(n => (n.visible = false));

    // 先讓 root 可見
    rawMap.forEach(n => {
      if (!n.parent) n.visible = true;
    });

    // 一路往下展開
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

  /**
   * 子節點扇形排在母節點右側（只設 initial x/y，不再使用 fx/fy）
   */
  function placeChildrenFan(parent, kids) {
    if (!kids || kids.length === 0) return;

    const fan = Math.PI / 2;      // 90 度扇形
    const center = 0;             // 朝右
    const start = center - fan / 2;
    const end   = center + fan / 2;

    // 不同層級用不同半徑，避免線太長
    const baseRadius =
      parent.level === 1 ? 220 :
      parent.level === 2 ? 190 :
      160;

    const count = kids.length;

    kids.forEach((c, i) => {
      const t = count === 1 ? 0.5 : i / (count - 1); // 只有一個就置中，多個就平均分
      const angle = start + t * (end - start);
      const r = baseRadius;
      const targetX = parent.x + Math.cos(angle) * r;
      const targetY = parent.y + Math.sin(angle) * r;

      // 只設 initial x/y，不釘死
      if (!isFinite(c.x) || !isFinite(c.y)) {
        c.x = targetX;
        c.y = targetY;
      } else {
        // 已經有位置的話，稍微往目標拉近
        c.x = (c.x * 2 + targetX) / 3;
        c.y = (c.y * 2 + targetY) / 3;
      }
    });
  }

  /**
   * 根據目前 expanded / visible 狀態產生 nodes & links
   */
  function buildGraph(rawMap) {
    computeVisibility(rawMap);

    const nodes = [];
    const links = [];

    rawMap.forEach(n => {
      if (n.visible) nodes.push(n);
    });

    rawMap.forEach(n => {
      if (!n.visible || !n.parent) return;
      const p = rawMap.get(n.parent);
      if (p && p.visible) {
        links.push({ source: p, target: n });
      }
    });

    // 對每個展開中的節點，幫它的 child 設定扇形初始位置
    rawMap.forEach(n => {
      if (n.expanded && n.children && n.children.length > 0) {
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
