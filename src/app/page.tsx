"use client";
import { useReadContract } from "thirdweb/react";
import { client } from "./client";
import { sepolia } from "thirdweb/chains";
import { getContract } from "thirdweb";
import { CampaignCard } from "@/components/CampaignCard";
import { CROWDFUNDING_FACTORY } from "./constants/contracts";
import Footer from "@/components/Footer";

export default function Home() {
  // Get CrowdfundingFactory contract
  const contract = getContract({
    client: client,
    chain: sepolia,
    address: CROWDFUNDING_FACTORY,
  });

  // Get all campaigns deployed with CrowdfundingFactory
  const {
    data: campaigns,
    isLoading: isLoadingCampaigns,
    refetch: refetchCampaigns,
  } = useReadContract({
    contract: contract,
    method:
      "function getAllCampaigns() view returns ((address campaignAddress, address owner, string name)[])",
    params: [],
  });

  return (
    <main className="w-full">
      <div className="mx-auto max-w-7xl mt-4 px-4 md:px-12">
        <h1 className="text-4xl font-medium py-14">Fundraisers</h1>
        <div className="grid grid-cols-3 gap-12 max-md:flex max-md:flex-col">
          {!isLoadingCampaigns &&
            campaigns &&
            (campaigns.length > 0 ? (
              campaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.campaignAddress}
                  campaignAddress={campaign.campaignAddress}
                />
              ))
            ) : (
              <p>No Campaigns</p>
            ))}
        </div>
      </div>
      <Footer />
    </main>
  );
}
