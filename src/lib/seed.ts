import { randomUUID } from "crypto";
import type { CommunityEvent, NewsPost, Policy, RequestItem } from "./types";

const G = "https://lh3.googleusercontent.com/aida-public/";

export function uid(): string {
  return randomUUID();
}

export function seedNews(): NewsPost[] {
  return [
    {
      id: "news_garden",
      category: "Community",
      title: "New Gardening Project Starts Monday!",
      excerpt:
        "Come and join us as we plant new flowers and vegetables in our shared community space. No experience needed!",
      image:
        G +
        "AB6AXuC4KgILsZgA08JD-JYi89LqpmplRGYZ_Urnumsc_176tm69h3VKtkIjofdAUrhfV3KUWcFAcQWqUAAIatc3EtXp3knA4zAlFEOLOlmEZpFI7esR_l1OFsbgMTQWSiKmY0-dhZUaQlZLj3Wtwic68eraKq16QNaypupMqjNPPdaUi3Hwb6Tsluh6jtwkzUojhnnIN3LrTETFh-YJxkBsl9RuTjRncPePaBxsr4EGiLHh1ltn0gyrdgA45obavt0qESeojZlnnOiQ41nx",
    },
    {
      id: "news_art",
      category: "Events",
      title: "Weekly Art Workshop Is Back",
      excerpt:
        "Our popular creative session returns this week. Bring your ideas and let's get painting together!",
      image:
        G +
        "AB6AXuDaM4YCSu0b5OBUl9kzCOZpUdpUOaC7Q7mRCXsdp7wM49mo0M2vqR48cTBrpOhpMJGTO9HFhyl0uTwjUWc9fW5Bxr1MrE-UsVHMzs6n9gHw6vaH5ZX2g6UrAuHfc3YuiEZ2M7yW7XXrSEN2bYmzPyAhv1BlHjaA6mRI2jeZx9-6M2ASQptrdr9PgIIsKKWDngklZQsqaaT3hu1k9UY6FPlTKcEIZuWXdlXpKET4O4QEpw1oBk4uHKThz1ynr1lLw-iG0TNVtBXtd9z8",
    },
    {
      id: "news_digital",
      category: "Success",
      title: "Digital Skills Training Success",
      excerpt:
        "See how our latest graduates are using their new computer skills to stay connected with friends and family.",
      image:
        G +
        "AB6AXuDTE3cHy42YMrHkMkvP94bEkiSQ3NGGQwa3t_n9zZHz5IO3BItSVkeflJE93s7VEpiQ5VyCCNpX9eMDBVVxNzERUVvQawrmEudW9X9RMwP1yffFTzdzo5vTJoxY3dDFkUZAE4ZkeUWoy3xiPNmkR7NLLaLha5_4zApdywJHPAE-eglBbtViC9vgaJwq5LdWAE1-r-emDRbVYGTAsgt9z8QDLxMQU3IHWeL08toh7AdrDzqP1LyoqCjQfR3g6kliWlAcev6AVS9FmQAU",
    },
  ];
}

