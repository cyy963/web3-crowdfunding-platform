import { client } from "@/app/client";
import Link from "next/link";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { useReadContract } from "thirdweb/react";

type MyCampaignCardProps = {
  contractAddress: string;
};

export const MyCampaignCard: React.FC<MyCampaignCardProps> = ({
  contractAddress,
}) => {
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: contractAddress,
  });

  // Get Campaign Name
  const { data: campaignName } = useReadContract({
    contract: contract,
    method: "function name() view returns (string)",
    params: [],
  });

  // Get Campaign Description
  const { data: campaignDescription } = useReadContract({
    contract: contract,
    method: "function description() view returns (string)",
    params: [],
  });

  // Get Campaign Image
  const { data: campaignImage } = useReadContract({
    contract: contract,
    method: "function image() view returns (string)",
    params: [],
  });

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

  // Get Campaign State
  const { data: state, isLoading: isLoadingState } = useReadContract({
    contract: contract,
    method: "function state() view returns (uint8)",
    params: [],
  });

  // Calculate the total funded balance percentage
  const totalBalance = balance?.toString();
  const totalGoal = goal?.toString();
  let balancePercentage =
    (parseInt(totalBalance as string) / parseInt(totalGoal as string)) * 100;

  // If balance is greater than or equal to goal, percentage should be 100
  if (balancePercentage >= 100) {
    balancePercentage = 100;
  }

  return (
    <Link href={`/campaign/${contractAddress}`} passHref={true}>
      <div className="flex flex-col justify-between w-[100%] h-[300px] p-3 bg-white">
        <img
          src={
            campaignImage ||
            "https://www.raisinghealth.org.uk/images/general-fr-images/fundraising_cropped-500x353.jpg"
          }
          alt="campaign-image"
          className="h-2/3"
        />
        <h5 className="mb-2 text-2xl font-bold tracking-tight">
          {campaignName}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {campaignDescription}
        </p>
        {!isLoadingBalance && (
          <div className="mb-4">
            <div className="relative w-full h-6 bg-progress-bar-bg rounded-full">
              <div
                className="h-6 bg-progress-bar rounded-full text-right"
                style={{ width: `${balancePercentage?.toString()}%` }}
              >
                <p className="text-white text-xs p-1 px-2">
                  ${balance?.toString()} raised
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Link>
  );
};
