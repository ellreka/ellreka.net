import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
});

export const fetchEntries = async () => {
  const entries = await client.getEntries<EntryFields>();
  if (entries.items) return entries.items;
};

export const fetchEntry = async (id: string) => {
  const entry = await client.getEntry<EntryFields>(id).catch((e) => {
    console.error(e);
  });
  if (entry) return entry;
};

interface EntryFields {
  title: string;
  body: string;
}
