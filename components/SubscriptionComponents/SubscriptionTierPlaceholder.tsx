import React from "react";

const SubscriptionTierPlaceholder = ({
  title,
  sutitle,
  benefitTitle,
  artwork,
}: {
  title: string;
  sutitle: string;
  benefitTitle: string;
  artwork: string;
}) => (
  <div className="flex flex-col justify-start items-start rounded border border-solid border-repod-border-light p-4 pb-8 mx-4">
    <img
      style={{ width: 225, height: 71 }}
      className="mb-4"
      src={artwork}
      alt={title}
    />
    <p className="text-base font-semibold text-repod-text-primary">{title}</p>
    <p className="text-xs font-semibold text-repod-text-secondary uppercase mb-4">
      {sutitle}
    </p>
    <div className="py-1 px-2 rounded bg-repod-border-light w-full">
      <p className="text-sm font-semibold text-repod-text-primary">
        {benefitTitle}
      </p>
    </div>
  </div>
);

export default SubscriptionTierPlaceholder;
