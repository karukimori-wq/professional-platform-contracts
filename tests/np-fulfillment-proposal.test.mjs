import assert from "node:assert/strict";
import test from "node:test";
import {
  canStartNewReading,
  canViewFullText,
  canDownloadPdf,
  canPublishPaidCommerceEvent,
} from "../src/proposals/np-fulfillment-policy.js";

const valid = {
  paymentMode: "prepaid",
  paymentState: "paid",
  readingState: "accepted",
  fulfillmentChannel: "business_ns",
  buyerAuthenticated: true,
  sellerOptedInPostpay: false,
  linkAuthorizedAtIntake: true,
};

test("prepaid only starts after verified payment", () => {
  assert.equal(canStartNewReading(valid), true);
  assert.equal(canStartNewReading({...valid, paymentState:"pending"}), false);
  assert.equal(canStartNewReading({...valid, linkAuthorizedAtIntake:false}), false);
  assert.equal(canStartNewReading({...valid, paymentState:"refunded"}), false);
});

test("NP-only seller can fulfill without Business or NS link", () => {
  assert.equal(canStartNewReading({...valid,fulfillmentChannel:"np_only",linkAuthorizedAtIntake:false}), true);
});

test("seller-opted-in postpay may start work before payment but does not unlock PDF", () => {
  const o={...valid,paymentMode:"postpay",paymentState:"not_started",readingState:"accepted",sellerOptedInPostpay:true};
  assert.equal(canStartNewReading(o),true);
  assert.equal(canDownloadPdf({...o, readingState:"finalized"}),false);
  assert.equal(canViewFullText({...o,readingState:"finalized"}),true);
  assert.equal(canPublishPaidCommerceEvent(o),false);
});

test("postpay requires seller opt-in; PDF available only after confirmed payment", () => {
  const o={...valid,paymentMode:"postpay",paymentState:"not_started",readingState:"accepted",sellerOptedInPostpay:false};
  assert.equal(canStartNewReading(o),false);
  assert.equal(canViewFullText({...o,readingState:"finalized"}),false);
  assert.equal(canDownloadPdf({...o,readingState:"finalized",paymentState:"paid"}),true);
});

test("privacy and refund restrictions apply at access time", () => {
  const report={...valid,readingState:"finalized"};
  assert.equal(canViewFullText(report),true);
  assert.equal(canDownloadPdf(report),true);
  assert.equal(canDownloadPdf({...report,buyerAuthenticated:false}),false);
  assert.equal(canViewFullText({...report,buyerAuthenticated:false}),false);
  assert.equal(canDownloadPdf({...report,paymentState:"disputed"}),false);
  assert.equal(canDownloadPdf({...report,paymentState:"refunded"}),false);
  assert.equal(canViewFullText({...report,readingState:"canceled"}),false);
});

test("invalid states fail closed", () => {
  assert.throws(()=>canViewFullText({...valid,paymentMode:"unknown"}),/invalid/);
  assert.throws(()=>canDownloadPdf({...valid,buyerAuthenticated:"yes"}),/invalid/);
  assert.throws(()=>canStartNewReading({}),/invalid/);
});
