function getAccessConfig(context) {
  const {
    CLOUDFLARE_ACCOUNT_ID,
    CLOUDFLARE_ACCESS_API_TOKEN,
  } = context.env;

  if (!CLOUDFLARE_ACCOUNT_ID) {
    throw new Error("CLOUDFLARE_ACCOUNT_ID is not configured");
  }

  if (!CLOUDFLARE_ACCESS_API_TOKEN) {
    throw new Error("CLOUDFLARE_ACCESS_API_TOKEN is not configured");
  }

  return {
    accountId: CLOUDFLARE_ACCOUNT_ID,
    apiToken: CLOUDFLARE_ACCESS_API_TOKEN,
  };
}

async function cloudflareRequest(
  context,
  path,
  options = {}
) {
  const { accountId, apiToken } =
    getAccessConfig(context);

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}${path}`,
    {
      ...options,
      headers: {
        Authorization: `Bearer ${apiToken}`,
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    const message =
      data.errors
        ?.map((error) => error.message)
        .join("; ") ||
      `Cloudflare API request failed (${response.status})`;

    throw new Error(message);
  }

  return data.result;
}

async function getAccessPolicy(
  context,
  appId,
  policyId
) {
  return cloudflareRequest(
    context,
    `/access/apps/${appId}/policies/${policyId}`
  );
}

function policyIncludesEmail(policy, email) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  return (policy.include || []).some((rule) => {
    const ruleEmail =
      rule?.email?.email?.trim().toLowerCase();

    return ruleEmail === normalizedEmail;
  });
}

function buildPolicyUpdate(policy, include) {
  const update = {
    name: policy.name,
    decision: policy.decision,
    include,
    exclude: policy.exclude || [],
    require: policy.require || [],
  };

  const optionalFields = [
    "precedence",
    "session_duration",
    "approval_required",
    "approval_groups",
    "purpose_justification_required",
    "purpose_justification_prompt",
    "isolation_required",
    "mfa_config",
    "connection_rules",
  ];

  for (const field of optionalFields) {
    if (policy[field] !== undefined) {
      update[field] = policy[field];
    }
  }

  return update;
}

export async function grantAccessByEmail(
  context,
  {
    appId,
    policyId,
    email,
  }
) {
  const normalizedEmail = email
    .trim()
    .toLowerCase();

  if (!normalizedEmail) {
    throw new Error(
      "An email address is required to grant archive access"
    );
  }

  const policy = await getAccessPolicy(
    context,
    appId,
    policyId
  );

  // Safe to call more than once.
  if (policyIncludesEmail(policy, normalizedEmail)) {
    return {
      granted: true,
      alreadyAllowed: true,
    };
  }

  const include = [
    ...(policy.include || []),
    {
      email: {
        email: normalizedEmail,
      },
    },
  ];

  const updatedPolicy = await cloudflareRequest(
    context,
    `/access/apps/${appId}/policies/${policyId}`,
    {
      method: "PUT",
      body: JSON.stringify(
        buildPolicyUpdate(policy, include)
      ),
    }
  );

  return {
    granted: true,
    alreadyAllowed: false,
    policy: updatedPolicy,
  };
}

export async function grantCabillaArchiveAccess(
  context,
  email
) {
  const {
    CABILLA_ACCESS_APP_ID,
    CABILLA_ACCESS_POLICY_ID,
  } = context.env;

  if (!CABILLA_ACCESS_APP_ID) {
    throw new Error(
      "CABILLA_ACCESS_APP_ID is not configured"
    );
  }

  if (!CABILLA_ACCESS_POLICY_ID) {
    throw new Error(
      "CABILLA_ACCESS_POLICY_ID is not configured"
    );
  }

  return grantAccessByEmail(context, {
    appId: CABILLA_ACCESS_APP_ID,
    policyId: CABILLA_ACCESS_POLICY_ID,
    email,
  });
}