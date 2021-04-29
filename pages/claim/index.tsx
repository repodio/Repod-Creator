import React, { useState, useEffect, useCallback } from "react";
import { withAuthUser, AuthAction } from "next-firebase-auth";
import { RepodLogo } from "components/Header";
import { ProfileDropdown } from "components/Dropdown";
import { Search } from "react-feather";
import { search, sendVerificationCodeEmail } from "utils/repodAPI";
import { useDebounce } from "utils/hooks";
import { Button } from "components/Buttons";
import { claimShow } from "utils/repodAPI";
import { useForm } from "react-hook-form";
import { FormInput } from "components/Inputs";
import { useRouter } from "next/router";

interface ClaimProps {
  children: JSX.Element[] | JSX.Element;
}

interface ClaimSearchPodcastProps {
  onShowSelect: (item: ShowItem) => void;
}

interface ClaimSendEmailProps {
  show: ShowItem;
  email: string;
}

const PLACEHOLDER_COPY = "Search for your podcast here";
const REPOD_SUPPORT_EMAIL = "podcasters@repod.io";
const ERRORS_LOOKUP = {
  "wrong-verify-code": "The code you entered did not match.",
  "no-verify-code": "The code you entered did not match.",
  default: "Something went wrong.",
};
const ClaimSearchPodcast = ({ onShowSelect }: ClaimSearchPodcastProps) => {
  const [value, setValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [noResults, setNoResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm: string = useDebounce(value, 400);

  const onChangeText = useCallback(
    (event) => {
      setValue(event.target.value);
    },
    [setValue]
  );

  useEffect(
    () => {
      if (debouncedSearchTerm) {
        setNoResults(false);

        const searchingTimeout = setTimeout(() => {
          setIsSearching(true);
        }, 150);

        search({
          query: debouncedSearchTerm,
          type: "shows",
          includeRSS: true,
        }).then((searchResponse) => {
          console.log("searchResponse", searchResponse);
          const { items } = searchResponse;
          clearTimeout(searchingTimeout);

          if (!items.length) {
            setNoResults(true);
          }

          setSearchResults(items.slice(0, 5));
          setIsSearching(false);
        });
      } else {
        setSearchResults([]);
      }
    },
    [debouncedSearchTerm] // Only call effect if debounced search term changes
  );

  return (
    <div className="flex flex-col justify-center items-center max-w-xl w-full">
      <div className="w-full flex relative justify-start items-center">
        <Search
          className="ml-2 absolute stroke-current text-repod-text-secondary "
          size={24}
        />

        <input
          className={`w-full text-lg pl-10 pr-6 h-12 border-2 rounded border-repod-text-secondary text-repod-text-primary focus:border-info `}
          type="search"
          value={value}
          placeholder={PLACEHOLDER_COPY}
          onChange={onChangeText}
        />
      </div>
      {isSearching || noResults || searchResults.length ? (
        <div
          className="p-2 mt-2 border-2 rounded border-repod-text-secondary w-full text-left "
          style={{ top: 52 }}
        >
          <ul>
            {noResults && (
              <li className="text-repod-text-secondary my-2 text-center">
                {value.length < 3
                  ? "Try adding a longer search term"
                  : "No Shows Found."}
              </li>
            )}

            {isSearching && (
              <li className="text-repod-text-secondary my-2">Searching ...</li>
            )}

            {!isSearching && !!searchResults.length && (
              <li className="text-repod-text-secondary my-2">
                Select Your Podcast Below
              </li>
            )}

            {!isSearching &&
              searchResults.map((item, i) => {
                return (
                  <li key={i}>
                    <button
                      onClick={() => onShowSelect(item)}
                      className="block rounded-lg p-4 mb-2 w-full hover:bg-repod-canvas-secondary"
                    >
                      <div className="flex overflow-hidden w-full">
                        <img
                          className="w-12 mr-4 rounded"
                          src={item.artworkUrl}
                          alt={`${item.title} artwork`}
                        />
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <p className="text-lg text-repod-text-primary text-left">
                            {item.title}
                          </p>
                          <p className="text-sm text-repod-text-secondary text-left">
                            {item.author}
                          </p>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

type Inputs = {
  code: string;
};

const ClaimSendEmail = ({ show, email }: ClaimSendEmailProps) => {
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [error, setError] = useState<string>(null);
  const [disabled, setDisabled] = useState<boolean>(true);
  const router = useRouter();
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<Inputs>();
  const { code } = watch();

  useEffect(() => {
    console.log("code", code, code && code.length >= 6);
    if (code && code.length === 6) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [code, setDisabled]);

  const handleSendEmail = async () => {
    sendVerificationCodeEmail({
      showId: show.showId,
    })
      .then((response) => {
        console.log("sendVerificationCodeEmail response", response);
        setEmailSent(true);
      })
      .catch((error) => {
        console.log("sendVerificationCodeEmail error", error);
        setError(ERRORS_LOOKUP.default);
      });
  };

  const handleClaimShow = () => {
    console.log("handleClaimShow pressed");
    claimShow({
      showId: show.showId,
      type: "host",
      verifyCode: code,
    })
      .then((response) => {
        console.log("handleClaimShow response", response);

        if (response && response.success === true) {
          router.replace(`/console`);
        } else {
          setError(ERRORS_LOOKUP[response && response.code]);
        }
      })
      .catch((error) => {
        console.log("handleClaimShow error", error);
        setError(ERRORS_LOOKUP.default);
      });
  };

  return (
    <>
      <div className="w-full flex-row flex relative justify-start items-start">
        <div className="relative">
          <img
            style={{ maxWidth: 412 }}
            className=""
            src="/claim-mock-phone.png"
            alt={`${show.title} app mock up`}
          />
          <div
            className="absolute flex flex-row"
            style={{
              top: 98,
              left: 80,
            }}
          >
            <img
              style={{ width: 84, height: 84 }}
              className="w-12 mr-4 rounded"
              src={show.artworkUrl}
              alt={`${show.title} artwork`}
            />
            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <p
                  style={{ maxWidth: 150 }}
                  className="text-lg font-bold truncate"
                >
                  {show.title}
                </p>
                <div className="flex flex-row justify-start items-center">
                  <img
                    style={{ width: 9, height: 8 }}
                    src="/icons/claimed-icon.svg"
                    alt="claim icon"
                  />
                  <p className="text-sm text-info ml-1">Claimed</p>
                </div>
              </div>

              <Button.Tiny
                className={`bg-repod-tint text-repod-text-alternative border-2 border-repod-tint`}
              >
                Follow
              </Button.Tiny>
            </div>
          </div>
        </div>
        {emailSent ? (
          <div className="flex flex-col mt-6" style={{ maxWidth: 412 }}>
            <p className="text-md text-repod-text-primary mb-4">
              We sent you a 6 digit code. Paste it below to claim your podcast.
              The code will expire in{" "}
              <p className="inline font-bold">{"1 hour!"}</p>
            </p>
            <div className="flex flex-row my-2">
              <FormInput
                label="6 Digit Code"
                registerInput={register("code", {
                  required: true,
                  maxLength: 6,
                  minLength: 6,
                  valueAsNumber: false,
                })}
                name="code"
                type="code"
                error={Boolean(errors.code)}
                placeholder="123456"
                maxLength={6}
              />

              <Button.Medium
                disabled={disabled}
                onClick={handleClaimShow}
                className="bg-repod-tint text-repod-text-alternative my-4 ml-8"
              >
                Submit
              </Button.Medium>
            </div>
            {error ? <p className="text-md text-danger my-4">{error}</p> : null}

            <a className="text-lg text-repod-text-primary font-bold">
              Need Help? Visit our FAQ
            </a>
          </div>
        ) : (
          <div className="flex flex-col mt-6" style={{ maxWidth: 412 }}>
            {error ? <p className="text-md text-danger my-4">{error}</p> : null}

            <p className="text-md text-repod-text-primary mb-4">
              To claim <p className="inline font-bold">{show.title}</p>, we’ll
              sent an email to the{" "}
              <p className="inline font-bold">{"<itunes:email>"}</p> address
              listed on your podcast feed (
              <p className="inline font-bold">{email}</p>). Tap the button below
              to send the email and continue your registration.
            </p>
            <Button.Medium
              onClick={handleSendEmail}
              className="bg-repod-tint text-repod-text-alternative"
            >
              Send Email Code
            </Button.Medium>
            <p className="text-sm text-repod-text-primary font-bold  my-4 text-center">
              - OR -
            </p>
            <p className="text-md text-repod-text-primary">
              If you don’t have access to this email or would like to claim your
              podcast manually, just shoot us an email at
            </p>
            <a
              className="text-md text-repod-tint"
              href={`mailto:${REPOD_SUPPORT_EMAIL}`}
            >
              {REPOD_SUPPORT_EMAIL}
            </a>
          </div>
        )}
      </div>
    </>
  );
};

const Claim = ({}: ClaimProps) => {
  const [show, setShow] = useState(null);

  return (
    <>
      <div className="flex flex-col items-center w-full">
        <div className="flex justify-between items-center w-full">
          <RepodLogo />
          <ProfileDropdown lightMode={true} />
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-col justify-center items-center max-w-xl">
            <img
              style={{ width: 72, height: 90 }}
              className=""
              src="/icons/claim-podcast-icon.svg"
              alt={`Claim podcast icon`}
            />
            <h1 className="text-5xl text-repod-text-primary my-4 text-center">
              Claim your podcast on Repod
            </h1>
            <p className="text-lg text-repod-text-secondary mb-8 text-center">
              Start engaging and growing your listener audience on Repod by
              first claiming your podcast
            </p>
          </div>
          {!show ? (
            <ClaimSearchPodcast onShowSelect={setShow} />
          ) : (
            <ClaimSendEmail show={show} email={"test@gmail.com"} />
          )}
        </div>
      </div>
    </>
  );
};

export default withAuthUser({
  whenUnauthedBeforeInit: AuthAction.RETURN_NULL,
  whenUnauthedAfterInit: AuthAction.REDIRECT_TO_LOGIN,
})(Claim);
