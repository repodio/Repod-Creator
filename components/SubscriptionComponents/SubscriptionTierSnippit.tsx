import Link from "next/link";
import React from "react";
import { formatCurrency } from "utils/formats";
import { map } from "lodash/fp";
import * as Badge from "components/Badge";

const SubscriptionTierSnippit = ({
  subscriptionTier,
}: {
  subscriptionTier: SubscriptionTierItem & { benefits: { title: string }[] };
}) => (
  <div
    className="flex flex-col justify-start items-start rounded border border-solid border-repod-border-light p-4 pb-8 mx-4"
    style={{ minWidth: 260, maxWidth: 230 }}
  >
    <div className="flex flex-row justify-between items-center w-full mb-4">
      {subscriptionTier.published ? (
        <Badge.Info label="Published" />
      ) : (
        <Badge.Disabled label="Unpublished" />
      )}
      <Link href={`/subscriptions/${subscriptionTier.showId}/edit`}>
        <a className="cursor-pointer flex text-center no-underline text-xs font-bold text-info hover:opacity-50 transition">
          EDIT TIER
        </a>
      </Link>
    </div>
    <p className="text-base font-semibold text-repod-text-primary">
      {subscriptionTier.title}
    </p>
    <p className="text-xs font-semibold text-repod-text-secondary uppercase mb-4">
      {`${formatCurrency(subscriptionTier.monthlyPrice)} PER MONTH`}
    </p>
    {map((benefit: { title: string }) => (
      <div className="py-1 px-2 rounded bg-repod-border-light w-full">
        <p className="text-sm font-semibold text-repod-text-primary">
          {benefit.title}
        </p>
      </div>
    ))(subscriptionTier.benefits)}
  </div>
);

export default SubscriptionTierSnippit;