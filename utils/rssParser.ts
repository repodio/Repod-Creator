import Parser from "rss-parser";
import { get } from "lodash/fp";

const fetchFeedEmailFromRSS = async ({
  rss,
}: {
  rss: string;
}): Promise<string> => {
  try {
    const parser = new Parser();
    const feed = await parser.parseURL(rss);
    const email = get("itunes.owner.email")(feed);

    return email;
  } catch (error) {
    console.error("fetchFeedEmailFromRSS", error);
  }
  return null;
};

export { fetchFeedEmailFromRSS };
