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
  closeModal: () => void;
  modalType: ManageEpisodesModalTypes;
  episodeIds: string[];
  subscriptionTiers: SubscriptionTierItem[];
  handleAssignTiers: (props: {
    episodeIds: string[];
    subscriptionTierIds: string[];
  }) => void;
  handleRemoveEpisodes: (props: { episodeIds: string[] }) => void;
  unselectAll: () => void;
};

const AssignTiersModal = ({
  isModalOpen,
  closeModal,
  setLoading,
  loading,
  episodeIds,
  subscriptionTiers,
  handleAssignTiers,
  unselectAll,
}) => {
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
      unselectAll();
      setLoading(false);

      closeModal();
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
      setIsModalOpen={closeModal}
    >
      <div className="w-full flex flex-col items-start justify-start px-4 mb-4">
        {map((subscriptionTier: SubscriptionTierItem) => (
          <div
            key={subscriptionTier.subscriptionTierId}
            className="flex flex-row justify-center items-center  mb-2 cursor-pointer"
            onClick={() => toggleSelect(subscriptionTier.subscriptionTierId)}
          >
            <MultiSelectButton
              selected={selectedIds.includes(
                subscriptionTier.subscriptionTierId
              )}
              onPress={() => toggleSelect(subscriptionTier.subscriptionTierId)}
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
};

const RemoveEpisodesModal = ({
  isModalOpen,
  closeModal,
  setLoading,
  loading,
  episodeIds,
  handleRemoveEpisodes,
  unselectAll,
}) => {
  const removeEpisodes = async () => {
    try {
      setLoading(true);
      await handleRemoveEpisodes({
        episodeIds,
      });
      unselectAll();
      setLoading(false);

      closeModal(false);
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
      setIsModalOpen={closeModal}
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

const RemoveTiersModal = ({
  isModalOpen,
  closeModal,
  setLoading,
  loading,
  episodeIds,
  handleAssignTiers,
  unselectAll,
}) => {
  const removeTiers = async () => {
    try {
      setLoading(true);
      await handleAssignTiers({
        episodeIds,
        subscriptionTierIds: [],
      });
      unselectAll();
      setLoading(false);

      closeModal(false);
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
      setIsModalOpen={closeModal}
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
};

const ManageEpisodesModal = ({
  isModalOpen,
  closeModal,
  modalType,
  episodeIds,
  subscriptionTiers,
  handleAssignTiers,
  handleRemoveEpisodes,
  unselectAll,
}: ManageEpisodesModalProps) => {
  const [loading, setLoading] = useState(false);

  if (modalType === ManageEpisodesModalTypes.AssignTiers) {
    return (
      <AssignTiersModal
        setLoading={setLoading}
        loading={loading}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        episodeIds={episodeIds}
        subscriptionTiers={subscriptionTiers}
        handleAssignTiers={handleAssignTiers}
        unselectAll={unselectAll}
      />
    );
  } else if (modalType === ManageEpisodesModalTypes.RemoveEpisodes) {
    return (
      <RemoveEpisodesModal
        setLoading={setLoading}
        loading={loading}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        episodeIds={episodeIds}
        handleRemoveEpisodes={handleRemoveEpisodes}
        unselectAll={unselectAll}
      />
    );
  } else if (modalType === ManageEpisodesModalTypes.RemoveTiers) {
    return (
      <RemoveTiersModal
        setLoading={setLoading}
        loading={loading}
        closeModal={closeModal}
        isModalOpen={isModalOpen}
        episodeIds={episodeIds}
        handleAssignTiers={handleAssignTiers}
        unselectAll={unselectAll}
      />
    );
  }

  return null;
};

export default ManageEpisodesModal;