export function seedEvents(): CommunityEvent[] {
  return [
    {
      id: "evt_art",
      title: "Spring Art Workshop",
      description:
        "Come and paint beautiful spring flowers with us! We provide all the paints and brushes. It's easy and fun.",
      dateLabel: "Friday, 12th April",
      timeLabel: "2:00 PM - 4:00 PM",
      free: false,
      price: "£5.00",
      image:
        G +
        "AB6AXuDVb4kBFjHfjwbFukQi6YzvYO4hEgiQ4oafZ9bPFSaKPLvQgVXF-AJ2KDMUIWeodkpPZs6xX1CNjpk1EGJsi8SzBLGMllQ7-X9SX5q6n9YvaUlKLCy6t49F3wYJw5F8REIIr1rXE5XQUFlGn5zL7RxOTpSiha6hAGoU1LkV1paVvuCQaiMlhlmGWYm2U77decKxnBtMYOGEDG6zHHCnwozGxrzRsVScSb_6tJ7Nn-6C_wYOnOZIZpASljooC5KZIowlBp8iPMTiPsJW",
    },
    {
      id: "evt_music",
      title: "Community Music Night",
      description:
        "Listen to local musicians and sing along! A great way to end your Monday. Everyone is welcome.",
      dateLabel: "Monday, 15th April",
      timeLabel: "6:00 PM - 8:00 PM",
      free: true,
      price: "Free",
      image:
        G +
        "AB6AXuDr2luwgtVdCoF6nWU5GRmK_xGZQt76h66l0D22zDa4nhXVjel1dwhVBOEIuGq0BIWGSz29Sp9qe0CwX1pQ7GnB3fAxhneWqExNuFAtqyd2A2TeQ2lgQpcpCE-MWGT9ASyl-vK64WnUNJ9HM1s18MZg8x_eNrNFOEL736qNY-3aJc6ghmkA4c68Dzd_XDxV5F4oulpbcvXvV9SwWrDy0Px0ObD9H1lGlbg4WG_ZtGvQGhhZsAAQuvNtS5oqxDBkfsiPHzZYAbow37n8",
    },
    {
      id: "evt_walk",
      title: "Morning Park Walk",
      description:
        "A gentle walk in the fresh air. We will look at the birds and flowers together. Wear comfy shoes!",
      dateLabel: "Wednesday, 17th April",
      timeLabel: "10:00 AM - 11:30 AM",
      free: false,
      price: "£2.00",
      image:
        G +
        "AB6AXuBNZvgZFFaMglKs_sakca3xvcbJmFk9BiarocPLT3YyqmBqEkokeIVUSJFJxoegtygZoh1Fn-1DF782lpGaGiDLJMlxOdcOWzFTc7DID6mIMrfdoq4bE1mS-xPwiC-yFl-jZhkfTXjmf6nKUeOCJ7x1ffe35KhBgM6_-k_DzfqpzWnQRSjZZj2d9G4jeiDLE128qKwvH183zV86cVS8Th68pcHKq1dbsbJrCcnENdEh4H8lKwayp9OqLQL0k-ARSx9VrD_3uaHZ0PkC",
    },
  ];
}

export function seedPolicies(): Policy[] {
  return [
    {
      id: "pol_safe",
      title: "Staying Safe Policy",
      description: "Simple steps on how we keep you safe and what to do if you feel scared.",
      image:
        G +
        "AB6AXuA8iQeGQKOue9PfAXlGOzh2ELEvl-p_87R44PACI-J3I36sGnkCEO44TgkhOWsx34y0wKdGhsPGB-mWcfDrZNLv0qTQBg3QnGQTU0qu9-OZ4Pu4Sty058GmP2kA_rnmjsjwSSxdot9Rt2bx0Qn3KZnFcH4XXtM1A-ai_pPjLBlfmknlSYB32yDSRJzVMzCb1sgAo91DWZVReixpMOuUkpZPTW648y4ghdFdSEDAYtUQAXQTA_SoFlMo5kV69esJ5yEFaYyiXJfRLEh7",
      body: "We want you to feel safe. If anything makes you feel scared or unhappy, tell a member of staff or use the report button. We will listen and help you straight away.",
    },
    {
      id: "pol_values",
      title: "Our Values",
      description: "Learn about our mission to help you live the life you choose.",
      image:
        G +
        "AB6AXuAiTyOpHXoR-cyxtusXxUFR-mBeLR7G_YVZTEl8cVsNsndzS39jobQXGLuIXuqmVy6-OtM1wnuio5YYyWMLuLjbn51Rkbet20_fX_H-GxONZNzIbcQ_uEJnB0s-W9rcUuvK6q2QTPA5NPvAyy38hXKJFZW0ST2yg_UP1f-pHc7qJzn-Mnvpt2KXq9KXxpYlFsIKSjdzla85ezfEdiR6XVQVgViD7srzbgRjTTn8d-4z5iDXf92eQsUN6QqRqsQhoOm9qhTtxpL3zZ9L",
      body: "We believe everyone should live the life they choose. We are passionate, person-centred and happy. We listen to you and put you first in everything we do.",
    },
    {
      id: "pol_privacy",
      title: "Privacy Policy",
      description: "How we keep your personal information safe and private.",
      image:
        G +
        "AB6AXuAQEhkYNzC8HZB0Fd4FjLc3po64tjAkU4Wgp5oPx2H6dpRm2VkftC793sY4NIDLRAr4uKVpOHSxQmVyHmaPX__B7juy9VISEC8mcBeF40s7-BfJJnuUvlJYtU3iegilmnR5aFjlwijSxTLyqDHklUGyDEHXfS8bBvzOBmhSlWcKrKYO1tLiAF3aWVzWxj9SszZlgL1Ye_s0saejpfaf7UT7j35ufg7_zrD_5HvHrIZAEeUcSXNfVKHLOXQ7HeTmj-pIsZGhRoey0ejc",
      body: "Your information belongs to you. We only keep what we need to support you, we store it safely, and we never share it without your permission.",
    },
  ];
}

