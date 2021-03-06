import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Modal from "./baseModal";
import { removeSubscriptionTier } from "modules/Subscriptions";
import { Button } from "components/Buttons";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import toast from "react-hot-toast";

type RemoveTierModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
};

const MODAL_COPY = {
  title: "Are you sure you want to delete this tier?",
};

const RemoveTierModal = ({
  isModalOpen,
  setIsModalOpen,
}: RemoveTierModalProps) => {
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const router = useRouter();
  const { subscriptionTierId, showId } = router.query;
  const subscriptionTierIdString = subscriptionTierId as string;
  const showIdString = showId as string;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeTier = async () => {
    try {
      await dispatch(
        removeSubscriptionTier({
          showId: showIdString,
          subscriptionTierId: subscriptionTierIdString,
        })
      );

      router.replace(`/${showIdString}/subscriptions`);

      toast.success("Subscription Tier Deleted");
      setIsModalOpen(false);
    } catch (error) {
      console.error("removeTier error", error);
      toast.error("Something went wrong, try again later");
    }
  };

  return (
    <Modal
      title={MODAL_COPY.title}
      isModalOpen={isModalOpen}
      setIsModalOpen={setIsModalOpen}
      minWidth={100}
    >
      <div className="w-full flex flex-row items-center justify-between">
        <Button.Small
          className="bg-repod-canvas text-repod-text-secondary"
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={closeModal}
        >
          Cancel
        </Button.Small>

        <Button.Small
          className="bg-danger text-repod-text-alternative"
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={removeTier}
        >
          Remove
        </Button.Small>
      </div>
    </Modal>
  );
};

export default RemoveTierModal;
