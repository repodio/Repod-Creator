import Modal from "./baseModal";
import { Button, MultiSelectButton } from "components/Buttons";
import toast from "react-hot-toast";
import { filter, map } from "lodash/fp";
import { useState } from "react";
import { Loader } from "components/Loading";

export enum ManageEpisodesModalTypes {
  AssignTiers = 1,
  RemoveEpisodes,
  RemoveTiers,
}

type ManageEpisodesModalProps = {
  isModalOpen: boolean;
  setIsModalOpen: (b: boolean) => void;
  modalType: ManageEpisodesModalTypes;
  episodeIds: string[];
  subscriptionTiers: SubscriptionTierItem[];
  handleAssignTiers: (props: {
    episodeIds: string[];
    subscriptionTierIds: string[];
  }) => void;
  handleRemoveEpisodes: (props: { episodeIds: string[] }) => void;
  handleRemoveTiers: (props: { episodeIds: string[] }) => void;
  unselectAll: () => void;
};

const ManageEpisodesModal = ({
  isModalOpen,
  setIsModalOpen,
  modalType,
  episodeIds,
  subscriptionTiers,
  handleAssignTiers,
  handleRemoveEpisodes,
  handleRemoveTiers,
  unselectAll,
}: ManageEpisodesModalProps) => {
  const [loading, setLoading] = useState(false);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (modalType === ManageEpisodesModalTypes.AssignTiers) {
    const [selectedIds, setSelectedIds] = useState([]);

    const toggleSelect = (id) => {
      if (!selectedIds.includes(id)) {
        setSelectedIds([...selectedIds, id]);
      } else {
        setSelectedIds(filter((selectedId) => selectedId !== id)(selectedIds));
      }
    };

    const assignTiers = async () => {
      try {
        setLoading(true);
        await handleAssignTiers({
          episodeIds,
          subscriptionTierIds: selectedIds,
        });
        setLoading(false);

        setIsModalOpen(false);
        setSelectedIds([]);
      } catch (error) {
        console.error("assignTiers error", error);
        toast.error("Something went wrong, try again later");
      }
    };

    const disabled = loading || !selectedIds.length;

    return (
      <Modal
        title={`What tier would you like to assign these ${episodeIds?.length} episodes to?`}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      >
        <div className="w-full flex flex-col items-start justify-start px-4 mb-4">
          {map((subscriptionTier: SubscriptionTierItem) => (
            <div
              key={subscriptionTier.subscriptionTierId}
              className="flex flex-row justify-center items-center  mb-2"
            >
              <MultiSelectButton
                selected={selectedIds.includes(
                  subscriptionTier.subscriptionTierId
                )}
                onPress={() =>
                  toggleSelect(subscriptionTier.subscriptionTierId)
                }
              />
              <p className="font-semibold text-repod-text-primary ml-2">
                {subscriptionTier.title}
              </p>
            </div>
          ))(subscriptionTiers)}
        </div>

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
                : "bg-info text-repod-text-alternative"
            }
            style={{ minWidth: 100, maxWidth: 100, width: 100 }}
            onClick={assignTiers}
          >
            {loading ? <Loader /> : "Add"}
          </Button.Small>
        </div>
      </Modal>
    );
  } else if (modalType === ManageEpisodesModalTypes.RemoveEpisodes) {
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
  } else if (modalType === ManageEpisodesModalTypes.RemoveTiers) {
    const removeTiers = async () => {
      try {
        setLoading(true);
        await handleRemoveTiers({
          episodeIds,
        });
        unselectAll();
        setLoading(false);

        setIsModalOpen(false);
      } catch (error) {
        console.error("removeTiers error", error);
        toast.error("Something went wrong, try again later");
      }
    };
    const disabled = loading;

    return (
      <Modal
        title={`Are you sure you want to remove the tiers on ${episodeIds?.length} episodes?`}
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
            onClick={removeTiers}
          >
            {loading ? <Loader /> : "Remove"}
          </Button.Small>
        </div>
      </Modal>
    );
  }

  return null;
};

export default ManageEpisodesModal;
