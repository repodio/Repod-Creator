import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import Modal from "./baseModal";
import { deleteBenefit } from "modules/Subscriptions";
import { Button } from "components/Buttons";
import { ThunkDispatch } from "redux-thunk";
import { Action } from "redux";
import toast from "react-hot-toast";

type RemoveEpisodesModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  episodeIds: string[];
};

const RemoveEpisodesModal = ({
  isModalOpen,
  setIsModalOpen,
  episodeIds,
}: RemoveEpisodesModalProps) => {
  const dispatch = useDispatch<ThunkDispatch<{}, undefined, Action>>();
  const router = useRouter();
  const { showId } = router.query;
  const showIdString = showId as string;

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const removeEpisodes = async () => {
    try {
      // await dispatch(
      //   deleteBenefit({
      //     benefitId,
      //     showId: showIdString,
      //   })
      // );
      console.log("episodeIds", episodeIds);
      toast.success("Episodes Deleted");
      setIsModalOpen(false);
    } catch (error) {
      console.error("removeEpisodes error", error);
      toast.error("Something went wrong, try again later");
    }
  };

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
          className="bg-danger text-repod-text-alternative"
          style={{ minWidth: 100, maxWidth: 100, width: 100 }}
          onClick={removeEpisodes}
        >
          Remove
        </Button.Small>
      </div>
    </Modal>
  );
};

export default RemoveEpisodesModal;
