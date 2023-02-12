export const getContents = async () => {
  return await (await fetch(process.env.FEED_DATA)).json();
};
