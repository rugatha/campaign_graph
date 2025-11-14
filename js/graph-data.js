// graph-data.js
// Rugatha campaign hierarchy data
// 之後要新增 / 調整章節，只要改這個陣列即可

const DEFAULT_NODE_URL = "https://rugatha.com";

const BASE_CAMPAIGN_GRAPH_DATA = [
  // Level 1 (root)
  { id: "rugatha", label: "Rugatha", level: 1, parent: null },

  // ===== Rugatha (main line) =====
  { id: "rugatha-main", label: "Rugatha", level: 2, parent: "rugatha" },
  {
    id: "rugatha-c01",
    label: "C01 Curse of Vowalon",
    level: 3,
    parent: "rugatha-main"
  },
  {
    id: "rugatha-c02",
    label: "C02 Beneath the Temple",
    level: 3,
    parent: "rugatha-main"
  },
  {
    id: "rugatha-c03",
    label: "C03 Korringfield Reunion",
    level: 3,
    parent: "rugatha-main"
  },
  {
    id: "rugatha-c04",
    label: "C04 The Blooming of Macksohn",
    level: 3,
    parent: "rugatha-main"
  },
  {
    id: "rugatha-c05",
    label: "C05 Mattington Shattered",
    level: 3,
    parent: "rugatha-main"
  },

  // ===== Rugatha Plus =====
  { id: "plus", label: "Rugatha Plus", level: 2, parent: "rugatha" },
  {
    id: "plus-c05",
    label: "C05 Mattington Shattered",
    level: 3,
    parent: "plus"
  },
  {
    id: "plus-c06",
    label: "C06 Hand of the Lich",
    level: 3,
    parent: "plus"
  },
  {
    id: "plus-c07",
    label: "C07 Before the Next Full Moon",
    level: 3,
    parent: "plus"
  },

  // ===== Rugatha Plus 1 =====
  { id: "plus1", label: "Rugatha Plus 1", level: 2, parent: "rugatha" },
  {
    id: "plus1-c01",
    label: "C01 To the Deep and Back",
    level: 3,
    parent: "plus1"
  },

  // ===== Rugatha lite =====
  { id: "lite", label: "Rugatha lite", level: 2, parent: "rugatha" },
  {
    id: "lite-c05",
    label: "C05 Mattington Shattered",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c06",
    label: "C06 The Gift from Alfenor",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c07",
    label: "C07 Lurking Dangers",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c08",
    label: "C08 Deep into Lothum",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c09",
    label: "C09 The Cave of Drogsland",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c10",
    label: "C10 Requiem of the Feathered Island",
    level: 3,
    parent: "lite"
  },
  {
    id: "lite-c11",
    label: "C11 Seats of the Eclipse",
    level: 3,
    parent: "lite"
  },

  // ===== Rugatha WILDS =====
  { id: "wilds", label: "Rugatha WILDS", level: 2, parent: "rugatha" },
  {
    id: "wilds-c01",
    label: "C01 The Elite Bloodline",
    level: 3,
    parent: "wilds"
  },
  {
    id: "wilds-c02",
    label: "C02 Gathering of the Chosen",
    level: 3,
    parent: "wilds"
  },
  {
    id: "wilds-c03",
    label: "C03 Storm of Mudtown",
    level: 3,
    parent: "wilds"
  },
  {
    id: "wilds-c04",
    label: "C04 Heir to Rathanad",
    level: 3,
    parent: "wilds"
  },

  // ===== Rugatha Brown =====
  { id: "brown", label: "Rugatha Brown", level: 2, parent: "rugatha" },
  {
    id: "brown-c01",
    label: "C01 Dark Petals",
    level: 3,
    parent: "brown"
  },
  {
    id: "brown-howling",
    label: "Howling of the Wolf",
    level: 3,
    parent: "brown"
  },

  // ===== Rugatha Legends =====
  { id: "legends", label: "Rugatha Legends", level: 2, parent: "rugatha" },
  {
    id: "legends-os01",
    label: "OS01 The False Hydra of Moorland Haunt",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os02",
    label: "OS02 The Disappearance of Gustavo Norman",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os03",
    label: "OS03 The Lighthouse on the Deserted Island",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os04",
    label: "OS04 The Deadly Prison Break",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os05",
    label: "OS05 Dragon’s Orb",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os06",
    label: "OS06 The Malicious Rise of Alfenor",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os07",
    label: "OS07 Mylstan Colossus",
    level: 3,
    parent: "legends"
  },
  {
    id: "legends-os08",
    label: "OS08 Lord Octavian von Oderick’s Dungeon of Randomness",
    level: 3,
    parent: "legends"
  },

  // ===== Rugatha Experience =====
  { id: "exp", label: "Rugatha Experience", level: 2, parent: "rugatha" },
  {
    id: "exp-e01",
    label: "E01 The Scroll of the Golden Castle",
    level: 3,
    parent: "exp"
  },
  {
    id: "exp-e02",
    label: "E02 Echoes of the Dragon’s Roar",
    level: 3,
    parent: "exp"
  }
];

window.CAMPAIGN_GRAPH_DATA = BASE_CAMPAIGN_GRAPH_DATA.map(node =>
  Object.assign({ url: DEFAULT_NODE_URL }, node)
);
