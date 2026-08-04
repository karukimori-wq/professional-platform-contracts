export const platformApps = {
  growthEngine: {
    deliveryModel: "Business plan mode inside Professional Studio products",
    owns: [
      "customerMaster",
      "contactDetails",
      "leadLifecycle",
      "acquisitionSource",
      "nurturingWorkflow",
      "reservation",
      "contract",
      "payment",
      "sales",
      "referral",
      "repeatAnalysis",
      "campaign",
    ],
  },
  professionalStudio: {
    owns: [
      "session",
      "professionalProfile",
      "professionalInputs",
      "professionalHistory",
      "practitionerNotes",
      "document",
      "serviceReference",
    ],
    references: ["customerId"],
  },
  aiPlatformCore: {
    owns: [
      "capability",
      "promptManagement",
      "modelSelection",
      "runtimeExecution",
      "usageLogging",
      "providerAbstraction",
    ],
  },
  snsPlanner: {
    owns: ["snsContentGeneration", "postTemplate", "hashtag", "snsFormat"],
    directCaller: "Growth Engine",
    requiresBusinessInputs: ["purpose", "targetAudience", "cta", "channel"],
  },
};

export const glossary = [
  { term: "Customer", owner: "Growth Engine" },
  { term: "customerId", owner: "Growth Engine" },
  { term: "Professional Studio", owner: "Platform" },
  { term: "Session", owner: "Professional Studio" },
  { term: "Reading", owner: "Numeria Studio" },
  { term: "Document", owner: "Professional Studio" },
  { term: "ServiceReference", owner: "Professional Studio" },
  { term: "Reservation", owner: "Growth Engine" },
  { term: "Capability", owner: "AI Platform Core" },
  { term: "ConsultationTag", owner: "Professional Studio" },
  { term: "SNS Planner", owner: "Growth Engine tool" },
];

export const professionalStudioApis = [
  "Customer.Get",
  "Reservation.Get",
  "Session.Start",
  "Session.Complete",
  "ServiceReference.List",
  "AICapability.Run",
];

export const professionalStudioEvents = {
  publishes: [
    "Session.Started",
    "Session.Completed",
    "Document.Generated",
    "Professional.RecommendationCreated",
  ],
  subscribes: [
    "Customer.Created",
    "Reservation.Created",
    "Reservation.Cancelled",
  ],
};

export const integrationPolicy = {
  synchronous: {
    transport: "api",
    uses: [
      "screenDataRetrieval",
      "immediateCommands",
      "reportPreview",
      "snsDraftGeneration",
      "usageSummary",
    ],
  },
  asynchronous: {
    transport: "event",
    uses: [
      "stateChangeNotification",
      "downstreamProcessing",
      "followupCreation",
      "usageAggregation",
    ],
  },
};

export const canonicalOwners = {
  customerProfile: "Growth Engine",
  leadStatus: "Growth Engine",
  acquisitionSource: "Growth Engine",
  nurturingStatus: "Growth Engine",
  session: "Professional Studio",
  document: "Professional Studio",
  report: "Professional Studio",
  snsPostDraft: "SNS Planner",
  campaignIntent: "Growth Engine",
  capability: "AI Platform Core",
  aiActivity: "AI Platform Core",
  aiUsage: "AI Platform Core",
};

export const versionedEvents = [
  "growth.customer.created.v1",
  "growth.customer.updated.v1",
  "growth.lead.converted.v1",
  "growth.reservation.created.v1",
  "growth.reservation.cancelled.v1",
  "studio.session.started.v1",
  "studio.session.completed.v1",
  "studio.report.generated.v1",
  "studio.service_reference.updated.v1",
  "ai.activity.created.v1",
  "ai.activity.completed.v1",
  "ai.activity.failed.v1",
  "ai.usage.recorded.v1",
  "sns.post_draft.created.v1",
  "sns.post_draft.updated.v1",
];

export const apiOperations = [
  "Customer.Create",
  "Customer.Get",
  "Customer.Find",
  "Customer.UpdateStatus",
  "Reservation.Create",
  "Reservation.Get",
  "Session.Start",
  "Session.Complete",
  "Report.Generate",
  "Report.Preview",
  "Report.ExportPdf",
  "ServiceReference.List",
  "Capability.Register",
  "Activity.Create",
  "Activity.Get",
  "Usage.List",
  "PromptTemplate.Render",
  "PostDraft.Generate",
  "PostDraft.Rewrite",
  "PostTemplate.List",
];

export const aiCapabilities = [
  "Reading.Interpret",
  "Reading.GenerateDraft",
  "Document.GenerateSection",
  "Document.SummarizeForFollowup",
];

export const growthShareAllowlist = [
  "customerId",
  "professionalSessionId",
  "sessionStartedAt",
  "sessionCompletedAt",
  "serviceType",
  "consultationTags",
  "anonymizedTendencySummary",
  "documentGenerated",
  "recommendedNextTiming",
  "followupAllowed",
  "reviewRequestAllowed",
];

export const growthShareDeniedFields = [
  "fullReadingText",
  "detailedConsultationText",
  "aiGeneratedFullText",
  "privatePractitionerNotes",
  "fullChartInterpretation",
  "fullMeetingTranscript",
  "paymentStatus",
  "salesAmount",
  "campaignCode",
];

export function getCanonicalOwner(dataName) {
  return canonicalOwners[dataName] ?? null;
}

export function isApiUseCase(useCase) {
  return integrationPolicy.synchronous.uses.includes(useCase);
}

export function isEventUseCase(useCase) {
  return integrationPolicy.asynchronous.uses.includes(useCase);
}

export function isVersionedEvent(eventName) {
  return versionedEvents.includes(eventName);
}

export function isApiOperation(operationName) {
  return apiOperations.includes(operationName);
}

export function createGrowthSharePayload(source) {
  const leaked = Object.keys(source).filter((key) => growthShareDeniedFields.includes(key));
  if (leaked.length > 0) {
    throw new Error(`Growth share payload contains denied fields: ${leaked.join(", ")}`);
  }

  return growthShareAllowlist.reduce((payload, field) => {
    const value = source[field];
    if (
      typeof value === "string"
      || typeof value === "boolean"
      || (Array.isArray(value) && value.every((item) => typeof item === "string"))
    ) {
      payload[field] = value;
    }
    return payload;
  }, {});
}

export function isGrowthShareField(field) {
  return growthShareAllowlist.includes(field);
}
