import { seedContent } from "./seed";

const G = "https://lh3.googleusercontent.com/aida-public/";

export const FEATURE_VIDEO =
  G +
  "AB6AXuBlA2zWlEluR6U4BtN0jixhPH6pRFRVdQdnDVcv7HFZ7sfh3ueRoGjhvEAgnBqY9T8PC3r7jG_gGy3hPjEDXb6HhEGUCoHJy5AsSoR029yyiUDqesb3IU3WWPryKpJ3n8TavNKlB-sphpJPoNpMFiac__HgWdu6tIgJLRDB_o_zfc3FUSGr8AjXsGdF9IEUtFMNHeC4WnXShohWyp9rfnckXSUt4y1WHu5iV5NnT8n5C1BV7YveD8PMeYFtuLcJTOCfJAYv2ux35oZC";

export const GALLERY = [
  G + "AB6AXuB2Kl7SnTD2vEnV-Y0_EXMZSaimE-3pP18ShXLrc9VSE2GgZew2hdEL4ZAMF4-IVCc6hpPR4Atgxjuul_7P9KhG6xb5xxin_O4b0PAxQkYa3pvNTf1laxaFguT2kyAJ9QKFgxTg7DbBQrTQP6RJxyCbeoUJVWHrK9bfy3n1Fj39JwEMF24240T8Hw1lIrlCYSF6KsKOOjY7TJ7zKFvpPMivndOR0yl9V2DB2E3r1PoLIePdSR0ypVtp13_U3qDcw8e25bdk9SCDzhnj",
  G + "AB6AXuCRbHVFvzhgt-Br_OFBbU3ZAjnOWHxeCc_Ou3okHBgX4RKul7wZsNMZaS1FHGWwyqaxWCPUM3JMYVNMHZXIyGl93XIIa_kcSO7e6Eflw-3QDMIUglupnSTJPIak3jYxVJQw2rG7yRzd1_hKStrFCvNnA7aE4zBBi5JFW8Ua6qbeLgj0F1AFzm5xW2hiQquYmg8FnKP5px2GCDd5HyYsigolPLFa8KR_FauE_B_c566ehhkMTwD59dXlSALk49ib7KDSudNhQQyaTqrU",
  G + "AB6AXuBSup3ru7UMGN1iNEZj1WVug229qpD9VRdeTYi11Y2l_GB58_p_B0TJtJAZdRjYbX8ivHbsK9_0FytvOLEo_XcEepIVxoSpKkK6oePi7tq29SXc47fukD2sd1n71BiQnipXsyahrQQTWPiDJlaj2KOCyLSjUMn2oB4m_MOF0xSnmKrv87O7ZpipfvSzOq-xZ5ftVRQFG8vX1QAbZpZ6pImQiIWcd0sUXuYcIwXxNnmVutdcrwL-eUUFFvF2tr0Quj0rCksn2-DIeOvm",
];

export interface VideoItem {
  id: string;
  title: string;
  thumb: string;
}
export interface PhotoItem {
  id: string;
  title: string;
  src: string;
}

export function getVideos(): VideoItem[] {
  const fromContent = seedContent()
    .filter((c) => c.type === "video_library")
    .map((c) => ({ id: c.id, title: c.name.replace(/\.[a-z0-9]+$/i, ""), thumb: c.image }));
  return [
    { id: "feat", title: "Community Highlights: 2024 Showcase", thumb: FEATURE_VIDEO },
    ...fromContent,
  ];
}

export function getPhotos(): PhotoItem[] {
  const fromContent = seedContent()
    .filter((c) => c.type === "photo")
    .map((c) => ({ id: c.id, title: c.name.replace(/\.[a-z0-9]+$/i, ""), src: c.image }));
  const fromGallery = GALLERY.map((src, i) => ({ id: `g${i}`, title: "Community photo", src }));
  return [...fromGallery, ...fromContent];
}
