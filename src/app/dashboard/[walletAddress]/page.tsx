"use client";
import { client } from "@/app/client";
import { CROWDFUNDING_FACTORY } from "@/app/constants/contracts";
import { CampaignCard } from "@/components/CampaignCard";
import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { deployPublishedContract } from "thirdweb/deploys";
import { useActiveAccount, useReadContract } from "thirdweb/react";

export default function DashboardPage() {
  const account = useActiveAccount();

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get Campaigns
  const {
    data: myCampaigns,
    isLoading: isLoadingMyCampaigns,
    refetch,
  } = useReadContract({
    contract: contract,
    method:
      "function getUserCampaigns(address _user) view returns ((address campaignAddress, address owner, string name, uint256 creationTime)[])",
    params: [account?.address as string],
  });

  return (
    <div className="mx-auto max-w-7xl mt-4 px-4 md:px-12">
      <div className="flex flex-row justify-between items-center py-14">
        <h1 className="text-4xl font-medium">My Fundraisers</h1>
        <button
          className="px-4 py-2 bg-green-100 text-white rounded-md"
          onClick={() => setIsModalOpen(true)}
        >
          Create a Fundraiser
        </button>
      </div>
      {/* <p className="text-2xl font-semibold mb-4">My Campaigns:</p> */}
      <div className="grid grid-cols-3 gap-12 max-md:flex max-md:flex-col pb-16">
        {!isLoadingMyCampaigns &&
          (myCampaigns && myCampaigns.length > 0 ? (
            myCampaigns.map((campaign, index) => (
              <CampaignCard
                key={index}
                campaignAddress={campaign.campaignAddress}
              />
            ))
          ) : (
            <p>No campaigns</p>
          ))}
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          refetch={refetch}
        />
      )}
    </div>
  );
}

type CreateCampaignModalProps = {
  setIsModalOpen: (value: boolean) => void;
  refetch: () => void;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  refetch,
}: CreateCampaignModalProps) => {
  const account = useActiveAccount();
  const [isDeployingContract, setIsDeployingContract] =
    useState<boolean>(false);
  const [campaignName, setCampaignName] = useState<string>("");
  const [campaignDescription, setCampaignDescription] = useState<string>("");
  const [campaignImage, setCampaignImage] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState<number>(1);
  const [campaignDeadline, setCampaignDeadline] = useState<number>(1);

  // Deploy contract from CrowdfundingFactory
  const handleDeployContract = async () => {
    console.log({
      campaignName,
      campaignDescription,
      campaignImage,
      campaignGoal,
      campaignDeadline,
    });
    setIsDeployingContract(true);
    try {
      console.log("Deploying contract...");
      const contractAddress = await deployPublishedContract({
        client: client,
        chain: sepolia,
        account: account!,
        contractId: "Crowdfunding",
        contractParams: {
          _name: campaignName,
          _description: campaignDescription,
          _image: campaignImage,
          _goal: campaignGoal,
          _durationInDays: campaignDeadline,
        }, // Now an object with string keys
        publisher: "0x7EF00a99cc93333f6915109D2AB7f687f645fd99",
        version: "1.0.1",
      });
      alert("Contract deployed successfully!");
      refetch();
    } catch (error) {
      console.error("Error deploying contract:", error);
    } finally {
      setIsDeployingContract(false);
      setIsModalOpen(false);
    }
  };

  const handleCampaignGoal = (value: number) => {
    if (value < 1) {
      setCampaignGoal(1);
    } else {
      setCampaignGoal(value);
    }
  };

  const handleCampaignLengthChange = (value: number) => {
    if (value < 1) {
      setCampaignDeadline(1);
    } else {
      setCampaignDeadline(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md ">
      <div className="w-1/2 bg-black-200 p-6 rounded-md border border-black-300">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-medium">Create Fundraiser</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Fundraiser Name *</label>
          <input
            type="text"
            value={campaignName}
            onChange={(e) => setCampaignName(e.target.value)}
            placeholder="Write a title"
            className="mb-4 px-4 py-2 mt-3 border-black-300 border bg-transparent font-light rounded-md focus:outline-none"
          />

          <label>Fundraiser Description *</label>
          <textarea
            value={campaignDescription}
            onChange={(e) => setCampaignDescription(e.target.value)}
            placeholder="Write your story"
            className="mb-4 px-4 py-2 mt-3 border-black-300 border bg-transparent font-light rounded-md resize-none focus:outline-none"
          ></textarea>

          <label>Fundraiser Image *</label>
          <input
            value={campaignImage}
            onChange={(e) => setCampaignImage(e.target.value)}
            placeholder="Image URL"
            className="mb-4 px-4 py-2 mt-3 border-black-300 border bg-transparent font-light rounded-md focus:outline-none"
          ></input>

          <div className="mb-4">
            <label>Fundraiser Goal *</label>
            <div className="flex items-center mt-3 border border-black-300 rounded-md">
              <span className="px-3 text-white">$</span>
              <input
                type="number"
                value={campaignGoal}
                onChange={(e) => handleCampaignGoal(parseInt(e.target.value))}
                className="w-full py-2 bg-transparent font-light focus:outline-none"
              />
            </div>
          </div>

          <label>{`Fundraiser Length (Days) *`}</label>
          <div className="flex space-x-4">
            <input
              type="number"
              value={campaignDeadline}
              onChange={(e) =>
                handleCampaignLengthChange(parseInt(e.target.value))
              }
              className="mb-4 px-4 py-2 mt-3 border-black-300 border bg-transparent rounded-md focus:outline-none"
            />
          </div>

          <button
            className="mt-4 px-4 py-2 bg-green-100 text-white rounded-md"
            onClick={handleDeployContract}
          >
            {isDeployingContract
              ? "Creating Fundraiser..."
              : "Create Fundraiser"}
          </button>
        </div>
      </div>
    </div>
  );
};
