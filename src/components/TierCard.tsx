import { prepareContractCall, ThirdwebContract } from "thirdweb";
import { TransactionButton } from "thirdweb/react";

type Tier = {
  name: string;
  amount: bigint;
  backers: bigint;
};

type TierCardProps = {
  tier: Tier;
  index: number;
  contract: ThirdwebContract;
  isEditing: boolean;
};

export const TierCard: React.FC<TierCardProps> = ({
  tier,
  index,
  contract,
  isEditing,
}) => {
  return (
    <div className="max-w-[300px] flex min-w-[245px] flex-col justify-between p-6 bg-black-200 border-slate-100 rounded-lg shadow">
      <div>
        <div className="flex flex-row justify-around items-center pb-4">
          <p className="text-2xl font-medium">{tier.name}</p>
          <p className="text-2xl font-medium">${tier.amount.toString()}</p>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center">
        <p className="text-base font-normal">
          Total Backers: {tier.backers.toString()}
        </p>
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function fund(uint256 _tierIndex) payable",
              params: [BigInt(index)],
              value: tier.amount,
            })
          }
          onError={(error) => alert(`Error: ${error.message}`)}
          onTransactionConfirmed={async () => alert("Funded successfully!")}
          style={{
            marginTop: "1rem",
            backgroundColor: "rgb(29, 192, 113)",
            color: "white",
            padding: "0.5rem 0.5rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
            
          }}
        >
          Donate
        </TransactionButton>
      </div>
      {isEditing && (
        <TransactionButton
          transaction={() =>
            prepareContractCall({
              contract: contract,
              method: "function removeTier(uint256 _index)",
              params: [BigInt(index)],
            })
          }
          onError={(error) => alert(`Error: ${error.message}`)}
          onTransactionConfirmed={async () => alert("Removed successfully!")}
          style={{
            marginTop: "1rem",
            backgroundColor: "#f54281",
            color: "white",
            padding: "0.5rem 0.5rem",
            borderRadius: "0.375rem",
            cursor: "pointer",
          }}
        >
          Remove
        </TransactionButton>
      )}
    </div>
  );
};
