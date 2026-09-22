import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const contractUrl = new URL(
  "../docs/contracts/external-intelligence-development-support.md",
  import.meta.url,
);

async function contract() {
  return readFile(contractUrl, "utf8");
}

test("EIS development starts by retrieving shared intelligence", async () => {
  const text = await contract();
  assert.match(text, /development_start/);
  assert.match(text, /cross-project proven patterns and known failures/);
  assert.match(text, /shared Knowledge changes/);
});

test("repository HEAD alone cannot validate EIS cache", async () => {
  const text = await contract();
  assert.match(text, /Repository HEAD alone must not determine cache validity/);
  assert.match(text, /repository state and relevant shared Knowledge revision are unchanged/);
});

test("implementation success is distinct from production verified success", async () => {
  const text = await contract();
  assert.match(text, /`implementation_result`/);
  assert.match(text, /`production_verified_success`/);
  assert.match(text, /CI Green alone must never be translated into `production_verified_success`/);
});

test("failed development can become reusable known failure knowledge", async () => {
  const text = await contract();
  assert.match(text, /`known_failure`/);
  assert.match(text, /must not be discarded/);
});

test("application and repository identities are separate", async () => {
  const text = await contract();
  for (const field of ["appId", "componentId", "projectId", "repository", "commitSha"]) {
    assert.match(text, new RegExp(`\\`${field}\\``));
  }
});

test("production readiness requires runtime usability evidence", async () => {
  const text = await contract();
  assert.match(text, /current main and current Production/);
  assert.match(text, /authorization, persistence, and integrations connected/);
});
