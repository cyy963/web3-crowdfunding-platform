"use client";
import { client } from "@/app/client";
import Link from "next/link";
import { ConnectButton, lightTheme, useActiveAccount } from "thirdweb/react";
import Image from "next/image";
import thirdwebIcon from "@public/thirdweb.svg";
import { styleText } from "util";

const Navbar = () => {
  const account = useActiveAccount();

  return (
    <nav className="bg-slate-100 border-b-2 border-b-slate-300 flex justify-center h-[8.5dvh]">
      <div className="flex w-[1120px] justify-between w-85 py-2 px-4 md:px-8">
        <div className="flex flex-1 items-center gap-4 pr-2">
          <Link href={"/"}>
            <Image
              src={thirdwebIcon}
              alt="Your Company"
              width={55}
              height={55}
              style={{
                filter: "drop-shadow(0px 0px 24px #a726a9a8)",
              }}
            />
          </Link>
          <Link href={"/"}>
            <p className="rounded-md font-normal px-3 py-2 text-xl text-slate-700 hover:bg-slate-200 transition">
              Donate
            </p>
          </Link>
          {account && (
            <Link href={`/dashboard/${account?.address}`}>
              <p className="rounded-md font-normal px-3 py-2 text-xl text-slate-700 hover:bg-slate-200 transition">
                My Fundraisers
              </p>
            </Link>
          )}
        </div>
        <div className="flex items-center pr-2 sm:ml-6 sm:pr-0">
          <ConnectButton
            client={client}
            theme={lightTheme()}
            connectButton={{
              style: {
                backgroundColor: "rgb(0, 128, 68)",
              },
            }}
            detailsButton={{
              style: {
                maxHeight: "50px",
              },
            }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
