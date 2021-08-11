const generateUniqTitle = (title: string, titles: string[]) => {
  if (titles.includes(title)) {
    return generateUniqTitle(`${title} Copy`, titles);
  }
  return title;
};

export default generateUniqTitle;
