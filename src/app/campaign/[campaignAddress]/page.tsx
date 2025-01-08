"use client";
import { client } from "@/app/client";
import { TierCard } from "@/components/TierCard";
import { useParams } from "next/navigation";
import { useState } from "react";
import { getContract, prepareContractCall, ThirdwebContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import {
  lightTheme,
  TransactionButton,
  useActiveAccount,
  useReadContract,
  useSendTransaction,
} from "thirdweb/react";

export default function CampaignPage() {
  const account = useActiveAccount();
  const { campaignAddress } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Hooks must be at the top level
  const { mutate: sendTransaction } = useSendTransaction();

  const contract = getContract({
    client: client,
    chain: sepolia,
    address: campaignAddress as string,
  });

  // Name of the campaign
  const { data: name, isLoading: isLoadingName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Description of the campaign
  const { data: description } = useReadContract({
    contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Get Campaign Image
  const { data: image } = useReadContract({
    contract: contract,
    method: "function image() view returns (string)",
    params: [],
  });

  // Campaign deadline
  const { data: deadline, isLoading: isLoadingDeadline } = useReadContract({
    contract: contract,
    method: "function deadline() view returns (uint256)",
    params: [],
  });
  // Convert deadline to a date
  const deadlineDate = new Date(
    parseInt(deadline?.toString() as string) * 1000
  );
  // Check if deadline has passed
  const hasDeadlinePassed = deadlineDate < new Date();

  // Goal amount of the campaign
  const { data: goal, isLoading: isLoadingGoal } = useReadContract({
    contract: contract,
    method: "function goal() view returns (uint256)",
    params: [],
  });

  // Total funded balance of the campaign
  const { data: balance, isLoading: isLoadingBalance } = useReadContract({
    contract: contract,
    method: "function getContractBalance() view returns (uint256)",
    params: [],
  });

  // Calulate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  // If balance is greater than or equal to goal, percentage should be 100
  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  // Get tiers for the campaign
  const { data: tiers, isLoading: isLoadingTiers } = useReadContract({
    contract: contract,
    method:
      "function getTiers() view returns ((string name, uint256 amount, uint256 backers)[])",
    params: [],
  });

  // Get owner of the campaign
  const { data: owner, isLoading: isLoadingOwner } = useReadContract({
    contract: contract,
    method: "function owner() view returns (address)",
    params: [],
  });

  // Get status of the campaign
  const { data: status } = useReadContract({
    contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  const handleWithdraw = async () => {
    try {
      // Prepare the transaction
      const transaction = prepareContractCall({
        contract: contract,
        method: "function withdraw()",
        params: [],
      });

      // Send the transaction
      sendTransaction(transaction, {
        onSuccess: () => {
          alert("Funds withdrawn successfully!");
        },
        onError: (error) => {
          console.error("Withdrawal failed:", error);
          alert("Failed to withdraw funds. Ensure the campaign is successful.");
        },
      });
    } catch (error) {
      console.error("Error preparing transaction:", error);
      alert("Failed to prepare the transaction.");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-2 mt-4 sm:px-6 lg:px-8 pb-10">
      <div className="flex flex-row justify-between items-center pt-14">
        {!isLoadingName && <p className="text-4xl font-medium">{name}</p>}
        {owner === account?.address && (
          <div className="flex flex-row">
            {isEditing && (
              <p className="px-4 py-2 bg-gray-500 text-white rounded-md mr-2">
                Status:
                {status === 0
                  ? " Active"
                  : status === 1
                  ? " Successful"
                  : status === 2
                  ? " Failed"
                  : "Unknown"}
              </p>
            )}
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Done" : "Edit"}
            </button>
            <button
              className={`ml-2 px-4 py-2 ${
                status === 1
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-300 text-gray-500"
              } rounded-md`}
              onClick={handleWithdraw}
              
            >
              Withdraw Funds
            </button>
          </div>
        )}
      </div>
      <div className="my-7">
        <img
          src={
            image ||
            "https://www.raisinghealth.org.uk/images/general-fr-images/fundraising_cropped-500x353.jpg"
          }
          alt="campaign-image"
          className="w-2/4 h-[250px] object-cover rounded-[15px]"
        />
      </div>
        <div className="my-4">
          {/* <p className="text-lg font-semibold">Description</p> */}
          <p>{description}</p>
        </div>
      <div className="mb-4">
        <p className="text-lg font-medium py-1">Deadline</p>
        {!isLoadingDeadline && <p>{deadlineDate.toDateString()}</p>}
      </div>
      {!isLoadingBalance && (
        <div className="mb-4">
          <p className="text-lg font-medium py-2">
            Fundraiser Goal: ${goal?.toString()}
          </p>
          <div className="relative w-full h-6 bg-progress-bar-bg rounded-full">
            <div
              className="h-6 bg-progress-bar rounded-full text-right"
              style={{ width: `${balancePercentage?.toString()}%` }}
            >
              <p className="text-white dark:text-white text-xs p-1 px-2">
                ${balance?.toString()}
              </p>
            </div>
            <p className="absolute top-0 right-0 text-white dark:text-white text-xs p-1 px-2">
              {balancePercentage >= 100
                ? ""
                : `${balancePercentage?.toString()}%`}
            </p>
          </div>
        </div>
      )}
      <div>
        <p className="text-lg font-medium py-2">Tiers:</p>
        <div className="grid grid-cols-3 gap-4 max-md:flex max-md:flex-col">
          {isLoadingTiers ? (
            <p>Loading...</p>
          ) : tiers && tiers.length > 0 ? (
            tiers.map((tier, index) => (
              <TierCard
                key={index}
                tier={tier}
                index={index}
                contract={contract}
                isEditing={isEditing}
              />
            ))
          ) : (
            !isEditing && <p>No tiers available</p>
          )}
          {isEditing && (
            // Add a button card with text centered in the middle
            <button
              className="max-w-[300px] flex flex-col text-center justify-center items-center font-normal p-6 bg-blue-500 text-white border-slate-100 rounded-lg shadow"
              onClick={() => setIsModalOpen(true)}
            >
              + Add Tier
            </button>
          )}
        </div>
      </div>

      {isModalOpen && (
        <CreateCampaignModal
          setIsModalOpen={setIsModalOpen}
          contract={contract}
        />
      )}
    </div>
  );
}

type CreateTierModalProps = {
  setIsModalOpen: (value: boolean) => void;
  contract: ThirdwebContract;
};

const CreateCampaignModal = ({
  setIsModalOpen,
  contract,
}: CreateTierModalProps) => {
  const [tierName, setTierName] = useState<string>("");
  const [tierAmount, setTierAmount] = useState<bigint>(1n);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center backdrop-blur-md pb-10">
      <div className="w-1/2 bg-black-100 p-6 rounded-md">
        <div className="flex justify-between items-center mb-4">
          <p className="text-lg font-semibold">Create a Funding Tier</p>
          <button
            className="text-sm px-4 py-2 bg-slate-600 text-white rounded-md"
            onClick={() => setIsModalOpen(false)}
          >
            Close
          </button>
        </div>
        <div className="flex flex-col">
          <label>Tier Name:</label>
          <input
            type="text"
            value={tierName}
            onChange={(e) => setTierName(e.target.value)}
            placeholder="Tier Name"
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <label>Tier Cost:</label>
          <input
            type="number"
            value={parseInt(tierAmount.toString())}
            onChange={(e) => setTierAmount(BigInt(e.target.value))}
            className="mb-4 px-4 py-2 bg-slate-200 rounded-md"
          />
          <TransactionButton
            transaction={() =>
              prepareContractCall({
                contract: contract,
                method: "function addTier(string _name, uint256 _amount)",
                params: [tierName, tierAmount],
              })
            }
            onTransactionConfirmed={async () => {
              alert("Tier added successfully!");
              setIsModalOpen(false);
            }}
            onError={(error) => alert(`Error: ${error.message}`)}
            theme={lightTheme()}
          >
            Add Tier
          </TransactionButton>
        </div>
      </div>
    </div>
  );
};
