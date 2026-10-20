import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import {
  createPaidCommerceProjectionData,
  createRefundCommerceProjectionData,
} from "../src/proposals/commerce-projection.js";

const base = "schemas/proposals/";
const names = [
  "commerce-event-envelope.v1.schema.json",
  "commerce.payment.completed.v1.schema.json",
  "commerce.payment.refunded.v1.schema.json",
  "place.order.paid.v1.schema.json",
  "studio.report.ready_for_delivery.v1.schema.json",
];
const sensitive = [
  "fullReadingText", "reportBody", "pdfContent", "birthData",
  "detailedConsultationText", "paymentMethod", "stripeSecret", "rawStripeEvent",
  "bankAccount", "cardNumber", "customerEmail", "clientNote",
];

async function schema(name) {
  return JSON.parse(await readFile(base + name, "utf8"));
}

test("proposed commerce schemas have isolated versioned identities", async () => {
  for (const name of names) {
    const s = await schema(name);
    assert.equal(s.$schema, "https://json-schema.org/draft/2020-12/schema");
    assert.ok(s.$id?.endsWith("/" + name));
    assert.ok(s.title?.length);
    if (name !== names[0]) {
      assert.equal(s.allOf?.[0]?.$ref, "./commerce-event-envelope.v1.schema.json");
      assert.equal(s.allOf?.[1]?.properties?.eventType?.const, s.title);
      assert.equal(s.allOf?.[1]?.properties?.data?.additionalProperties, false);
    }
  }
});

test("proposal envelope has an explicit source and scope (no fabricated workspace)", async () => {
  const e = await schema(names[0]);
  assert.ok(e.required.includes("scope"));
  assert.ok(e.properties.sourceSystem.enum.includes("numeria-place"));
  assert.equal(e.properties.scope.oneOf.length, 3);
  const types = e.properties.scope.oneOf.map((branch) => branch.properties.scopeType.const);
  assert.deepEqual(types, ["seller", "workspace", "platform"]);
});

test("proposed event data cannot declare sensitive professional or financial fields", async () => {
  for (const name of names.slice(1)) {
    const e = await schema(name);
    const props = Object.keys(e.allOf[1].properties.data.properties);
    for (const key of sensitive) assert.ok(!props.includes(key), name + " exposes " + key);
  }
});

test("paid commerce projection allows minimum financial state only", () => {
  const x = { sourceApp: "numeria-place", sourceOrderId: "ord_7", sellerRef: "seller_7",
    salesChannel: "seller_lp", amountMinor: 3000, currency: "JPY", paymentState: "paid" };
  assert.deepEqual(createPaidCommerceProjectionData(x), x);
  assert.throws(() => createPaidCommerceProjectionData({ ...x, fullReadingText: "secret" }), /not allowed/);
  assert.throws(() => createPaidCommerceProjectionData({ ...x, stripeSecret: "sk_test_fake" }), /not allowed/);
  assert.throws(() => createPaidCommerceProjectionData({ ...x, paymentState: "pending" }), /paid/);
  assert.throws(() => createPaidCommerceProjectionData({ ...x, salesChannel: "official_ai" }), /cannot/);
  assert.throws(() => createPaidCommerceProjectionData({ ...x, amountMinor: 1.5 }), /amount/);
});

test("refund events are independent of seller transfer-reversal events", () => {
  const x = { sourceApp: "numeria-place", sourceOrderId: "ord_7", sellerRef: "seller_7",
    refundRef: "re_7", amountMinor: 500, currency: "JPY", refundState: "succeeded",
    transferReversalState: "pending" };
  assert.deepEqual(createRefundCommerceProjectionData(x), x);
  assert.throws(() => createRefundCommerceProjectionData({ ...x, transferReversalState: "succeeded", rawStripeEvent: {} }), /not allowed/);
  assert.throws(() => createRefundCommerceProjectionData({ ...x, amountMinor: 0 }), /positive/);
});
