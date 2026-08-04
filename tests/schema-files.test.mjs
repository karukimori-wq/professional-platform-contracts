import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const schemaDirs = [
  "schemas/entities",
  "schemas/events",
];

async function listJsonFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
    .map((entry) => path.join(dir, entry.name));
}

test("schema files are valid JSON and include core metadata", async () => {
  const files = [];
  for (const dir of schemaDirs) {
    files.push(...await listJsonFiles(dir));
  }

  assert.ok(files.length >= 6);

  for (const file of files) {
    const schema = JSON.parse(await readFile(file, "utf8"));
    assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.ok(schema.$id, `${file} must include $id`);
    assert.ok(schema.title, `${file} must include title`);
  }
});

test("event schemas use versioned event titles", async () => {
  const files = await listJsonFiles("schemas/events");
  const eventFiles = files.filter((file) => !file.endsWith("event-envelope.schema.json"));

  for (const file of eventFiles) {
    const schema = JSON.parse(await readFile(file, "utf8"));
    assert.match(schema.title, /^[a-z]+\.[a-z_]+\.[a-z_]+\.v\d+$/);
  }
});
