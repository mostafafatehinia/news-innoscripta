export const whichNewsIcon = (source: string) => {
  switch (source) {
    case "bbc":
      return "/images/bbc.png";
    case "abc":
      return "/images/abc.png";
    case "guardian":
      return "/images/guardian.jpg";
    default:
      return "/images/news.jpg";
  }
};

export const renderTag = (source: string) => {
  switch (source) {
    case "bbc":
      return "BBC";
    case "abc":
      return "ABC";
    case "guardian":
      return "Guardian";
    default:
      return "News";
  }
};
