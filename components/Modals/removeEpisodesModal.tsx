import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Modal from "./baseModal";
import { deleteBenefit } from "modules/Subscriptions";
import { Button } from "components/Buttons";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import toast from "react-hot-toast";
import { useState } from "react";
import { Loader } from "react-feather";

type RemoveEpisodesModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  episodeIds: string[];
  handleRemoveEpisodes: (props: { episodeIds: string[] }) => void;
  unselectAll: () => void;
};

const RemoveEpisodesModal = ({
  isModalOpen,
  setIsModalOpen,
  episodeIds,
  handleRemoveEpisodes,
  unselectAll,
}: RemoveEpisodesModalProps) => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showId } = router.query;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeEpisodes = async () => {
    try {
      setLoading(true);
      await handleRemoveEpisodes({
        episodeIds,
      });
      unselectAll();
      setLoading(false);

      setIsModalOpen(false);
    } catch (error) {
      console.error("removeEpisodes error", error);
      toast.error("Something went wrong, try again later");
    }
  };
  const disabled = loading;

  return (
    <Modal
      title={`Are you sure you want to delete ${episodeIds?.length} episodes?`}
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
          disabled={disabled}
          className={
            disabled
              ? "bg-repod-disabled-bg text-repod-text-disabled cursor-default flex justify-center items-center"
              : "bg-danger text-repod-text-alternative"
          }
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={removeEpisodes}
        >
          {loading ? <Loader /> : "Remove"}
        </Button.Small>
      </div>
    </Modal>
  );
};

export default RemoveEpisodesModal;