export function seedRequests(): RequestItem[] {
  return [
    {
      id: uid(),
      kind: "NEWS",
      subject: "New sensory garden photos",
      submittedBy: "Sarah Jenkins",
      status: "Pending",
      detail: {},
      createdAt: "2 hours ago",
    },
    {
      id: uid(),
      kind: "EVENT",
      subject: "Art Therapy Workshop Proposal",
      submittedBy: "David Miller",
      status: "Pending",
      detail: {},
      createdAt: "Today",
    },
    {
      id: uid(),
      kind: "FEEDBACK",
      subject: "Login issue on mobile app",
      submittedBy: "Anonymous",
      status: "Investigating",
      detail: {},
      createdAt: "Yesterday",
    },
  ];
}

export interface ContentItem {
  id: string;
  name: string;
  type: "photo" | "video_library";
  image: string;
}

export function seedContent(): ContentItem[] {
  return [
    {
      id: "c1",
      name: "Garden_Project_01.jpg",
      type: "photo",
      image:
        G +
        "AB6AXuDGnB5lKTyo7etHvO7GCl5MzLI8K_G4GZDUXlicVWW-qh5q3O0dWUWw6573NuNGj4hL41ZAtcBbKXWiYmJHXrMPsuCd24bdrtTs7JmWEjVFElhZpaqVutn9mOFsLDy3FHfKEH3rYqVRXi2sSFRAvxMK9Z0y72EFXUmb2uL30GSKC-f6SdqT6ch_NhRHMXqxjtRLtgEkVcAWzdRWOOD9jXE7MCUQ0Fs9rCzcL6pxuU-Y54Tu-gExdZePpDJYVTdWpJgkYhxSxRneguyQ",
    },
    {
      id: "c2",
      name: "Art_Workshop_Promo.mp4",
      type: "video_library",
      image:
        G +
        "AB6AXuCAj7wHMSTZ8IvWPtGBd-LcSL80Y4tldIxljdCsJNLFyNod92Cpzg5RMucD44rYLyGU50AQ1SNS_N20g9EiZ6Js87UvXGfTje5XhJziAZ90L8_HApQmZIiWFjrkABIb1kBq7wReghOQv4NtpDmdd991IcC96BCZW3ezXH0L1E4BJhMVxsXSnuCKjlNBC34w9P23txu2eJcrI0VG0RaPHcmiqs5xB2hwPK9Zc0rY7nLPF1GGI4ZuiR5BVl_hw7b41pfnTXyv84bSlGbk",
    },
    {
      id: "c3",
      name: "Team_Lunch_Hero.jpg",
      type: "photo",
      image:
        G +
        "AB6AXuAag5igMLrBTjX54ucSluLYHs1_oiY1etiecefPP63SWo_fnDOQA6hcPJ-0k6xyc0I0QDD41xoqFG69qo27uY7M5WBVcAOiKWdDcxL8CJ6djBCXcpBwBRdF-t1MlVEPgqq3UIs5Z5MzW5Dujq7ZIv83XC7W81yOFSgpX2vDBy4dLHZ5LlQlOjWh980WHjYxNlt0iZjAEfgL2VryZM8WcxwxAMd4akaREUOg-S_DW2g2lXkehopLSPFnRaFdqU_uGbRZyjLLlZv1A1L3",
    },
  ];
}
