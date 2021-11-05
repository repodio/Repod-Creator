import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import * as Badge from "components/Badge";
import { Button } from "components/Buttons";
import {
  fetchConnectedAccountOnboardingUrl,
  COUNTRY_CODES,
} from "utils/repodAPI";
import { Select } from "components/Dropdown";
import { map } from "lodash/fp";

const STRIPE_CONNECT_COPY = {
  Title: "Connected Account",
  DefaultMessage:
    "To enable listeners to send you tips and subscribe through Repod we must first connect to your Stripe Account. We use Stripe to safely and securely get you your money, setting up an account is quick and easy. Start by pressing the button below.",
  CountrySelectLabel: "What country are you from?",
};

const StripeConnect = ({ message = STRIPE_CONNECT_COPY.DefaultMessage }) => {
  const router = useRouter();
  const [connectButtonLoading, setConnectButtonLoading] = useState(false);
  const [countryCode, setCountryCode] = useState(COUNTRY_CODES.US.key);
  const { showId } = router.query;
  const showIdString = showId as string;

  const handleConnectAccount = useCallback(async () => {
    setConnectButtonLoading(true);

    const onboardingURL = await fetchConnectedAccountOnboardingUrl({
      showId: showIdString,
      countryCode,
    });

    if (window) {
      window.location.href = onboardingURL;
    }
    setConnectButtonLoading(false);
  }, [showIdString, countryCode]);

  const selectOptions = useMemo(
    () =>
      map((key: string) => ({
        label: COUNTRY_CODES[key].label,
        key,
      }))(Object.keys(COUNTRY_CODES)),
    [COUNTRY_CODES]
  );

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center  mb-2">
        <p className="text-lg font-bold text-repod-text-primary mr-2">
          {STRIPE_CONNECT_COPY.Title}
        </p>
        <Badge.Disabled label="Not Connected" />
      </div>
      <p className="text-md font-book text-repod-text-secondary mb-4">
        {message}
      </p>
      <div
        className="mb-4"
        style={{ minWidth: 300, maxWidth: 300, width: 300 }}
      >
        <p className="text-md font-semibold text-repod-text-primary mb-1">
          {STRIPE_CONNECT_COPY.CountrySelectLabel}
        </p>
        <Select
          options={selectOptions}
          onOptionChange={setCountryCode}
          initialOption={COUNTRY_CODES.US.key}
        />
      </div>
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
