import assert from "node:assert/strict";
import test from "node:test";
import {
  aiCapabilities,
  apiOperations,
  canonicalOwners,
  createGrowthSharePayload,
  getCanonicalOwner,
  glossary,
  growthShareAllowlist,
  growthShareDeniedFields,
  integrationPolicy,
  isGrowthShareField,
  isApiUseCase,
  isApiOperation,
  isEventUseCase,
  isVersionedEvent,
  platformApps,
  professionalStudioApis,
  professionalStudioEvents,
  versionedEvents,
} from "../src/contracts.js";

test("Customer master belongs to Growth Engine", () => {
  assert.ok(platformApps.growthEngine.owns.includes("customerMaster"));
  assert.ok(!platformApps.professionalStudio.owns.includes("customerMaster"));
  assert.ok(glossary.some((entry) => entry.term === "Customer" && entry.owner === "Growth Engine"));
});

test("Professional Studio external events use Session, not Reading", () => {
  assert.ok(professionalStudioEvents.publishes.includes("Session.Started"));
  assert.ok(professionalStudioEvents.publishes.includes("Session.Completed"));
  assert.ok(professionalStudioEvents.publishes.every((event) => !event.startsWith("Reading.")));
});

test("API contracts include synchronous customer, reservation, and session operations", () => {
  assert.ok(professionalStudioApis.includes("Customer.Get"));
  assert.ok(professionalStudioApis.includes("Reservation.Get"));
  assert.ok(professionalStudioApis.includes("Session.Start"));
  assert.ok(professionalStudioApis.includes("Session.Complete"));
});

test("AI capabilities are capability names, not prompt names", () => {
  assert.ok(aiCapabilities.includes("Reading.Interpret"));
  assert.ok(aiCapabilities.includes("Document.GenerateSection"));
  assert.ok(aiCapabilities.every((capability) => !capability.toLowerCase().includes("prompt")));
});

test("SNS Planner is called through Growth Engine", () => {
  assert.equal(platformApps.snsPlanner.directCaller, "Growth Engine");
  assert.ok(platformApps.snsPlanner.requiresBusinessInputs.includes("purpose"));
  assert.ok(platformApps.snsPlanner.requiresBusinessInputs.includes("cta"));
});

test("Growth Engine is exposed as Business plan mode", () => {
  assert.equal(
    platformApps.growthEngine.deliveryModel,
    "Business plan mode inside Professional Studio products",
  );
});

test("Canonical data ownership is explicit", () => {
  assert.equal(canonicalOwners.customerProfile, "Growth Engine");
  assert.equal(canonicalOwners.session, "Professional Studio");
  assert.equal(canonicalOwners.aiUsage, "AI Platform Core");
  assert.equal(getCanonicalOwner("customerProfile"), "Growth Engine");
  assert.equal(getCanonicalOwner("unknownThing"), null);
});

test("API and event use cases are separated", () => {
  assert.equal(integrationPolicy.synchronous.transport, "api");
  assert.equal(integrationPolicy.asynchronous.transport, "event");
  assert.equal(isApiUseCase("reportPreview"), true);
  assert.equal(isApiUseCase("stateChangeNotification"), false);
  assert.equal(isEventUseCase("stateChangeNotification"), true);
  assert.equal(isEventUseCase("screenDataRetrieval"), false);
});

test("Events are versioned and use current naming", () => {
  assert.ok(versionedEvents.includes("growth.customer.created.v1"));
  assert.ok(versionedEvents.includes("studio.report.generated.v1"));
  assert.ok(versionedEvents.includes("sns.post_draft.created.v1"));
  assert.equal(isVersionedEvent("growth.customer.created.v1"), true);
  assert.equal(isVersionedEvent("Customer.Created"), false);
});

test("API operations include cross-repository contract operations", () => {
  assert.ok(apiOperations.includes("Customer.Create"));
  assert.ok(apiOperations.includes("Report.Generate"));
  assert.ok(apiOperations.includes("PostDraft.Generate"));
  assert.equal(isApiOperation("Customer.Create"), true);
  assert.equal(isApiOperation("growth.customer.created.v1"), false);
});

test("Growth Engine share payload only includes allowlisted fields", () => {
  const payload = createGrowthSharePayload({
    customerId: "cus_001",
    professionalSessionId: "sess_001",
    serviceType: "numeria.four-pillars",
    consultationTags: ["仕事", "2027年運勢"],
    documentGenerated: true,
    internalMemo: "not shared",
  });

  assert.deepEqual(Object.keys(payload).sort(), [
    "consultationTags",
    "customerId",
    "documentGenerated",
    "professionalSessionId",
    "serviceType",
  ]);
  assert.equal("internalMemo" in payload, false);
});

test("Growth Engine share payload rejects denied fields", () => {
  for (const deniedField of growthShareDeniedFields) {
    assert.throws(
      () => createGrowthSharePayload({ customerId: "cus_001", [deniedField]: "private" }),
      /denied fields/,
    );
  }
});

test("Growth share field guard follows the allowlist", () => {
  for (const field of growthShareAllowlist) {
    assert.equal(isGrowthShareField(field), true);
  }
  assert.equal(isGrowthShareField("fullReadingText"), false);
  assert.equal(isGrowthShareField("paymentStatus"), false);
});
