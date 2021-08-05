import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import * as Badge from "components/Badge";
import { Button } from "components/Buttons";
import { fetchConnectedAccountOnboardingUrl } from "utils/repodAPI";

const DEFAULT_MESSAGE =
  "To enable listeners to send you tips and subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.";

const StripeConnect = ({ message = DEFAULT_MESSAGE }) => {
  const router = useRouter();
  const [connectButtonLoading, setConnectButtonLoading] = useState(false);
  const { showId } = router.query;
  const showIdString = showId as string;

  const handleConnectAccount = useCallback(async () => {
    setConnectButtonLoading(true);
    const onboardingURL = await fetchConnectedAccountOnboardingUrl({
      showId: showIdString,
    });

    if (window) {
      window.location.href = onboardingURL;
    }
    setConnectButtonLoading(false);
  }, [showIdString]);

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center  mb-2">
        <p className="text-lg font-bold text-repod-text-primary mr-2">
          Connected Account
        </p>
        <Badge.Disabled label="Not Connected" />
      </div>
      <p className="text-md font-book text-repod-text-secondary mb-8">
        {message}
      </p>
      <Button.Medium
        disabled={connectButtonLoading}
        className="bg-info text-repod-text-alternative"
        style={{ minWidth: 300, maxWidth: 300, width: 300 }}
        onClick={handleConnectAccount}
      >
        {connectButtonLoading ? "Loading..." : "Connect Stripe Account"}
      </Button.Medium>
    </div>
  );
};

export default StripeConnect;
